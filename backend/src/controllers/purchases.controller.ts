import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { PurchasesService } from "src/services/purchases.service";

@Controller("purchases")
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get()
  async getByUser(@Query("id") userId: number) {
    const purchase = await this.purchasesService.getPendingPurchase(userId);
    return purchase?.id;
  }

  @Post()
  async create(@Query("id") userId: number) {
    try {
      return await this.purchasesService.createPurchase(userId);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Failed to create purchase",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("products/increase")
  async addProduct(
    @Query("productId") productId: number,
    @Query("userId") userId: number
  ) {
    try {
      return await this.purchasesService.addProductToPurchase(
        userId,
        productId,
        1
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Failed to add product to purchase",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("products/decrease")
  async decreaseProduct(
    @Query("productId") productId: number,
    @Query("userId") userId: number
  ) {
    try {
      return await this.purchasesService.addProductToPurchase(
        userId,
        productId,
        -1
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Failed to decrease product from purchase",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
