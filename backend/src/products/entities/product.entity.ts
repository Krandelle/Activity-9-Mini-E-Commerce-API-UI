import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}