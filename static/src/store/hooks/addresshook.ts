import { useEffect } from "react";
import { addressErrorHandler, fetchAddress } from "../actions/addressActions";
import { addNewAddress, deleteUserAddress, editUserAddress } from "../api";
import { Address } from "../interfaces";
import { useAppDispatch, useAppSelector } from "./apphook";
import { useNavigate } from "react-router-dom";
import { memoizedAddressSelectors } from "../selectors";
import editDefaultAddress from "../api/editDefaultAddress";

export default function useAddress() {
  const { auth, address } = useAppSelector(memoizedAddressSelectors);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.user !== null) {
      if (address.addresses === null) {
        dispatch(fetchAddress());
      }
    } else {
      navigate("/signIn");
    }
  }, [auth.user]);

  const addAddress = async (address: Address) => {
    try {
      await addNewAddress(address);
      dispatch(fetchAddress());
    } catch (error) {
      dispatch(addressErrorHandler(error, "Error in adding new address"));
    }
  };

  const deleteAddress = async (address: Address) => {
    try {
      await deleteUserAddress(address);
      dispatch(fetchAddress());
    } catch (error) {
      dispatch(addressErrorHandler(error, "Error in deleting address"));
    }
  };

  const editAddress = async (addressId: string, address: Address) => {
    try {
      await editUserAddress(addressId, address);
      dispatch(fetchAddress());
    } catch (error) {
      dispatch(addressErrorHandler(error, "Error in updating address"));
    }
  };

  const changeDefaultAddress = async (addressId: string) => {
    try {
      await editDefaultAddress(addressId);
      dispatch(fetchAddress());
    } catch (error) {
      dispatch(addressErrorHandler(error, "Error in changing default address"));
    }
  };

  return {
    address,
    addAddress,
    deleteAddress,
    editAddress,
    changeDefaultAddress,
  };
}
