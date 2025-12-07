import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/shipping",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  shipping() {
    return {
      getShippingFee: (): Promise<AxiosResponse<number>> =>
        axiosInstance.get(`/fee`),
    };
  },
};
