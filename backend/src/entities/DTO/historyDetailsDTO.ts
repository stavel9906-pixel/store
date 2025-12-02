import { Timestamp } from "rxjs";
import { PurchaseStatus } from "src/enums/purchaseStatus.enum";
import { PurchaseProduct } from "../purchaseProduct.entity";

export type HistoryDetailsDTO = {
  orderId: number;
  deliverTime: string | undefined;
  createdAt: Date;
  quantity: number;
  totalPrice: number;
  status: PurchaseStatus;
  purchaseProducts: PurchaseProduct[];
  userId: number;
  userName: string;
  phone: string;
};
