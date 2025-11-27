import { Controller, Get, Post, Query } from "@nestjs/common";
import { ProductsTypeService } from "src/services/productsType.service";

@Controller("products-type")
export class ProductsTypeController {
  constructor(private productsTypeService: ProductsTypeService) {}

  @Get()
  async getAll() {
    return this.productsTypeService.getAllProductsType();
  }
}
