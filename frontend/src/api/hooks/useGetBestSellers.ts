import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Product } from "../../utils/types";
import purchasesApi from "../purchasesApi";

export const useGetBestSellers = (amount: number) => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const fetchedBestSellers = (await purchasesApi.purchases().getMostSoldProducts(amount)).data;

        setBestSellers(fetchedBestSellers);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem displaying the Best Sellers. Please try again.", "error");
      }
    };

    fetchBestSellers();
  }, [amount]);

  return { bestSellers, setBestSellers };
};
