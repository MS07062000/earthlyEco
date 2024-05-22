import { Dispatch } from "@reduxjs/toolkit";
import { updateSessionError } from "../../slices/authSlice";
import {
  fetchProductsError,
  updateProductErrorMessage,
} from "../../slices/productSlice.ts";
import {
  fetchCategoriesError,
  updateCategoryErrorMessage,
} from "../../slices/categorySlice.ts";
import { AxiosError } from "axios";

type Non403ActionCreator = (
  errorMessage: string
) => ReturnType<
  | typeof fetchProductsError
  | typeof fetchCategoriesError
  | typeof updateCategoryErrorMessage
  | typeof updateProductErrorMessage
>;

const apiErrorHandler =
  (
    error: unknown,
    errorMessage: string,
    errorMessageExecutor: Non403ActionCreator
  ) =>
  (
    dispatch: Dispatch<
      | ReturnType<typeof updateSessionError>
      | ReturnType<typeof errorMessageExecutor>
    >
  ) => {
    if (error instanceof AxiosError && error.response?.status === 403) {
      dispatch(updateSessionError());
    } else {
      dispatch(errorMessageExecutor(errorMessage)); // Dispatch the non-403 action
    }
  };

export default apiErrorHandler;
