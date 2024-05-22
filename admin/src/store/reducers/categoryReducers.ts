import { PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryState } from "../interfaces";

export default {
  fetchCategoriesInitiated(state: CategoryState) {
    state = {
      loading: true,
      successMessage: null,
      errorMessage: null,
      categories: [],
    };
    return state;
  },
  fetchCategoriesSuccess(
    state: CategoryState,
    action: PayloadAction<Category[]>
  ) {
    state = {
      loading: false,
      successMessage: null,
      errorMessage: null,
      categories: action.payload,
    };
    return state;
  },
  fetchCategoriesError(state: CategoryState, action: PayloadAction<string>) {
    state = {
      loading: false,
      successMessage: null,
      errorMessage: action.payload,
      categories: [],
    };
    return state;
  },
  updateCategorySuccessMessage(
    state: CategoryState,
    action: PayloadAction<string | null>
  ) {
    state = {
      ...state,
      successMessage: action.payload,
      errorMessage: null,
    };
    return state;
  },
  updateCategoryErrorMessage(
    state: CategoryState,
    action: PayloadAction<string | null>
  ) {
    state = {
      ...state,
      errorMessage: action.payload,
      successMessage: null,
    };
    return state;
  },
};
