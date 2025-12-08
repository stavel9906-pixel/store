import axios, { AxiosResponse } from "axios";
import { AuthResponse } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/auth",
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
      googleSignIn: (token: string): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("/google-login", {
          token,
        }),
      login: (
        email: string,
        password: string
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("login", { email, password }),
    };
  },
};
