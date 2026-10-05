// backend/src/Modules/Productos/productos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async crear(createProductoDto: CreateProductoDto): Promise<Producto> {
    const { tipo, estilo, talla, color } = createProductoDto;

    // Contar los productos actuales en la base de datos para el consecutivo
    const totalProductos = await this.productoRepository.count();
    const consecutivoNum = totalProductos + 1;
    const consecutivoStr = String(consecutivoNum).padStart(4, '0');

    // Construcción estricta del SKU paramétrico
    const sku = `${tipo.toUpperCase()}-${estilo.toUpperCase()}-${talla.toUpperCase()}-${color.toUpperCase()}-${consecutivoStr}`;

    const nuevoProducto = this.productoRepository.create({
      ...createProductoDto,
      sku,
      consecutivo: consecutivoNum,
    });

    return await this.productoRepository.save(nuevoProducto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }
}











