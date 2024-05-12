import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchAddressesInitiated,
  updateAddressError,
  updateAddressesSuccess,
  updateDefaultAddress,
} from "../slices/addressSlice";
import { getUserAddresses } from "../api";
import { Address } from "../interfaces";
import apiErrorHandler from "./utils/apiErrorHandler";
import { updateSessionError } from "../slices/authSlice";

export const fetchAddress =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchAddressesInitiated>
      | ReturnType<typeof updateAddressError>
      | ReturnType<typeof updateAddressesSuccess>
      | ReturnType<typeof updateDefaultAddress>
    >
  ) => {
    dispatch(fetchAddressesInitiated());
    try {
      const { data: addresses } = await getUserAddresses();
      const defaultAddress = addresses.find(
        (address: Address) => address.isDefault === true
      );
      const updatedAddressList = addresses.filter(
        (address: Address) => address !== defaultAddress
      );
      if (defaultAddress) {
        updatedAddressList.unshift(defaultAddress);
      }
      dispatch(
        updateAddressesSuccess({
          addresses: updatedAddressList,
          defaultAddress: defaultAddress,
        })
      );
    } catch (error) {
      apiErrorHandler(
        error,
        "Error in getting addresses",
        updateAddressError
      )(dispatch);
    }
  };

export const setDefaultAddress =
  (address: any) =>
  async (dispatch: Dispatch<ReturnType<typeof updateDefaultAddress>>) => {
    dispatch(updateDefaultAddress(address));
  };

export const addressErrorHandler =
  (error: any, errorMessage: string) =>
  (
    dispatch: Dispatch<
      | ReturnType<typeof updateAddressError>
      | ReturnType<typeof updateSessionError>
    >
  ) => {
    apiErrorHandler(error, errorMessage, updateAddressError)(dispatch);
  };
