import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { HistoryDetailsDTO } from "../../utils/types";
import purchasesApi from "../purchasesApi";

export const useGetOrdersForUser = () => {
  const [orders, setOrders] = useState<HistoryDetailsDTO[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const fetchedOrders = (
          await purchasesApi.purchases().getOrdersForUser(token)
        ).data;

        const formattedOrders = fetchedOrders.map(
          (order: HistoryDetailsDTO) => ({
            ...order,
            createdAt: new Date(order.createdAt).toLocaleDateString("he-IL"),
            delivertime: order.deliverTime
              ? new Date(order.deliverTime).toLocaleDateString("he-IL")
              : "not delivered",
          })
        );

        console.log(fetchedOrders);
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
  }, []);

  return { orders, setOrders };
};
