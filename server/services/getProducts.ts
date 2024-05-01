import { DocumentData, FieldPath } from "firebase-admin/firestore";
import { db } from "../firebase";

interface Product {
  name: string;
  image: string;
  quantityAvailable: number;
  price: number;
}

export async function getProducts(category: string): Promise<Product[]> {
  //capitalizing the category first letter because database has first letter capitalized
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const products: Product[] = [];
  const categoriesQuerySnapshot = await db
    .collection("Categories")
    .where(FieldPath.documentId(), "==", capitalizedCategory)
    .get();

  const categoryDoc = categoriesQuerySnapshot.docs[0];

  if (categoryDoc.exists) {
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

  // console.log(products);
  return products;
}
