import { FieldValue } from "firebase-admin/firestore";
import { storage, db } from "../firebase";
import { getDownloadURL } from "firebase-admin/storage";
interface Category {
  id: string;
  name: string;
  image: string | null;
}

interface createCategory {
  name: string;
  image: {
    data: string;
    extension: string;
  };
}

interface UpdateCategoryData {
  id: string;
  name?: string;
  image?: {
    data: string;
    extension: string;
  };
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
  const categoriesSnapshot = await db
    .collection("Categories")
    .where("deletedTimeStamp", "==", null)
    .get();

  categoriesSnapshot.forEach((categoryDoc) => {
    if (categoryDoc.exists) {
      const data = categoryDoc.data();
      const { id, name, image, deletedTimeStamp, deletedById } = data;

      if (!deletedTimeStamp && !deletedById) {
        const category: Category = {
          id,
          name,
          image: image && image.url ? image.url : null,
        };
        categories.push(category);
      }
    }
  });

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
        id: categoryDoc.id,
      } as CategoryWithTimestamp;
      categories.push(categoryWithTimestamp);
    }
  });

  return categories;
}

export async function createCategory(category: createCategory): Promise<void> {
  // Add category to Firestore database
  const categoryRef = await db
    .collection("Categories")
    .add({ name: category.name });

  // Get the document ID of the newly added category
  const categoryId = categoryRef.id;

  // Upload image to Firebase Storage
  const imageFile = storage
    .bucket()
    .file(`Categories/${categoryId}.${category.image.extension}`);
  await imageFile.save(category.image.data);

  // Get the download URL for the uploaded image
  const imageURL = await getDownloadURL(imageFile);

  // Update category with the image URL
  await db
    .collection("Categories")
    .doc(categoryId)
    .set(
      {
        image: { url: imageURL, extension: category.image.extension },
      },
      { merge: true }
    );
}

export async function updateCategory(category: UpdateCategoryData) {
  const categoryInfo = await db.doc(`Categories/${category.id}`).get();

  // If image data is provided, upload the new image to Firebase Storage
  if (category.image && categoryInfo.exists) {
    const data = categoryInfo.data();

    if (data && data.image && data.image.extension) {
      // Delete the previous image from Firebase Storage
      await storage
        .bucket()
        .file(`Categories/${category.id}.${data.image.extension}`)
        .delete();
    }

    // Upload the new image to Firebase Storage
    const imageFile = storage
      .bucket()
      .file(`Categories/${category.id}.${category.image.extension}`);
    await imageFile.save(category.image.data);

    // Get the download URL for the uploaded image
    const imageURL = await getDownloadURL(imageFile);

    // Update category with the new image URL
    category.updatedImage = {
      url: imageURL,
      extension: category.image.extension,
    };
  }

  const { id, image, updatedImage, ...data } = category;

  // Update category in Firestore database
  await db
    .collection("Categories")
    .doc(category.id)
    .update({ ...data, image: category.updatedImage });
}

export async function deleteCategory(
  categoryId: string,
  userUID: string
): Promise<void> {
  const categoryRef = db.collection("Categories").doc(categoryId);
  categoryRef.set(
    {
      deletedTimeStamp: FieldValue.serverTimestamp(),
      deletedById: userUID,
    },
    { merge: true }
  );
}
