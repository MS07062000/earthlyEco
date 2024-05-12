import { instance } from "./razorpay";
import { db } from "../../firebase";
import { Address } from "../userOperations/addressOperations";
export interface orderProduct {
  id: string;
  quantity: number;
  price: number;
}

export interface order {
  orderID: string;
  products: orderProduct[];
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
  products: orderProduct[],
  deliveryAddress: Address
) {
  const orderID = await createOrderInRazorPay(amount, userUID);
  await db.doc(`Users/${userUID}/Orders/${orderID}`).set({
    status: "Created",
    deliveryAddress: deliveryAddress,
  });

  products.forEach(async (product) => {
    await db
      .doc(`Users/${userUID}/Orders/${orderID}/Products/${product.id}`)
      .set({
        quantity: product.quantity,
        price: product.price,
      });
  });

  return orderID;
}

