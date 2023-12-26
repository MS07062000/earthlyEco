import { arrayRemove, arrayUnion, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { categoryWithProductsInfo, order } from "./createOrder";
import { createRefundInDatabase } from "./createRefund";
import { validatePayment } from "./validatePayment";

export interface productInfoOfInsufficientQuantity {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export async function orderPaid(response: any) {
    const processedOrderInfo = response.body;
    if (processedOrderInfo.event === "order.paid") {
        if (processedOrderInfo.contains.includes("order") && processedOrderInfo.contains.includes("payment")) {
            const paymentId = processedOrderInfo.payload.payment.entity.id;
            const orderID = processedOrderInfo.payload.order.entity.id;
            const signature = response.headers['x-razorpay-signature'];
            const ispaymentValidated = validatePayment(orderID, paymentId, signature);
            // if (ispaymentValidated) {
            const notes = processedOrderInfo.payload.order.entity.notes;
            const userUID = notes["userUID"]; //userUID;
            const orderDetails = await getOrderDetails(userUID, orderID);

            if (orderDetails != null) {
                throw Error("Order details not found");
                //handle case where we could not find order in user's orders
            }

            const insufficientQuantities = await modifyQuantityAvailable(orderDetails!["categoryWithProducts"]);
            const totalAmountToBeRefunded = calculateTotalAmountToBeRefunded(insufficientQuantities);

            await updateOrders(userUID, orderDetails!);

            if (totalAmountToBeRefunded > 0) {
                await createRefundInDatabase(paymentId, totalAmountToBeRefunded, userUID, insufficientQuantities);
            }
            // }
            // return ispaymentValidated;
        }
    } else {
        throw Error("Invalid event received");
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


async function getOrderDetails(userUID: string, orderID: string) {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userOrders = userDoc.data()['Orders Created'];
        if (Array.isArray(userOrders)) {
            const orderDetails: order = userOrders.find((order: order) => order.orderID === orderID);
            return orderDetails;
        }
    }
    return null;
}


async function updateOrders(userUID: string, orderDetails: order) {
    const userDocRef = doc(db, `Users/${userUID}`);

    await setDoc(userDocRef, {
        'Orders Processed': arrayUnion(orderDetails)
    }, {
        merge: true
    });

    await setDoc(userDocRef, {
        'Orders Created': arrayRemove(orderDetails)
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