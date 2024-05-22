import axiosInstance from "../../utils/apiUtils";
import { CreateProduct, UpdateProduct } from "../interfaces";

export default {
  fetchProducts: async () => {
    const response = await axiosInstance.get("api/v1/product/all");
    return response.data;
  },
  createProduct: async (product: CreateProduct) => {
    return await axiosInstance.post("api/v1/product", { product });
  },
  updateProduct: async (product: UpdateProduct) => {
    return await axiosInstance.put(`api/v1/product`, { product });
  },
  deleteProduct: async (productId: string) => {
    return await axiosInstance.delete(`api/v1/product/${productId}`);
  },
  restoreProduct: async (productId: string) => {
    return await axiosInstance.put(`api/v1/product/restore/${productId}`);
  },
};
