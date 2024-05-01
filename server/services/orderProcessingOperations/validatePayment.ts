import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export function validatePayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
) {
  const secret: string = process.env.VITE_RAZORPAY_WEBHOOK_SECRET as string;
  return validatePaymentVerification(
    { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
    signature,
    secret
  );
}
