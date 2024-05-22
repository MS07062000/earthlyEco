import { FieldValue } from "firebase-admin/firestore";
import { storage, db } from "../firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { isValidHttpUrl } from "./utils";
interface Category {
  id: string;
  name: string;
  image: string | null;
}

interface createCategory {
  name: string;
  image: string;
}

interface UpdateCategoryData {
  id: string;
  name?: string;
  image?: string;
  updatedImage?: {
    url: string;
    extension: string;
  };
}

interface CategoryWithTimestamp extends Category {
  createdTimeStamp: string;
  deletedTimeStamp: FieldValue | null;
}

export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = [];
  const categoriesSnapshot = await db.collection("Categories").get();

  categoriesSnapshot.docs.forEach((categoryDoc) => {
    if (categoryDoc.exists) {
      const data = categoryDoc.data();
      const { name, image, deletedTimeStamp } = data;

      if (!deletedTimeStamp) {
        const category: Category = {
          id: categoryDoc.id,
          name,
          image: image && image.url ? image.url : null,
        };
        // console.log(category);
        categories.push(category);
      }
    }
  });

  // console.log("Categories: ", categories);
  return categories;
}

export async function getAllCategories(): Promise<CategoryWithTimestamp[]> {
  const categories: CategoryWithTimestamp[] = [];
  const categoriesSnapshot = await db.collection("Categories").get();

  categoriesSnapshot.docs.forEach((categoryDoc) => {
    if (categoryDoc.exists) {
      const data = categoryDoc.data();
      const categoryWithTimestamp = {
        ...data,
        image: data.image && data.image.url ? data.image.url : null,
        createdTimeStamp: categoryDoc.createTime.toDate().toISOString(),
        deletedTimeStamp: data.deletedTimeStamp
          ? data.deletedTimeStamp.toDate()
          : null,
        id: categoryDoc.id,
      } as CategoryWithTimestamp;
      categories.push(categoryWithTimestamp);
    }
  });

  // console.log("All Categories: ", categories);

  return categories;
}

export async function createCategory(
  category: createCategory,
  userUID: string
): Promise<void> {
  // Add category to Firestore database
  const categoryRef = await db
    .collection("Categories")
    .add({ name: category.name, updatedById: userUID });

  // Get the document ID of the newly added category
  const categoryId = categoryRef.id;

  // Get extension of image
  const imageExtension = category.image.split(";")[0].split("/")[1];

  // Upload image to Firebase Storage
  const imageFile = storage
    .bucket()
    .file(`Categories/${categoryId}.${imageExtension}`);

  // Convert base64 string to image buffer
  const base64ToImageBuffer = Buffer.from(
    category.image.split(",")[1],
    "base64"
  );

  // Save image buffer to Firebase Storage
  await imageFile.save(base64ToImageBuffer);

  // Get the download URL for the uploaded image
  const imageURL = await getDownloadURL(imageFile);

  // Update category with the image URL
  await db
    .collection("Categories")
    .doc(categoryId)
    .set(
      {
        image: {
          url: imageURL,
          extension: imageExtension,
        },
        updatedById: userUID,
      },
      { merge: true }
    );
}

export async function updateCategory(
  category: UpdateCategoryData,
  userUID: string
) {
  const categoryInfo = await db.doc(`Categories/${category.id}`).get();

  // If image data is provided, upload the new image to Firebase Storage
  if (
    category.image &&
    !isValidHttpUrl(category.image) &&
    categoryInfo.exists
  ) {
    const data = categoryInfo.data();

    if (data && data.image && data.image.extension) {
      // Delete the previous image from Firebase Storage
      await storage
        .bucket()
        .file(`Categories/${category.id}.${data.image.extension}`)
        .delete();
    }

    // Get extension of image
    const newImageExtension = category.image.split(";")[0].split("/")[1];

    // Upload the new image to Firebase Storage
    const imageFile = storage
      .bucket()
      .file(`Categories/${category.id}.${newImageExtension}`);

    // Convert base64 string to image buffer
    const base64ToImageBuffer = Buffer.from(
      category.image.split(",")[1],
      "base64"
    );

    // Save image buffer to Firebase Storage
    await imageFile.save(base64ToImageBuffer);

    // Get the download URL for the uploaded image
    const imageURL = await getDownloadURL(imageFile);

    // Update category with the new image URL
    category.updatedImage = {
      url: imageURL,
      extension: newImageExtension,
    };
  }

  const { id, image, updatedImage, ...restdata } = category;

  // Update category in Firestore database
  await db
    .collection("Categories")
    .doc(category.id)
    .update({
      ...restdata,
      ...(updatedImage ? { image: updatedImage } : {}),
      updatedById: userUID,
    });
}

export async function deleteCategory(
  categoryId: string,
  userUID: string
): Promise<void> {
  await  db.collection("Categories").doc(categoryId).set(
    {
      deletedTimeStamp: FieldValue.serverTimestamp(),
      updatedById: userUID,
    },
    { merge: true }
  );
}

export async function restoreCategory(
  categoryId: string,
  userUID: string
): Promise<void> {
  await db.collection("Categories").doc(categoryId).set(
    {
      deletedTimeStamp: null,
      updatedById: userUID,
    },
    { merge: true }
  );
}
