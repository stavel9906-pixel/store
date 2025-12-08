import { Controller, Get, InternalServerErrorException, Post, Query, UseGuards } from "@nestjs/common";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { ProductsTypeService } from "src/services/productsType.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("products-type")
export class ProductsTypeController {
  constructor(private productsTypeService: ProductsTypeService) {}

  @Get()
  async getAll() {
    try {
      return this.productsTypeService.getAllProductsType();
    } catch (error) {
      throw new InternalServerErrorException("Failed to get products types");
    }
  }
}
