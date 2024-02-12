import { Dispatch } from "@reduxjs/toolkit";
import {
  updateProductSuccessMessage,
  updateProductErrorMessage,
  fetchProductsError,
  fetchProductsInitiated,
  fetchProductsSuccess,
} from "../slices/productSlice";
import { getProducts } from "../api/getProduct";
import { addProductToCartOfUser } from "../api/addProductToCartOfUser";

export const fetchProducts =
  (category: string) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchProductsInitiated>
      | ReturnType<typeof fetchProductsSuccess>
      | ReturnType<typeof fetchProductsError>
    >
  ) => {
    dispatch(fetchProductsInitiated());
    try {
      const data = await getProducts(category);
      dispatch(fetchProductsSuccess(data));
    } catch (error) {
      dispatch(fetchProductsError("Unable to fetch categories"));
    }
  };

export const addProductToCart =
  (userUID: string, product: string, quantity: number) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof updateProductErrorMessage>
      | ReturnType<typeof updateProductSuccessMessage>
    >
  ) => {
    try {
      await addProductToCartOfUser(userUID, product, quantity);
      dispatch(
        updateProductSuccessMessage(`${product} added to cart successfully`)
      );
    } catch (error) {
      dispatch(updateProductErrorMessage(`Unable to add ${product} to cart`));
    }
  };

export const setProductErrorMessage =
  (error: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateProductErrorMessage>>) =>
    dispatch(updateProductErrorMessage(error));

export const setProductSuccessMessage =
  (successMessage: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateProductSuccessMessage>>) =>
    dispatch(updateProductSuccessMessage(successMessage));
