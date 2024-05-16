import { db } from "../../firebase";
import { FieldValue } from "firebase-admin/firestore";

interface ProductInfo {
  id: string;
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
}

export async function getWishlistProductsWithProductDetails(userUID: string) {
  const userWishlistProductIds = await getWishlist(userUID);
  if (!userWishlistProductIds || userWishlistProductIds.length === 0) {
    return [];
  }

  const productRefs = userWishlistProductIds.map((productId: string) =>
    db.collection("Products").doc(productId)
  );

  const productSnapshots = await db.getAll(...productRefs);

  return productSnapshots.map((snapshot) => {
    const product = snapshot.data();
    if(!product) {
      return;
    }

    const productData = {
      ...product,
      image: product!.image.url,
      id:snapshot.id
    };

    return productData as ProductInfo;
  });
}


export async function getWishlist(userUID: string): Promise<string[]> {
  const userDocRef = db.doc(`Users/${userUID}`);
  const userWishlistProductIds = (await userDocRef.get()).get("Wishlist");
  return userWishlistProductIds || [];
}

export async function wishlist(userUID: string, productId: string) {
  const userWishlistInfo: string[] = await getWishlist(userUID);
  if (!userWishlistInfo.includes(productId)) {
    await addToWishlist(userUID, productId);
  } else {
    await removeFromWishlist(userUID, productId);
  }
}

async function addToWishlist(userUID: string, productId: string) {
  await db.doc(`Users/${userUID}`).update({
    Wishlist: FieldValue.arrayUnion(productId),
  }); 
}

async function removeFromWishlist(userUID: string, productId: string) {
  await db.doc(`Users/${userUID}`).update({
    Wishlist: FieldValue.arrayRemove(productId),
  });
}
