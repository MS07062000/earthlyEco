import { arrayRemove, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { productInfoOfInsufficientQuantity } from "./orderPaid";
import { db } from "../firebase";
import { sendEmail } from "./sendMail";
export interface refund {
    refundID: string;
    paymentID: string;
    insufficientQuantities: productInfoOfInsufficientQuantity[];
}

export async function redundProcessed(response: any) {
    const processedRefundInfo = response.body;
    if (processedRefundInfo.event === "refund.processed") {
        const paymentID = processedRefundInfo.payload.payment.entity.id;
        const refundID = processedRefundInfo.payload.refund.entity.id;
        const notes = processedRefundInfo.payload.refund.entity.notes;
        const userUID = notes.userUID;
        const refundDetails = await getRefundDetails(userUID, refundID, paymentID);
        if (refundDetails === null) {
            throw Error("Refund details not found");
        }
        await updateRefund(userUID, refundDetails);
        const email=processedRefundInfo.payload.payment.entity.email;
        await sendEmail(email, "refund", refundID, refundDetails.insufficientQuantities);
    }else{
        throw Error("Invalid event received");
    }
}

async function updateRefund(userUID: string, refundDetails: refund) {
    const userDocRef = doc(db, `Users/${userUID}`);

    await setDoc(userDocRef, {
        'Refunds Processed': arrayUnion(refundDetails)
    }, {
        merge: true
    });

    await setDoc(userDocRef, {
        'Refunds Created': arrayRemove(refundDetails)
    }, {
        merge: true
    });

}

async function getRefundDetails(userUID: string, refundID: string, paymentID: string) {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
        const userRefunds = userDocSnapshot.data()['Refunds Created'];
        const refundDetails = userRefunds.find((refund: refund) => refund.refundID === refundID && refund.paymentID === paymentID);
        return refundDetails;
    }
    return null;
}