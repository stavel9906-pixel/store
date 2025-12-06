import axios, { AxiosResponse } from "axios";
import { Product, ProductType } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/admin",
});

export default {
  admin() {
    return {
      deleteProduct: (
        token: string | null,
        productId: number
      ): Promise<AxiosResponse<void>> => {
        return axiosInstance.patch(
          `/products/delete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              id: productId, // query param
            },
          }
        );
      },
      addProduct: (
        formData: FormData,
        token: string | null
      ): Promise<AxiosResponse<Product>> =>
        axiosInstance.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }),
      updateProduct: (
        formData: FormData,
        token: string | null
      ): Promise<AxiosResponse<Product>> =>
        axiosInstance.patch("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }),
      updateShippingFee: (
        token: string | null,
        price: number
      ): Promise<AxiosResponse<ProductType>> => {
        return axiosInstance.patch(
          `/shipping/fee`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              price,
            },
          }
        );
      },
      addNewProductType: (
        token: string | null,
        name: string
      ): Promise<AxiosResponse<ProductType>> => {
        return axiosInstance.post(
          `/product-type`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              name,
            },
          }
        );
      },
      deleteProductType: (
        token: string | null,
        id: number
      ): Promise<AxiosResponse<ProductType>> => {
        return axiosInstance.delete(`/product-type`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
          },
        });
      },
    };
  },
};
