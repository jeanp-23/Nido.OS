// En tu archivo backend/src/Modules/Productos/dto/create-producto.dto.ts
import { IsString, IsNumber, IsNotEmpty, Length, Min } from 'class-validator';

export class CreateProductoDto { // <-- Asegúrate de incluir 'export'
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  tipo: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  estilo: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 3)
  talla: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  color: string;

  @IsNumber()
  @Min(0)
  precioVenta: number;

  @IsNumber()
  @Min(0)
  costoAdquisicion: number;

  @IsNumber()
  @Min(0)
  stock: number;
}