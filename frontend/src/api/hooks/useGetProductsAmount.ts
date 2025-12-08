import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import adminApi from "../adminApi";

export const useGetProductsAmount = (isAdmin: boolean) => {
  const [productsAmount, setProductsAmount] = useState<number>(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchProductsAmount = async () => {
      try {
        const fetchedProductsAmount = (
          await adminApi.admin().getProductsAmount()
        ).data;

        setProductsAmount(fetchedProductsAmount);
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the products amount. Please try again.",
          "error"
        );
      }
    };

    fetchProductsAmount();
  }, [isAdmin]);

  return { productsAmount, setProductsAmount };
};
