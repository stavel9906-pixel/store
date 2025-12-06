import { Controller, Get, Logger, Post, Query } from "@nestjs/common";
import { ProductsService } from "src/services/products.service";

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
