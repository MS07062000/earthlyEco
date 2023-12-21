import { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { getCartOfUser } from "./helpers/getCartOfUser";
import { removeProductFromCartOfUser } from "./helpers/removeProductFromCartOfUser";
import { addOrRemoveProductToWishListOfUser } from "../products/helpers/addOrRemoveProductToWishListOfUser";
import SortBy from "../sortBy/sortBy";
import SuccessMessage from "../SuccessMessage";
import ErrorMessage from "../ErrorMessage";
import { addProductToCartOfUser } from "../products/helpers/addProductToCartOfUser";
import { loadScript } from "./helpers/loadRazorpayScript";
import { proceedForPayment } from "./helpers/proceedForPayment";
import { categoryWithProductsInfo, createOrder } from "./helpers/createOrder";

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
    const [cartProducts, setCartProducts] = useState<CartProductInfo[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const getCartProducts = async () => {
        let totalAmountCalculated = 0;
        try {
            getCartOfUser(user!.uid).then((data) => {
                data.forEach(async (product: CartProductInfo, index: number) => {
                    if (product.quantityByUser > product.quantityAvailable) {
                        await removeProductFromCartOfUser(user!.uid, product.name, product.quantityByUser);
                        await addProductToCartOfUser(user!.uid, product.name, product.quantityAvailable);
                        data[index].quantityByUser = product.quantityAvailable;
                        totalAmountCalculated = totalAmountCalculated + (product.price * product.quantityAvailable);
                    } else {
                        totalAmountCalculated = totalAmountCalculated + (product.price * product.quantityByUser);
                    }

                });
                setCartProducts(data);
                setTotalAmount(totalAmountCalculated);
            });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user != null) {
            getCartProducts();
        }
    }, [user]);

    const onDeleteFromCart = async (productName: string, quantityByUser: number) => {
        if (user != null) {
            try {
                await removeProductFromCartOfUser(user!.uid, productName, quantityByUser);
                getCartProducts();
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
                getCartProducts();
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
                if(product.quantityAvailable === 0){
                    return acc;
                }

                const existingCategoryIndex = acc.findIndex((item) => item.category === product.category);

                if (existingCategoryIndex !== -1) {
                    acc[existingCategoryIndex].products.push({
                        name: product.name,
                        image: product.image,
                        quantity: product.quantityByUser,
                    });
                } else {
                    acc.push({
                        category: product.category,
                        products: [{
                            name: product.name,
                            image: product.image,
                            quantity: product.quantityByUser,
                        }],
                    });
                }

                return acc;
            }, []);

            try {
                const orderResponse = await createOrder(user!.uid, categoryWithProducts);
                if (orderResponse) {
                    loadScript().then(() => {
                        proceedForPayment(orderResponse.id);
                    })
                }
            } catch (error) {
                setErrorMessage("Unable to place order");
            }

        }
    }



    return (
        <div className="p-4 mt-12 min-h-screen">
            <p className="pb-2 px-2 text-2xl font-medium text-center text-gray-900">My Cart</p>
            {
                cartProducts.length > 0 &&
                <>
                    <SortBy products={cartProducts} setProducts={setCartProducts} />
                    <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2">
                        {
                            cartProducts.map((product: CartProductInfo, index: number) => (
                                <div key={product.name} className="w-full max-w-xs flex flex-row flex-nowrap justify-start items-center gap-4 border-solid border-2 border-black rounded-lg p-2">
                                    <div className="text-center">
                                        <img className="w-[6.5rem] h-[6.5rem] rounded-lg" src={product.image} />
                                    </div>
                                    <div className="flex justify-around items-start flex-col flex-nowrap gap-3">
                                        <div className="w-full">
                                            <p className="text-lg font-semibold capitalize">{product.name}</p>
                                            <p className="text-xl font-bold">&#x20B9;{product.price}</p>
                                        </div>

                                        <div className="flex items-center gap-x-1.5">
                                            <button
                                                type="button"
                                                onClick={() => decrementQuantity(index)}
                                                className="p-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                            </button>
                                            <input className="p-0 w-6 bg-transparent border-0 text-center focus:outline-none focus:ring-0 text-black " type="number"
                                                min={1}
                                                max={Math.min(product.quantityByUser, 10)}
                                                value={product.quantityByUser}
                                                disabled
                                            />
                                            {/*onChange={(e) => onChangeOfQuantity(e, index)*/}
                                            <button
                                                type="button"
                                                onClick={() => incrementQuantity(index)}
                                                className="p-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                                            </button>
                                        </div>

                                        <div className="w-full flex flex-row justify-start flex-nowrap gap-2">
                                            <button onClick={() => { onDeleteFromCart(product.name, product.quantityByUser) }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" fill="currentColor" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
                                            </button>
                                            <button disabled={product.quantityAvailable <= 0} onClick={() => { moveFromCartToWishlist(product.name, product.quantityByUser) }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 512 512" fill="currentColor"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                                            </button>
                                        </div>
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
                    <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-black text-white flex flex-col  justify-between items-stretch p-2 md:h-16 md:flex-row md:items-center">
                        <p className="text-2xl font-medium">Subtotal: &#x20B9;{totalAmount} </p>
                        <button type="button" onClick={() => { placeOrder() }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl p-2 text-center">
                            Place Order
                        </button>
                    </div>
                </>
            }
            {
                successMessage != null && <SuccessMessage successMessage={successMessage} />
            }
            {
                errorMessage != null && <ErrorMessage errorMessage={errorMessage} />
            }
        </div >
    )
}

export default Cart;