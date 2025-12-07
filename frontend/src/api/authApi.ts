import axios, { AxiosResponse } from "axios";
import { AuthResponse } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/auth",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  auth() {
    return {
      register: (
        name: string,
        email: string,
        password: string
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("/register", {
          userName: name,
          email,
          password,
        }),
      signIn: (
        name: string,
        email: string,
        profile: string | undefined
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("/signin", {
          userName: name,
          email,
          profile,
        }),

      login: (
        email: string,
        password: string
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("login", { email, password }),
    };
  },
};
