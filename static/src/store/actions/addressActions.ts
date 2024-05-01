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
  () =>
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
  (address: Address) =>
  async (dispatch: ReactDispatch<ReturnType<typeof fetchAddress>>) => {
    try {
      await deleteUserAddress(address);
      dispatch(fetchAddress());
    } catch (error) {
      console.log(error);
    }
  };

export const editAddress =
  (defaultAddress: Address, address: Address) =>
  async (dispatch: ReactDispatch<ReturnType<typeof fetchAddress>>) => {
    try {
      await editUserAddress(defaultAddress, address);
      dispatch(fetchAddress());
    } catch (error) {
      console.log(error);
    }
  };

export const changeDefaultAddress =
  (defaultAddress: Address | null, address: Address) =>
  async (dispatch: ReactDispatch<ReturnType<typeof fetchAddress>>) => {
    try {
      if (defaultAddress != null) {
        await editUserAddress(defaultAddress, {
          ...defaultAddress,
          isDefault: false,
        });
      }
      await editUserAddress(address, { ...address, isDefault: true });
      dispatch(fetchAddress());
    } catch (error) {
      console.log(error);
    }
  };

export const setDefaultAddress =
  (address: any) =>
  async (dispatch: ReduxDispatch<ReturnType<typeof updateDefaultAddress>>) => {
    dispatch(updateDefaultAddress(address));
  };
