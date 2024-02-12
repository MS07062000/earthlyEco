import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchAddressesInitiated,
  fetchAddressesFailed,
  fetchAddressesSuccess,
  updateDefaultAddress,
} from "../slices/addressSlice";
import { getAddressesOfUser } from "../api/getAddressesOfUser";
import address from "../interfaces/address";

export const fetchAddress =
  (userUID: string) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchAddressesInitiated>
      | ReturnType<typeof fetchAddressesFailed>
      | ReturnType<typeof fetchAddressesSuccess>
      | ReturnType<typeof updateDefaultAddress>
    >
  ) => {
    dispatch(fetchAddressesInitiated());
    try {
      const data = await getAddressesOfUser(userUID);
      const defaultAddress = data.find(
        (address: address) => address.isDefault === true
      );
      const updatedAddressList = data.filter(
        (address: address) => address !== defaultAddress
      );
      if (defaultAddress) {
        updatedAddressList.unshift(defaultAddress);
      }
      dispatch(fetchAddressesSuccess({addresses:updatedAddressList,defaultAddress:defaultAddress}));
    } catch (error) {
      dispatch(fetchAddressesFailed("Error in getting addresses"));
    }
  };

export const setDefaultAddress =
  (address: any) =>
  async (dispatch: Dispatch<ReturnType<typeof updateDefaultAddress>>) => {
    dispatch(updateDefaultAddress(address));
  };
