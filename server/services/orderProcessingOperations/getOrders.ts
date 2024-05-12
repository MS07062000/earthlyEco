import { db } from "../../firebase";

interface UserOrder {
  orderID: string;
  products: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

// Function to retrieve user orders
export async function getOrders(userUID: string) {
  // Step 1: Retrieve user order collection snapshot
  const userOrderCollectionSnapshot = await db
    .collection(`Users/${userUID}/Orders`)
    .where("status", "==", "Processed")
    .get();

  // Step 2: Check if user has any orders
  if (userOrderCollectionSnapshot.empty) {
    return [];
  }

  // Step 3: Map through each order document
  const ordersDataPromises = userOrderCollectionSnapshot.docs.map(
    async (orderDoc) => {
      // Step 4: Retrieve order products for each order
      const orderProductsSnapshot = await db
        .collection(`Users/${userUID}/Orders/${orderDoc.id}/Products`)
        .get();

      // Step 5: Check if order has any products
      if (orderProductsSnapshot.empty) {
        return [];
      }

      // Step 6: Map through each product document and fetch product details
      const orderProductsDataPromises = orderProductsSnapshot.docs.map(
        async (productDoc) => {
          const orderedProductInfo = productDoc.data() || {
            quantity: 0,
            price: 0,
          };

          const productDetailsSnapshot = await db
            .collection(`Products`)
            .doc(productDoc.id)
            .get();

          // Step 7: Check if product details exist
          const productData = productDetailsSnapshot.data() || {
            name: "Unnamed Product",
            image: "https://pic.onlinewebfonts.com/thumbnails/icons_342113.svg",
          };
          return {
            id: productDoc.id,
            name: productData.name,
            image: productData.image,
            ...orderedProductInfo,
          };
        }
      );

      // Step 9: Wait for all product data promises to resolve
      const orderProductsData = await Promise.all(orderProductsDataPromises);

      return { products: orderProductsData, id: orderDoc.id };
    }
  );

  // Step 10: Wait for all order data promises to resolve
  const ordersData = await Promise.all(ordersDataPromises);

  return ordersData || []; // Return ordersData or an empty array if ordersData is nullish
}
