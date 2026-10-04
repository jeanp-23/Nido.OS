// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones globales para los DTOs
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log(`🚀 Servidor de El Nido Outfit corriendo en: http://localhost:3000`);
}
bootstrap();