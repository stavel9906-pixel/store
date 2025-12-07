import axios, { AxiosResponse } from "axios";
import { Country } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/countries",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  countries() {
    return {
      getAll: (): Promise<AxiosResponse<Country[]>> =>
        axiosInstance.get(``),
    };
  },
};
