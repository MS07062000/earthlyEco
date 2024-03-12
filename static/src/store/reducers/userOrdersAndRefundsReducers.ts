import { PayloadAction } from "@reduxjs/toolkit";
import { UserOrdersAndRefundsState, Order, Refund } from "../interfaces";

export default {
  fetchOrdersAndRefundsOfUserInitiated(state: UserOrdersAndRefundsState) {
    state = {
      ...state,
      loading: true,
      orders: [],
      refunds: [],
      error: null,
    };
    return state;
  },
  fetchOrdersAndRefundsOfUserSuccess(
    state: UserOrdersAndRefundsState,
    action: PayloadAction<{ orders: Order[]; refunds: Refund[] }>
  ) {
    state = {
      ...state,
      loading: false,
      orders: action.payload.orders,
      refunds: action.payload.refunds,
      error: null,
    };
    return state;
  },
  fetchOrdersAndRefundsOfUserFailed(
    state: UserOrdersAndRefundsState,
    action: PayloadAction<string>
  ) {
    state = {
      ...state,
      loading: true,
      orders: [],
      refunds: [],
      error: action.payload,
    };
    return state;
  },
};
