import { db } from "../../firebase";
import { orderProductInfo } from "./orderPaid";
import { sendEmail } from "./sendMail";
export interface refund {
  refundID: string;
  paymentID: string;
  products: orderProductInfo[];
}

export async function refundProcessed(response: any) {
  // Step 1: Get refund info
  const processedRefundInfo = response.body;

  // Step 2: Check if event is valid
  if (processedRefundInfo.event === "refund.processed") {
    const paymentID = processedRefundInfo.payload.payment.entity.id;
    const refundID = processedRefundInfo.payload.refund.entity.id;
    const notes = processedRefundInfo.payload.refund.entity.notes;
    const userUID = notes.userUID;

    // Step 3: Get refund details
    const refundDetails = await getRefundDetails(userUID, refundID);

    // Step 4: Check if refund details found
    if (refundDetails === null) {
      throw Error("Refund details not found");
    }

    // Step 5: Update refund
    await updateRefund(userUID, refundID, paymentID);

    // Step 6: Get email of user
    const email = processedRefundInfo.payload.payment.entity.email;

    // Step 7: Send email to user
    await sendEmail(email, "refund", refundID, refundDetails.products);
  } else {
    throw Error("Invalid event received");
  }
}

async function updateRefund(
  userUID: string,
  refundID: string,
  paymentID: string
) {
  await db.doc(`Users/${userUID}/Refunds/${refundID}`).update({
    status: "Processed",
    paymentID: paymentID,
  });
}

async function getRefundDetails(userUID: string, refundID: string) {
  //Step 1: Get refund document reference
  const refundDocRef = db.doc(`Users/${userUID}/Refunds/${refundID}`);

  //Step 2: Get refund details
  const refundDetails: refund = {
    refundID: refundID,
    paymentID: (await refundDocRef.get()).data()?.paymentID,
    products: [],
  };

  //Step 3: Get refund products
  const refundProducts = (
    await refundDocRef.collection("Products").get()
  ).docs;

  // Loop through each product and get details
  for (const doc of refundProducts) {
    // Get product document reference
    const productInfo = await db.doc(`Products/${doc.id}`).get();

    if (productInfo.data()) {
      refundDetails.products.push({
        id: doc.id,
        name: productInfo.data()?.name,
        quantity: doc.data()?.quantity,
        price: doc.data()?.price,
      });
    }
  }

  return refundDetails;
}