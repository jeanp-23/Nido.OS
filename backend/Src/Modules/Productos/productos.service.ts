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

  async create(createProductoDto: CreateProductoDto) {
    const { tipo, genero, talla, color } = createProductoDto;
    
    // Lógica para el SKU
    const count = await this.productoRepository.count();
    const consecutivo = count + 1;
    const sku = `${tipo}-${genero}-${talla}-${color}-${String(consecutivo).padStart(4, '0')}`.toUpperCase();

    const nuevoProducto = this.productoRepository.create({
      ...createProductoDto,
      sku,
      consecutivo,
    });

    return await this.productoRepository.save(nuevoProducto);
  }

  async findAll() {
    return await this.productoRepository.find();
  }

  async findOne(id: string) {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no fue encontrado.`);
    }
    return producto;
  }

  // --- MÉTODOS DE MUTACIÓN NUEVOS ---

  // Actualizar parcialmente un producto (PATCH)
  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepository.preload({
      id,
      ...updateProductoDto,
    });

    if (!producto) {
      throw new NotFoundException(`No se encontró el producto con ID: ${id}`);
    }

    return await this.productoRepository.save(producto);
  }

  // Eliminar un producto (DELETE)
  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return { message: `El producto con ID ${id} fue eliminado correctamente.` };
  }
}






