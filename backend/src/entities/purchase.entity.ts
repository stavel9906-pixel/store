import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { PurchaseProduct } from './purchaseProduct.entity';
import { PurchaseStatus } from 'src/enums/purchaseStatus.enum';

@Entity({ name: 'purchases' })
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user!: User;

  @Column({ type: 'enum', enum: PurchaseStatus, default: PurchaseStatus.PENDING })
  status!: PurchaseStatus;

  @CreateDateColumn({name: "craeted_at"})
  createdAt!: Date;

  // @UpdateDateColumn({name: "updated_at"})
  // updatedAt!: Date;

  @OneToMany(() => PurchaseProduct, (purchaseProduct) => purchaseProduct.purchase)
  purchaseProducts!: PurchaseProduct[];

  @Column()
  deliverTime?: Date;

  @Column()
  address?: string;

  @Column()
  phone?: string;
}
