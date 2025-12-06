import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { AdminService } from "src/services/admin.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Product } from "src/entities/product.entity";

@UseGuards(new AuthAndRoleGuard([UsersRole.ADMIN]))
@Roles(UsersRole.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch("products/delete")
  deleteProduct(@Query("id") productId: number) {
    try {
      return this.adminService.deleteProduct(productId);
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to remove product");
    }
  }

  @Patch("products")
  @UseInterceptors(FileInterceptor("image"))
  async updateProduct(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() product: Product
  ) {
    try {
      return await this.adminService.updateProduct(product, file);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Error while updating product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("products")
  @UseInterceptors(FileInterceptor("image"))
  async addProduct(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() product: Product
  ) {
    try {
      return await this.adminService.addProduct(product, file);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Error while adding product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("product-type")
  async addProductType(@Query("name") name: string) {
    try {
      return await this.adminService.insertNewProductType(name);
    } catch (err: any) {
      throw new HttpException(
        "Error while adding product type",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete("product-type")
  async deleteProductType(@Query("id") id: number) {
    try {
      return this.adminService.deleteProductType(+id);
    } catch (error) {
      throw new InternalServerErrorException("Failed to remove product type");
    }
  }

  @Patch('shipping/fee')
  async updateFee(@Query('price') price: number) {
    try {
      return this.adminService.updateShippingFee(price);
    } catch (error) {
      throw new InternalServerErrorException("Failed to update shipping fee");
    }
  }
}
