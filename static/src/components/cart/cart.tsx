import { useEffect, useState } from "react";
import { loadScript } from "../../helpers/loadRazorpayScript";
import { proceedForPayment } from "../../helpers/proceedForPayment.js";
import { createOrder, clearCartOfUser, removeProductFromCartOfUser } from "../../store/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAddress } from "../../store/actions/addressActions";
import { decreaseQuantityOfProduct, fetchCart, increaseQuantityOfProduct, moveToWishlistFromCart, removeProductFromCart, setCartErrorMessage, setCartSuccessMessage, updateCartProducts } from "../../store/actions/cartActions";
import { Button, Icon, Message, MessageModal, SelectAddressModal, SortBy, Spinner } from "..";
import { CartProductInfo, CategoryWithProductsInfo, Address } from "../../store/interfaces";
import { memoizedCartSelectors} from "../../store/selectors";

const Cart = () => {
    const { auth, address, cart } = useAppSelector(memoizedCartSelectors);
    const dispatch = useAppDispatch();
    const [selectAddress, setSelectAddress] = useState<Address | null>(null);
    const [showSelectAddressModal, setShowSelectAddressModal] = useState<boolean>(false);
    const [singleProduct, setSingleProduct] = useState<CartProductInfo | null>(null);

    useEffect(() => {
        if (auth.user != null) {
            dispatch(fetchCart(auth.user.uid));
            getListOfAddressesOfUser();
        }
    }, [auth.user]);

    const getListOfAddressesOfUser = () => {
        dispatch(fetchAddress(auth.user!.uid));
        if (address.addresses.length > 0) {
            setSelectAddress(address.addresses[0]);
        }
    }

    const onDeleteFromCart = async (productName: string, quantityByUser: number) => {
        if (auth.user != null) {
            dispatch(removeProductFromCart(auth.user!.uid, productName, quantityByUser));
        }
    }

    const moveFromCartToWishlist = async (productName: string, quantityByUser: number) => {
        if (auth.user != null) {
            dispatch(moveToWishlistFromCart(auth.user!.uid, productName, quantityByUser));
        }
    }

    const incrementQuantity = async (index: number) => {
        dispatch(increaseQuantityOfProduct(auth.user!.uid, cart.products, cart.totalAmount, index));
    }

    const decrementQuantity = async (index: number) => {
        dispatch(decreaseQuantityOfProduct(auth.user!.uid, cart.products, cart.totalAmount, index));
    }

    // const onChangeOfQuantity = async (event: any, index: number) => {
    //     try {
    //         const productQuantity = cartProducts[index].quantityByUser;
    //         const newproductQuantity = Number(event.target.value);
    //         console.log(productQuantity, newproductQuantity);
    //         if (newproductQuantity >= 1 && newproductQuantity <= cartProducts[index].quantityAvailable && newproductQuantity <= 10) {
    //             await removeProductFromCartOfUser(auth.user!.uid, cartProducts[index].name, productQuantity);
    //             const updatedCartProducts = [...cartProducts];
    //             updatedCartProducts[index].quantityByUser = newproductQuantity;
    //             await addProductToCartOfUser(auth.user!.uid, cartProducts[index].name, updatedCartProducts[index].quantityByUser);
    //             setCartProducts(updatedCartProducts);
    //             setTotalAmount(totalAmount + ((newproductQuantity - productQuantity) * cartProducts[index].price));
    //         } else {
    //             setErrorMessage(`You can order minimum 1 and maximum 10 quantity for each product at a time. ${cartProducts[index].quantityAvailable >10 ? '' : 'Unfortunately we have only ${cartProducts[index].quantityAvailable} in stock.'} `);
    //         }
    //     } catch (error) {
    //         setErrorMessage(`Unable to decrese quantity of ${cartProducts[index].name}`);
    //     }
    // }

    const placeOrder = async () => {
        if (auth.user != null) {
            const categoryWithProducts: CategoryWithProductsInfo[] = cart.products.reduce((acc: CategoryWithProductsInfo[], product: CartProductInfo) => {
                if (product.quantityAvailable === 0) {
                    return acc;
                }

                const existingCategoryIndex = acc.findIndex((item) => item.category === product.category);

                if (existingCategoryIndex !== -1) {
                    acc[existingCategoryIndex].products.push({
                        name: product.name,
                        image: product.image,
                        quantity: product.quantityByUser,
                        price: product.price
                    });
                } else {
                    acc.push({
                        category: product.category,
                        products: [{
                            name: product.name,
                            image: product.image,
                            quantity: product.quantityByUser,
                            price: product.price
                        }],
                    });
                }

                return acc;
            }, []);

            try {
                const orderID = await createOrder(auth.user!.uid, categoryWithProducts, cart.totalAmount, selectAddress!);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(auth.user!.email, orderID).then(async (isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    await clearCartOfUser(auth.user!.uid);
                                    dispatch(fetchCart(auth.user!.uid));
                                    dispatch(setCartSuccessMessage(`Your order has been processed with order id ${orderID}.`));
                                }
                            });
                        } else {
                            dispatch(setCartErrorMessage("We are unable to load our payment provider"));
                        }
                    })
                }
            } catch (error) {
                dispatch(setCartErrorMessage("Unable to place order"));
            }

        }
    }

    const onBuyNowFromCart = async () => {
        if (auth.user != null && singleProduct != null) {
            const categoryWithProducts: CategoryWithProductsInfo[] = [{ category: singleProduct.category, products: [{ name: singleProduct.name, image: singleProduct.image, quantity: singleProduct.quantityByUser, price: singleProduct.price }] }];
            try {
                const orderID = await createOrder(auth.user!.uid, categoryWithProducts, singleProduct.quantityByUser * singleProduct.price, selectAddress!);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(auth.user!.email, orderID).then(async (isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    await removeProductFromCartOfUser(auth.user!.uid, singleProduct.name, singleProduct.quantityByUser);
                                    dispatch(fetchCart(auth.user!.uid));
                                    dispatch(setCartSuccessMessage(`Your order for the product ${singleProduct.name} with a quantity of ${singleProduct.quantityByUser} has been processed with order id ${orderID}.`));
                                }
                            });
                        } else {
                            dispatch(setCartErrorMessage("We are unable to load our payment provider"));
                        }
                    })
                }
            } catch (error) {
                dispatch(setCartErrorMessage("Unable to place order"));
            } finally {
                setSingleProduct(null);
            }

        }
    }

    const processBuyNow = (product: CartProductInfo) => {
        if (address.addresses.length === 0) {
            dispatch(setCartErrorMessage("Please add address for delivery in your profile."));
            return;
        }
        setSingleProduct(product);
        setShowSelectAddressModal(true);
    }

    const processCompleteOrder = () => {
        if (address.addresses.length === 0) {
            dispatch(setCartErrorMessage("Please add address for delivery in your profile."));
            return;
        }
        setShowSelectAddressModal(true);
    }

    const clearSuccessMessage = () => {
        dispatch(setCartSuccessMessage(null));
    }

    const clearErrorMessage = () => {
        dispatch(setCartErrorMessage(null));
    }
    const setCartProducts = (products: CartProductInfo[]) => {
        dispatch(updateCartProducts(products, cart.totalAmount));
    }

    return (
        <div className="p-4 mt-12 min-h-screen">
            <p className="pb-2 px-2 text-2xl font-medium text-center text-gray-900 fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">My Cart</p>
            {
                cart.loading
                    ? <Spinner />
                    :
                    (
                        cart.products.length > 0 ?
                            <>
                                <SortBy products={cart.products} setProducts={setCartProducts} />
                                <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2 mb-20  mt-[5.25rem]">
                                    {
                                        cart.products.map((product: CartProductInfo, index: number) => (
                                            <div key={product.name} className="flex flex-row flex-nowrap justify-start items-center gap-4 border-solid border-2 border-black rounded-lg p-2 w-full md:w-auto">
                                                <div className="text-center">
                                                    <img className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg" loading="lazy" src={product.image} />
                                                </div>
                                                <div className="flex justify-around items-start flex-col flex-nowrap gap-3">
                                                    <div className="w-full">
                                                        <p className="text-lg font-semibold capitalize">{product.name}</p>
                                                        <p className="text-xl font-bold">&#x20B9;{product.price}</p>
                                                    </div>

                                                    <div className="flex items-center gap-x-1.5">
                                                        <Button text="" buttonClass="p-2 text-sm" icon={<Icon type="minus" />} onClick={() => decrementQuantity(index)} isTextVisible={false} />
                                                        <input className="p-0 w-6 bg-transparent border-0 text-center focus:outline-none focus:ring-0 text-black " type="number"
                                                            min={1}
                                                            max={Math.min(product.quantityAvailable, 10)}
                                                            value={product.quantityByUser}
                                                            readOnly={true}
                                                        />
                                                        {/*onChange={(e) => onChangeOfQuantity(e, index)}*/}
                                                        <Button text="" buttonClass="p-2 text-sm" icon={<Icon type="plus" />} isTextVisible={false} onClick={() => incrementQuantity(index)} />
                                                    </div>

                                                    <div className="w-full flex flex-row justify-start flex-nowrap gap-2">
                                                        <Button isTextVisible={false} text="Delete" icon={<Icon type="delete" iconClass="h-5 w-5" />} onClick={() => { onDeleteFromCart(product.name, product.quantityByUser); }} buttonClass="text-sm p-2.5" />
                                                        <Button isTextVisible={false} disabled={product.quantityAvailable <= 0} text="Move to Wishlist" icon={<Icon type="red_heart" iconClass="h-5 w-5" />} onClick={() => { moveFromCartToWishlist(product.name, product.quantityByUser) }} buttonClass="text-sm p-2.5" />
                                                        <Button isTextVisible={true} disabled={product.quantityAvailable <= 0} text="Buy Now" onClick={() => { processBuyNow(product) }} buttonClass="hidden md:block w-auto text-md p-2" />
                                                    </div>
                                                    <Button isTextVisible={true} disabled={product.quantityAvailable <= 0} text="Buy Now" onClick={() => { processBuyNow(product) }} buttonClass="block md:hidden w-auto text-md p-2" />
                                                </div>
                                                {
                                                    product.quantityAvailable <= 0 &&
                                                    <div className="w-full flex absolute bg-[white] h-full opacity-[0.65] items-center justify-center left-0 top-0 rounded-lg">
                                                        <p className="text-xl font-bold text-red-700">Out of stock</p>
                                                    </div>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  flex flex-col  justify-between items-stretch p-2 md:h-16 md:flex-row md:items-center">
                                    <p className="text-2xl font-medium text-white">Subtotal: &#x20B9;{cart.totalAmount} </p>
                                    <button type="button" onClick={() => { processCompleteOrder() }} className="text-black bg-[#fdd35b] focus:ring-4 focus:outline-none hover:bg-yellow-300 focus:ring-yellow-200 font-medium rounded-lg text-xl p-2 text-center">
                                        Place Order
                                    </button>
                                </div>
                            </> :
                            <div className=" mt-[3.25rem]"><Message type="info" message="Your cart is empty" /></div>
                    )
            }
            {
                cart.successMessage != null && <MessageModal isSuccess={true} message={cart.successMessage} setMessage={clearSuccessMessage} />
            }
            {
                cart.errorMessage != null && <MessageModal isSuccess={false} message={cart.errorMessage} setMessage={clearErrorMessage} />
            }
            {
                showSelectAddressModal
                    ?
                    singleProduct != null ?
                        <SelectAddressModal listOfAddressInfo={address.addresses} selectAddress={selectAddress} setSelectAddress={setSelectAddress} setShowSelectAddressModal={setShowSelectAddressModal} handleProceedToCheckOut={onBuyNowFromCart} />
                        :
                        <SelectAddressModal listOfAddressInfo={address.addresses} selectAddress={selectAddress} setSelectAddress={setSelectAddress} setShowSelectAddressModal={setShowSelectAddressModal} handleProceedToCheckOut={placeOrder} />
                    : null
            }
        </div >
    )
}

export default Cart;