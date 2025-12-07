import axios, { AxiosResponse } from "axios";
import { OrderDetailsDTO } from "../utils/DTOs";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/purchase-address",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  purchaseAddress() {
    return {
      insertAddress: (
        data: OrderDetailsDTO
      ): Promise<AxiosResponse<{ message: string }>> =>
        axiosInstance.post("/insert", data),
    };
  },
};
