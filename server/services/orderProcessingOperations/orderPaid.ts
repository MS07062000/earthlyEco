import { db } from "../../firebase";
import { orderProduct } from "./createOrder";
import { createRefundInDatabase } from "./createRefund";
import { validatePayment } from "./validatePayment";
import { sendEmail } from "./sendMail";
import { Address } from "../userOperations/addressOperations";
import { Product } from "../productOperations";

export interface orderProductInfo extends orderProduct {
  name: string;
}

interface orderDetails {
  products: orderProductInfo[];
  insufficientQuantities: orderProduct[];
  refundAmount: number;
  deliveryAddress: Address;
  id: string;
}


export async function orderPaid(response: any) {
  const processedOrderInfo = response.body;
  if (
    processedOrderInfo.event === "order.paid" &&
    processedOrderInfo.contains.includes("order") &&
    processedOrderInfo.contains.includes("payment")
  ) {
    const paymentId = processedOrderInfo.payload.payment.entity.id;
    const orderID = processedOrderInfo.payload.order.entity.id;
    const signature = response.headers["x-razorpay-signature"];
    const ispaymentValidated = validatePayment(orderID, paymentId, signature);
    // if (ispaymentValidated) {
    const notes = processedOrderInfo.payload.order.entity.notes;
    const userUID = notes["userUID"]; //userUID;
    const email = processedOrderInfo.payload.payment.entity.email;

    const orderDetails = await getProcessedOrderDetails(userUID, orderID);

    if(orderDetails === null){
      throw Error("Order not found");
    }

    await updateOrders(userUID, orderID);
    await sendEmail(
      email,
      "order",
      orderID,
      orderDetails.products,
      orderDetails.deliveryAddress
    );

    if (orderDetails.refundAmount > 0) {
      await createRefundInDatabase(
        paymentId,
        orderDetails.refundAmount,
        userUID,
        orderDetails.insufficientQuantities
      );
    }
    // }
    // return ispaymentValidated;
  } else {
    throw Error("Invalid event received");
  }
}

async function getProcessedOrderDetails(userUID: string, orderID: string) {
  // Step 1: Retrieve the order document snapshot
  const orderDocSnapshot = await db
    .doc(`Users/${userUID}/Orders/${orderID}`)
    .get();

  // Step 2: Check if the order document exists
  if (!orderDocSnapshot.exists) {
    return null;
  }

  // Step 3: Retrieve the collection of ordered products
  const orderProductsRef = orderDocSnapshot.ref.collection("Products");
  const orderProductsSnapshot = await orderProductsRef.get();

  // Step 4: Initialize arrays for products and insufficient quantities
  const products: orderProductInfo[] = [];
  const insufficientQuantities: orderProduct[] = [];
  let refundAmount = 0;

  // Step 5: Process each ordered product
  await Promise.all(
    orderProductsSnapshot.docs.map(async (doc) => {
      const orderedProductInfo = doc.data() as orderProduct;

      // Step 6: Retrieve product details from the database
      const productDocSnapshot = await db.doc(`Products/${doc.id}`).get();

      if (productDocSnapshot.exists && !productDocSnapshot.data()) {
        const productInfoFromDB = productDocSnapshot.data() as Product;

        // Step 7: Check product availability
        if (productInfoFromDB.quantityAvailable >= orderedProductInfo.quantity) {
          // Sufficient quantity available
          productInfoFromDB.quantityAvailable -= orderedProductInfo.quantity;
          refundAmount += orderedProductInfo.quantity * productInfoFromDB.price;

          // Update product quantity in the database
          await productDocSnapshot.ref.update({
            quantityAvailable: productInfoFromDB.quantityAvailable,
          });
        } else {
          // Insufficient quantity available
          insufficientQuantities.push({
            id: doc.id,
            quantity: orderedProductInfo.quantity - productInfoFromDB.quantityAvailable,
            price: productInfoFromDB.price,
          });

          refundAmount += (orderedProductInfo.quantity - productInfoFromDB.quantityAvailable) * productInfoFromDB.price;

          // Set product quantity to 0 in the database
          await productDocSnapshot.ref.update({ quantityAvailable: 0 });
        }

        // Step 8: Add processed product info to the products array
        products.push({
          ...orderedProductInfo,
          name: productInfoFromDB.name,
          id: doc.id,
        });
      }
    })
  );

  // Step 9: Return processed order details
  return {
    products,
    insufficientQuantities,
    refundAmount,
    ...orderDocSnapshot.data(),
  } as orderDetails;
}


async function updateOrders(userUID: string, orderId: string) {
  await db.doc(`Users/${userUID}/Orders/${orderId}`).update({
    status: "Processed",
  });
}