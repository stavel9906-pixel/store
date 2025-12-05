import axios, { AxiosResponse } from "axios";
import { City } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/cities",
});

export default {
  cities() {
    return {
      getAll: (): Promise<AxiosResponse<City[]>> =>
        axiosInstance.get(``),
    };
  },
};
