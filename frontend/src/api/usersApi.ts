import axios, { AxiosResponse } from "axios";
import { AuthResponse, User } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/users",
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
  users() {
    return {
      updateUser: (formData: FormData): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.patch("", formData, {
          headers: {
            "Content-Type": "multipart/form-data", //type of FormData instead of json
          },
        }),
      getProfile: async (): Promise<AxiosResponse<User>> => {
        return axiosInstance.get("/profile", {});
      },
      isAdmin: async (): Promise<AxiosResponse<boolean>> => {
        return axiosInstance.get("/is-admin", {});
      },
    };
  },
};
