import { FC, useEffect, useState } from "react";
import { ProductsAmountCartContext } from "./ProductsAmountCartContext";
import { useOrderId } from "../OrderId";
import Swal from "sweetalert2";
import purchasesApi from "../../api/purchasesApi";
import { useGetUserFromToken } from "../../api/hooks/useGetUserFromToken";

export const ProductsAmountCartProvider: FC<{
  children: JSX.Element[] | JSX.Element;
}> = ({ children }) => {
  const { orderId } = useOrderId();
    const { user } = useGetUserFromToken();

  const [productsAmountCart, setProductsAmountCart] = useState<number>(0);

  useEffect(() => {
    const fetchProductsAmountCart = async () => {
      setProductsAmountCart(0);
      try {
        if (orderId) {
          const fetchedProductsAmountCart = (
            await purchasesApi.purchases().getOrderTotalAmount(orderId)
          ).data;
          setProductsAmountCart(fetchedProductsAmountCart || 0);
        }
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the cart amount total. Please try again.",
          "error"
        );
      }
    };

    fetchProductsAmountCart();
  }, [orderId, user]);

  return (
    <ProductsAmountCartContext.Provider
      value={{
        productsAmountCart,
        setProductsAmountCart,
      }}
    >
      {children}
    </ProductsAmountCartContext.Provider>
  );
};
