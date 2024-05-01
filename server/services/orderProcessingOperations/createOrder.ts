import { instance } from "./razorpay";
import { db } from "../../firebase";
import { Address } from "../userOperations/addressOperations";
import { FieldValue } from "firebase-admin/firestore";
export interface categoryWithProductsInfo {
  category: string;
  products: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export interface order {
  orderID: string;
  categoryWithProducts: categoryWithProductsInfo[];
  deliveryAddress: Address;
}

export async function createOrderInRazorPay(amount: number, userUID: string) {
  const orderCreatedResponse = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
    notes: {
      userUID: userUID,
    },
  });

  return orderCreatedResponse.id;
}

export async function createOrderInDatabase(
  amount: number,
  userUID: string,
  categoryWithProductsInfo: categoryWithProductsInfo[],
  deliveryAddress: Address
) {
  const orderID = await createOrderInRazorPay(amount, userUID);
  await db.doc(`Users/${userUID}`).set(
    {
      "Orders Created": FieldValue.arrayUnion({
        orderID: orderID,
        categoryWithProducts: categoryWithProductsInfo,
        deliveryAddress: deliveryAddress,
      }),
    },
    { merge: true }
  );
  return orderID;
}
