import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from './product.entity';

@Entity({ name: 'purchase_products' })
export class PurchaseProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseProducts, { onDelete: 'CASCADE' })
  purchase!: Purchase;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ type: 'numeric' })
  currentPrice!: number;
}
