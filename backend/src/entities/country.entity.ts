import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { City } from "./city.entity";
import { PurchaseAddress } from "./purchaseAddress.entity";

@Entity({ schema: "shop", name: "country" })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
  
  @OneToMany(() => PurchaseAddress, (address) => address.city)
  addresses: PurchaseAddress[];
}
