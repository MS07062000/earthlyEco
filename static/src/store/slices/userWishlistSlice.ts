import { createSlice } from "@reduxjs/toolkit";
import userWishlistReducer from "../reducers/userWishlistReducers";
import UserWishlistState from "../interfaces/userWishlistState";

const userWishlistSlice = createSlice({
  name: "userWishlist",
  initialState: {
    loading: false,
    products: null,
    successMessage:null,
    errorMessage: null,
  } as UserWishlistState,
  reducers: userWishlistReducer,
});

export const {
  fetchWishlistOfUserInitiated,
  fetchWishlistOfUserSuccess,
  updateWishlistSuccessMessage,
  updateWishlistErrorMessage,
} = userWishlistSlice.actions;
export default userWishlistSlice.reducer;
