import { getDownloadURL } from "firebase-admin/storage";
import { db, storage } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";
import { getCategories } from "./categoriesOperations";
import { isValidHttpUrl } from "./utils";

export interface Product {
  id: string;
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
  categoryId: string;
  categoryName: string;
}

export interface CreateProduct extends Omit<Product, "id"> {}

export interface UpdateProductData {
  id: string;
  name?: string;
  image?: string;
  updatedImage?: {
    url: string;
    extension: string;
  };
  quantityAvailable?: number;
  price?: number;
  categoryId?: string;
}

export interface ProductWithTimestamp extends Product {
  createdTimeStamp: string;
  deletedTimeStamp: string | null;
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
    .get();

  productsSnapshot.docs.map((productDoc) => {
    if (productDoc.exists) {
      const data = productDoc.data();
      if (!data.deletedTimeStamp) {
        const product = {
          ...data,
          image: data.image && data.image.url ? data.image.url : null,
          id: productDoc.id,
        } as Product;
        products.push(product);
      }
    }
  });

  return products;
}

export async function getAllProducts(): Promise<ProductWithTimestamp[]> {
  const activeCategories = await getCategories();

  const productPromises = activeCategories.map(async (category) => {
    const productsSnapshot = await db
      .collection("Products")
      .where("categoryId", "==", category.id)
      .get();

    return productsSnapshot.docs.map((productDoc) => {
      const data = productDoc.data();
      return {
        ...data,
        image: data.image && data.image.url ? data.image.url : null,
        categoryName: category.name,
        createdTimeStamp: productDoc.createTime.toDate().toISOString(),
        deletedTimeStamp: data.deletedTimeStamp ? data.deletedTimeStamp.toDate() : null,
        id: productDoc.id,
      } as ProductWithTimestamp;
    });
  });

  const productArrays = await Promise.all(productPromises);

  // console.log("All Products", ...productArrays.flat());
  return [...productArrays.flat()];
}

export async function createProduct(
  product: CreateProduct,
  userUID: string
): Promise<void> {
  const { image, ...restdata } = product;

  // Add product to Firestore database
  const productRef = await db.collection("Products").add({
    ...restdata,
    updatedById: userUID,
  });

  // Get the document ID of the newly added product
  const productId = productRef.id;

  // Get extension of image
  const extension = image.split(";")[0].split("/")[1];

  // Upload image to Firebase Storage
  const imageFile = storage.bucket().file(`Products/${productId}.${extension}`);

  // Convert base64 string to image buffer
  const base64ToImageBuffer = Buffer.from(
    product.image.split(",")[1],
    "base64"
  );

  // Save image buffer to Firebase Storage
  await imageFile.save(base64ToImageBuffer);

  // Get the download URL for the uploaded image
  const imageURL = await getDownloadURL(imageFile);

  // Update product with the image URL
  await db
    .collection("Products")
    .doc(productId)
    .set(
      {
        image: {
          url: imageURL,
          extension: extension,
        },
        updatedById: userUID,
      },
      { merge: true }
    );
}

export async function updateProduct(
  product: UpdateProductData,
  userUID: string
): Promise<void> {
  const productInfo = await db.doc(`Products/${product.id}`).get();
  // If image data is provided, upload the new image to Firebase Storage
  if (product.image && !isValidHttpUrl(product.image) && productInfo.exists) {
    const data = productInfo.data();

    if (data && data.image && data.image.extension) {
      // Delete the previous image from Firebase Storage
      await storage
        .bucket()
        .file(`Products/${product.id}.${data.image.extension}`)
        .delete();
    }

    // Get extension of image
    const newExtension = product.image.split(";")[0].split("/")[1];

    // Upload the new image to Firebase Storage
    const imageFile = storage
      .bucket()
      .file(`Products/${product.id}.${newExtension}`);

    // Convert base64 string to image buffer
    const base64ToImageBuffer = Buffer.from(
      product.image.split(",")[1],
      "base64"
    );

    // Save image buffer to Firebase Storage
    imageFile.save(base64ToImageBuffer);

    // Get the download URL for the uploaded image
    const imageURL = await getDownloadURL(imageFile);

    // Update product with the new image URL
    product.updatedImage = {
      url: imageURL,
      extension: newExtension,
    };
  }
  // Update product in Firestore database
  const { image, updatedImage, ...restdata } = product;

  await db
    .collection("Products")
    .doc(product.id)
    .update({
      ...restdata,
      ...(updatedImage ? { image: updatedImage } : {}),
      updatedById: userUID,
    });
}


export async function deleteProduct(
  productId: string,
  userUID: string
): Promise<void> {
  await db
    .collection("Products")
    .doc(productId)
    .set(
      { deletedTimeStamp: FieldValue.serverTimestamp(), updatedById: userUID },
      { merge: true }
    );
}

export async function restoreProduct(
  productId: string,
  userUID: string
): Promise<void> {
  await db
    .collection("Products")
    .doc(productId)
    .set(
      { deletedTimeStamp: null, updatedById: userUID },
      { merge: true }
    );
}