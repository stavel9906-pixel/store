import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { CloudinaryService } from "./cloudinary.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private cloudinaryService: CloudinaryService
  ) {}

  async attachImageToProduct(id: number, fileUrl: string) {
    const uploadResult = await this.cloudinaryService.uploadImage(
      fileUrl,
      `product_${id}`
    );

    const result = await this.productRepo.update(id, {
      imageUrl: uploadResult.secure_url,
    });

    if (result.affected === 0)
      throw new NotFoundException("Product not found");

    return {
      message: "Image uploaded and URL saved",
      imageUrl: uploadResult.secure_url,
    };
  }

  async getAllProducts() {
    return this.productRepo.find({ 
      where: {forSale: true},
      relations: ["productType"]
     });
  }

  async getProductById(productId: number) {
    return this.productRepo.findOne({
      where: { productId },
      relations: ["productType"],
    });
  }
}
