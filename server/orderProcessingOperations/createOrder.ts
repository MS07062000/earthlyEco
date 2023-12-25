import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { instance } from "./razorpay";
import { db } from "../firebase";
export interface categoryWithProductsInfo {
    category: string,
    products: {
        name: string,
        image: string,
        quantity: number,
        price: number
    }[]
}

export interface order{
    orderID: string,
    categoryWithProductsInfo: categoryWithProductsInfo[]
}

export async function createOrderInRazorPay(amount: number, userUID: string) {
    const orderCreatedResponse= await instance.orders.create({
        amount: amount,
        currency: "INR",
        notes: {
            userUID: userUID
        }
    });
    
    return orderCreatedResponse.id;
}

export async function createOrderInDatabase(amount: number, userUID: string, categoryWithProductsInfo: categoryWithProductsInfo[]) {
    // const orderID = await createOrderInRazorPay(amount, userUID);
    // console.log(orderID);
    const userDoc = doc(db, `Users/${userUID}`);
    await setDoc(userDoc, {
        'Orders Created': arrayUnion({
            orderID: "order_NGjK7qMJalc88d",
            categoryWithProducts: categoryWithProductsInfo
        }),
    }, { merge: true });
    return "order_NGjK7qMJalc88d";
}