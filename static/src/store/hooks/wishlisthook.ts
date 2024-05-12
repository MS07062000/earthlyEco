import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setWishlistSuccessMessage,
  fetchWishlist,
  setWishlistErrorMessage,
  setWishlistProducts,
} from "../actions/wishlistActions";
import { addProductToCartOfUser, updateWishlistForUser } from "../api";
import { Product } from "../interfaces";
import { memoizedWishlistSelectors } from "../selectors";
import { useAppDispatch, useAppSelector } from "./apphook";

export const useWishlist = () => {
  const { auth, wishlist } = useAppSelector(memoizedWishlistSelectors);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user !== null) {
      dispatch(fetchWishlist());
    } else {
      navigate("/signIn");
    }
  }, [auth.user]);

  const deleteFromWishlist = async (productId: string, productName: string) => {
    if (auth.user !== null) {
      addToOrRemoveFromWishlist(productId, productName, false);
    }
  };

  const moveToCart = async (productId: string, productName: string) => {
    if (auth.user !== null) {
      moveToCartFromWishlist(productId, productName);
    }
  };

  const clearSuccessMessage = () => {
    dispatch(setWishlistSuccessMessage(null));
  };

  const clearErrorMessage = () => {
    dispatch(setWishlistErrorMessage(null));
  };

  const setProducts = (products: Product[]) => {
    dispatch(setWishlistProducts(products));
  };

  const addToOrRemoveFromWishlist = async (
    productId: string,
    productName: string,
    isAdd: boolean
  ) => {
    try {
      await updateWishlistForUser(productId);
      dispatch(
        setWishlistSuccessMessage(
          isAdd
            ? `${productName} added to wishlist successfully`
            : `${productName} removed from wishlist successfully`
        )
      );

      dispatch(fetchWishlist());
    } catch (error) {
      dispatch(
        setWishlistErrorMessage(
          isAdd
            ? `Failed to add ${productName} to wishlist`
            : `Failed to remove ${productName} from wishlist`
        )
      );
    }
  };

  const moveToCartFromWishlist = async (
    productId: string,
    productName: string
  ) => {
    try {
      await addProductToCartOfUser(productId, 1);
      await updateWishlistForUser(productId);
    } catch (error) {
      dispatch(
        setWishlistErrorMessage(`Unable to move ${productName} to cart`)
      );
      return;
    }
    dispatch(fetchWishlist());
    dispatch(
      setWishlistSuccessMessage(`${productName} moved to cart successfully`)
    );
  };

  return {
    wishlist,
    setProducts,
    deleteFromWishlist,
    moveToCart,
    clearSuccessMessage,
    clearErrorMessage,
  };
};

export default useWishlist;
