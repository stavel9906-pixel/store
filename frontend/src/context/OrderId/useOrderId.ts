import { useContext } from "react";
import { OrderIdContext } from "./OrderIdContext";

export const useOrderId = () => {
  const orderId = useContext(OrderIdContext);

  if (!orderId) {
    throw new Error(
      " OrderId context must be used within a OrderIdProvider"
    );
  }

  return orderId;
};
