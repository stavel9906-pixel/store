import axios, { AxiosResponse } from "axios";
import { OrderDetailsDTO } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
  purchaseAddress() {
    return {
      insertAddress: (
        data: OrderDetailsDTO
      ): Promise<AxiosResponse<{ message: string }>> =>
        axiosInstance.post("purchase-address/insert", data),
    };
  },
};
