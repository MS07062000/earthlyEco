import { createSlice } from "@reduxjs/toolkit";
import userWishlistReducer from "../reducers/userWishlistReducers";
import UserWishlistState from "../interfaces/userWishlistState";

const userWishlistSlice = createSlice({
  name: "userWishlist",
  initialState: {
    loading: false,
    products: [],
    successMessage:null,
    errorMessage: null,
  } as UserWishlistState,
  reducers: userWishlistReducer,
});

export const {
  fetchWishlistOfUserInitiated,
  fetchWishlistOfUserSuccess,
  fetchWishlistOfUserFailed,
  updateErrorMessage,
  updateSuccessMessage,
} = userWishlistSlice.actions;
export default userWishlistSlice.reducer;
