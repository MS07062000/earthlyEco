import { instance } from "./razorpay";
import { db } from "../../firebase";
import { orderProduct } from "./createOrder";

export async function createRefundInRazorPay(
  paymentID: string,
  amount: number,
  userUID: string
) {
  const refundCreatedResponse = await instance.payments.refund(paymentID, {
    amount: amount * 100,
    speed: "optimum",
    notes: {
      userUID: userUID,
    },
  });

  return refundCreatedResponse.id;
}

export async function createRefundInDatabase(
  paymentID: string,
  amount: number,
  userUID: string,
  products: orderProduct[]
) {
  const refundID = await createRefundInRazorPay(paymentID, amount, userUID);

  const refundDoc = db.doc(`Users/${userUID}/Refunds/${refundID}`);

  await refundDoc.set({
    status: "Created",
    paymentID: paymentID,
  });

  products.forEach(async (product) => {
    const productDoc = refundDoc.collection("Products").doc(product.id);
    await productDoc.create({
      quantity: product.quantity,
      price: product.price,
    });
  });
}
