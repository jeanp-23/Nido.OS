import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Producto } from '../producto.entity'; // Ajusta la ruta si es necesario

@Entity('baules')
export class Baul {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombreCliente: string;

  @Column()
  telefonoCliente: string;

  // Relación: Un baúl puede tener varias prendas (productos)
  @ManyToMany(() => Producto, { eager: true })
  @JoinTable()
  productos: Producto[];

  @Column('decimal', { precision: 10, scale: 2 })
  precioTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAbonado: number;

  @Column('decimal', { precision: 10, scale: 2 })
  saldoPendiente: number;

  @Column({ default: 'activo' }) // Estados: activo, liquidado, cancelado
  estado: string;

  @Column({ type: 'timestamp' })
  fechaLimite: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}