import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Country } from './country.entity';
import { PurchaseAddress } from './purchaseAddress.entity';

@Entity({ schema: 'shop', name: 'city' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Country, country => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => PurchaseAddress, address => address.city)
  addresses: PurchaseAddress[];
}