// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Producto } from './Modules/Productos/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Cambia por tu usuario de PostgreSQL
      password: 'tu_password', // Cambia por tu contraseña de PostgreSQL
      database: 'nido_db',    // Asegúrate de haber creado esta base de datos en tu gestor
      entities: [Producto],
      synchronize: true,      // Únicamente para desarrollo (crea tablas automáticas)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}