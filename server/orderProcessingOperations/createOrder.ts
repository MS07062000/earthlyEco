import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { instance } from "./razorpay";
import { db } from "../firebase";
import { addressCard } from "../userAddress/addressOperations";
export interface categoryWithProductsInfo {
    category: string,
    products: {
        name: string,
        image: string,
        quantity: number,
        price: number
    }[]
}

export interface order {
    orderID: string,
    categoryWithProducts: categoryWithProductsInfo[],
    deliveryAddress:addressCard
}

export async function createOrderInRazorPay(amount: number, userUID: string) {
    const orderCreatedResponse = await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        notes: {
            userUID: userUID,
        }
    });

    return orderCreatedResponse.id;
}

export async function createOrderInDatabase(amount: number, userUID: string, categoryWithProductsInfo: categoryWithProductsInfo[],deliveryAddress:addressCard) {
    const orderID = await createOrderInRazorPay(amount, userUID);
    const userDoc = doc(db, `Users/${userUID}`);
    await setDoc(userDoc, {
        'Orders Created': arrayUnion({
            orderID: orderID,
            categoryWithProducts: categoryWithProductsInfo,
            deliveryAddress:deliveryAddress
        }),
    }, { merge: true });
    return orderID;
}