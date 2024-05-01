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
import {
  setProductErrorMessage,
  setProductSuccessMessage,
} from "./productActions";

export const fetchWishlist =
  () =>
  async (
    dispatch: ReduxDispatch<
      | ReturnType<typeof fetchWishlistOfUserInitiated>
      | ReturnType<typeof fetchWishlistOfUserSuccess>
      | ReturnType<typeof fetchWishlistOfUserFailed>
    >
  ) => {
    dispatch(fetchWishlistOfUserInitiated());
    try {
      const { data: wishlist } = await getUserWishlistWithProductDetails();
      dispatch(fetchWishlistOfUserSuccess(wishlist));
    } catch (error) {
      dispatch(fetchWishlistOfUserFailed("Failed to fetch wishlist"));
    }
  };

export const addToOrRemoveFromWishlist =
  (product: string, isAdd: boolean, isActionDispatchedFromWishlist: boolean) =>
  async (
    dispatch: ReactDispatch<
      | ReturnType<typeof setWishlistErrorMessage>
      | ReturnType<typeof setWishlistSuccessMessage>
      | ReturnType<typeof setProductErrorMessage>
      | ReturnType<typeof setProductSuccessMessage>
      | ReturnType<typeof fetchWishlist>
    >
  ) => {
    try {
      await updateWishlistForUser(product);
      dispatch(
        isActionDispatchedFromWishlist
          ? setWishlistSuccessMessage(
              isAdd
                ? `${product} added to wishlist successfully`
                : `${product} removed from wishlist successfully`
            )
          : setProductSuccessMessage(
              isAdd
                ? `${product} added to wishlist successfully`
                : `${product} removed from wishlist successfully`
            )
      );
      dispatch(fetchWishlist());
    } catch (error) {
      dispatch(
        isActionDispatchedFromWishlist
          ? setWishlistErrorMessage(
              isAdd
                ? `Failed to add ${product} to wishlist`
                : `Failed to remove ${product} from wishlist`
            )
          : setProductErrorMessage(
              isAdd
                ? `Failed to add ${product} to wishlist`
                : `Failed to remove ${product} from wishlist`
            )
      );
      return;
    }
  };

export const moveToCartFromWishlist =
  (product: string) =>
  async (
    dispatch: ReactDispatch<
      | ReturnType<typeof setWishlistErrorMessage>
      | ReturnType<typeof setWishlistSuccessMessage>
      | ReturnType<typeof fetchWishlist>
    >
  ) => {
    try {
      await addProductToCartOfUser(product, 1);
      await updateWishlistForUser(product);
    } catch (error) {
      dispatch(setWishlistErrorMessage(`Unable to move ${product} to cart`));
      return;
    }
    dispatch(fetchWishlist());
    dispatch(
      setWishlistSuccessMessage(`${product} moved to cart successfully`)
    );
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
