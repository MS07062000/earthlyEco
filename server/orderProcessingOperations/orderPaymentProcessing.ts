import { arrayUnion, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { db } from "../firebase";
import { categoryWithProductsInfo } from "./createOrder";
import { createRefund } from "./createRefund";
import { validatePayment } from "./validatePayment";

export interface productInfoOfInsufficientQuantity {
    name: string;
    quantity: number;
    price: number;
    image: string;
}


export async function orderPaymentProcessing(response:any) {
    const orderDetails = response.body;
    if (orderDetails.event === "order.paid") {
        if (orderDetails.contains.includes("order") && orderDetails.contains.includes("payment")) {
            const paymentId = orderDetails.payload.payment.entity.id;
            const orderID = orderDetails.payload.order.entity.id;
            const signature = response.headers['x-razorpay-signature'];
            const ispaymentValidated = validatePayment(orderID, paymentId, signature);
            if (ispaymentValidated) {
                const notes = JSON.parse(orderDetails.payload.order.entity.notes);
                const productWithQuantity = JSON.parse(notes.products);
                const insufficientQuantities = await modifyQuantityAvailable(productWithQuantity);
                const totalAmountToBeRefunded = calculateTotalAmountToBeRefunded(insufficientQuantities);
                const userUID = notes.userUID;
                await updateUserOrders(userUID, orderID);
                if (totalAmountToBeRefunded > 0) {
                    const refundResponse=await createRefund(paymentId, totalAmountToBeRefunded, userUID, insufficientQuantities);
                    if(refundResponse.payment_id && refundResponse.id){
                        await updateUserRefund(userUID,refundResponse.id,refundResponse.payment_id);
                    }
                }
            }
        }
    }
}


async function modifyQuantityAvailable(categoryWithProductsAndItsQuantity: categoryWithProductsInfo[]) {
    const insufficientQuantities: productInfoOfInsufficientQuantity[] = [];
    const productsCollectionRef = collection(db, 'Categories');
    for (const categoryAndItsProduct of categoryWithProductsAndItsQuantity) {
        const categoryDocRef = doc(productsCollectionRef, categoryAndItsProduct.category);
        const categoryDoc = await getDoc(categoryDocRef);
        if (!categoryDoc.exists()) {
            continue;
        }

        const categoryData = categoryDoc.data();
        if (categoryData.Products && Array.isArray(categoryData.Products)) {
            const updatedProducts = categoryData.Products.map((product) => {
                const foundProduct = categoryAndItsProduct.products.find(p => p.name === product.Name);
                if (foundProduct) {
                    if (product['Quantity Available'] >= foundProduct.quantity) {
                        product['Quantity Available'] -= foundProduct.quantity;
                    } else {
                        insufficientQuantities.push({
                            name: product.Name,
                            quantity: foundProduct.quantity,
                            image: product.Image,
                            price: product.Price
                        });
                    }
                }
                return product;
            });

            await setDoc(categoryDocRef, {
                Products: updatedProducts
            }, { merge: true });
        }
    }
    return insufficientQuantities;
}

async function updateUserOrders(userUID: string, order_id: string) {
    const userDocRef= doc(db, `Users/${userUID}`);
    await setDoc(userDocRef, {
        'orders': arrayUnion(order_id)
    }, {
        merge: true
    });
}

async function updateUserRefund(userUID: string, refundID: string,paymentID:string) {
    const userDocRef= doc(db, `Users/${userUID}`);
    await setDoc(userDocRef, {
        'refunds': arrayUnion({refundID,paymentID})
    }, {
        merge: true
    });
}

function calculateTotalAmountToBeRefunded(listOfProductInfoWithInsufficientQuantity: productInfoOfInsufficientQuantity[]): number {
    let totalAmountToBeRefunded: number = 0
    listOfProductInfoWithInsufficientQuantity.forEach(product => {
        totalAmountToBeRefunded += product.price * product.quantity
    });
    return totalAmountToBeRefunded;
}