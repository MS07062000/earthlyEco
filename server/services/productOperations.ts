import { getDownloadURL } from "firebase-admin/storage";
import { db, storage } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

export interface Product {
  id: string;
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
  categoryId: string;
}

export interface CreateProduct extends Omit<Product, "id" | "image"> {
  image: {
    data: string;
    extension: string;
  };
}

export interface UpdateProductData {
  id: string;
  name?: string;
  image?: {
    data: string;
    extension: string;
  };
  quantityAvailable?: number;
  price?: number;
  categoryId?: string;
  updatedImage?: {
    url: string | undefined;
    extension: string;
  };
}

export interface ProductWithTimestamp extends Product {
  createdTimeStamp: string;
  deletedTimeStamp: FieldValue | null;
}

export async function getProducts(category: string): Promise<Product[]> {
  const products: Product[] = [];
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
    .where("deletedTimeStamp", "==", null)
    .get();

  productsSnapshot.docs.map((productDoc) => {
    if (productDoc.exists) {
      const data = productDoc.data();
      const product = {
        ...data,
        image: data.image && data.image.url ? data.image.url : null,
        id: productDoc.id,
      } as Product;
      products.push(product);
    }
  });

  return products;
}

export async function getAllProducts(): Promise<ProductWithTimestamp[]> {
  const products: ProductWithTimestamp[] = [];
  const productsSnapshot = await db.collection("Products").get();
  productsSnapshot.docs.forEach((productDoc) => {
    if (productDoc.exists) {
      const data = productDoc.data();
      const product = {
        ...data,
        image: data.image && data.image.url ? data.image.url : null,
        createdTimeStamp: productDoc.createTime.toDate().toISOString(),
        id: productDoc.id,
      } as ProductWithTimestamp;
      products.push(product);
    }
  });

  return products;
}

export async function createProduct(product: CreateProduct): Promise<void> {
  const { image, ...restdata } = product;
  // Add product to Firestore database
  const productRef = await db.collection("Products").add({
    ...restdata,
  });

  // Get the document ID of the newly added product
  const productId = productRef.id;

  // Upload image to Firebase Storage
  const imageFile = storage
    .bucket()
    .file(`Products/${productId}.${product.image.extension}`);
  imageFile.save(image.data);

  // Get the download URL for the uploaded image
  const imageURL = await getDownloadURL(imageFile);

  // Update product with the image URL
  await db
    .collection("Products")
    .doc(productId)
    .set(
      {
        image: { url: imageURL, extension: product.image.extension },
      },
      { merge: true }
    );
}

export async function updateProduct(product: UpdateProductData) {
  const productInfo = await db.doc(`Products/${product.id}`).get();
  // If image data is provided, upload the new image to Firebase Storage
  if (product.image && productInfo.exists) {
    const data = productInfo.data();

    if (data && data.image && data.image.extension) {
      // Delete the previous image from Firebase Storage
      await storage
        .bucket()
        .file(`Products/${product.id}.${data.image.extension}`)
        .delete();
    }

    // Upload the new image to Firebase Storage
    const imageFile = storage
      .bucket()
      .file(`Products/${product.id}.${product.image.extension}`);
    imageFile.save(product.image.data);
    // Get the download URL for the uploaded image
    const imageURL = await getDownloadURL(imageFile);

    // Update product with the new image URL
    product.updatedImage = {
      url: imageURL,
      extension: product.image.extension,
    }; // Update data object with the image URL
  }

  const { id, image, updatedImage, ...data } = product;
  // Update product in Firestore database
  await db
    .collection("Products")
    .doc(product.id)
    .update({ ...data, image: product.updatedImage });
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
