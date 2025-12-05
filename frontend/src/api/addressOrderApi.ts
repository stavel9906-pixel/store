import axios, { AxiosResponse } from "axios";
import { OrderDetailsDTO } from "../utils/DTOs";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/purchase-address",
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
