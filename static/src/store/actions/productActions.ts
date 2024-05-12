import { Dispatch } from "@reduxjs/toolkit";
import {
  updateProductSuccessMessage,
  updateProductErrorMessage,
  fetchProductsError,
  fetchProductsInitiated,
  fetchProductsSuccess,
} from "../slices/productSlice";
import { getProducts, addProductToCartOfUser } from "../api";
import { Product } from "../interfaces";

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
      const { data: products }: { data: Product[] } = await getProducts(category);
      dispatch(fetchProductsSuccess(products));
    } catch (error) {
      dispatch(fetchProductsError("Unable to fetch categories"));
    }
  };

export const addProductToCart =
  (productId: string, productName: string, quantity: number) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof updateProductErrorMessage>
      | ReturnType<typeof updateProductSuccessMessage>
    >
  ) => {
    try {
      await addProductToCartOfUser(productId, quantity);
      dispatch(
        updateProductSuccessMessage(`${productName} added to cart successfully`)
      );
    } catch (error) {
      dispatch(updateProductErrorMessage(`Unable to add ${productName} to cart`));
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


