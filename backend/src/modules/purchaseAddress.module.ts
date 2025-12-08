import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "src/controllers/products.controller";
import { PurchaseAddressController } from "src/controllers/purchaseAddress.controller";
import { City } from "src/entities/city.entity";
import { Product } from "src/entities/product.entity";
import { PurchaseAddress } from "src/entities/purchaseAddress.entity";
import { ProductsService } from "src/services/products.service";
import { PurchaseAddressService } from "src/services/purchaseAddress.service";

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseAddress, City])], 
  providers: [PurchaseAddressService],
  controllers: [PurchaseAddressController],
})
export class PurchaseAddressModule {}
