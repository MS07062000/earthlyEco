import { FieldValue } from "firebase-admin/firestore";
import { db } from "../firebase";

export interface Product {
  id: string;
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
}

export async function getProducts(category: string): Promise<Product[]> {
  const categoryId = await db
    .collection("Categories")
    .where("name", "==", category)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        throw new Error("Category does not exist");
      }
      return querySnapshot.docs[0].id;
    });

  const productsSnapshot = await db
    .collection("Products")
    .where("categoryId", "==", categoryId)
    .get();

  const productsData = productsSnapshot.docs.map((productDoc) => ({
    ...productDoc.data(),
    id: productDoc.id,
  })) as Product[];

  return productsData;
}

export async function createProduct(
  categoryId: string,
  name: string,
  image: string,
  quantityAvailable: number,
  price: number
): Promise<void> {
  await db
    .collection("Products")
    .add({ categoryId, name, image, quantityAvailable, price });
}

export async function editProduct(
  productId: string,
  name: string,
  image: string,
  quantityAvailable: number,
  price: number
) {
  //
}

export async function deleteProduct(
  productId: string,
  userUID: string
): Promise<void> {
  await db
    .collection("Products")
    .doc(productId)
    .set(
      { deletedTimeStamp: FieldValue.serverTimestamp(), deletedById: userUID },
      { merge: true }
    );
}
