import { instance } from "./razorpay";
export interface categoryWithProductsInfo{
    category: string,
    products: {
        name: string,
        image: string,
        quantity: number, 
    }[]
}


export async function createOrder(amount: number, userUID: string, categoryWithProductsInfo: categoryWithProductsInfo[]) {
    return await instance.orders.create({
        amount: amount,
        currency: "INR",
        notes: {
            userUID: userUID,
            categoryWithProductsInfo: JSON.stringify(categoryWithProductsInfo)
        }
    });
}