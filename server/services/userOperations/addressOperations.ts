import { db } from "../../firebase";
import { FieldValue } from "firebase-admin/firestore";

export interface Address {
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

export const addAddress = async (userUID: string, address: Address) => {
  await db.doc(`Users/${userUID}`).set(
    {
      Addresses: FieldValue.arrayUnion(address),
    },
    { merge: true }
  );
};

export const deleteAddress = async (userUID: string, address: Address) => {
  await db.doc(`Users/${userUID}`).update({
    Addresses: FieldValue.arrayRemove(address),
  });
};

export const editAddress = async (
  userUID: string,
  oldAddress: Address,
  newAddress: Address
) => {
  await deleteAddress(userUID, oldAddress);
  await addAddress(userUID, newAddress);
};

export const getAddress = async (userUID: string) => {
  const userDoc = await db.doc(`Users/${userUID}`).get();
  if (userDoc.exists) {
    const userAddresses = userDoc.get("Addresses");
    if (Array.isArray(userAddresses)) {
      return userAddresses;
    }
  }
  return [];
};
