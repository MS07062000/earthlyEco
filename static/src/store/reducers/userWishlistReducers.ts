import { PayloadAction } from "@reduxjs/toolkit";
import UserWishlistState from "../interfaces/userWishlistState";
import ProductInfo from "../interfaces/productInfo";

export default {
  updateErrorMessage(
    state: UserWishlistState,
    action: PayloadAction<string|null>
  ) {
    state = {
      ...state,
      loading: false,
      errorMessage: action.payload,
    };
    return state;
  },
  updateSuccessMessage(
    state: UserWishlistState,
    action: PayloadAction<string|null>
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
    action: PayloadAction<ProductInfo[]>
  ) {
    state = {
      ...state,
      loading: false,
      products: action.payload,
      errorMessage: null,
    };
    return state;
  },
  fetchWishlistOfUserFailed(
    state: UserWishlistState,
    action: PayloadAction<string>
  ) {
    state = {
      ...state,
      loading: false,
      products: [],
      errorMessage: action.payload,
    };
    return state;
  },
};
