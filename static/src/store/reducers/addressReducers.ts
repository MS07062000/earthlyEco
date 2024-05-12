import { PayloadAction } from "@reduxjs/toolkit";
import { AddressState, Address } from "../interfaces";

export default {
  fetchAddressesInitiated(state: AddressState) {
    state = {
      ...state,
      loading: true,
      error: null,
    };
    return state;
  },
  updateAddressError(state: AddressState, action: PayloadAction<string>) {
    state = {
      ...state,
      loading: false,
      error: action.payload,
    };
    return state;
  },
  updateAddressesSuccess(
    state: AddressState,
    action: PayloadAction<{ addresses: Address[]; defaultAddress: Address }>
  ) {
    state = {
      ...state,
      loading: false,
      addresses: action.payload.addresses,
      defaultAddress: action.payload.defaultAddress,
      error: null,
    };
    return state;
  },
  updateDefaultAddress(state: AddressState, action: PayloadAction<Address>) {
    state = {
      ...state,
      loading: false,
      defaultAddress: action.payload,
      error: null,
    };
    return state;
  },
};
