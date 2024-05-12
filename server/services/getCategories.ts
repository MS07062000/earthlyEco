import { FieldValue } from "firebase-admin/firestore";
import { bucket, db } from "../firebase";
interface Category {
  id: string;
  name: string;
  imageName: string;
  image: string;
  deletedTimeStamp?: FieldValue;
  deletedById?: string;
}

export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = [];
  const categoriesSnapshot = await db.collection("Categories").get();
  categoriesSnapshot.forEach((categoryDoc) => {
    if (categoryDoc.exists) {
      const category = {
        ...categoryDoc.data(),
        id: categoryDoc.id,
      } as Category;
      if (!category.deletedTimeStamp && !category.deletedById) {
        categories.push(category);
      }
    }
  });

  return categories;
}

export async function createCategory(
  name: string,
  image: string
): Promise<void> {
  const [uploadResponse] = await bucket.upload(image, {
    destination: `${name}/${name}Image`,
  });

  const imageUrl = uploadResponse.publicUrl();
  await db
    .collection("Categories")
    .add({ name, imageName: name, image: imageUrl });
}

export async function editCategory(
  categoryId: string,
  newName: string,
  newImage: string
): Promise<void> {
  const categoryRef = db.collection("Categories").doc(categoryId);
  const categoryDoc = await categoryRef.get();

  if (!categoryDoc.exists) {
    throw new Error("Category does not exist");
  }

  const updates: any = {
    name: newName,
    imageName: newName,
    image: newImage,
  };
  const imageName = categoryDoc.data()?.imageName
    ? categoryDoc.data()?.imageName
    : categoryDoc.data()?.name;
  updates.imageName = imageName;

  if (newImage) {
    const [uploadResponse] = await bucket.upload(newImage, {
      destination: `${imageName}/${imageName}Image`,
    });
    const imageUrl = uploadResponse.publicUrl();
    updates.image = imageUrl;
  }

  await categoryRef.update({ ...updates });
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
