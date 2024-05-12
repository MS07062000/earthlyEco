import { useNavigate } from "react-router-dom";
import {
  setCartSuccessMessage,
  fetchCart,
  setCartErrorMessage,
  updateCartProducts,
  cartErrorHandler,
} from "../actions/cartActions";
import {
  removeProductFromCartOfUser,
  clearCartOfUser,
  updateWishlistForUser,
  addProductToCartOfUser,
  createOrder,
} from "../api";
import { Address, CartProductInfo, ProductOrder } from "../interfaces";
import { memoizedCartSelectors } from "../selectors";
import { useAppDispatch, useAppSelector } from "./apphook";
import { useEffect, useState } from "react";
import { loadScript } from "../../helpers/loadRazorpayScript";
import { proceedForPayment } from "../../helpers/proceedForPayment";
import { fetchAddress } from "../actions/addressActions";

export default function useCart() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth, address, cart } = useAppSelector(memoizedCartSelectors);
  const [selectAddress, setSelectAddress] = useState<Address | null>(null);
  const [singleProduct, setSingleProduct] = useState<CartProductInfo | null>(
    null
  );
  const [showSelectAddressModal, setShowSelectAddressModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (address.addresses != null && address.addresses.length > 0) {
      setSelectAddress(address.addresses[0]);
    }
  }, [address]);

  useEffect(() => {
    if (auth.user !== null) {
      dispatch(fetchCart());
      dispatch(fetchAddress());
    } else {
      navigate("/signIn");
    }
  }, [auth.user]);

  const processBuyNow = (product: CartProductInfo) => {
    setSingleProduct(product);
    setShowSelectAddressModal(true);
  };

  const processCompleteOrder = () => {
    if (address.addresses!.length === 0) {
      setErrorMessage("Please add address for delivery in your profile.");
      return;
    }
    setShowSelectAddressModal(true);
  };

  const onBuyNowFromCart = async (
    product: CartProductInfo,
    selectAddress: Address
  ) => {
    if (auth.user !== null && product != null) {
      const products: ProductOrder[] = [
        {
          id: product.id,
          quantity: product.quantityByUser,
          price: product.price,
        },
      ];
      try {
        const orderID = await createOrder(
          products,
          product.quantityByUser * product.price,
          selectAddress!
        );
        if (orderID) {
          loadScript().then((isScriptLoaded) => {
            if (isScriptLoaded) {
              proceedForPayment(auth.user!.email, orderID).then(
                async (isPaymentSuccess) => {
                  if (isPaymentSuccess) {
                    await removeProductFromCartOfUser(
                      product.id,
                      product.quantityByUser
                    );
                    dispatch(fetchCart());
                    dispatch(
                      setCartSuccessMessage(
                        `Your order for the product ${product.name} with a quantity of ${product.quantityByUser} has been processed with order id ${orderID}.`
                      )
                    );
                  }else{
                    dispatch(setCartErrorMessage("Payment Failed"));
                  }
                }
              );
            } else {
              dispatch(
                setCartErrorMessage(
                  "We are unable to load our payment provider"
                )
              );
            }
          });
        }
      } catch (error) {
        dispatch(cartErrorHandler(error, "Unable to place order"));
      }
    }
  };

  const placeOrder = async (selectAddress: Address) => {
    if (auth.user !== null) {
      const products: ProductOrder[] = [];
      cart.products!.forEach((product) => {
        products.push({
          id: product.id,
          quantity: product.quantityByUser,
          price: product.price,
        });
      });

      try {
        const orderID = await createOrder(
          products,
          cart.totalAmount,
          selectAddress
        );
        if (orderID) {
          loadScript().then((isScriptLoaded) => {
            if (isScriptLoaded) {
              proceedForPayment(auth.user!.email, orderID).then(
                async (isPaymentSuccess) => {
                  if (isPaymentSuccess) {
                    await clearCartOfUser();
                    dispatch(fetchCart());
                    dispatch(
                      setCartSuccessMessage(
                        `Your order has been processed with order id ${orderID}.`
                      )
                    );
                  }
                }
              );
            } else {
              dispatch(
                setCartErrorMessage(
                  "We are unable to load our payment provider"
                )
              );
            }
          });
        }
      } catch (error) {
        dispatch(cartErrorHandler(error, "Unable to place order"));
      }
    }
  };

  const removeProductFromCart = async (
    productId: string,
    productName: string,
    quantity: number
  ) => {
    try {
      await removeProductFromCartOfUser(productId, quantity);
      dispatch(
        setCartSuccessMessage(`${productName} added to cart successfully`)
      );
      dispatch(fetchCart());
    } catch (error) {
      dispatch(
        cartErrorHandler(error, `Unable to remove ${productName} from cart.`)
      );
    }
  };

  const clearCart = async () => {
    try {
      await clearCartOfUser();
      dispatch(fetchCart());
    } catch (error) {
      dispatch(setCartErrorMessage("Failed to add product to cart"));
    }
  };

  const moveToWishlistFromCart = async (
    productId: string,
    productName: string,
    quantity: number
  ) => {
    try {
      await removeProductFromCartOfUser(productId, quantity);
      await updateWishlistForUser(productId);
      dispatch(
        setCartSuccessMessage(`${productName} moved to wishlist successfully`)
      );
      dispatch(fetchCart());
    } catch (error) {
      dispatch(
        cartErrorHandler(error, `Unable to move ${productName} to wishlist.`)
      );
    }
  };

  const increaseQuantityOfProduct = async (index: number) => {
    const { products, totalAmount } = cart;
    try {
      const productQuantity = products![index].quantityByUser;
      if (
        productQuantity < products![index].quantityAvailable &&
        productQuantity < 10
      ) {
        const updatedCartProducts = [...products!];
        const updatedProduct = {
          ...updatedCartProducts[index],
          quantityByUser: productQuantity + 1,
        };
        updatedCartProducts[index] = updatedProduct;
        await removeProductFromCartOfUser(
          products![index].id,
          productQuantity
        );
        await addProductToCartOfUser(
          products![index].id,
          updatedCartProducts[index].quantityByUser
        );
        dispatch(
          updateCartProducts(
            updatedCartProducts,
            totalAmount + products![index].price
          )
        );
      } else {
        dispatch(
          setCartErrorMessage(
            `Maximum quantity of ${products![index].name} is ${
              products![index].quantityAvailable
            }. You can order only maximum 10 quantity for each product at a time.`
          )
        );
      }
    } catch (error) {
      dispatch(
        cartErrorHandler(
          error,
          `Unable to increase quantity of ${products![index].name}`
        )
      );
    }
  };

  const decreaseQuantityOfProduct = async (index: number) => {
    const { products, totalAmount } = cart;
    try {
      const productQuantity = products![index].quantityByUser;
      if (productQuantity > 1) {
        await removeProductFromCartOfUser(
          products![index].id,
          productQuantity
        );
        const updatedCartProducts = [...products!];
        const updatedProduct = {
          ...updatedCartProducts[index],
          quantityByUser: productQuantity - 1,
        };
        updatedCartProducts[index] = updatedProduct;
        await addProductToCartOfUser(
          products![index].id,
          updatedCartProducts[index].quantityByUser
        );
        dispatch(
          updateCartProducts(
            updatedCartProducts,
            totalAmount + products![index].price
          )
        );
      } else {
        dispatch(
          setCartErrorMessage(`Minimum quantity for any product in cart is 1.`)
        );
      }
    } catch (error) {
      dispatch(
        cartErrorHandler(
          error,
          `Unable to decrease quantity of ${products![index].name}`
        )
      );
    }
  };

  const clearSuccessMessage = () => {
    dispatch(setCartSuccessMessage(null));
  };

  const setErrorMessage = (error: string | null) => {
    dispatch(setCartErrorMessage(error));
  };

  const setCartProducts = (products: CartProductInfo[]) => {
    dispatch(updateCartProducts(products, cart.totalAmount));
  };

  return {
    cart,
    address,
    setCartProducts,
    increaseQuantityOfProduct,
    decreaseQuantityOfProduct,
    removeProductFromCart,
    moveToWishlistFromCart,
    onBuyNowFromCart,
    placeOrder,
    clearCart,
    clearSuccessMessage,
    setErrorMessage,
    processBuyNow,
    processCompleteOrder,
    selectAddress,
    setSelectAddress,
    singleProduct,
    showSelectAddressModal,
    setShowSelectAddressModal,
  };
}

// const onChangeOfQuantity = async (event: any, index: number) => {
//     try {
//         const productQuantity = cartProducts[index].quantityByUser;
//         const newproductQuantity = Number(event.target.value);
//         console.log(productQuantity, newproductQuantity);
//         if (newproductQuantity >= 1 && newproductQuantity <= cartProducts[index].quantityAvailable && newproductQuantity <= 10) {
//             await removeProductFromCartOfUser( cartProducts[index].name, productQuantity);
//             const updatedCartProducts = [...cartProducts];
//             updatedCartProducts[index].quantityByUser = newproductQuantity;
//             await addProductToCartOfUser( cartProducts[index].name, updatedCartProducts[index].quantityByUser);
//             setCartProducts(updatedCartProducts);
//             setTotalAmount(totalAmount + ((newproductQuantity - productQuantity) * cartProducts[index].price));
//         } else {
//             setErrorMessage(`You can order minimum 1 and maximum 10 quantity for each product at a time. ${cartProducts[index].quantityAvailable >10 ? '' : 'Unfortunately we have only ${cartProducts[index].quantityAvailable} in stock.'} `);
//         }
//     } catch (error) {
//         setErrorMessage(`Unable to decrese quantity of ${cartProducts[index].name}`);
//     }
// }
