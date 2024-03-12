import { Dispatch as ReactDispatch } from "react";
import { Dispatch as ReduxDispatch } from "@reduxjs/toolkit";

//try to find out difference between dispatch from redux vs react
import {
  fetchWishlistOfUserInitiated,
  fetchWishlistOfUserSuccess,
  fetchWishlistOfUserFailed,
  updateSuccessMessage,
  updateErrorMessage,
} from "../slices/userWishlistSlice";
import {
  updateWishlistForUser,
  addProductToCartOfUser,
  getUserWishlistWithProductDetails,
} from "../api";
import { ProductInfo } from "../interfaces";

export const fetchWishlist =
  (userUID: string) =>
  async (
    dispatch: ReduxDispatch<
      | ReturnType<typeof fetchWishlistOfUserInitiated>
      | ReturnType<typeof fetchWishlistOfUserSuccess>
      | ReturnType<typeof fetchWishlistOfUserFailed>
    >
  ) => {
    dispatch(fetchWishlistOfUserInitiated());
    try {
      const wishlist = await getUserWishlistWithProductDetails(userUID);
      dispatch(fetchWishlistOfUserSuccess(wishlist));
    } catch (error) {
      dispatch(fetchWishlistOfUserFailed("Failed to fetch wishlist"));
    }
  };

export const addToOrRemoveFromWishlist =
  (userUID: string, product: string, isAdd: boolean) =>
  async (
    dispatch: ReactDispatch<
      | ReturnType<typeof setWishlistErrorMessage>
      | ReturnType<typeof setWishlistSuccessMessage>
      | ReturnType<typeof fetchWishlist>
    >
  ) => {
    try {
      await updateWishlistForUser(userUID, product);
    } catch (error) {
      dispatch(
        setWishlistErrorMessage(
          isAdd
            ? `Failed to add ${product} to wishlist`
            : `Failed to remove ${product} from wishlist`
        )
      );
      return;
    }

    !isAdd &&
      dispatch(
        setWishlistSuccessMessage(
          `${product} removed from wishlist successfully`
        )
      );
    dispatch(fetchWishlist(userUID));
  };

export const moveToCartFromWishlist =
  (userUID: string, product: string) =>
  async (
    dispatch: ReactDispatch<
      | ReturnType<typeof setWishlistErrorMessage>
      | ReturnType<typeof setWishlistSuccessMessage>
      | ReturnType<typeof fetchWishlist>
    >
  ) => {
    try {
      await addProductToCartOfUser(userUID, product, 1);
      await updateWishlistForUser(userUID, product);
    } catch (error) {
      dispatch(setWishlistErrorMessage(`Unable to move ${product} to cart`));
      return;
    }
    dispatch(fetchWishlist(userUID));
    dispatch(setWishlistSuccessMessage(`${product} moved to cart successfully`));
  };

export const setWishlistSuccessMessage =
  (message: string | null) =>
  (dispatch: ReduxDispatch<ReturnType<typeof updateSuccessMessage>>) =>
    dispatch(updateSuccessMessage(message));

export const setWishlistErrorMessage =
  (message: string | null) =>
  (dispatch: ReduxDispatch<ReturnType<typeof updateErrorMessage>>) =>
    dispatch(updateErrorMessage(message));

export const setWishlistProducts =
  (products: ProductInfo[]) =>
  (dispatch: ReduxDispatch<ReturnType<typeof fetchWishlistOfUserSuccess>>) =>
    dispatch(fetchWishlistOfUserSuccess(products));
