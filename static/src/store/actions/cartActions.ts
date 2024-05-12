import { Dispatch } from "@reduxjs/toolkit";
import {
  updateCartOfUserSuccess,
  updateCartOfUserFailed,
  fetchCartOfUserInitiated,
  fetchCartOfUserSuccess,
} from "../slices/userCartSlice";
import {
  addProductToCartOfUser,
  removeProductFromCartOfUser,
  getUserCart,
} from "../api";
import { CartProductInfo } from "../interfaces";
import apiErrorHandler from "./utils/apiErrorHandler";
import { updateSessionError } from "../slices/authSlice";

const processCartData = async (data: CartProductInfo[]) => {
  let totalAmount = 0;
  const products = await Promise.all(
    data.map(async (product: CartProductInfo) => {
      let updatedProduct = { ...product };
      if (product.quantityByUser > product.quantityAvailable) {
        await removeProductFromCartOfUser(product.id, product.quantityByUser);
        await addProductToCartOfUser(product.id, product.quantityAvailable);
        updatedProduct.quantityByUser = product.quantityAvailable;
        totalAmount += product.price * product.quantityAvailable;
      } else {
        totalAmount += product.price * product.quantityByUser;
      }
      return updatedProduct;
    })
  );
  return { products, totalAmount };
};

export const fetchCart =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchCartOfUserInitiated>
      | ReturnType<typeof fetchCartOfUserSuccess>
      | ReturnType<typeof updateCartOfUserFailed>
      | ReturnType<typeof updateSessionError>
    >
  ) => {
    dispatch(fetchCartOfUserInitiated());
    try {
      const { data: cart } = await getUserCart();
      const { products, totalAmount } = await processCartData(cart);
      dispatch(fetchCartOfUserSuccess({ products, totalAmount }));
    } catch (error) {
      apiErrorHandler(
        error,
        "Unable to get cart. Please try again.",
        updateCartOfUserFailed
      )(dispatch);
    }
  };

export const setCartErrorMessage =
  (error: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateCartOfUserFailed>>) =>
    dispatch(updateCartOfUserFailed(error));

export const setCartSuccessMessage =
  (successMessage: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateCartOfUserSuccess>>) =>
    dispatch(updateCartOfUserSuccess(successMessage));

export const updateCartProducts =
  (products: CartProductInfo[], totalAmount: number) =>
  (dispatch: Dispatch<ReturnType<typeof fetchCartOfUserSuccess>>) =>
    dispatch(fetchCartOfUserSuccess({ products, totalAmount }));

export const cartErrorHandler =
  (error: any, errorMessage: string) =>
  (
    dispatch: Dispatch<
      | ReturnType<typeof updateCartOfUserFailed>
      | ReturnType<typeof updateSessionError>
    >
  ) => {
    apiErrorHandler(error, errorMessage, updateCartOfUserFailed)(dispatch);
  };
