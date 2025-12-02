import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/shipping",
});

export default {
  shipping() {
    return {
      getShippingFee: (): Promise<AxiosResponse<number>> =>
        axiosInstance.get(`/fee`),
    };
  },
};
