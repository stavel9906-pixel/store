import axios, { AxiosResponse } from "axios";
import { Purchase } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
  purchases() {
    return {
      increaseProductAmount: (
        productId: number,
        orderId: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.post(
          `/purchases/products/increase`,
          {},
          {
            params: {
              productId,
              orderId,
            },
          }
        ),
      decreaseProductAmount: (
        productId: number,
        orderId: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.post(
          `/purchases/products/decrease`,
          {},
          {
            params: {
              productId,
              orderId,
            },
          }
        ),

      create: (id: number): Promise<AxiosResponse<number>> =>
        axiosInstance.post(
          `/purchases`,
          {},
          {
            params: {
              id,
            },
          }
        ),
      getByUser: (id: number): Promise<AxiosResponse<number | null>> =>
        axiosInstance.get(`/purchases/pending`, {
          params: {
            id,
          },
        }),
      getOrderTotalAmount: (
        id: number
      ): Promise<AxiosResponse<number | null>> =>
        axiosInstance.get(`/purchases/products/total`, {
          params: {
            id,
          },
        }),
      getOrderById: (id: number | null): Promise<AxiosResponse<Purchase>> =>
        axiosInstance.get(`/purchases/id`, {
          params: {
            id,
          },
        }),
      removeProductFromPurchase: (
        purchaseId: number,
        productId: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.delete(`/purchases/${purchaseId}/product/${productId}`),
    };
  },
};
