import { db } from "../../firebase";

interface ProductDetails {
  id: string;
  name: string;
  price: string;
  image: string;
  quantityAvailable: number;
  quantityByUser: number;
}

export async function getCartWithProductDetails(
  userUID: string
): Promise<ProductDetails[]> {
  const userCartRef = db.collection(`Users/${userUID}/Cart`);
  const productRefs = await userCartRef.listDocuments();

  if (productRefs.length === 0) return [];

  const productDocs = await Promise.all(productRefs.map((ref) => ref.get()));
  const productData = await Promise.all(productDocs.map(async doc => {
    const productRef = db.collection('Products').doc(doc.id);
    const productSnapshot = await productRef.get();
    const product = productSnapshot.data();
    const productData = {
      ...product,
      image: product!.image.url,
      quantityByUser: doc.data()?.quantity,
      id:doc.id
    };

    return productData as ProductDetails;
  }));

  return productData as ProductDetails[];
}

export async function getCart(userUID: string) {
  return db
    .collection(`Users/${userUID}/Cart`)
    .get()
    .then((snapshot) => snapshot.docs);
}

export async function addProductToCart(
  userUID: string,
  productId: string,
  quantity: number
) {
  const cartRef = db.collection(`Users/${userUID}/Cart`).doc(productId);
  const doc = await cartRef.get();

  if (doc.exists && doc.data() && doc.data()?.quantity) {
    const updatedQuantity = doc.data()?.quantity || 0 + quantity;
    await cartRef.update({ quantity: updatedQuantity });
  } else {
    await cartRef.set({ quantity });
  }
}

export async function removeFromCart(
  userUID: string,
  productId: string,
  quantity: number
) {
  const cartRef = db.collection(`Users/${userUID}/Cart`).doc(productId);
  const doc = await cartRef.get();

  if (doc.exists && doc.data() && doc.data()?.quantity) {
    const updatedQuantity = doc.data()?.quantity - quantity;
    if (updatedQuantity <= 0) {
      await cartRef.delete();
    } else {
      await cartRef.update({ quantity: updatedQuantity });
    }
  } else {
    throw new Error("Product not found in cart");
  }
}

export async function clearCart(userUID: string): Promise<void> {
  await db
    .collection(`Users/${userUID}/Cart`)
    .get()
    .then(async (querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

// Not sure whether firebase will throw error in free plan so commented.
// export async function clearCart(userUID: string): Promise<void> {
//   await db
//     .collection(`Users/${userUID}/Cart`)
//     .get()
//     .then(async (querySnapshot) => {
//       const batches: WriteBatch[] = [db.batch()];

//       //Firestore batch limit is 500 operations. Splitting into batches
//       querySnapshot.docs.forEach((doc, index) => {
//         const batchIndex = index % 499;
//         if (batchIndex < batches.length) {
//           batches[batchIndex].delete(doc.ref);
//         } else {
//           batches.push(db.batch());
//           batches[batchIndex].delete(doc.ref);
//         }
//       });

//       await Promise.all(batches.map((batch) => batch.commit()));
//     });
// }
