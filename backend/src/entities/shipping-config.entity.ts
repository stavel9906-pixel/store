import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: 'shop', name: 'shipping_config' })
export class ShippingConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
