import { Controller, Get, Logger, Post, Query, UseGuards } from "@nestjs/common";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { ProductsService } from "src/services/products.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // @Post("add-image")
  // async addImage(@Query("id") id: number, @Query("fileUrl") fileUrl: string) {
  //   return await this.productsService.attachImageToProduct(id, fileUrl);
  // }

  @Get()
  async getAll() {
    const products = await this.productsService.getAllProducts();
    Logger.log(`successfuly got ${products.length} products`);
    return products;
  }
}
