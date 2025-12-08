import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import purchasesApi from "../purchasesApi";
import { useOrderId } from "../../context/OrderId";
import { Purchase } from "../../utils/types";

export const useGetOrderById = () => {
  const { orderId } = useOrderId();
  const [order, setOrder] = useState<Purchase | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = (
          await purchasesApi.purchases().getOrderById(orderId)
        ).data;

        setOrder(fetchedOrder)
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the order. Please try again.",
          "error"
        );
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, setOrder };
};
