import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baul } from './baul.entity';
import { CreateBaulDto } from '../dto/create-baul.dto';
import { ProductosService } from '../productos.service'; // <--- Importamos el servicio de productos

@Injectable()
export class BaulService {
  constructor(
    @InjectRepository(Baul)
    private readonly baulRepository: Repository<Baul>,

    private readonly productosService: ProductosService, // <--- Inyectamos el servicio
  ) {}

  async create(createBaulDto: CreateBaulDto) {
    const { nombreCliente, telefonoCliente, productosIds, abonoInicial = 0, fechaLimite } = createBaulDto;

    // 1. Buscar los productos usando el servicio existente
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

    // 2. Calcular el precio total sumando el precio de venta de cada prenda
    const precioTotal = productos.reduce((acc, producto) => acc + Number(producto.precioVenta), 0);

    // 3. Validar que el abono inicial no sea mayor al total
    if (abonoInicial > precioTotal) {
      throw new BadRequestException('El abono inicial no puede ser mayor al precio total del apartado.');
    }

    // 4. Calcular el saldo pendiente
    const saldoPendiente = precioTotal - abonoInicial;

    // 5. Determinar el estado inicial del baúl
    const estado = saldoPendiente === 0 ? 'liquidado' : 'activo';

    // 6. Crear la instancia del Baúl
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
    const baul = await this.baulRepository.findOne({
      where: { id },
      relations: { productos: true },
    });
    if (!baul) {
      throw new NotFoundException(`El baúl con ID ${id} no fue encontrado.`);
    }
    return baul;
  }
}