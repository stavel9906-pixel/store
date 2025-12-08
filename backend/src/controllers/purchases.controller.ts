import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { PurchaseStatus } from "src/enums/purchaseStatus.enum";
import { UsersRole } from "src/enums/userRole.enum";
import { PurchasesService } from "src/services/purchases.service";
import { UsersService } from "src/services/users.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("purchases")
export class PurchasesController {
  constructor(
    private purchasesService: PurchasesService,
    private usersService: UsersService
  ) {}

  @Get("pending")
  async getByUser(@Query("id") userId: number) {
    try {
      const purchase = await this.purchasesService.getPendingPurchase(userId);
      return purchase?.id;
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to fetch pending purchase"
      );
    }
  }

  @Get("id")
  async getOrderByIdHandler(@Query("id") id: number) {
    try {
      return await this.purchasesService.getOrderById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      Logger.error(error);
      throw new InternalServerErrorException("Failed to fetch the order by ID");
    }
  }

  @Get("products/total")
  async getOrderTotalAmount(@Query("id") orderId: number) {
    try {
      return await this.purchasesService.getTotalAmountPurchase(orderId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        "Failed to calculate total amount for the order"
      );
    }
  }

  @Delete(":purchaseId/product/:productId")
  async deleteProduct(
    @Param("purchaseId") purchaseId: number,
    @Param("productId") productId: number
  ) {
    try {
      return this.purchasesService.deleteProductFromOrder(
        +purchaseId,
        +productId
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException(
        "Failed to remove product from purchase"
      );
    }
  }

  @Get("user")
  async getAllOrdersForUser(@Request() req) {
    try {
      const user = this.usersService.getUserFromToken(
        req.headers.authorization
      );
      return await this.purchasesService.getUserOrdersDetails(user);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        "Failed to fetch user orders details"
      );
    }
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
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Failed to add product to purchase",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("products/best-sellers")
  async getBestSellerProducts(@Query("amount") amount: number) {
    try {
      return await this.purchasesService.findBestSellerProducts(amount);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        "Failed to fetch best seller products"
      );
    }
  }
}
