import { PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryState } from "../interfaces";

export default {
  fetchCategoriesInitiated(state: CategoryState) {
    state = { loading: true, error: null, categories: [] };
    return state;
  },
  fetchCategoriesSuccess(state: CategoryState, action: PayloadAction<Category[]>) {
    state = { loading: false, error: null, categories: action.payload };
    return state;
  },
  fetchCategoriesError(state: CategoryState, action: PayloadAction<string>) {
    state = { loading: false, error: action.payload, categories: [] };
    return state;
  },
};
