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
import { ShippingService } from "./shipping.service";
import { User } from "src/entities/user.entity";
import { UserTokenDTO } from "src/entities/DTO/UserTokenDTO";
import { UsersRole } from "src/enums/userRole.enum";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepo: Repository<Purchase>,
    @InjectRepository(PurchaseProduct)
    private purchaseProductRepo: Repository<PurchaseProduct>,
    private productsService: ProductsService,
    private shippingService: ShippingService
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
    if (id) {
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

    return null;
  }

  async deleteProductFromOrder(purchaseId: number, productId: number) {
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
    const shippingFee: number =
      await this.shippingService.getActiveShippingFee();

    if (!existingPending) {
      const newPurchase = this.purchaseRepo.create({
        user: { userId },
        status: PurchaseStatus.PENDING,
        createdAt: new Date(),
        shippingFee,
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

  async getUserOrdersDetails(user: UserTokenDTO): Promise<HistoryDetailsDTO[]> {
    const userId = user.role === UsersRole.ADMIN ? undefined : user.id;
    const purchasesDetail = await this.purchaseRepo.find({
      where: { user: { userId: userId } },
      relations: [
        "purchaseProducts",
        "purchaseProducts.product",
        "purchaseProducts.product.productType",
        "address",
        "user",
      ],
    });

    return purchasesDetail.map((order) => {
      const { requestedDate, requestedTimeFrom, requestedTimeTo } =
        order.address || {};

      const dateStr = requestedDate
        ? new Date(requestedDate).toLocaleDateString("he-IL")
        : "";
      const timeFromStr = requestedTimeFrom
        ? requestedTimeFrom.toString().slice(0, 5)
        : "?";
      const timeToStr = requestedTimeTo
        ? requestedTimeTo.toString().slice(0, 5)
        : "?";

      let deliverTime = "not specified";

      if (requestedDate || requestedTimeFrom || requestedTimeTo) {
        if (dateStr && requestedTimeFrom && requestedTimeTo) {
          deliverTime = `${dateStr}, ${timeFromStr}-${timeToStr}`;
        } else if (dateStr && (requestedTimeFrom || requestedTimeTo)) {
          deliverTime = `${dateStr}, ${timeFromStr}-${timeToStr}`;
        } else if (dateStr) {
          deliverTime = dateStr;
        } else {
          // אין תאריך, רק שעה או חלקי
          deliverTime = `${timeFromStr}-${timeToStr}`;
        }
      }

      console.log(deliverTime);

      return {
        orderId: order.id,
        status: order.status,
        createdAt: order.createdAt,
        deliverTime,
        totalPrice:
          order.purchaseProducts.reduce(
            (sum, pp) => sum + pp.amount * pp.currentPrice,
            0
          ) + Number(order.shippingFee ?? 0),
        quantity: order.purchaseProducts.reduce(
          (sum, pp) => sum + pp.amount,
          0
        ),
        purchaseProducts: order.purchaseProducts,
        userId: order.user.userId,
        userName: order.address
          ? `${order.address.firstName} ${order.address.lastName}`
          : order.user.userName,
        phone: order.address?.phone ?? "",
      };
    });
  }
}
