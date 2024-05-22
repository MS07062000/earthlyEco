import axiosInstance from "../../utils/apiUtils";
import { CreateCategory, UpdateCategory } from "../interfaces";

export default {
  fetchCategories: async () => {
    const response = await axiosInstance.get("api/v1/categories/all");
    return response.data;
  },
  createCategory: async (category: CreateCategory) => {
    return await axiosInstance.post("api/v1/categories", { category });
  },
  updateCategory: async (category: UpdateCategory) => {
    return await axiosInstance.put(`api/v1/categories`, { category });
  },
  deleteCategory: async (categoryId: string) => {
    return await axiosInstance.delete(`api/v1/categories/${categoryId}`);
  },
  restoreCategory: async (categoryId: string) => {
    return await axiosInstance.put(`api/v1/categories/restore/${categoryId}`);
  }
};
