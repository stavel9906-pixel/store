import axios, { AxiosResponse } from "axios";
import { Country } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/countries",
});

export default {
  countries() {
    return {
      getAll: (): Promise<AxiosResponse<Country[]>> =>
        axiosInstance.get(``),
    };
  },
};
