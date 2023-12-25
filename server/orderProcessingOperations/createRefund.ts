import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { productInfoOfInsufficientQuantity } from "./orderPaid";
import { instance } from "./razorpay";
import { db } from "../firebase";

export async function createRefundInRazorPay(paymentID: string, amount: number, userUID: string) {
    const refundCreatedResponse = await instance.payments.refund(paymentID, {
        amount: amount,
        speed: "optimum",
        notes: {
            userUID: userUID,
        }
    });
    return refundCreatedResponse.id;
}

export async function createRefundInDatabase(paymentID: string, amount: number, userUID: string, productWithQuantity: productInfoOfInsufficientQuantity[]) {
    const userDoc = doc(db, `Users/${userUID}`);
    const refundID = await createRefundInRazorPay(paymentID, amount, userUID);
    await setDoc(userDoc, {
        'refundsCreated': arrayUnion({ refundID, paymentID, productWithQuantity })
    }, {
        merge: true
    });
}