import { doc, getDoc, setDoc, arrayUnion, arrayRemove, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
interface cartProduct {
    product: string,
    quantity: number
}
interface ProductDetails {
    name: string;
    price: string;
    image: string;
    quantityAvailable: number;
    quantityByUser: number;
    category: string;
}

export async function getCartOfUserWithProductDetails(userUID: string): Promise<ProductDetails[]> {
    try {
        const cart = await getUserCart(userUID);
        if(cart.length === 0) {
            return [];
        }

        const result: ProductDetails[] = [];

        const productsCollectionRef = collection(db, 'Categories');
        const categoriesSnapshot = await getDocs(productsCollectionRef);

        categoriesSnapshot.forEach((categoryDoc) => {
            const categoryData = categoryDoc.data();
            const products = categoryData?.Products || [];

            cart.forEach((cartItem: cartProduct) => {
                const productInCategory = products.find((product: { Name: string }) => product.Name === cartItem.product);

                if (productInCategory) {
                    const { Name, Price, Image, 'Quantity Available': QuantityAvailable } = productInCategory;
                    const { quantity } = cartItem;

                    const productDetails: ProductDetails = {
                        name: Name,
                        price: Price,
                        image: Image,
                        quantityAvailable: QuantityAvailable,
                        quantityByUser: quantity,
                        category: categoryDoc.id
                    };

                    result.push(productDetails);
                }
            });
        });

        return result;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return [];
    }
}

export async function getUserCart(userUID: string): Promise<cartProduct[]> {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userCartInfo = userDoc.data()['Cart'];
        if(Array.isArray(userCartInfo)) {
            return userCartInfo;
        }
    }
    return [];
}

export async function addProductToCart(userUID: string, product: string, quantity: number) {
    const userCartInfo: cartProduct[] = await getUserCart(userUID);

    const existingProductIndex = userCartInfo.findIndex(
        (cartProduct: cartProduct) => cartProduct.product === product
    );

    if (existingProductIndex !== -1) {
        const existingProduct = userCartInfo[existingProductIndex];
        const updatedQuantity = existingProduct.quantity + quantity;

        await removeFromCart(userUID, product, existingProduct.quantity);
        await addToCart(userUID, product, updatedQuantity);
    } else {
        await addToCart(userUID, product, quantity);
    }

}

async function addToCart(userUID: string, product: string, quantity: number) {
    await setDoc(doc(db, `Users/${userUID}`), {
        'Cart': arrayUnion({
            'product': product,
            'quantity': quantity
        })
    }, {
        merge: true
    });
}

export async function removeFromCart(userUID: string, product: string, quantity: number) {
    await setDoc(doc(db, `Users/${userUID}`), {
        'Cart': arrayRemove({
            'product': product,
            'quantity': quantity
        })
    }, {
        merge: true
    });
}

