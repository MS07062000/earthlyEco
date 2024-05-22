import { Dispatch } from "@reduxjs/toolkit";
import {
  updateProductSuccessMessage,
  updateProductErrorMessage,
  fetchProductsError,
  fetchProductsInitiated,
  fetchProductsSuccess,
} from "../slices/productSlice";
import { productAPI } from "../api";
import { Product } from "../interfaces";
import apiErrorHandler from "./utils/apiErrorHandler";

export const fetchProducts =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchProductsInitiated>
      | ReturnType<typeof fetchProductsSuccess>
      | ReturnType<typeof fetchProductsError>
    >
  ) => {
    dispatch(fetchProductsInitiated());
    try {
      const { data: products }: { data: Product[] } =
        await productAPI.fetchProducts();
      //console.log(products);
      dispatch(fetchProductsSuccess(products));
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        "Unable to fetch products",
        fetchProductsError
      )(dispatch);
    }
  };

export const setProductErrorMessage =
  (error: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateProductErrorMessage>>) =>
    dispatch(updateProductErrorMessage(error));

export const setProductSuccessMessage =
  (successMessage: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateProductSuccessMessage>>) =>{
    dispatch(updateProductSuccessMessage(successMessage));
  }

