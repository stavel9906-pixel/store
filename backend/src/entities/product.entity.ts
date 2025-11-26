import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductType } from './productType.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  productId!: number;

  @Column()
  productName!: string;

  @ManyToOne(() => ProductType, (type) => type.products)
  productType!: ProductType;

  @Column()
  price!: number;

  @Column()
  description?: string;

  @Column()
  imageUrl!: string;
}
