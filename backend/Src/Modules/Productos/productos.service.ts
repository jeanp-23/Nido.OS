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

  async crear(createProductoDto: CreateProductoDto) {
    // Aquí implementaremos la lógica del SKU paramétrico más adelante
    const nuevoProducto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(nuevoProducto);
  }

  async findAll() {
    return await this.productoRepository.find();
  }
}













