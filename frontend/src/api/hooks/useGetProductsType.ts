import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ProductType } from "../../utils/types";
import productsTypeApi from "../productsTypeApi";

export const useGetProductsType = () => {
  const [productsType, setProductsType] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProductsType = async () => {
      try {
        const fetchedProductsType = (await productsTypeApi.productsType().getAll()).data;

        setProductsType(fetchedProductsType.sort((before, current) => before.name.localeCompare( current.name )));
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem displaying the products Type. Please try again.", "error");
      }
    };

    fetchProductsType();
  }, []);

  return { productsType, setProductsType };
};
