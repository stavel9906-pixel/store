import axios, { AxiosResponse } from "axios";
import { ProductType } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  productsType() {
    return {
      getAll: (): Promise<AxiosResponse<ProductType[]>> =>
        axiosInstance.get(`products-type`),
    };
  },
};
