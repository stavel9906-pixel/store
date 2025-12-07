import axios, { AxiosResponse } from "axios";
import { City } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/cities",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  cities() {
    return {
      getAll: (): Promise<AxiosResponse<City[]>> =>
        axiosInstance.get(``),
    };
  },
};
