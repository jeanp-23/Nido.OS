// backend/src/Modules/Baul/dto/add-abono.dto.ts
import { IsNumber, Min } from 'class-validator';

export class AddAbonoDto {
  @IsNumber()
  @Min(0.01, { message: 'El monto del abono debe ser mayor a cero' })
  monto: number;
}