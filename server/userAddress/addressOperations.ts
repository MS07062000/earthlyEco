import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface addressCard {
  fullname: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export const addAddress = async (userUID: string, address: addressCard) => {
  const userDocRef = doc(db, `Users/${userUID}`);
  await setDoc(
    userDocRef,
    {
      Addresses: arrayUnion(address),
    },
    {
      merge: true,
    }
  );
};

export const deleteAddress = async (userUID: string, address: addressCard) => {
  const userDocRef = doc(db, `Users/${userUID}`);
  await setDoc(
    userDocRef,
    {
      Addresses: arrayRemove(address),
    },
    {
      merge: true,
    }
  );
};

export const editAddress = async (
  userUID: string,
  oldAddress: addressCard,
  newAddress: addressCard
) => {
  await deleteAddress(userUID, oldAddress);
  await addAddress(userUID, newAddress);
};

export const getAddress = async (userUID: string) => {
  const userDocRef = doc(db, `Users/${userUID}`);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userAddresses = userDoc.data()["Addresses"];
    if (Array.isArray(userAddresses)) {
      return userAddresses;
    }
  }
  return [];
};
