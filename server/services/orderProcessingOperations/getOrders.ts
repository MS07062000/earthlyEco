import { db } from "../../firebase";
import { order } from "./createOrder";

export async function getOrders(userUID: string) {
    const userDocSnapshot = await db.doc(`Users/${userUID}`).get();
  
    if (userDocSnapshot.exists) {
        const ordersProcessed: order[] = userDocSnapshot.get('Orders Processed');
        return ordersProcessed;
    }

    return [];
}
