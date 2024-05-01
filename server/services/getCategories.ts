import { DocumentData } from "firebase-admin/firestore";
import { db } from "../firebase";
interface Category {
  name: string;
  image: string;
}

export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = [];

  const categoriesSnapshot = await db.collection("Categories").get();

  categoriesSnapshot.forEach((categoryDoc) => {
    if (categoryDoc.exists) {
      const categoryData = categoryDoc.data() as DocumentData;
      const category: Category = {
        name: categoryDoc.id.toLowerCase(),
        image: categoryData["category image"] ?? "",
      };

      categories.push(category);
    }
  });

  return categories;
}
