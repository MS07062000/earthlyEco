import { productInfoOfInsufficientQuantity } from "./orderPaid";
import { instance } from "./razorpay";
import { db } from "../../firebase";
import { FieldValue } from "firebase-admin/firestore";

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
  productWithQuantity: productInfoOfInsufficientQuantity[]
) {
  const refundID = await createRefundInRazorPay(paymentID, amount, userUID);
  await db.doc(`Users/${userUID}`).set(
    {
      refundsCreated: FieldValue.arrayUnion({ refundID, paymentID, productWithQuantity }),
    },
    {
      merge: true,
    }
  );
}
