import axios, { AxiosResponse } from "axios";
import { AuthResponse } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
  users() {
    return {
      register: (
        name: string,
        email: string,
        password: string
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("users/register", {
          userName: name,
          email,
          password,
        }),
      signIn: (
        name: string,
        email: string,
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("users/signin", {
          userName: name,
          email,
        }),

      login: (
        email: string,
        password: string
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("users/login", { email, password }),
    };
  },
};
