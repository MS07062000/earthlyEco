import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getOrderInfo } from "./getOrderInfo";

export async function getUserOrders(userUID: string) {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const ordersWithProductInfo: { orderID: string; categoryWithProductsAndQuantity: any; }[] = [];
        const orders = userDocSnapshot.data()['orders'];

        for (const orderID of orders) {
            const orderInfo = await getOrderInfo(orderID);
            if (orderInfo['notes'] && orderInfo['notes']['categoryWithProductsAndItsQuantity']) {
                let categoryWithProductsAndQuantity: any = orderInfo['notes']['categoryWithProductsAndItsQuantity'];
                categoryWithProductsAndQuantity = JSON.parse(categoryWithProductsAndQuantity);
                ordersWithProductInfo.push({ orderID, categoryWithProductsAndQuantity });
            }
        }

        return ordersWithProductInfo;
    }

    return [];
}
