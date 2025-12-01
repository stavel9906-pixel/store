import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Purchase } from "./purchase.entity";
import { City } from "./city.entity";

@Entity({ schema: "shop", name: "purchase_addresses" })
export class PurchaseAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Purchase, (purchase) => purchase.address)
  @JoinColumn({ name: "purchase_id" })
  purchase: Purchase;

  @Column()
  street: string;

  @Column({ name: "house_number" })
  houseNumber: string;

  @ManyToOne(() => City, (city) => city.addresses)
  @JoinColumn({ name: "city_id" })
  city: City;

  @Column()
  phone: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;
}
