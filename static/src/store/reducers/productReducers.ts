import { PayloadAction } from "@reduxjs/toolkit";
import {ProductState, ProductInfo } from "../interfaces";

export default {
  fetchProductsInitiated(state: ProductState) {
    state = {
      loading: true,
      errorMessage: null,
      successMessage: null,
      products: [],
    };
    return state;
  },
  fetchProductsSuccess(
    state: ProductState,
    action: PayloadAction<ProductInfo[]>
  ) {
    state = {
      loading: false,
      errorMessage: null,
      successMessage: null,
      products: action.payload,
    };
    return state;
  },
  fetchProductsError(state: ProductState, action: PayloadAction<string>) {
    state = {
      loading: false,
      successMessage: null,
      errorMessage: action.payload,
      products: [],
    };
    return state;
  },
  updateProductSuccessMessage(
    state: ProductState,
    action: PayloadAction<string|null>
  ) {
    state = {
      ...state,
      successMessage: action.payload,
      errorMessage: null,
    };
    return state;
  },
  updateProductErrorMessage(
    state: ProductState,
    action: PayloadAction<string|null>
  ) {
    state = {
      ...state,
      errorMessage: action.payload,
      successMessage: null,
    };
    return state;
  },
};
