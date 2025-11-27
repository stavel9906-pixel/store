import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductType } from 'src/entities/productType.entity';

@Injectable()
export class ProductsTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepo: Repository<ProductType>,
  ) {}

   async getAllProductsType() {
    return await this.productTypeRepo.find();
  }
}
