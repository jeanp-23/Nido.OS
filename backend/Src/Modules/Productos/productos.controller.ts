// backend/src/Modules/Productos/productos.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductosService } from './productos.service'; // Asegúrate de que el nombre del servicio coincida
import { CreateProductoDto } from './dto/create-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  crear(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.crear(createProductoDto);
  }

  @Get()
  obtenerTodos() {
    return this.productosService.findAll();
  }
}