import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Purchase } from "src/entities/purchase.entity";
import { PurchaseStatus } from "src/enums/purchaseStatus.enum";
import { PurchaseProduct } from "src/entities/purchaseProduct.entity";
import { ProductsService } from "./products.service";
import { HistoryDetailsDTO } from "src/entities/DTO/historyDetailsDTO";
const SHIPPING_PRICE: number = 2;

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
      relations: ["purchaseProducts", "user"],
    });

    return purchase;
  }

  async getOrderById(id: number): Promise<Purchase | null> {
    const purchase = await this.purchaseRepo.findOne({
      where: { id },
      relations: [
        "purchaseProducts",
        "purchaseProducts.product",
        "purchaseProducts.product.productType",
      ],
    });

    return purchase;
  }

  async deleteProduct(purchaseId: number, productId: number) {
    try {
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

  async updateStatus(id: number, status: PurchaseStatus): Promise<void> {
    const updateResult = await this.purchaseRepo
      .createQueryBuilder("order")
      .update(Purchase)
      .set({
        status: status,
      })
      .where("id = :orderId", { orderId: id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException("no purchase with this id found");
    }
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
    const purchase = await this.purchaseRepo.findOne({
      where: { id: orderId },
    });

    if (!purchase) {
      throw new NotFoundException("Purchase not found");
    }

    purchaseProduct = this.purchaseProductRepo.create({
      purchase,
      product,
      amount,
      currentPrice: product.price,
    });

    return this.purchaseProductRepo.save(purchaseProduct);
  }

  async getUserOrdersDetails(userId: number): Promise<HistoryDetailsDTO[]> {
    const purchasesDetail = await this.purchaseRepo.find({
      where: { user: { userId: userId } },
      relations: [
        "purchaseProducts",
        "purchaseProducts.product",
        "purchaseProducts.product.productType",
      ], // להוסיף של פרודאקט טייפ
    });

    console.log(purchasesDetail);

    return purchasesDetail.map((order) => ({
      orderId: order.id,
      status: order.status,
      createdAt: order.createdAt,
      deliverTime: order.deliverTime,
      totalPrice: order.purchaseProducts.reduce(
        (sum, pp) => sum + pp.amount * pp.currentPrice,
        0
      ) + SHIPPING_PRICE,
      quantity: order.purchaseProducts.reduce((sum, pp) => sum + pp.amount, 0),
      purchaseProducts: order.purchaseProducts,
    }));
  }
}
