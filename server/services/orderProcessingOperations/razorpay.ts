import Razorpay from "razorpay";
export const instance = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID as string,
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET as string,
});
