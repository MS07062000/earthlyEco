import { createSlice } from "@reduxjs/toolkit";
import categoryReducers from "../reducers/categoryReducers";
import { CategoryState } from "../interfaces";

const categorySlice = createSlice({
  name: "category" as string,
  initialState: {
    loading: false,
    categories: null,
    successMessage: null,
    errorMessage: null,
  } as CategoryState,
  reducers: categoryReducers,
});

export const {
  fetchCategoriesInitiated,
  fetchCategoriesSuccess,
  fetchCategoriesError,
  updateCategorySuccessMessage,
  updateCategoryErrorMessage,
} = categorySlice.actions;
export default categorySlice.reducer;
