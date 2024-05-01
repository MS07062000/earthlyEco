import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchCategoriesInitiated,
  fetchCategoriesSuccess,
  fetchCategoriesError,
} from "../slices/categorySlice";
import { getCategories } from "../api";

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
      const { data: categories } = await getCategories();
      dispatch(fetchCategoriesSuccess(categories));
    } catch (error) {
      dispatch(fetchCategoriesError("Unable to fetch categories"));
    }
  };
