// backend/src/Modules/Productos/productos.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.crear(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }
}