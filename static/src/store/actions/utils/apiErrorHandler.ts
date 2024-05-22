import { Dispatch } from "@reduxjs/toolkit";
import { updateSessionError } from "../../slices/authSlice";
import { updateCartOfUserFailed } from "../../slices/userCartSlice";
import { updateWishlistErrorMessage } from "../../slices/userWishlistSlice";
import { updateAddressError } from "../../slices/addressSlice";
import { fetchOrdersAndRefundsOfUserFailed } from "../../slices/userOrdersAndRedundsSlice";

// Define a generic type for the action to dispatch in case of non-403 errors
type Non403ActionCreator = (
  errorMessage: string
) => ReturnType<
  | typeof updateCartOfUserFailed
  | typeof updateWishlistErrorMessage
  | typeof updateAddressError
  | typeof fetchOrdersAndRefundsOfUserFailed
>;

const apiErrorHandler =
  (
    error: any,
    errorMessage: string,
    non403ActionCreator: Non403ActionCreator
  ) =>
  (
    dispatch: Dispatch<
      ReturnType<typeof updateSessionError> | ReturnType<Non403ActionCreator>
    >
  ) => {
    if (error?.response?.status === 403) {
      dispatch(updateSessionError());
    } else {
      dispatch(non403ActionCreator(errorMessage)); // Dispatch the non-403 action
    }
  };
  
export default apiErrorHandler;
