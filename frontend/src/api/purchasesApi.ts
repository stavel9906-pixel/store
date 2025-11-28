import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
  purchases() {
    return {
      increaseProductAmount: (
        productId: number,
        userId: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.post(
          `/purchases/products/increase`,
          {},
          {
            params: {
              productId,
              userId,
            },
          }
        ),
      decreaseProductAmount: (
        productId: number,
        userId: number
      ): Promise<AxiosResponse<void>> =>
        axiosInstance.post(
          `/purchases/products/decrease`,
          {},
          {
            params: {
              productId,
              userId,
            },
          }
        ),

      create: (id: number): Promise<AxiosResponse<void>> =>
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
        axiosInstance.get(
          `/purchases`,
          {
            params: {
              id,
            },
          }
        ),
    };
  },
};
