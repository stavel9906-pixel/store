import { Module } from "@nestjs/common";
import { AdminController } from "src/controllers/admin.controller";
import { AdminService } from "src/services/admin.service";
import { ProductsService } from "src/services/products.service";
import { CloudinaryModule } from "./cloudinary.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { ProductType } from "src/entities/productType.entity";
import { ProductsTypeService } from "src/services/productsType.service";
import { ShippingConfig } from "src/entities/shipping-config.entity";
import { ShippingService } from "src/services/shipping.service";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductType, ShippingConfig, User]), CloudinaryModule],
  controllers: [AdminController],
  providers: [AdminService, ProductsService, ProductsTypeService, ShippingService],
})
export class AdminModule {}
