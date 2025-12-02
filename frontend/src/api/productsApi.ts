import axios, { AxiosResponse } from "axios";
import { Product } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/products",
});

export default {
  products() {
    return {
      getAll: (): Promise<AxiosResponse<Product[]>> =>
        axiosInstance.get(``),
    };
  },
};
