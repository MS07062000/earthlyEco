import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { refund } from "./redundProcessed";

export async function getUserRefunds(userUID: string) {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const refundsProcessed: refund[] = userDocSnapshot.data()['Refunds Processed'];
        return refundsProcessed;
    }

    return [];
}
