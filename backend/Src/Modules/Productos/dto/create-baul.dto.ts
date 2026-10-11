import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateBaulDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  nombreCliente: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono del cliente es obligatorio' })
  telefonoCliente: string;

  @IsArray()
  @IsNotEmpty({ message: 'Debe incluir al menos un producto en el baúl' })
  productosIds: string[]; // Recibirá un arreglo de UUIDs de productos

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El abono inicial no puede ser negativo' })
  abonoInicial?: number;

  @IsDateString({}, { message: 'La fecha límite debe tener un formato de fecha válido' })
  @IsNotEmpty({ message: 'La fecha límite del apartado es obligatoria' })
  fechaLimite: string;
}