import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { CloudinaryService } from "./cloudinary.service";
import { ProductsTypeService } from "./productsType.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private cloudinaryService: CloudinaryService,
    private productTypeService: ProductsTypeService,
  ) {}

  async deleteProduct(productId: number) {
    console.log(productId);
    const result = await this.productRepo
      .createQueryBuilder("product")
      .update(Product)
      .set({
        forSale: false,
      })
      .where("product_id = :id", { id: productId })
      .execute();

    if (result.affected === 0) throw new NotFoundException("Product not found");
  }

  async updateProduct(product: Product, file?: Express.Multer.File) {
    const currentProduct = await this.productRepo.findOne({
      where: { productId: product.productId },
    });

    if (!currentProduct) throw new NotFoundException("Product not found");

    // --- תמונת מוצר ---
    if (file) {
      try {
        const result = await this.cloudinaryService.uploadFileImage(file);
        currentProduct.imageUrl = result.secure_url;
      } catch (error) {
        Logger.error("Cloudinary upload failed:", error);
      }
    }

    const type = await this.productTypeService.getTypeById(
      +product.productType
    );

    currentProduct.productName = product.productName;
    currentProduct.description = product.description;
    currentProduct.productType = type;
    currentProduct.price = product.price;

    const savedProduct = await this.productRepo.save(currentProduct);

    return savedProduct;
  }

  async addProduct(product: Product, file?: Express.Multer.File) {
    if (file) {
      try {
        const result = await this.cloudinaryService.uploadFileImage(file);
        product.imageUrl = result.secure_url;
      } catch (error) {
        Logger.error("Cloudinary upload failed:", error);
      }
    }

    const productToSave = this.productRepo.create({
      price: product.price,
      productName: product.productName,
      productType: { id: +product.productType },
      imageUrl: product.imageUrl,
      description: product.description,
    });

    const savedProduct = await this.productRepo.save(productToSave);

    return savedProduct;
  }
}
