import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebase";

interface ProductInfo {
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
}

interface Category {
  name: string;
  image: string;
}

export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = [];

  const categoriesCollectionRef = collection(db, `Categories`);
  const categoriesSnapshot = await getDocs(categoriesCollectionRef);

  categoriesSnapshot.forEach((categoryDoc) => {
    if (categoryDoc.exists()) {
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

export async function getProducts(category: string): Promise<ProductInfo[]> {
  const categoriesCollectionRef = collection(db, `Categories`);
  const categoriesSnapshot = await getDocs(categoriesCollectionRef);
  const products: ProductInfo[] = [];

  categoriesSnapshot.forEach((categoryDoc) => {
    if (
      categoryDoc.exists() &&
      categoryDoc.id.toLowerCase() === category.toLowerCase()
    ) {
      const categoryData = categoryDoc.data() as DocumentData;
      const productsData = categoryData["Products"];
      products.push(
        ...productsData.map((product: DocumentData) => ({
          name: product["Name"] ?? "",
          image: product["Image"] ?? "",
          quantityAvailable: product["Quantity Available"] ?? 0,
          price: product["Price"] ?? 0,
        }))
      );
    }
  });
  return products;
}