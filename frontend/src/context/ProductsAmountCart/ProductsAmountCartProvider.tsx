import { FC, useEffect, useState } from "react";
import { ProductsAmountCartContext } from "./ProductsAmountCartContext";
import { useOrderId } from "../OrderId";
import Swal from "sweetalert2";
import purchasesApi from "../../api/purchasesApi";

export const ProductsAmountCartProvider: FC<{
  children: JSX.Element[] | JSX.Element;
}> = ({ children }) => {
  const { orderId } = useOrderId();
  const [productsAmountCart, setProductsAmountCart] = useState<number>(0);

  useEffect(() => {
    const fetchProductsAmountCart = async () => {
      try {
        if (orderId) {
          console.log(orderId)
          const fetchedProductsAmountCart = (
            await purchasesApi.purchases().getOrderTotalAmount(orderId)
          ).data;
          console.log(fetchedProductsAmountCart, " amount")
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
  }, [orderId]);

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
