import { db } from "../../firebase";
import { FieldValue } from "firebase-admin/firestore";

interface ProductInfo {
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
}

export async function getProductDetailsOfWishlistProducts(userUID: string) {
  const wishlist = await getWishlist(userUID);
  if (wishlist.length === 0) {
    return [];
  }

  const products: ProductInfo[] = [];
  const categoriesDocsSnapshot = await db.collection("Categories").get();
  categoriesDocsSnapshot.forEach((doc) => {
    const productsArray = doc.get("Products");

    if (productsArray && Array.isArray(productsArray)) {
      productsArray.forEach((product) => {
        if (wishlist.includes(product.Name)) {
          products.push({
            name: product["Name"],
            image: product["Image"],
            quantityAvailable: product["Quantity Available"],
            price: product["Price"],
          });
        }
      });
    }
  });

  return products;
}

export async function getWishlist(userUID: string): Promise<string[]> {
  const userDoc = await db.doc(`Users/${userUID}`).get();
  if (userDoc.exists) {
    const userWishlistInfo = userDoc.get("Wishlist");
    if (userWishlistInfo && Array.isArray(userWishlistInfo)) {
      return userWishlistInfo;
    }
  }
  return [];
}

export async function wishlist(userUID: string, product: string) {
  const userWishlistInfo: string[] = await getWishlist(userUID);
  if (!userWishlistInfo.includes(product)) {
    await addToWishlist(userUID, product);
  } else {
    await removeFromWishlist(userUID, product);
  }
}

async function addToWishlist(userUID: string, product: string) {
  await db.doc(`Users/${userUID}`).set(
    {
      Wishlist: FieldValue.arrayUnion(product),
    },
    { merge: true }
  );
}

async function removeFromWishlist(userUID: string, product: string) {
  await db.doc(`Users/${userUID}`).update({
    Wishlist: FieldValue.arrayRemove(product),
  });
}
