import {
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { productInfoOfInsufficientQuantity } from "./orderPaid";
import { db } from "../../firebase";
import { sendEmail } from "./sendMail";
export interface refund {
  refundID: string;
  paymentID: string;
  insufficientQuantities: productInfoOfInsufficientQuantity[];
}

export async function refundProcessed(response: any) {
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
    const email = processedRefundInfo.payload.payment.entity.email;
    await sendEmail(
      email,
      "refund",
      refundID,
      refundDetails.insufficientQuantities
    );
  } else {
    throw Error("Invalid event received");
  }
}

async function updateRefund(userUID: string, refundDetails: refund) {
  await db.doc(`Users/${userUID}`).set(
    {
      "Refunds Processed": arrayUnion(refundDetails),
      "Refunds Created": arrayRemove(refundDetails),
    },
    {
      merge: true,
    }
  );
}

async function getRefundDetails(
  userUID: string,
  refundID: string,
  paymentID: string
) {
  const userDocSnapshot = await db.doc(`Users/${userUID}`).get();
  if (userDocSnapshot.exists) {
    const userRefunds = userDocSnapshot.get("Refunds Created");
    if (userRefunds === undefined) {
      return null;
    }

    const refundDetails = userRefunds.find(
      (refund: refund) =>
        refund.refundID === refundID && refund.paymentID === paymentID
    );
    return refundDetails;
  }
  return null;
}
