import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Product } from "../../utils/types";
import productsApi from "../productsApi";

export const useGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = (await productsApi.products().getAll()).data;

        setProducts(fetchedProducts);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem displaying the products. Please try again.", "error");
      }
    };

    fetchProducts();
  }, []);

  return { products, setProducts };
};
