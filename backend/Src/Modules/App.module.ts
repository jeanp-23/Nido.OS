// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './Productos/productos.module';
import { Producto } from './Productos/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Cambia por tu usuario de PostgreSQL
      password: 'tu_password', // Cambia por tu contraseña
      database: 'nido_os_db', // Nombre de tu base de datos
      entities: [Producto],
      synchronize: true, // Solo para desarrollo
    }),
    ProductosModule,
  ],
})
export class AppModule {}