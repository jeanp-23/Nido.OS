import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Baul } from './baul.entity';
import { CreateBaulDto } from '../dto/create-baul.dto';
import { AddAbonoDto } from '../dto/abono.dto'; // <--- Asegúrate de que apunte al nombre correcto de tu DTO de abono
import { ProductosService } from '../productos.service'; // O la ruta correcta a tu servicio de productos

@Injectable()
export class BaulService {
  constructor(
    @InjectRepository(Baul)
    private readonly baulRepository: Repository<Baul>,

    private readonly productosService: ProductosService,
  ) {}

  async create(createBaulDto: CreateBaulDto) {
    const { nombreCliente, telefonoCliente, productosIds, abonoInicial = 0, fechaLimite } = createBaulDto;

    const productos = [];
    for (const id of productosIds) {
      try {
        const producto = await this.productosService.findOne(id);
        productos.push(producto);
      } catch (error) {
        throw new NotFoundException(`No se encontró el producto con ID ${id}`);
      }
    }

    if (productos.length === 0) {
      throw new NotFoundException('No se encontró ninguno de los productos especificados para el baúl.');
    }

    const precioTotal = productos.reduce((acc, producto) => acc + Number(producto.precioVenta), 0);

    if (abonoInicial > precioTotal) {
      throw new BadRequestException('El abono inicial no puede ser mayor al precio total del apartado.');
    }

    const saldoPendiente = precioTotal - abonoInicial;
    const estado = saldoPendiente === 0 ? 'liquidado' : 'activo';

    const nuevoBaul = this.baulRepository.create({
      nombreCliente,
      telefonoCliente,
      productos,
      precioTotal,
      totalAbonado: abonoInicial,
      saldoPendiente,
      estado,
      fechaLimite: new Date(fechaLimite),
    });

    return await this.baulRepository.save(nuevoBaul);
  }

  async findAll() {
    return await this.baulRepository.find({ relations: { productos: true } });
  }

async findOne(id: string) {
    // Forzamos la búsqueda asegurando que el id se pase plano
    const baul = await this.baulRepository.findOne({
      where: { id: id as any },
      relations: { productos: true },
    });

    if (!baul) {
      throw new NotFoundException(`El baúl con ID ${id} no fue encontrado.`);
    }
    return baul;
  }
  async registrarAbono(id: string, addAbonoDto: AddAbonoDto): Promise<Baul> {
    const { monto } = addAbonoDto;
    
    const baul = await this.findOne(id);

    if (baul.estado === 'liquidado') {
      throw new BadRequestException('Este apartado (baúl) ya se encuentra totalmente liquidado.');
    }
  
    const nuevoSaldoPendiente = Number(baul.saldoPendiente) - monto;
    if (nuevoSaldoPendiente < 0) {
      throw new BadRequestException(
        `El abono excede el saldo pendiente. El saldo actual por pagar es de $${baul.saldoPendiente}`,
      );
    }

    baul.totalAbonado = Number(baul.totalAbonado) + monto;
    baul.saldoPendiente = nuevoSaldoPendiente;

    if (baul.saldoPendiente === 0) {
      baul.estado = 'liquidado';
    }

    return await this.baulRepository.save(baul);
  }
  // Método para que n8n consulte los apartados próximos a vencer (ej. faltan 2 días o menos)
  async findVencimientosProximos() {
    const hoy = new Date();
    const fechaLimiteAlerta = new Date();
    fechaLimiteAlerta.setDate(hoy.getDate() + 2); // Filtra los que vencen en los próximos 2 días o ya vencieron

    // Usamos operadores de TypeORM para comparar fechas en formato string/Date
    return await this.baulRepository.find({
      where: {
        estado: 'activo',
        fechaLimite: LessThanOrEqual(fechaLimiteAlerta) as any,
      },
      relations: { productos: true }, // Mantiene la consistencia de tu relación con los productos
    });
  }
  async findByTelefono(telefonoCliente: string) {
    const baules = await this.baulRepository.find({
      where: { telefonoCliente },
      relations: { productos: true },
    });

    if (!baules || baules.length === 0) {
      throw new NotFoundException(`No se encontraron baúles activos para el teléfono ${telefonoCliente}`);
    }
    return baules;
  }
}