import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase";

interface CartProduct {
  product: string;
  quantity: number;
}

interface ProductDetails {
  name: string;
  price: string;
  image: string;
  quantityAvailable: number;
  quantityByUser: number;
  category: string;
}

export async function getCartWithProductDetails(
  userUID: string
): Promise<ProductDetails[]> {
  try {
    const cart = await getCart(userUID);
    if (cart.length === 0) {
      return [];
    }

    const cartWithProductDetails: ProductDetails[] = [];

    const categoriesSnapshot = await db.collection("Categories").get();

    categoriesSnapshot.forEach((categoryDoc) => {
      const products = categoryDoc.get("Products");
      if (!products) {
        return;
      }

      cart.forEach((cartItem: CartProduct) => {
        const productInCategory = products.find(
          (product: { Name: string }) => product.Name === cartItem.product
        );

        if (productInCategory) {
          const {
            Name,
            Price,
            Image,
            "Quantity Available": QuantityAvailable,
          } = productInCategory;
          const { quantity } = cartItem;

          const productDetails: ProductDetails = {
            name: Name,
            price: Price,
            image: Image,
            quantityAvailable: QuantityAvailable,
            quantityByUser: quantity,
            category: categoryDoc.id,
          };

          cartWithProductDetails.push(productDetails);
        }
      });
    });

    return cartWithProductDetails;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return [];
  }
}

export async function getCart(userUID: string): Promise<CartProduct[]> {
  const userDoc = await db.doc(`Users/${userUID}`).get();
  if (userDoc.exists) {
    const userCartInfo = userDoc.get("Cart");
    if (Array.isArray(userCartInfo)) {
      return userCartInfo;
    }
  }
  return [];
}

export async function addProductToCart(
  userUID: string,
  product: string,
  quantity: number
) {
  const userCartInfo: CartProduct[] = await getCart(userUID);

  const existingProductIndex = userCartInfo.findIndex(
    (cartProduct: CartProduct) => cartProduct.product === product
  );

  if (existingProductIndex !== -1) {
    const existingProduct = userCartInfo[existingProductIndex];
    const updatedQuantity = existingProduct.quantity + quantity;

    await removeFromCart(userUID, product, existingProduct.quantity);
    await addToCart(userUID, product, updatedQuantity);
  } else {
    await addToCart(userUID, product, quantity);
  }
}

async function addToCart(userUID: string, product: string, quantity: number) {
  await db.doc(`Users/${userUID}`).set(
    {
      Cart: FieldValue.arrayUnion({
        product: product,
        quantity: quantity,
      }),
    },
    { merge: true }
  );
}

export async function removeFromCart(
  userUID: string,
  product: string,
  quantity: number
) {
  await db.doc(`Users/${userUID}`).update({
    Cart: FieldValue.arrayRemove(
      {
        product: product,
        quantity: quantity,
      },
    ),
  });
}

export async function clearCart(userUID: string) {
  await db.doc(`Users/${userUID}`).update({
    Cart: [],
  });
}
