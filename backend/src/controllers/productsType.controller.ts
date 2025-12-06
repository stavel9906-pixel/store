import { Controller, Get, InternalServerErrorException, Post, Query } from "@nestjs/common";
import { ProductsTypeService } from "src/services/productsType.service";

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
