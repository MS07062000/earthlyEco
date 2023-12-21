import { instance } from "./razorpay";

export async function getRefundInfo(redundID: string,paymentID:string) {
    return await instance.payments.fetchRefund(redundID,paymentID);
}