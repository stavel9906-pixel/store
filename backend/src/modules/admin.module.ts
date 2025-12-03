// src/admin/admin.module.ts
import { Module } from "@nestjs/common";
import { AdminController } from "src/controllers/admin.controller";
import { AdminService } from "src/services/admin.service";
import { ProductsService } from "src/services/products.service";
import { CloudinaryModule } from "./cloudinary.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { ProductType } from "src/entities/productType.entity";
import { ProductsTypeService } from "src/services/productsType.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductType]), CloudinaryModule],
  controllers: [AdminController],
  providers: [AdminService, ProductsService, ProductsTypeService],
})
export class AdminModule {}
