import axios, { AxiosResponse } from "axios";
import { ProductType } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
  productsType() {
    return {
      getAll: (): Promise<AxiosResponse<ProductType[]>> =>
        axiosInstance.get(`products-type`),
    };
  },
};
