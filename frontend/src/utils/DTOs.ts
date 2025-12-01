import { PurchaseStatus } from "./enums";
import { PurchaseProduct } from "./types";

export type OrderDetailsDTO = {
  orderId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  street: string;
  houseNumber: number;
};

export type HistoryDetailsDTO = {
  orderId: number;
  deliverTime: string | undefined;
  createdAt: string;
  quantity: number;
  totalPrice: number;
  status: PurchaseStatus;
  purchaseProducts: PurchaseProduct[];
};

export interface UpdateUserDTO {
  id: number;
  name: string;
  oldPassword: string;
  newPassword: string;
  profile?: string;
}
