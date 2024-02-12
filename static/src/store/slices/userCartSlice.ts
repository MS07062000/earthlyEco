import { createSlice } from "@reduxjs/toolkit";
import UserCartState from "../interfaces/userCartState";
import userCartReducers from "../reducers/userCartReducers";

const userCartSlice = createSlice({
  name: "userCart",
  initialState: {
    loading: false,
    products: [],
    totalAmount : 0,
    successMessage : null,
    errorMessage: null,
  } as UserCartState,
  reducers: userCartReducers,
});

export const {
  updateCartOfUserFailed,
  updateCartOfUserSuccess,
  fetchCartOfUserFailed,
  fetchCartOfUserSuccess,
  fetchCartOfUserInitiated,
} = userCartSlice.actions;
export default userCartSlice.reducer;
