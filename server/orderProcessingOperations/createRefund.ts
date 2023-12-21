import { productInfoOfInsufficientQuantity } from "./orderPaymentProcessing";
import { instance } from "./razorpay";

export async function createRefund(paymentID:string,amount:number,userUID:string,productWithQuantity:productInfoOfInsufficientQuantity[]){
    return await instance.payments.refund(paymentID,{
        amount:amount,
        speed:"optimum",
        notes:{
            userUID:userUID,
            products:JSON.stringify(productWithQuantity),
        }
    });
}