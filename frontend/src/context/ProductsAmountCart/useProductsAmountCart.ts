import { useContext } from "react";
import { ProductsAmountCartContext } from "./ProductsAmountCartContext";

export const useProductsAmountCart = () => {
  const productsAmountCart = useContext(ProductsAmountCartContext);

  if (!productsAmountCart) {
    throw new Error(
      "selected convoy context must be used within a SelectedConvoyProvider"
    );
  }

  return productsAmountCart;
};
