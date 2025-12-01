
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from 'src/controllers/purchases.controller';
import { Product } from 'src/entities/product.entity';
import { Purchase } from 'src/entities/purchase.entity';
import { PurchaseProduct } from 'src/entities/purchaseProduct.entity';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { UsersModule } from './users.module';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, PurchaseProduct, Product]),
    UsersModule, CloudinaryModule,
  ],
  providers: [PurchasesService, ProductsService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
