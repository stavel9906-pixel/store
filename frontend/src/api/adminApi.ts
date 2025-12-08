import axios, { AxiosResponse } from "axios";
import { Product, ProductType } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/admin",
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  admin() {
    return {
      deleteProduct: (productId: number): Promise<AxiosResponse<void>> => {
        return axiosInstance.patch(
          `/products/delete`,
          {},
          {
            params: {
              id: productId, 
            },
          }
        );
      },
      addProduct: (formData: FormData): Promise<AxiosResponse<Product>> =>
        axiosInstance.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      updateProduct: (formData: FormData): Promise<AxiosResponse<Product>> =>
        axiosInstance.patch("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      updateShippingFee: (
        price: number
      ): Promise<AxiosResponse<ProductType>> => {
        return axiosInstance.patch(
          `/shipping/fee`,
          {},
          {
            params: {
              price,
            },
          }
        );
      },
      addNewProductType: (
        name: string
      ): Promise<AxiosResponse<ProductType>> => {
        return axiosInstance.post(
          `/product-type`,
          {},
          {
            params: {
              name,
            },
          }
        );
      },
      deleteProductType: (id: number): Promise<AxiosResponse<ProductType>> => {
        return axiosInstance.delete(`/product-type`, {
          params: {
            id,
          },
        });
      },
      getProductsAmount: (): Promise<AxiosResponse<number>> => axiosInstance.get(`products/amount`),
      getUsersAmount: (): Promise<AxiosResponse<number>> => axiosInstance.get(`users/amount`),
    };
  },
};
