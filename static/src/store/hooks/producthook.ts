import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./apphook";
import { useNavigate } from "react-router-dom";
import { fetchAddress } from "../actions/addressActions";
import {
  fetchProducts,
  addProductToCart,
  setProductErrorMessage,
  setProductSuccessMessage,
} from "../actions/productActions";
import { fetchWishlist } from "../actions/wishlistActions";
import { Address, Product, ProductOrder } from "../interfaces";
import { memoizedProductSelectors } from "../selectors";
import { loadScript } from "../../helpers/loadRazorpayScript";
import { proceedForPayment } from "../../helpers/proceedForPayment";
import { createOrder, updateWishlistForUser } from "../api";

const useProduct = (category: string) => {
  const { auth, wishlist, address, product } = useAppSelector(
    memoizedProductSelectors
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [quantityOfEachProduct, setQuantityOfEachProduct] = useState<number[]>(
    []
  );
  const [selectAddress, setSelectAddress] = useState<Address | null>(null);
  const [showSelectAddressModal, setShowSelectAddressModal] =
    useState<boolean>(false);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [quantityToBuyNow, setQuantityToBuyNow] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchProducts(category));
  }, [category]);

  useEffect(() => {
    if (auth.user !== null) {
      getWishlistProducts();
      getListOfAddressesOfUser();
    }
  }, [auth.user]);

  useEffect(() => {
    setQuantityOfEachProduct(Array(product.products.length).fill(1));
  }, [product.products]);

  const getWishlistProducts = () => {
    dispatch(fetchWishlist());
  };

  const getListOfAddressesOfUser = () => {
    dispatch(fetchAddress());
    if (address.addresses && address.addresses.length > 0) {
      setSelectAddress(address.addresses[0]);
    }
  };

  const productsPresentInWishlist = product.products.map((product: Product) =>
    wishlist.products!.some(
      (wishlistProduct: Product) => wishlistProduct.id === product.id
    )
  );

  const onWishlist = async (productId: string, index: number) => {
    if (auth.user !== null) {
      try {
        await updateWishlistForUser(productId);
        dispatch(
          setProductSuccessMessage(
            !productsPresentInWishlist[index]
              ? `${product.products[index].name} added to wishlist successfully`
              : `${product.products[index].name} removed from wishlist successfully`
          )
        );
        dispatch(fetchWishlist());
      } catch (error) {
        dispatch(
          setProductErrorMessage(
            !productsPresentInWishlist[index]
              ? `Failed to add ${product.products[index].name} to wishlist`
              : `Failed to remove ${product.products[index].name} from wishlist`
          )
        );
      }
    } else {
      navigate("/signIn");
    }
  };

  const onAddToCart = async (
    productId: string,
    productName: string,
    quantity: number
  ) => {
    if (auth.user !== null) {
      dispatch(addProductToCart(productId, productName, quantity));
    } else {
      navigate("/signIn");
    }
  };

  const incrementQuantity = (index: number) => {
    const prevQuantity = [...quantityOfEachProduct];
    if (
      prevQuantity[index] + 1 <= product.products[index].quantityAvailable &&
      prevQuantity[index] < 10
    ) {
      prevQuantity[index] = prevQuantity[index] + 1;
      setQuantityOfEachProduct(prevQuantity);
    }
  };

  const decrementQuantity = (index: number) => {
    const prevQuantity = [...quantityOfEachProduct];
    if (prevQuantity[index] + 1 > 1) {
      prevQuantity[index] = prevQuantity[index] - 1;
      setQuantityOfEachProduct(prevQuantity);
    }
  };

  const onBuyNow = async () => {
    if (auth.user !== null && singleProduct != null) {
      const products: ProductOrder[] = [
        {
          id: singleProduct.id,
          quantity: quantityToBuyNow,
          price: singleProduct.price,
        },
      ];
      try {
        const orderID = await createOrder(
          products,
          quantityToBuyNow * singleProduct.price,
          selectAddress!
        );
        if (orderID) {
          loadScript().then((isScriptLoaded) => {
            if (isScriptLoaded) {
              proceedForPayment(auth.user!.email, orderID).then(
                (isPaymentSuccess) => {
                  if (isPaymentSuccess) {
                    dispatch(
                      setProductSuccessMessage(
                        `Your order for the product ${singleProduct.name} with a quantity of ${quantityToBuyNow} has been processed with order id ${orderID}.`
                      )
                    );
                  }
                }
              );
            } else {
              dispatch(
                setProductErrorMessage(
                  "We are unable to load our payment provider"
                )
              );
            }
          });
        }
      } catch (error) {
        dispatch(setProductErrorMessage("Unable to place order"));
      }
    } else {
      navigate("/signIn");
    }
  };

  const processBuyNow = (index: number, product: Product) => {
    if (auth.user == null) {
      navigate("/signIn");
      return;
    }

    if (address.addresses!.length === 0) {
      dispatch(
        setProductErrorMessage(
          "Please add address for delivery in your profile"
        )
      );
      return;
    }
    setQuantityToBuyNow(quantityOfEachProduct[index]);
    setSingleProduct(product);
    setShowSelectAddressModal(true);
  };

  const clearErrorMessage = () => {
    dispatch(setProductErrorMessage(null));
  };

  const clearSuccessMessage = () => {
    dispatch(setProductSuccessMessage(null));
  };

  return {
    product,
    address,
    productsPresentInWishlist,
    quantityOfEachProduct,
    selectAddress,
    setSelectAddress,
    showSelectAddressModal,
    setShowSelectAddressModal,
    singleProduct,
    quantityToBuyNow,
    onWishlist,
    onAddToCart,
    incrementQuantity,
    decrementQuantity,
    onBuyNow,
    processBuyNow,
    clearErrorMessage,
    clearSuccessMessage,
  };
};

export default useProduct;
