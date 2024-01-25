import { MouseEvent, SetStateAction, useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { getCartOfUser } from "./helpers/getCartOfUser";
import { removeProductFromCartOfUser } from "./helpers/removeProductFromCartOfUser";
import { addOrRemoveProductToWishListOfUser } from "../products/helpers/addOrRemoveProductToWishListOfUser";
import SortBy from "../sortBy/sortBy";
import { addProductToCartOfUser } from "../products/helpers/addProductToCartOfUser";
import { loadScript } from "./helpers/loadRazorpayScript";
import { proceedForPayment } from "./helpers/proceedForPayment.js";
import { categoryWithProductsInfo, createOrder } from "./helpers/createOrder";
import MessageModal from "../MessageModal";
import { clearCartOfUser } from "./helpers/clearCartOfUser";
import Spinner from "../Spinner";
import Message from "../Message";
import { addressCard } from "../address/address";
import { getAddressesOfUser } from "../address/helpers/getAddressesOfUser";
import SelectAddressModal from "./selectAddressModal";
import Button from "../Button";
import Icon from "../Icon";

interface CartProductInfo {
    name: string;
    image: string;
    quantityAvailable: number;
    quantityByUser: number;
    price: number;
    category: string;
}

const Cart = () => {
    const { user } = useUserAuth();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [cartProducts, setCartProducts] = useState<CartProductInfo[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectAddress, setSelectAddress] = useState<addressCard | null>(null);
    const [listOfAddressInfo, setListOfAddressInfo] = useState<addressCard[]>([]);
    const [showSelectAddressModal, setShowSelectAddressModal] = useState<boolean>(false);
    const [singleProduct, setSingleProduct] = useState<CartProductInfo | null>(null);

    const getCartProducts = async () => {
        let totalAmountCalculated = 0;
        try {
            const data = await getCartOfUser(user!.uid);
            const updatedData = await Promise.all(
                data.map(async (product: CartProductInfo, index: number) => {
                    let updatedProduct = { ...product };
                    if (product.quantityByUser > product.quantityAvailable) {
                        await removeProductFromCartOfUser(
                            user!.uid,
                            product.name,
                            product.quantityByUser
                        );
                        await addProductToCartOfUser(
                            user!.uid,
                            product.name,
                            product.quantityAvailable
                        );
                        updatedProduct.quantityByUser = product.quantityAvailable;
                        totalAmountCalculated +=
                            product.price * product.quantityAvailable;
                    } else {
                        totalAmountCalculated +=
                            product.price * product.quantityByUser;
                    }
                    return updatedProduct;
                })
            );

            setCartProducts(updatedData);
            setTotalAmount(totalAmountCalculated);
            setLoading(false);
        } catch (error) {
            setErrorMessage(`Unable to get cart products`);
        }
    };

    useEffect(() => {
        if (user != null) {
            getCartProducts();
            getListOfAddressesOfUser();
        }
    }, [user]);

    const getListOfAddressesOfUser = () => {
        getAddressesOfUser(user!.uid).then((data) => {
            const defaultAddr = data.find((address: addressCard) => address.isDefault === true);
            const updatedList = data.filter((address: addressCard) => address !== defaultAddr);
            if (defaultAddr) {
                updatedList.unshift(defaultAddr);
            }
            setListOfAddressInfo(updatedList);
            if (updatedList.length > 0) {
                setSelectAddress(updatedList[0]);
            }
        });
    }

    const onDeleteFromCart = async (productName: string, quantityByUser: number) => {
        if (user != null) {
            try {
                await removeProductFromCartOfUser(user!.uid, productName, quantityByUser);
                await getCartProducts();
                setSuccessMessage(`${productName} removed from cart successfully`);
            } catch (error) {
                setErrorMessage(`Unable to remove ${productName} from cart`);
            }
        }
    }

    const moveFromCartToWishlist = async (productName: string, quantityByUser: number) => {
        if (user != null) {
            try {
                await removeProductFromCartOfUser(user!.uid, productName, quantityByUser);
                await addOrRemoveProductToWishListOfUser(user!.uid, productName);
                await getCartProducts();
                setSuccessMessage(`${productName} moved to wishlist successfully`);
            } catch (error) {
                setErrorMessage(`Unable to move ${productName} to wishlist`);
            }
        }
    }

    const incrementQuantity = async (index: number) => {
        try {
            const productQuantity = cartProducts[index].quantityByUser;
            if (productQuantity < cartProducts[index].quantityAvailable && productQuantity < 10) {
                await removeProductFromCartOfUser(user!.uid, cartProducts[index].name, productQuantity);
                const updatedCartProducts = [...cartProducts];
                updatedCartProducts[index].quantityByUser = updatedCartProducts[index].quantityByUser + 1;
                await addProductToCartOfUser(user!.uid, cartProducts[index].name, updatedCartProducts[index].quantityByUser);
                setCartProducts(updatedCartProducts);
                setTotalAmount(totalAmount + cartProducts[index].price);
            } else {
                setErrorMessage(`Maximum quantity of ${cartProducts[index].name} is ${cartProducts[index].quantityAvailable}. You can order only maximum 10 quantity for each product at a time.`);
            }
        } catch (error) {
            setErrorMessage(`Unable to increase quantity of ${cartProducts[index].name}`);
        }
    }

    const decrementQuantity = async (index: number) => {
        try {
            const productQuantity = cartProducts[index].quantityByUser;
            if (productQuantity > 1) {
                await removeProductFromCartOfUser(user!.uid, cartProducts[index].name, productQuantity);
                const updatedCartProducts = [...cartProducts];
                updatedCartProducts[index].quantityByUser = updatedCartProducts[index].quantityByUser - 1;
                await addProductToCartOfUser(user!.uid, cartProducts[index].name, updatedCartProducts[index].quantityByUser);
                setCartProducts(updatedCartProducts);
                setTotalAmount(totalAmount - cartProducts[index].price);
            } else {
                setErrorMessage(`Minimum quantity for any product in cart is 1.`);
            }
        } catch (error) {
            setErrorMessage(`Unable to decrese quantity of ${cartProducts[index].name}`);
        }
    }

    // const onChangeOfQuantity = async (event: any, index: number) => {
    //     try {
    //         const productQuantity = cartProducts[index].quantityByUser;
    //         const newproductQuantity = Number(event.target.value);
    //         console.log(productQuantity, newproductQuantity);
    //         if (newproductQuantity >= 1 && newproductQuantity <= cartProducts[index].quantityAvailable && newproductQuantity <= 10) {
    //             await removeProductFromCartOfUser(user!.uid, cartProducts[index].name, productQuantity);
    //             const updatedCartProducts = [...cartProducts];
    //             updatedCartProducts[index].quantityByUser = newproductQuantity;
    //             await addProductToCartOfUser(user!.uid, cartProducts[index].name, updatedCartProducts[index].quantityByUser);
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
        if (user != null) {
            const categoryWithProducts: categoryWithProductsInfo[] = cartProducts.reduce((acc: categoryWithProductsInfo[], product: CartProductInfo) => {
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
                const orderID = await createOrder(user!.uid, categoryWithProducts, totalAmount, selectAddress!);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(user.email, orderID).then(async (isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    await clearCartOfUser(user!.uid);
                                    await getCartProducts();
                                    setSuccessMessage(`Your order has been processed with order id ${orderID}.`);
                                }
                            });
                        } else {
                            setErrorMessage("We are unable to load our payment provider");
                        }
                    })
                }
            } catch (error) {
                setErrorMessage("Unable to place order");
            }

        }
    }

    const onBuyNowFromCart = async () => {
        if (user != null && singleProduct != null) {
            const categoryWithProducts: categoryWithProductsInfo[] = [{ category: singleProduct.category, products: [{ name: singleProduct.name, image: singleProduct.image, quantity: singleProduct.quantityByUser, price: singleProduct.price }] }];
            try {
                const orderID = await createOrder(user!.uid, categoryWithProducts, singleProduct.quantityByUser * singleProduct.price, selectAddress!);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(user.email, orderID).then(async (isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    await removeProductFromCartOfUser(user!.uid, singleProduct.name, singleProduct.quantityByUser);
                                    await getCartProducts();
                                    setSuccessMessage(`Your order for the product ${singleProduct.name} with a quantity of ${singleProduct.quantityByUser} has been processed with order id ${orderID}.`);
                                }
                            });
                        } else {
                            setErrorMessage("We are unable to load our payment provider");
                        }
                    })
                }
            } catch (error) {
                setErrorMessage("Unable to place order");
            } finally {
                setSingleProduct(null);
            }

        }
    }

    const processBuyNow = (product: CartProductInfo) => {
        if (listOfAddressInfo.length === 0) {
            setErrorMessage("Please add address for delivery in your profile.");
            return;
        }
        setSingleProduct(product);
        setShowSelectAddressModal(true);
    }

    const processCompleteOrder = () => {
        if (listOfAddressInfo.length === 0) {
            setErrorMessage("Please add address for delivery in your profile.");
            return;
        }
        setShowSelectAddressModal(true);
    }

    return (
        <div className="p-4 mt-12 min-h-screen">
            <p className="pb-2 px-2 text-2xl font-medium text-center text-gray-900 fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">My Cart</p>
            {
                isLoading
                    ? <Spinner />
                    :
                    (
                        cartProducts.length > 0 ?
                            <>
                                <SortBy products={cartProducts} setProducts={setCartProducts} />
                                <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2 mb-20  mt-[5.25rem]">
                                    {
                                        cartProducts.map((product: CartProductInfo, index: number) => (
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
                                                        <Button isTextVisible={false} text="Delete" icon={<Icon type="delete" iconClass="h-5 w-5"/>} onClick={() => { onDeleteFromCart(product.name, product.quantityByUser); } } buttonClass="text-sm p-2.5" />
                                                       <Button isTextVisible={false} disabled={product.quantityAvailable <= 0} text="Move to Wishlist" icon={<Icon type="red_heart" iconClass="h-5 w-5" />} onClick={() => { moveFromCartToWishlist(product.name, product.quantityByUser) }} buttonClass="text-sm p-2.5" />
                                                       <Button isTextVisible={true} disabled={product.quantityAvailable <= 0} text="Buy Now"  onClick={() => { processBuyNow(product) }} buttonClass="hidden md:block w-auto text-md p-2" />
                                                    </div>
                                                    <Button isTextVisible={true} disabled={product.quantityAvailable <= 0} text="Buy Now"  onClick={() => { processBuyNow(product) }} buttonClass="block md:hidden w-auto text-md p-2" />
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
                                    <p className="text-2xl font-medium text-white">Subtotal: &#x20B9;{totalAmount} </p>
                                    <button type="button" onClick={() => { processCompleteOrder() }} className="text-black bg-[#fdd35b] focus:ring-4 focus:outline-none hover:bg-yellow-300 focus:ring-yellow-200 font-medium rounded-lg text-xl p-2 text-center">
                                        Place Order
                                    </button>
                                </div>
                            </> :
                            <div className=" mt-[3.25rem]"><Message type="info" message="Your cart is empty" /></div>
                    )
            }
            {
                successMessage != null && <MessageModal isSuccess={true} message={successMessage} setMessage={setSuccessMessage} />
            }
            {
                errorMessage != null && <MessageModal isSuccess={false} message={errorMessage} setMessage={setErrorMessage} />
            }
            {
                showSelectAddressModal
                    ?
                    singleProduct != null ?
                        <SelectAddressModal listOfAddressInfo={listOfAddressInfo} selectAddress={selectAddress} setSelectAddress={setSelectAddress} setShowSelectAddressModal={setShowSelectAddressModal} handleProceedToCheckOut={onBuyNowFromCart} />
                        :
                        <SelectAddressModal listOfAddressInfo={listOfAddressInfo} selectAddress={selectAddress} setSelectAddress={setSelectAddress} setShowSelectAddressModal={setShowSelectAddressModal} handleProceedToCheckOut={placeOrder} />
                    : null
            }
        </div >
    )
}

export default Cart;