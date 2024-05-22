import {
  fetchCategories,
  setCategorySuccessMessage,
} from "@/store/actions/categoryActions";
import apiErrorHandler from "@/store/actions/utils/apiErrorHandler";
import { categoryAPI } from "@/store/api";
import { CreateCategory, UpdateCategory, Category } from "@/store/interfaces";
import { updateCategoryErrorMessage } from "@/store/slices/categorySlice";
import { useAppDispatch } from "./apphook";

export default function useCategory() {
  const dispatch = useAppDispatch();

  const createCategory = async (category: CreateCategory) => {
    try {
      await categoryAPI.createCategory(category);
      dispatch(
        setCategorySuccessMessage(`${category.name} created successfully`)
      );
      dispatch(fetchCategories());
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to create category ${category.name}`,
        updateCategoryErrorMessage
      )(dispatch);
    }
  };

  const updateCategory = async (category: UpdateCategory) => {
    try {
      await categoryAPI.updateCategory(category);
      dispatch(fetchCategories());
      dispatch(
        setCategorySuccessMessage(`${category.name} updated successfully`)
      );
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to update category ${category.name}`,
        updateCategoryErrorMessage
      )(dispatch);
    }
  };

  const deleteCategory = async (category: Category) => {
    try {
      await categoryAPI.deleteCategory(category.id);
      dispatch(
        setCategorySuccessMessage(
          `category ${category.name} deleted successfully`
        )
      );
      dispatch(fetchCategories());
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to delete category ${category.name}`,
        updateCategoryErrorMessage
      )(dispatch);
    }
  };

  const restoreCategory = async (category: Category) => {
    try {
      await categoryAPI.restoreCategory(category.id);
      dispatch(
        setCategorySuccessMessage(
          `category ${category.name} restored successfully`
        )
      );
      dispatch(fetchCategories());
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to restore category ${category.name}`,
        updateCategoryErrorMessage
      )(dispatch);
    }
  };

  return { createCategory, updateCategory, deleteCategory, restoreCategory };
}
