import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchCategoriesInitiated,
  fetchCategoriesSuccess,
  fetchCategoriesError,
} from "../slices/categorySlice";
import { getCategories } from "../api";
import { Category } from "../interfaces";

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
      const { data: categories }: { data: Category[] } = await getCategories();
      dispatch(fetchCategoriesSuccess(categories));
    } catch (error) {
      dispatch(fetchCategoriesError("Unable to fetch categories"));
    }
  };