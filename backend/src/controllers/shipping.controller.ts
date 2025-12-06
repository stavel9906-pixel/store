import { Controller, Get, Post, Body, InternalServerErrorException } from "@nestjs/common";
import { ShippingService } from "src/services/shipping.service";

@Controller("shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get("fee")
  async getFee() {
    try {
      return await this.shippingService.getActiveShippingFee();
    } catch (error) {
      throw new InternalServerErrorException("Failed to get shipping fee");
    }
  }
}
