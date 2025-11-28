import { useCallback } from "react";
import Swal from "sweetalert2";
import { useProductsAmountCart } from "../context/ProductsAmountCart";
import purchasesApi from "../api/purchasesApi";
import { useGetUserFromToken } from "../api/hooks/useGetUserFromToken";
import { useOrderId } from "../context/OrderId";

export const useChangeAmount = (toAdd: boolean, productId: number) => {
  const { setProductsAmountCart, productsAmountCart } = useProductsAmountCart();
  const { user } = useGetUserFromToken();
  const { orderId, setOrderId } = useOrderId();
  const changeAmount = useCallback(async () => {
    try {
      if (user) {
        if (productsAmountCart === 0 && !orderId) {
          console.log(user.id)
          const newOrderId = (await purchasesApi.purchases().create(user.id)).data;
          setOrderId(newOrderId)
        }

        if (toAdd) {
          console.log(orderId)
          // הוספת מוצר
          await purchasesApi
            .purchases()
            .increaseProductAmount(productId, orderId!);
        } else {
          // הפחתת מוצר
          await purchasesApi
            .purchases()
            .decreaseProductAmount(productId, orderId!);
        }
      }

      setProductsAmountCart((prev) => prev + (toAdd ? 1 : -1));
    } catch (error) {
      Swal.fire("There is a problem", "Can't update the cart", "error");
    }
  }, [orderId, productId, productsAmountCart, setOrderId, setProductsAmountCart, toAdd, user]);

  return changeAmount;
};
