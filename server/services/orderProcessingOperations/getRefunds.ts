import { db } from "../../firebase";

export async function getRefunds(userUID: string) {
  // Step 1: Retrieve user refund collection snapshot
  const userOrderCollectionSnapshot = await db
    .collection(`Users/${userUID}/Refunds`)
    .where("status", "==", "Processed")
    .get();

  // Step 2: Check if user has any refunds
  if (userOrderCollectionSnapshot.empty) {
    return [];
  }

  // Step 3: Map through each refund document
  const refundsDataPromises = userOrderCollectionSnapshot.docs.map(
    async (refundDoc) => {
      // Step 4: Retrieve refund products for each refund
      const refundProductsSnapshot = await db
        .collection(`Users/${userUID}/Refunds/${refundDoc.id}/Products`)
        .get();

      // Step 5: Check if refund has any products
      if (refundProductsSnapshot.empty) {
        return [];
      }

      // Step 6: Map through each product document and fetch product details
      const refundProductsDataPromises = refundProductsSnapshot.docs.map(
        async (productDoc) => {
          const refundedProductInfo = productDoc.data() || {
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
            ...refundedProductInfo,
          };
        }
      );

      // Step 9: Wait for all product data promises to resolve
      const refundProductsData = await Promise.all(refundProductsDataPromises);

      return { products: refundProductsData, id: refundDoc.id };
    }
  );

  // Step 10: Wait for all refund data promises to resolve
  const refundsData = await Promise.all(refundsDataPromises);

  return refundsData || []; // Return refundsData or an empty array if refundsData is nullish
}
