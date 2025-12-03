// src/admin/admin.module.ts
import { Module } from "@nestjs/common";
import { AdminController } from "src/controllers/admin.controller";
import { AdminService } from "src/services/admin.service";
import { ProductsService } from "src/services/products.service";
import { CloudinaryModule } from "./cloudinary.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CloudinaryModule],
  controllers: [AdminController],
  providers: [AdminService, ProductsService],
  exports: [],
})
export class AdminModule {}
