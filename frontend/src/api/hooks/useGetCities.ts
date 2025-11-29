import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { City } from "../../utils/types";
import citiesApi from "../citiesApi";

export const useGetCities = () => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const fetchedCities = (await citiesApi.cities().getAll()).data;

        setCities(fetchedCities);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem displaying the Cities. Please try again.", "error");
      }
    };

    fetchCities();
  }, []);

  return { cities, setCities };
};
