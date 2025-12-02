import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";
import { PurchaseProduct } from "./purchaseProduct.entity";
import { PurchaseStatus } from "src/enums/purchaseStatus.enum";
import { PurchaseAddress } from "./purchaseAddress.entity";

@Entity({ name: "purchases" })
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "enum",
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status!: PurchaseStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(
    () => PurchaseProduct,
    (purchaseProduct) => purchaseProduct.purchase
  )
  purchaseProducts!: PurchaseProduct[];

  @OneToOne(() => PurchaseAddress, (address) => address.purchase)
  address: PurchaseAddress;

  @Column({
    name: "shipping_fee",
    type: "numeric",
    precision: 10,
    scale: 2,
  })
  shippingFee: number;
}
