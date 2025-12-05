
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ShippingService } from 'src/services/shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService
) {}

  @Get('fee')
  async getFee() {
    return await this.shippingService.getActiveShippingFee();
  }

  @Post('fee')
  async updateFee(@Body('price') price: number) {
    return this.shippingService.setShippingFee(price);
  }
}
