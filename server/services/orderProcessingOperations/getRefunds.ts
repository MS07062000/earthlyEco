import { db } from "../../firebase";
import { refund } from "./refundProcessed";

export async function getRefunds(userUID: string): Promise<refund[]> {
    const userDocSnapshot = await db.doc(`Users/${userUID}`).get();
  
    if (userDocSnapshot.exists) {
        const refundsProcessed: refund[] = userDocSnapshot.data()?.['Refunds Processed'] || [];
        return refundsProcessed;
    }

    return [];
}
