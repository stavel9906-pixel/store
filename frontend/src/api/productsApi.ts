import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/products",
});

export default {
  products() {
    return {
      getAll: (): Promise<AxiosResponse<void>> =>
        axiosInstance.get(``),
    };
  },
};
