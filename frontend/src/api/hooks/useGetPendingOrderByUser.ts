import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetUserFromToken } from "./useGetUserFromToken";
import purchasesApi from "../purchasesApi";

export const useGetPendingOrderByUser = () => {
  const { user } = useGetUserFromToken();
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (user) {
          const fetchedOrder = (
            await purchasesApi.purchases().getByUser(user?.id)
          ).data;
          setOrderId(fetchedOrder || null);
        }
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the order id. Please try again.",
          "error"
        );
      }
    };

    fetchOrder();
  }, [user]);

  return { orderId, setOrderId };
};
