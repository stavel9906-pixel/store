import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductType } from "./productType.entity";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn({ name: "product_id" })
  productId!: number;

  @Column({ name: "product_name" })
  productName!: string;

  @ManyToOne(() => ProductType, (type) => type.products)
  @JoinColumn({ name: "product_type" }) 
  productType!: ProductType;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price!: number;

  @Column()
  description?: string;

  @Column({ name: "image_url", nullable: true })
  imageUrl?: string;

  @Column({name: "for_sale", default: true})
  forSale: boolean;
}
