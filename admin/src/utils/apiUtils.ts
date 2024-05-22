import axios, { AxiosInstance } from "axios";
import { BASEURL } from "../config";

const createAxiosInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use((config) => {
    // You can modify the config here if needed
    config.baseURL = BASEURL;
    return config;
  });

  return axiosInstance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
