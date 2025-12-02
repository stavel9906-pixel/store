import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from "@nestjs/common";
import { PurchaseStatus } from "src/enums/purchaseStatus.enum";
import { PurchasesService } from "src/services/purchases.service";
import { UsersService } from "src/services/users.service";

@Controller("purchases")
export class PurchasesController {
  constructor(
    private purchasesService: PurchasesService,
    private usersService: UsersService
  ) {}

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
  async deleteProduct(
    @Param("purchaseId") purchaseId: number,
    @Param("productId") productId: number
  ) {
    return this.purchasesService.deleteProductFromOrder(
      +purchaseId,
      +productId
    );
  }

  @Get("user")
  async getAllOrdersForUser(@Request() req) {
    const user = this.usersService.getUserFromToken(req.headers.authorization);
    console.log(user);
    return await this.purchasesService.getUserOrdersDetails(user);
  }

  @Patch(":id/:status")
  async updateStatus(
    @Param("id") id: number,
    @Param("status") status: PurchaseStatus
  ) {
    try {
      await this.purchasesService.updateStatus(id, status);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Error while updating order password",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Query("id") userId: number) {
    try {
      return (await this.purchasesService.createPurchase(userId)).id;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        "Failed to create purchase",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("products/amount")
  async addProduct(
    @Query("productId") productId: number,
    @Query("orderId") orderId: number,
    @Query("amount") amount: number
  ) {
    try {
      return await this.purchasesService.addProductToPurchase(
        orderId,
        productId,
        +amount
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        "Failed to add product to purchase",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
