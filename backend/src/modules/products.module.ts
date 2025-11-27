import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from 'src/controllers/products.controller';
import { Product } from 'src/entities/product.entity';
import { ProductsService } from 'src/services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // מאפשר inject של repository
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
