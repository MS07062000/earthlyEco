import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebase";

interface ProductInfo {
    name: string;
    image: string;
    quantityAvailable: number;
    price: number;
}

interface CategoryInfo {
    [key: string]: {
        image: string;
        products: ProductInfo[];
    };
}

export async function getCategoriesAndProducts(): Promise<CategoryInfo[]> {
    const categories: CategoryInfo[] = [];

    const categoriesCollectionRef = collection(db, `Categories`);
    const categoriesSnapshot = await getDocs(categoriesCollectionRef);

    categoriesSnapshot.forEach((categoryDoc) => {
        if (categoryDoc.exists()) {
            const categoryData = categoryDoc.data() as DocumentData;
            const productsData = categoryData['Products'];

            const products: ProductInfo[] = productsData.map((product: DocumentData) => ({
                name: product['Name'] ?? '',
                image: product['Image'] ?? '',
                quantityAvailable: product['Quantity Available'] ?? 0,
                price: product['Price'] ?? 0,
            }));

            const category: CategoryInfo = {
                [categoryDoc.id.toLowerCase()]: {
                    image: categoryData['category image'] ?? '',
                    products: products,
                },
            };

            categories.push(category);
        }
    });

    return categories;
}
