import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './Modules/Productos/productos.module';
import { BaulModule } from './Modules/Productos/Baul/baul.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Tu usuario de postgres
      password: '1007602742jp23', // Tu contraseña
      database: 'nido_db', // Tu base de datos
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductosModule,
    BaulModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}