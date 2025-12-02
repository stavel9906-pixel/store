import axios, { AxiosResponse } from "axios";
import { AuthResponse, User } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/users",
});

export default {
  users() {
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
      updateUser: (formData: FormData): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.patch("", formData, {
          headers: {
            "Content-Type": "multipart/form-data", //type of FormData instead of json
          },
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
      getProfile: async (
        token: string | null
      ): Promise<AxiosResponse<User>> => {
        return axiosInstance.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // שולחים את הטוקן בבקשה
          },
        });
      },
      isAdmin: async (
        token: string | null
      ): Promise<AxiosResponse<boolean>> => {
        return axiosInstance.get("/is-admin", {
          headers: {
            Authorization: `Bearer ${token}`, // שולחים את הטוקן בבקשה
          },
        });
      },
    };
  },
};
