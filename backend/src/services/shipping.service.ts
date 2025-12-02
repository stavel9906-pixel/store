
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingConfig } from 'src/entities/shipping-config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingConfig)
    private readonly shippingRepository: Repository<ShippingConfig>,
  ) {}

  async getActiveShippingFee(): Promise<number> {
    const config = await this.shippingRepository.findOne({ where: { active: true } });
    if (!config) {
      throw new NotFoundException('No active shipping fee configured');
    }
    return Number(config.price);
  }

  async setShippingFee(newPrice: number): Promise<ShippingConfig> {
    const activeConfig = await this.shippingRepository.findOne({ where: { active: true } });
    if (activeConfig) {
      activeConfig.price = newPrice;
      return this.shippingRepository.save(activeConfig);
    }
    const newConfig = this.shippingRepository.create({ price: newPrice, active: true });
    return this.shippingRepository.save(newConfig);
  }
}
