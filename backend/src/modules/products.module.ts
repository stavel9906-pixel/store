import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "src/controllers/products.controller";
import { Product } from "src/entities/product.entity";
import { ProductsService } from "src/services/products.service";
import { CloudinaryModule } from "./cloudinary.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CloudinaryModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
