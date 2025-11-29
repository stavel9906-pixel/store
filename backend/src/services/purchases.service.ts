import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { ProductType } from "src/entities/productType.entity";
import { Purchase } from "src/entities/purchase.entity";
import { PurchaseStatus } from "src/enums/purchaseStatus.enum";
import { PurchaseProduct } from "src/entities/purchaseProduct.entity";
import { ProductsService } from "./products.service";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepo: Repository<Purchase>,
    @InjectRepository(PurchaseProduct)
    private purchaseProductRepo: Repository<PurchaseProduct>,
    private productsService: ProductsService
  ) {}

  async getPendingPurchase(id: number): Promise<Purchase | null> {
    const purchase = await this.purchaseRepo.findOne({
      where: {
        user: { userId: id },
        status: PurchaseStatus.PENDING,
      },
      relations: ["purchaseProducts", "user"], // הוספת הקשרים למשתמש ולמוצרים
    });

    return purchase;
  }

  async getOrderById(id: number): Promise<Purchase | null> {
    const purchase = await this.purchaseRepo.findOne({
      where: { id },
      relations: [
        "purchaseProducts", // כל ה־PurchaseProduct
        "purchaseProducts.product", // טעינת המידע המלא של כל Product
        "purchaseProducts.product.productType", // אם רוצים גם סוג מוצר
      ],
    });

    return purchase;
  }

  async deleteProduct(purchaseId: number, productId: number) {
    try {
      console.log("purchase ", purchaseId);
      console.log("product ", productId)
      const result = await this.purchaseProductRepo.delete({
        purchase: { id: purchaseId },
        product: { productId: productId },
      });

      if (result.affected === 0) {
        throw new NotFoundException(
          `Product with ID ${productId} not found in purchase ${purchaseId}`
        );
      }

      return { message: "Product removed successfully" };
    } catch (error) {
      throw new InternalServerErrorException("Failed to remove product");
    }
  }

  async getTotalAmountPurchase(id: number): Promise<number> {
    const totalAmount = await this.purchaseProductRepo
      .createQueryBuilder("purchaseProducts")
      .select("SUM(purchaseProducts.amount)", "total")
      .where("purchaseProducts.purchase_id = :purchaseId", { purchaseId: id })
      .getRawOne();

    return totalAmount.total ?? 0;
  }

  async createPurchase(userId: number) {
    const existingPending = await this.getPendingPurchase(userId);

    if (!existingPending) {
      const newPurchase = this.purchaseRepo.create({
        user: { userId },
        status: PurchaseStatus.PENDING,
        createdAt: new Date(),
      });

      return this.purchaseRepo.save(newPurchase);
    }

    return existingPending;
  }

  async addProductToPurchase(
    orderId: number,
    productId: number,
    amount: number
  ) {
    // האם המוצר כבר קיים בהזמנה?
    let purchaseProduct = await this.purchaseProductRepo
      .createQueryBuilder("pp")
      .leftJoinAndSelect("pp.product", "product")
      .leftJoinAndSelect("pp.purchase", "purchase")
      .where("purchase.id = :orderId", { orderId })
      .andWhere("product.productId = :productId", { productId })
      .getOne();

    if (purchaseProduct) {
      const newAmount = purchaseProduct.amount + amount;
      purchaseProduct.amount = newAmount < 0 ? 0 : newAmount;


      return this.purchaseProductRepo.save(purchaseProduct);
    }

    const product = await this.productsService.getProductById(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }
    //  אם לא קיים — יוצרים רשומה חדשה
    const purchase = await this.purchaseRepo.findOne({
      where: { id: orderId },
    });

    if (!purchase) {
      throw new NotFoundException("Purchase not found");
    }

    

    purchaseProduct = this.purchaseProductRepo.create({
      purchase, //  entity מלא
      product: product, //  entity מלא
      amount,
      currentPrice: product.price,
    });

    return this.purchaseProductRepo.save(purchaseProduct);
  }
}
