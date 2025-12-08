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
  date?: Date;
  timeFrom?: string;
  timeTo?: string;
};

export type HistoryDetailsDTO = {
  orderId: number;
  deliverTime: string | undefined;
  createdAt: Date | string;
  quantity: number;
  totalPrice: number;
  status: PurchaseStatus;
  purchaseProducts: PurchaseProduct[];
  userId: number;
  userName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  houseNumber: string;
};

export interface UpdateUserDTO {
  id: number;
  name: string;
  oldPassword: string;
  newPassword: string;
  profile?: string;
}
