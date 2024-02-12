import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchWishlistOfUserInitiated,
  fetchWishlistOfUserSuccess,
  fetchWishlistOfUserFailed,
  updateSuccessMessage,
  updateErrorMessage,
} from "../slices/userWishlistSlice";
import { updateWishlistForUser } from "../api/updateWishlistForUser";
import { addProductToCartOfUser } from "../api/addProductToCartOfUser";
import ProductInfo from "../interfaces/productInfo";
import { getUserWishlistWithProductDetails } from "../api/getUserWishlistWithProductDetails";

export const fetchWishlist =
  (userUID: string) =>
  async (
    dispatch: Dispatch<
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
  async () => {
    try {
      await updateWishlistForUser(userUID, product);
    } catch (error) {
      setWishlistErrorMessage(
        isAdd
          ? `Failed to add ${product} to wishlist`
          : `Failed to remove ${product} from wishlist`
      );
      return;
    }

    !isAdd &&
      setWishlistSuccessMessage(
        `${product} removed from wishlist successfully`
      );
    fetchWishlist(userUID);
  };

export const moveToCartFromWishlist =
  (userUID: string, product: string) => async () => {
    try {
      await addProductToCartOfUser(userUID, product, 1);
      await updateWishlistForUser(userUID, product);
    } catch (error) {
      setWishlistErrorMessage(`Unable to move ${product} to cart`);
      return;
    }
    fetchWishlist(userUID);
    setWishlistSuccessMessage(`${product} moved to cart successfully`);
  };

export const setWishlistSuccessMessage =
  (message: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateSuccessMessage>>) =>
    dispatch(updateSuccessMessage(message));

export const setWishlistErrorMessage =
  (message: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateErrorMessage>>) =>
    dispatch(updateErrorMessage(message));

export const setWishlistProducts =
  (products: ProductInfo[]) =>
  (dispatch: Dispatch<ReturnType<typeof fetchWishlistOfUserSuccess>>) =>
    dispatch(fetchWishlistOfUserSuccess(products));
