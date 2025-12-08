import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingConfig } from '../entities/shipping-config.entity';
import { ShippingService } from '../services/shipping.service';
import { ShippingController } from '../controllers/shipping.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingConfig])],
  providers: [ShippingService],
  controllers: [ShippingController],
  exports: [ShippingService],  
})
export class ShippingModule {}
