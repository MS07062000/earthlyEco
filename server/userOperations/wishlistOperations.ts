import { doc, getDoc, setDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface ProductInfo {
    name: string;
    image: string;
    quantityAvailable: number;
    price: number;
}

// Function to get product details based on the wishlist array
export async function getProductDetailsOfWishlistProducts(userUID:string) {
    const wishlist = await getUserWishlist(userUID);
    if(wishlist.length === 0) {
        return [];
    }

    const products:ProductInfo[] = [];
    const productsCollectionRef = collection(db, 'Categories'); // Update with your collection name
    const docsSnapshot = await getDocs(productsCollectionRef);
    docsSnapshot.forEach((doc) => {
        const productsArray = doc.data().Products;

        if (Array.isArray(productsArray)) {
            productsArray.forEach(product => {
                if (wishlist.includes(product.Name)) {
                    products.push({
                        name: product['Name'],
                        image: product['Image'],
                        quantityAvailable: product['Quantity Available'],
                        price: product['Price'],
                    });
                }
            });
        }
    });

    return products;
}


export async function getUserWishlist(userUID: string): Promise<string[]> {
    const userDocRef = doc(db, `Users/${userUID}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userWishlistInfo = userDoc.data()['Wishlist'];
        return userWishlistInfo;
    }
    return [];
}

export async function wishlist(userUID: string, product: string) {
    const userWishlistInfo: string[] = await getUserWishlist(userUID);
    if (!userWishlistInfo.includes(product)) {
        await addToWishlist(userUID, product);
    } else {
        await removeFromWishlist(userUID, product);
    }
}

async function addToWishlist(userUID: string, product: string) {
    await setDoc(doc(db, `Users/${userUID}`), {
        'Wishlist': arrayUnion(product)
    }, {
        merge: true
    });
}

async function removeFromWishlist(userUID: string, product: string) {
    await setDoc(doc(db, `Users/${userUID}`), {
        'Wishlist': arrayRemove(product)
    }, {
        merge: true
    });
}