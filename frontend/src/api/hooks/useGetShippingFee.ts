import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import shippingApi from "../shippingApi";

export const useGetShippingFee = () => {
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        const fetchedShippingFee = (
          await shippingApi.shipping().getShippingFee()
        ).data;

        setShippingFee(fetchedShippingFee);
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the Shipping Fee. Please try again.",
          "error"
        );
      }
    };

    fetchShippingFee();
  }, []);

  return { setShippingFee, shippingFee };
};
