import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { ProductType } from "src/entities/productType.entity";

@Injectable()
export class ProductsTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepo: Repository<ProductType>
  ) {}

  async getAllProductsType() {
    return await this.productTypeRepo.find();
  }

  async getTypeById(id: number): Promise<ProductType> {
    const type = await this.productTypeRepo.findOne({ where: { id } });
    if (!type) throw new NotFoundException("Product type not found");
    return type;
  }

  async addProductType(name: string) {
    const type = this.productTypeRepo.create({
      name: name,
    });

    return await this.productTypeRepo.save(type);
  }

  async deleteProductType(id: number) {
    return await this.productTypeRepo.delete({
      id,
    });
  }
}
