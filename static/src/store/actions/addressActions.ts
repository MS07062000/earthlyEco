import { Dispatch as ReduxDispatch } from "@reduxjs/toolkit";
import { Dispatch as ReactDispatch } from "react";
import {
  fetchAddressesInitiated,
  fetchAddressesFailed,
  fetchAddressesSuccess,
  updateDefaultAddress,
} from "../slices/addressSlice";
import { deleteUserAddress, editUserAddress, getUserAddresses } from "../api";
import { Address } from "../interfaces";

export const fetchAddress =
  (userUID: string) =>
  async (
    dispatch: ReduxDispatch<
      | ReturnType<typeof fetchAddressesInitiated>
      | ReturnType<typeof fetchAddressesFailed>
      | ReturnType<typeof fetchAddressesSuccess>
      | ReturnType<typeof updateDefaultAddress>
    >
  ) => {
    dispatch(fetchAddressesInitiated());
    try {
      const data = await getUserAddresses(userUID);
      const defaultAddress = data.find(
        (address: Address) => address.isDefault === true
      );
      const updatedAddressList = data.filter(
        (address: Address) => address !== defaultAddress
      );
      if (defaultAddress) {
        updatedAddressList.unshift(defaultAddress);
      }
      dispatch(
        fetchAddressesSuccess({
          addresses: updatedAddressList,
          defaultAddress: defaultAddress,
        })
      );
    } catch (error) {
      dispatch(fetchAddressesFailed("Error in getting addresses"));
    }
  };

export const deleteAddress =
  (userUID: string, address: Address) =>
  async (dispatch: ReactDispatch<ReturnType<typeof fetchAddress>>) => {
    try {
      await deleteUserAddress(userUID, address);
      dispatch(fetchAddress(userUID));
    } catch (error) {
      console.log(error);
    }
  };

export const editAddress =
  (userUID: string, defaultAddress: Address, address: Address) =>
  async (dispatch: ReactDispatch<ReturnType<typeof fetchAddress>>) => {
    try {
      await editUserAddress(userUID, defaultAddress, address);
      dispatch(fetchAddress(userUID));
    } catch (error) {
      console.log(error);
    }
  };

export const changeDefaultAddress =
  (userUID: string, defaultAddress: Address | null, address: Address) =>
  async (dispatch: ReactDispatch<ReturnType<typeof fetchAddress>>) => {
    try {
      if (defaultAddress != null) {
        await editUserAddress(userUID, defaultAddress, {
          ...defaultAddress,
          isDefault: false,
        });
      }
      await editUserAddress(userUID, address, { ...address, isDefault: true });
      dispatch(fetchAddress(userUID));
    } catch (error) {
      console.log(error);
    }
  };

export const setDefaultAddress =
  (address: any) =>
  async (dispatch: ReduxDispatch<ReturnType<typeof updateDefaultAddress>>) => {
    dispatch(updateDefaultAddress(address));
  };
