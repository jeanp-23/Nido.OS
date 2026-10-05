import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de producto es obligatorio' })
  tipo: string;

  @IsString()
  @IsNotEmpty({ message: 'El género es obligatorio' })
  genero: string;

  @IsString()
  @IsNotEmpty({ message: 'La talla es obligatoria' })
  talla: string;

  @IsString()
  @IsNotEmpty({ message: 'El color es obligatorio' })
  color: string;

  @IsNumber({}, { message: 'El precio de venta debe ser un número' })
  @IsPositive({ message: 'El precio de venta debe ser mayor a cero' })
  precioVenta: number;

  @IsNumber({}, { message: 'El costo de adquisición debe ser un número' })
  @IsPositive({ message: 'El costo de adquisición debe ser mayor a cero' })
  costoAdquisicion: number;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  stock: number;
}