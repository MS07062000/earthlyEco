import { instance } from "./razorpay";

export async function getOrderInfo(orderID: string) {
    return await instance.orders.fetch(orderID);
}