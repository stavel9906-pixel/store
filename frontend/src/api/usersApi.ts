import axios, { AxiosResponse } from "axios";
import { AuthResponse, User } from "../utils/types";

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
      updateUser: (formData: FormData): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.patch("users", formData, {
          headers: {
            "Content-Type": "multipart/form-data", //type of FormData instead of json
          },
        }),
      signIn: (
        name: string,
        email: string,
        profile: string | undefined
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("users/signin", {
          userName: name,
          email,
          profile,
        }),

      login: (
        email: string,
        password: string
      ): Promise<AxiosResponse<AuthResponse>> =>
        axiosInstance.post("users/login", { email, password }),
      getProfile: async (
        token: string | null
      ): Promise<AxiosResponse<User>> => {
        return axiosInstance.get("users/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // שולחים את הטוקן בבקשה
          },
        });
      },
    };
  },
};
