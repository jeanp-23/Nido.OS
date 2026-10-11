import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaulService } from './baul.service';
import { BaulController } from './baul.controller';
import { Baul } from './baul.entity';
import { ProductosModule } from '../productos.module'; // Ajusta la ruta si es necesario

@Module({
  imports: [
    TypeOrmModule.forFeature([Baul]),
    ProductosModule, // <--- Importamos el módulo para poder usar su servicio
  ],
  controllers: [BaulController],
  providers: [BaulService],
})
export class BaulModule {}