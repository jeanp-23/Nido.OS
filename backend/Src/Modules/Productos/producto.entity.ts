// backend/src/modules/productos/entities/entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30 })
  sku: string; // Formato paramétrico: [TIPO]-[ESTILO]-[TALLA]-[COLOR]-[CONSECUTIVO][cite: 14]

  @Column({ length: 50 })
  tipo: string; // Ej: CAM, PAN, VES[cite: 14]

  @Column({ length: 50 })
  estilo: string; // Ej: CAS, SLI, URB[cite: 14]

  @Column({ length: 10 })
  talla: string; // Ej: XS, SM, MD, LG, XL[cite: 14]

  @Column({ length: 50 })
  color: string; // Ej: NEG, BLA, AZU[cite: 14]

  @Column({ type: 'int' })
  consecutivo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costoAdquisicion: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}