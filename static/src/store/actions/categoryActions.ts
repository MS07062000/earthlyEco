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
      const data = await getCategories();
      dispatch(fetchCategoriesSuccess(data));
    } catch (error) {
      dispatch(fetchCategoriesError("Unable to fetch categories"));
    }
  };
