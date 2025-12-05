import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Country } from "../../utils/types";
import countriesApi from "../countriesApi";

export const useGetCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const fetchedCountries = (await countriesApi.countries().getAll()).data;

        setCountries(fetchedCountries);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem displaying the Countries. Please try again.", "error");
      }
    };

    fetchCountries();
  }, []);

  return { countries, setCountries };
};
