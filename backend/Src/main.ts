import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades extra
      transform: true, // Transforma los tipos automáticamente (ej. string a número si se requiere)
    }),
  );

  await app.listen(3000, '0.0.0.0');
}
bootstrap();