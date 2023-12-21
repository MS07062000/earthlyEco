import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getRefundInfo } from "./getRefundInfo";

export async function getUserRefunds(userUID: string) {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userRefunds: { refundID: string; products: any; }[] = [];
        const refunds = userDocSnapshot.data()['refunds'];

        for (const refundParams of refunds) {
            const refundID = refundParams['refundID'];
            const paymentID = refundParams['paymentID'];
            const refundInfo = await getRefundInfo(refundID, paymentID);

            if (refundInfo['notes'] && refundInfo['notes']['products']) {
                let refundProducts:any = refundInfo['notes']['products'];
                refundProducts = JSON.parse(refundProducts);
                userRefunds.push({ refundID, products: refundProducts });
            }
        }

        return userRefunds;
    }

    return [];
}
