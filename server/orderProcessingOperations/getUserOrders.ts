import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { order } from "./createOrder";

export async function getUserOrders(userUID: string) {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const ordersProcessed: order[] = userDocSnapshot.data()['ordersProcessed'];
        return ordersProcessed;
    }

    return [];
}
