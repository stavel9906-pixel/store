import { useCallback } from "react";
import Swal from "sweetalert2";
import { useProductsAmountCart } from "../context/ProductsAmountCart";
import purchasesApi from "../api/purchasesApi";
import { useGetUserFromToken } from "../api/hooks/useGetUserFromToken";
import { useOrderId } from "../context/OrderId";

export const useChangeAmount = (productId: number) => {
  const { setProductsAmountCart, productsAmountCart } = useProductsAmountCart();
  const { user } = useGetUserFromToken();
  const { orderId, setOrderId } = useOrderId();

  const changeAmount = useCallback(
    async (toAdd: number) => {
      try {
        if (user) {
          if (productsAmountCart === 0 && !orderId) {
            const newOrderId = (await purchasesApi.purchases().create(user.id)).data;
            await purchasesApi.purchases().changeProductAmount(productId, newOrderId, toAdd);
            setOrderId(newOrderId);
          } else if (orderId) {
            await purchasesApi.purchases().changeProductAmount(productId, orderId, toAdd);
          }
        }

        setProductsAmountCart((prev) => prev + toAdd);
      } catch (error) {
        Swal.fire("There is a problem", "Can't update the cart", "error");
      }
    },
    [orderId, productId, productsAmountCart, setOrderId, setProductsAmountCart, user]
  );

  return changeAmount;
};
