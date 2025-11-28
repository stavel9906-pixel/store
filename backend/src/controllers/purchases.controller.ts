import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { PurchasesService } from "src/services/purchases.service";

@Controller("purchases")
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get("pending")
  async getByUser(@Query("id") userId: number) {
    const purchase = await this.purchasesService.getPendingPurchase(userId);
    return purchase?.id;
  }

  @Get("id")
  async getOrderByIdHandler(@Query("id") id: number) {
    return await this.purchasesService.getOrderById(id);
  }

  @Get("products/total")
  async getOrderTotalAmount(@Query("id") orderId: number) {
    return await this.purchasesService.getTotalAmountPurchase(orderId);
  }

  @Delete(":purchaseId/product/:productId")
  async deleteProduct(@Param("purchaseId") purchaseId: number, @Param("productId") productId: number) {
    return this.purchasesService.deleteProduct(+purchaseId, +productId);
  }

  @Post()
  async create(@Query("id") userId: number) {
    try {
      return (await this.purchasesService.createPurchase(userId)).id;
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
    @Query("orderId") orderId: number
  ) {
    try {
      return await this.purchasesService.addProductToPurchase(
        orderId,
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
    @Query("orderId") orderId: number
  ) {
    try {
      return await this.purchasesService.addProductToPurchase(
        orderId,
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
