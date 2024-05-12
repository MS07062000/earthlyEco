import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchWishlistOfUserInitiated,
  fetchWishlistOfUserSuccess,
  updateWishlistSuccessMessage,
  updateWishlistErrorMessage,
} from "../slices/userWishlistSlice";
import { getUserWishlistWithProductDetails } from "../api";
import { Product } from "../interfaces";
import apiErrorHandler from "./utils/apiErrorHandler";
import { updateSessionError } from "../slices/authSlice";

export const fetchWishlist =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchWishlistOfUserInitiated>
      | ReturnType<typeof fetchWishlistOfUserSuccess>
      | ReturnType<typeof updateWishlistErrorMessage>
      | ReturnType<typeof updateSessionError>
    >
  ) => {
    dispatch(fetchWishlistOfUserInitiated());
    try {
      const { data: wishlist } = await getUserWishlistWithProductDetails();
      dispatch(fetchWishlistOfUserSuccess(wishlist));
    } catch (error) {
      apiErrorHandler(
        error,
        "Failed to fetch wishlist",
        updateWishlistErrorMessage
      );
    }
  };

export const setWishlistSuccessMessage =
  (message: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateWishlistSuccessMessage>>) =>
    dispatch(updateWishlistSuccessMessage(message));

export const setWishlistErrorMessage =
  (message: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateWishlistErrorMessage>>) =>
    dispatch(updateWishlistErrorMessage(message));

export const setWishlistProducts =
  (products: Product[]) =>
  (dispatch: Dispatch<ReturnType<typeof fetchWishlistOfUserSuccess>>) =>
    dispatch(fetchWishlistOfUserSuccess(products));

export const wishlistErrorHandler =
  (error: any, errorMessage: string) =>
  (
    dispatch: Dispatch<
      | ReturnType<typeof updateWishlistErrorMessage>
      | ReturnType<typeof updateSessionError>
    >
  ) =>
    apiErrorHandler(error, errorMessage, updateWishlistErrorMessage)(dispatch);
