// import { validatePayment } from "./validatePayment";

// export function refundProcessed(response: any) {
//     const refundInfo = response.body;
//     if (refundInfo.event === 'refund.processed') {
//         if (refundInfo.contains.includes('order') && refundInfo.contains.includes('payment')) {
//             const paymentId = refundInfo.payload.payment.entity.id;
//             const orderID = refundInfo.payload.order.entity.id;
//             const signature = response.headers['x-razorpay-signature'];
//             const ispaymentValidated = validatePayment(orderID, paymentId, signature);
//             if (ispaymentValidated) {
//                 const notes = refundInfo.payload.order.entity.notes;
//                 const userUID = notes.userUID;
//                 const status = refundInfo.payload.payment.status;
//                 if (status === "processed") {

//                 }
//             }
//         }
//     }
//     return false;
// }