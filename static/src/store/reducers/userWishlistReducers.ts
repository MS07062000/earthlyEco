import { PayloadAction } from "@reduxjs/toolkit";
import { UserWishlistState, Product } from "../interfaces";

export default {
  updateWishlistErrorMessage(
    state: UserWishlistState,
    action: PayloadAction<string | null>
  ) {
    state = {
      ...state,
      loading: false,
      errorMessage: action.payload,
    };
    return state;
  },
  updateWishlistSuccessMessage(
    state: UserWishlistState,
    action: PayloadAction<string | null>
  ) {
    state = {
      ...state,
      loading: false,
      successMessage: action.payload,
    };
    return state;
  },
  fetchWishlistOfUserInitiated(state: UserWishlistState) {
    state = {
      ...state,
      loading: true,
      products: [],
      errorMessage: null,
    };
    return state;
  },
  fetchWishlistOfUserSuccess(
    state: UserWishlistState,
    action: PayloadAction<Product[]>
  ) {
    state = {
      ...state,
      loading: false,
      products: action.payload,
      errorMessage: null,
    };
    return state;
  },
};
