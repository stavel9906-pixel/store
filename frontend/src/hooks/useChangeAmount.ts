import { useCallback } from "react";
import Swal from "sweetalert2";
import { useProductsAmountCart } from "../context/ProductsAmountCart";
import purchasesApi from "../api/purchasesApi";
import { useGetUserFromToken } from "../api/hooks/useGetUserFromToken";

export const useChangeAmount = (toAdd: boolean, productId: number) => {
  const { setProductsAmountCart, productsAmountCart } = useProductsAmountCart();
  const { user } = useGetUserFromToken();
  console.log(user);

  const changeAmount = useCallback(async () => {
    try {
      if (user) {
        console.log(productsAmountCart)
        if (productsAmountCart === 0) {
          console.log(user.id)
          await purchasesApi.purchases().create(user.id);
        }

        if (toAdd) {
          // הוספת מוצר
          await purchasesApi
            .purchases()
            .increaseProductAmount(productId, user.id);
        } else {
          // הפחתת מוצר
          await purchasesApi
            .purchases()
            .decreaseProductAmount(productId, user.id);
        }
      }

      setProductsAmountCart((prev) => prev + (toAdd ? 1 : -1));
    } catch (error) {
      Swal.fire("There is a problem", "Can't update the cart", "error");
    }
  }, [productId, setProductsAmountCart, toAdd, user]);

  return changeAmount;
};
