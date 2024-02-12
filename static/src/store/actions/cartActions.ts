import { Dispatch } from "react";
import {
  updateCartOfUserSuccess,
  updateCartOfUserFailed,
  fetchCartOfUserFailed,
  fetchCartOfUserInitiated,
  fetchCartOfUserSuccess,
} from "../slices/userCartSlice";
import { addProductToCartOfUser } from "../api/addProductToCartOfUser";
import { removeProductFromCartOfUser } from "../api/removeProductFromCartOfUser";
import { clearCartOfUser } from "../api/clearCartOfUser";
import { getCartOfUser } from "../api/getCartOfUser";
import { updateWishlistForUser } from "../api/updateWishlistForUser";
import { CartProductInfo } from "../interfaces";
const processCartData = async (userUID: string, data: CartProductInfo[]) => {
  let totalAmount = 0;
  const products = await Promise.all(
    data.map(async (product: CartProductInfo, index: number) => {
      let updatedProduct = { ...product };
      if (product.quantityByUser > product.quantityAvailable) {
        await removeProductFromCartOfUser(
          userUID,
          product.name,
          product.quantityByUser
        );
        await addProductToCartOfUser(
          userUID,
          product.name,
          product.quantityAvailable
        );
        updatedProduct.quantityByUser = product.quantityAvailable;
        totalAmount += product.price * product.quantityAvailable;
      } else {
        totalAmount += product.price * product.quantityByUser;
      }
      return updatedProduct;
    })
  );
  return { products, totalAmount };
};

export const fetchCart =
  (userUID: string) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchCartOfUserInitiated>
      | ReturnType<typeof fetchCartOfUserSuccess>
      | ReturnType<typeof fetchCartOfUserFailed>
    >
  ) => {
    dispatch(fetchCartOfUserInitiated());
    try {
      const cart = await getCartOfUser(userUID);
      const { products, totalAmount } = await processCartData(userUID, cart);
      dispatch(fetchCartOfUserSuccess({ products, totalAmount }));
    } catch (error) {
      dispatch(fetchCartOfUserFailed("Unable to get cart products"));
    }
  };

export const removeProductFromCart =
  (userUID: string, product: string, quantity: number) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof setCartSuccessMessage>
      | ReturnType<typeof fetchCart>
      | ReturnType<typeof setCartErrorMessage>
    >
  ) => {
    try {
      await removeProductFromCartOfUser(userUID, product, quantity);
      dispatch(setCartSuccessMessage(`${product} added to cart successfully`));
      dispatch(fetchCart(userUID));
    } catch (error) {
      dispatch(
        setCartErrorMessage(`${product} removed from cart successfully`)
      );
      return;
    }
  };

export const clearCart =
  (userUID: string) =>
  async (
    dispatch: Dispatch<
      ReturnType<typeof fetchCart> | ReturnType<typeof setCartErrorMessage>
    >
  ) => {
    try {
      await clearCartOfUser(userUID);
      dispatch(fetchCart(userUID));
    } catch (error) {
      dispatch(setCartErrorMessage("Failed to add product to cart"));
    }
  };

export const moveToWishlistFromCart =
  (userUID: string, product: string, quantity: number) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof setCartSuccessMessage>
      | ReturnType<typeof fetchCart>
      | ReturnType<typeof setCartErrorMessage>
    >
  ) => {
    try {
      await removeProductFromCartOfUser(userUID, product, quantity);
      await updateWishlistForUser(userUID, product);
      dispatch(
        setCartSuccessMessage(`${product} moved to wishlist successfully`)
      );
      dispatch(fetchCart(userUID));
    } catch (error) {
      dispatch(setCartErrorMessage(`Unable to move ${product} to wishlist`));
    }
  };

export const increaseQuantityOfProduct =
  (
    userUID: string,
    cartProducts: CartProductInfo[],
    currentTotalAmount: number,
    index: number
  ) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchCartOfUserSuccess>
      | ReturnType<typeof setCartErrorMessage>
    >
  ) => {
    try {
      const productQuantity = cartProducts[index].quantityByUser;
      if (
        productQuantity < cartProducts[index].quantityAvailable &&
        productQuantity < 10
      ) {
        await removeProductFromCartOfUser(
          userUID,
          cartProducts[index].name,
          productQuantity
        );
        const updatedCartProducts = [...cartProducts];
        updatedCartProducts[index].quantityByUser =
          updatedCartProducts[index].quantityByUser + 1;
        await addProductToCartOfUser(
          userUID,
          cartProducts[index].name,
          updatedCartProducts[index].quantityByUser
        );
        dispatch(
          fetchCartOfUserSuccess({
            products: updatedCartProducts,
            totalAmount: currentTotalAmount + cartProducts[index].price,
          })
        );
      } else {
        dispatch(
          setCartErrorMessage(
            `Maximum quantity of ${cartProducts[index].name} is ${cartProducts[index].quantityAvailable}. You can order only maximum 10 quantity for each product at a time.`
          )
        );
      }
    } catch (error) {
      dispatch(
        setCartErrorMessage(
          `Unable to increase quantity of ${cartProducts[index].name}`
        )
      );
    }
  };

export const decreaseQuantityOfProduct =
  (
    userUID: string,
    cartProducts: CartProductInfo[],
    currentTotalAmount: number,
    index: number
  ) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchCartOfUserSuccess>
      | ReturnType<typeof setCartErrorMessage>
    >
  ) => {
    try {
      const productQuantity = cartProducts[index].quantityByUser;
      if (productQuantity > 1) {
        await removeProductFromCartOfUser(
          userUID,
          cartProducts[index].name,
          productQuantity
        );
        const updatedCartProducts = [...cartProducts];
        updatedCartProducts[index].quantityByUser =
          updatedCartProducts[index].quantityByUser - 1;
        await addProductToCartOfUser(
          userUID,
          cartProducts[index].name,
          updatedCartProducts[index].quantityByUser
        );
        dispatch(
          fetchCartOfUserSuccess({
            products: updatedCartProducts,
            totalAmount: currentTotalAmount + cartProducts[index].price,
          })
        );
      } else {
        dispatch(
          setCartErrorMessage(`Minimum quantity for any product in cart is 1.`)
        );
      }
    } catch (error) {
      dispatch(
        setCartErrorMessage(
          `Unable to decrese quantity of ${cartProducts[index].name}`
        )
      );
    }
  };

export const setCartErrorMessage =
  (error: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateCartOfUserFailed>>) =>
    dispatch(updateCartOfUserFailed(error));

export const setCartSuccessMessage =
  (successMessage: string | null) =>
  (dispatch: Dispatch<ReturnType<typeof updateCartOfUserSuccess>>) =>
    dispatch(updateCartOfUserSuccess(successMessage));

export const updateCartProducts =
  (products: CartProductInfo[], totalAmount: number) =>
  (dispatch: Dispatch<ReturnType<typeof fetchCartOfUserSuccess>>) =>
    dispatch(fetchCartOfUserSuccess({ products, totalAmount }));
