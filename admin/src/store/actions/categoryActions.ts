import { Dispatch } from "@reduxjs/toolkit";
import {
  updateCategorySuccessMessage,
  updateCategoryErrorMessage,
  fetchCategoriesError,
  fetchCategoriesInitiated,
  fetchCategoriesSuccess,
} from "../slices/categorySlice";
import { categoryAPI } from "../api";
import { Category } from "../interfaces";
import apiErrorHandler from "./utils/apiErrorHandler";

export const fetchCategories =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchCategoriesInitiated>
      | ReturnType<typeof fetchCategoriesSuccess>
      | ReturnType<typeof fetchCategoriesError>
    >
  ) => {
    dispatch(fetchCategoriesInitiated());
    try {
      const { data: Categories }: { data: Category[] } =
        await categoryAPI.fetchCategories();
      dispatch(fetchCategoriesSuccess(Categories));
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        "Unable to fetch categories",
        fetchCategoriesError
      )(dispatch);
    }
  };


export const setCategoryErrorMessage =
  (error: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateCategoryErrorMessage>>) =>
    dispatch(updateCategoryErrorMessage(error));

export const setCategorySuccessMessage =
  (successMessage: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateCategorySuccessMessage>>) =>
    dispatch(updateCategorySuccessMessage(successMessage));
