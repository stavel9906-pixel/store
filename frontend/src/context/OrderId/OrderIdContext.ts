import { createContext } from "react";

export interface OrderIdContextType {
  orderId: number | null;
  setOrderId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const OrderIdContext =
  createContext<OrderIdContextType | null>(null);
