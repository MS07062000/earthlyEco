import { createSlice } from "@reduxjs/toolkit";
import UserOrdersAndRefundsState from "../interfaces/userOrdersAndRefundsState";
import userOrdersAndRefundsReducer from "../reducers/userOrdersAndRefundsReducers";

const usersOrdersAndRefundsSlice = createSlice({
  name: "usersOrdersAndRefunds",
  initialState: {
    loading: false,
    orders: [],
    refunds: [],
    error: null,
  } as UserOrdersAndRefundsState,
  reducers: userOrdersAndRefundsReducer,
});

export const {
  fetchOrdersAndRefundsOfUserInitiated,
  fetchOrdersAndRefundsOfUserSuccess,
  fetchOrdersAndRefundsOfUserFailed,
} = usersOrdersAndRefundsSlice.actions;
export default usersOrdersAndRefundsSlice.reducer;
