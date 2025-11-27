import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsTypeController } from "src/controllers/productsType.controller";
import { ProductType } from "src/entities/productType.entity";
import { ProductsTypeService } from "src/services/productsType.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])], 
  providers: [ProductsTypeService],
  controllers: [ProductsTypeController],
})
export class ProductsTypeModule {}
