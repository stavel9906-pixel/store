import axios, { AxiosResponse } from "axios";
import { Product } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/products",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  products() {
    return {
      getAll: (): Promise<AxiosResponse<Product[]>> =>
        axiosInstance.get(``),
    };
  },
};
