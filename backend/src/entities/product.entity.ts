import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductType } from './productType.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  productId!: number;

  @Column({ type: 'text' })
  productName!: string;

  @ManyToOne(() => ProductType, (type) => type.products)
  productType!: ProductType;

  @Column({ type: 'numeric' })
  price!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;
}
