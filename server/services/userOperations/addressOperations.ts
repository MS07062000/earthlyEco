import { db } from "../../firebase";

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
  await db.collection(`Users/${userUID}/Addresses`).add(address);
};

export const deleteAddress = async (userUID: string, addressId: string) => {
  await db.collection(`Users/${userUID}/Addresses`).doc(addressId).delete();
};

export const editAddress = async (
  userUID: string,
  addressId: string,
  newAddress: Address
) => {
  await db.collection(`Users/${userUID}/Addresses`).doc(addressId).set(
    newAddress,{ merge: true }
  );
};
export const updateDefaultAddress = async (
  userUID: string,
  addressId: string,
) => {
  await db.collection(`Users/${userUID}/Addresses`).where("isDefault", "==", true).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      db.collection(`Users/${userUID}/Addresses`).doc(doc.id).update({
        isDefault: false
      });
    });
  });

  await db.collection(`Users/${userUID}/Addresses`).doc(addressId).update({
    isDefault: true
  });

};

export const getAddress = async (userUID: string) => {
  const userAddressesCollection = await db.collection(`Users/${userUID}/Addresses`).get();
  if (userAddressesCollection.empty) {
    return [];
  }else{
    return userAddressesCollection.docs.map((doc) => ({...doc.data(), id:doc.id, }));
  }
};
