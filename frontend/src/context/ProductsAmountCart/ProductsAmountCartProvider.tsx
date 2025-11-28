import { FC, useState } from "react";
import { ProductsAmountCartContext } from "./ProductsAmountCartContext";

export const ProductsAmountCartProvider: FC<{
  children: JSX.Element[] | JSX.Element;
}> = ({ children }) => {
  const [productsAmountCart, setProductsAmountCart] = useState<number>(0);

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
