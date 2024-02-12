import { PayloadAction } from "@reduxjs/toolkit";
import { UserCartState, CartProductInfo } from "../interfaces";

interface fetchCartOfUserSuccessPayload {
  products: CartProductInfo[];
  totalAmount: number;
}

export default {
  updateCartOfUserFailed(
    state: UserCartState,
    action: PayloadAction<string | null>
  ) {
    state = {
      ...state,
      successMessage: null,
      errorMessage: action.payload,
    };
    return state;
  },
  updateCartOfUserSuccess(
    state: UserCartState,
    action: PayloadAction<string | null>
  ) {
    state = {
      ...state,
      successMessage: action.payload,
      errorMessage: null,
    };
    return state;
  },
  fetchCartOfUserFailed(state: UserCartState, action: PayloadAction<string>) {
    state = {
      ...state,
      loading: false,
      products: [],
      errorMessage: action.payload,
    };
    return state;
  },
  fetchCartOfUserSuccess(
    state: UserCartState,
    action: PayloadAction<fetchCartOfUserSuccessPayload>
  ) {
    state = {
      ...state,
      loading: false,
      products: action.payload.products,
      totalAmount: action.payload.totalAmount,
      errorMessage: null,
    };
    return state;
  },
  fetchCartOfUserInitiated(state: UserCartState) {
    state = {
      ...state,
      loading: true,
      products: [],
      errorMessage: null,
    };
    return state;
  },
};
