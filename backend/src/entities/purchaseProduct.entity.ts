import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from './product.entity';

@Entity({ name: 'purchase_products' })
export class PurchaseProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "purchase_id" })
  purchase!: Purchase;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ name: 'current_price' })
  currentPrice!: number;
}
