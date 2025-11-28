import { Injectable, NotFoundException } from "@nestjs/common";
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
    console.log("id: ", id)
    const purchase = await this.purchaseRepo.findOne({
      where: {
        user: { userId: id },
        status: PurchaseStatus.PENDING,
      },
      relations: ["purchaseProducts", "user"], // הוספת הקשרים למשתמש ולמוצרים
    });

    console.log("Found Purchase:", purchase); // הדפסת התוצאה

    return purchase;
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
    userId: number,
    productId: number,
    amount: number
  ) {
    const purchase = await this.getPendingPurchase(userId);

    if (!purchase) {
      throw new NotFoundException("Pending purchase not found");
    }

    // האם המוצר כבר קיים בהזמנה?
    let purchaseProduct = await this.purchaseProductRepo.findOne({
      where: {
        purchase: { id: purchase.id },
        product: { productId },
      },
      relations: ["product", "purchase"],
    });

    if (purchaseProduct) {
      //  אם כבר קיים — מוסיפים עוד 1 לכמות
      purchaseProduct.amount += amount;

      return this.purchaseProductRepo.save(purchaseProduct);
    }

    const product = await this.productsService.getProductById(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }
    //  אם לא קיים — יוצרים רשומה חדשה
    purchaseProduct = this.purchaseProductRepo.create({
      purchase: { id: purchase.id },
      product: { productId },
      amount: 1,
      currentPrice: product.price,
    });

    return this.purchaseProductRepo.save(purchaseProduct);
  }
}
