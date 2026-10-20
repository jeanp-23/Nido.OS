import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Instanciamos el producto directamente para evitar ambigüedades en el tipado de TypeORM
    const nuevoProducto = this.productoRepository.create();
    Object.assign(nuevoProducto, createProductoDto);
    
    const saved = await this.productoRepository.save(nuevoProducto);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no fue encontrado.`);
    }
    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    
    // Actualizamos las propiedades permitidas
    this.productoRepository.merge(producto, updateProductoDto);
    return await this.productoRepository.save(producto);
  }

  async remove(id: string): Promise<{ message: string }> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return { message: `Producto con ID ${id} eliminado exitosamente del inventario.` };
  }
}