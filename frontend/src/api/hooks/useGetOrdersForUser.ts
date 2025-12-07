import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import purchasesApi from "../purchasesApi";
import { HistoryDetailsDTO } from "../../utils/DTOs";
import { useOrderId } from "../../context/OrderId";

export const useGetOrdersForUser = () => {
  const [orders, setOrders] = useState<HistoryDetailsDTO[]>([]);
  const { orderId } = useOrderId();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = (
          await purchasesApi.purchases().getOrdersForUser()
        ).data;

        const formattedOrders = fetchedOrders.map(
          (order: HistoryDetailsDTO) => ({
            ...order,
            createdAt: new Date(order.createdAt).toLocaleDateString("he-IL"),
          })
        );

        setOrders(formattedOrders);
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the Orders. Please try again.",
          "error"
        );
      }
    };

    fetchOrders();
  }, [orderId]);

  return { orders, setOrders };
};
