import { Controller, Get, Post, Body, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { ShippingService } from "src/services/shipping.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
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
