import { Controller, Post, Body, HttpException, HttpStatus, Logger, UseGuards } from "@nestjs/common";
import { PurchaseAddressService } from "../services/purchaseAddress.service";
import type { orderDetailsDTO } from "src/entities/DTO/orderDetailsDTO";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("purchase-address")
export class PurchaseAddressController {
  constructor(private readonly addressService: PurchaseAddressService) {}

  @Post("insert")
  async upsertAddress(@Body() dto: orderDetailsDTO) {
    try {
      return await this.addressService.insertOrderAddress(dto);
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        "Failed to create purchase address",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
