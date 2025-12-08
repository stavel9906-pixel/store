import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { CloudinaryService } from "./cloudinary.service";
import { ProductsTypeService } from "./productsType.service";
import { ShippingService } from "./shipping.service";
import { ShippingConfig } from "src/entities/shipping-config.entity";
import { User } from "src/entities/user.entity";
import { UsersRole } from "src/enums/userRole.enum";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private cloudinaryService: CloudinaryService,
    private productTypeService: ProductsTypeService,
    private shippingService: ShippingService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async deleteProduct(productId: number) {
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

    if (file) {
      try {
        const result = await this.cloudinaryService.uploadFileImage(file);
        currentProduct.imageUrl = result.secure_url;
      } catch (error) {
        Logger.error("Cloudinary upload failed: ", error);
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

    const type = await this.productTypeService.getTypeById(
      +product.productType
    );

    const productToSave = this.productRepo.create({
      price: product.price,
      productName: product.productName,
      productType: type,
      imageUrl: product.imageUrl,
      description: product.description,
    });

    const savedProduct = await this.productRepo.save(productToSave);

    return savedProduct;
  }

  async insertNewProductType(name: string) {
    return await this.productTypeService.addProductType(name);
  }

  async deleteProductType(id: number) {
    const result = await this.productTypeService.deleteProductType(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product Type with ID ${id} not found`);
    }

    return { message: "Product Type successfully deleted" };
  }

  async updateShippingFee(fee: number): Promise<ShippingConfig> {
    return await this.shippingService.setShippingFee(fee);
  }

  async getProductsTotalAmount(): Promise<number> {
    const numberOfProducts = await this.productRepo
      .createQueryBuilder("pro")
      .select("COUNT(*)", "products")
      .where("pro.for_sale = true")
      .getRawOne();

    return Number(numberOfProducts.products);
  }

  async getUsersTotalAmount(): Promise<number> {
    const numberOfUsers = await this.usersRepository
      .createQueryBuilder("user")
      .select("COUNT(*)", "users")
      .where("user.role = :role", {role: UsersRole.USER})
      .getRawOne();

    return Number(numberOfUsers.users);
  }
}
