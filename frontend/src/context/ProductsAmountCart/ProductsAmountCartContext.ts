import { createContext } from "react";

export interface ProductsAmountCartContextType {
  productsAmountCart: number;
  setProductsAmountCart: React.Dispatch<React.SetStateAction<number>>;
}

export const ProductsAmountCartContext =
  createContext<ProductsAmountCartContextType | null>(null);
