import axios, { AxiosResponse } from "axios";
import { Purchase } from "../utils/types";
import { PurchaseStatus } from "../utils/enums";
import { HistoryDetailsDTO } from "../utils/DTOs";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/purchases",
});

export default {
  purchases() {
    return {
      changeProductAmount: (
        productId: number,
        orderId: number,
        amount: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.post(
          `/products/amount`,
          {},
          {
            params: {
              productId,
              orderId,
              amount,
            },
          }
        ),

      create: (id: number): Promise<AxiosResponse<number>> =>
        axiosInstance.post(
          ``,
          {},
          {
            params: {
              id,
            },
          }
        ),
      updateStatus: (
        id: number | null,
        status: PurchaseStatus
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.patch(
          `/${id}/${status}`,
          {},
          {
            params: {
              id,
              status,
            },
          }
        ),
      getByUser: (id: number): Promise<AxiosResponse<number | null>> =>
        axiosInstance.get(`/pending`, {
          params: {
            id,
          },
        }),
      getOrderTotalAmount: (
        id: number
      ): Promise<AxiosResponse<number | null>> =>
        axiosInstance.get(`/products/total`, {
          params: {
            id,
          },
        }),
      getOrderById: (id: number | null): Promise<AxiosResponse<Purchase>> =>
        axiosInstance.get(`/id`, {
          params: {
            id,
          },
        }),
      removeProductFromPurchase: (
        purchaseId: number,
        productId: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.delete(`/${purchaseId}/product/${productId}`),

      getOrdersForUser: async (
        token: string | null
      ): Promise<AxiosResponse<HistoryDetailsDTO[]>> => {
        return axiosInstance.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      },
    };
  },
};
