import axios, { AxiosResponse } from "axios";
import { HistoryDetailsDTO, Purchase } from "../utils/types";
import { PurchaseStatus } from "../utils/enums";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
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
          `/purchases/products/amount`,
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
          `/purchases`,
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
          `/purchases/${id}/${status}`,
          {},
          {
            params: {
              id,
              status,
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

      getOrdersForUser: async (
        token: string | null
      ): Promise<AxiosResponse<HistoryDetailsDTO[]>> => {
        return axiosInstance.get("purchases/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      },
    };
  },
};
