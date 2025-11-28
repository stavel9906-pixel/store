import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // מחבר תמונה למוצר ושומר את ה-URL ב-DB
  async attachImageToProduct(id: number, fileUrl: string) {
    const uploadResult = await cloudinary.uploader.upload(fileUrl, {
      public_id: `product_${id}`,
      overwrite: true,
      resource_type: "image",
    });

    const result = await this.productRepo.update(id, {
      imageUrl: uploadResult.secure_url,
    });
    if (result.affected === 0) throw new NotFoundException("Product not found");

    return {
      message: "Image uploaded and URL saved",
      imageUrl: uploadResult.secure_url,
    };
  }

  // מחזיר את כל המוצרים כולל URL
  async getAllProducts() {
    return await this.productRepo.find({ relations: ["productType"] });
  }

  async getProductById(productId: number) {
    return await this.productRepo.findOne({
      where: { productId },
      relations: ["productType"],
    });
  }
}
