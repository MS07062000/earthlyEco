import { useLocation } from "react-router-dom";
import { addOrRemoveProductToWishListOfUser } from "./helpers/addOrRemoveProductToWishListOfUser";
import { useUserAuth } from "../../context/AuthContext";
import { getWishlistProductOfUser } from "./helpers/getWishlistProductOfUser";
import { useEffect, useState } from "react";
import { addProductToCartOfUser } from "./helpers/addProductToCartOfUser";
import ErrorModal from "../ErrorModal";
import SuccessModal from "../SuccessModal";
import { categoryWithProductsInfo, createOrder } from "../cart/helpers/createOrder";
import { loadScript } from "../cart/helpers/loadRazorpayScript";
import { proceedForPayment } from "../cart/helpers/proceedForPayment";

interface ProductInfo {
    name: string;
    image: string;
    quantityAvailable: number;
    price: number;
}
const Products = () => {
    const { user } = useUserAuth();
    const location = useLocation();
    const category: string = location.state?.category;
    const products: ProductInfo[] = location.state?.products;
    const [wishlistProducts, setWishlistProducts] = useState<String[]>([]);
    const [quantityOfEachProduct, setQuantityOfEachProduct] = useState(Array(products.length).fill(1));
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const getWishlistProducts = () => {
        getWishlistProductOfUser(user!.uid).then((data) => {
            setWishlistProducts(data);
        });
    }
    useEffect(() => {
        if (user != null) {
            getWishlistProducts();
        }
    }, [user]);

    const checkWishlist = (productName: string) => {
        return (wishlistProducts.includes(productName));
    }

    const onWishlist = async (productName: string) => {
        if (user != null) {
            await addOrRemoveProductToWishListOfUser(user!.uid, productName);
            getWishlistProducts();
        }
    }

    const onAddToCart = async (productName: string, quantity: number) => {
        if (user != null) {
            try {
                await addProductToCartOfUser(user!.uid, productName, quantity);
                setSuccessMessage(`${productName} added to cart successfully`);
            } catch (error) {
                setErrorMessage(`Unable to add ${productName} to cart`)
            }
        }
    }

    const incrementQuantity = (index: number) => {
        const prevQuantity = [...quantityOfEachProduct];
        if (prevQuantity[index] + 1 <= products[index].quantityAvailable && prevQuantity[index] < 10) {
            prevQuantity[index] = prevQuantity[index] + 1;
            setQuantityOfEachProduct(prevQuantity);
        }
    }

    const decrementQuantity = (index: number) => {
        const prevQuantity = [...quantityOfEachProduct];
        if (prevQuantity[index] + 1 > 1) {
            prevQuantity[index] = prevQuantity[index] - 1;
            setQuantityOfEachProduct(prevQuantity);
        }
    }

    // const onChangeOfQuantity = (event: any, index: number) => {
    //     const prevQuantity = [...quantityOfEachProduct];
    //     const newQuantity = Number(event.target.value);
    //     if (newQuantity <= products[index].quantityAvailable) {
    //         prevQuantity[index] = newQuantity;
    //         setQuantityOfEachProduct(prevQuantity);
    //     }
    // }

    const onBuyNow = async (index: number, product: ProductInfo) => {
        if (user != null) {
            const categoryWithProducts: categoryWithProductsInfo[] = [{ category: category, products: [{ name: product.name, image: product.image, quantity: quantityOfEachProduct[index], price: product.price }] }];
            try {
                const orderID = await createOrder(user!.uid, categoryWithProducts, quantityOfEachProduct[index] * product.price);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(orderID).then((isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    setSuccessMessage(`Your order for the product ${product.name} with a quantity of ${quantityOfEachProduct[index]} has been processed with order id ${orderID}.`);
                                }
                            })
                        }else{
                            setErrorMessage("We are unable to load our payment provider");
                        }
                    })
                }
            } catch (error) {
                setErrorMessage("Unable to place order");
            }

        }
    }

    return (
        <div className="p-4 mt-14 min-h-screen">
            <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">{category}</p>
            {
                products.length === 0 && <p className="text-center font-semibold">No Products in this category</p>
            }
            <div className="flex flex-row flex-wrap content-center justify-center gap-4 mt-12">
                {
                    products.length > 0 &&
                    products
                        .filter((product: ProductInfo) => product.quantityAvailable > 0) // Filter out products with quantityAvailable === 0 
                        .map((product: ProductInfo, index: number) => {
                            return (
                                <div key={product.name} className="max-w-xs flex flex-col justify-between items-start rounded-lg border-solid border-2 border-black  p-2">
                                    <div className='group relative z-1 '>
                                        <img className="h-[320px] w-[320px] rounded-lg text-center" loading="lazy" src={product.image} />
                                        {
                                            checkWishlist(product.name) ?
                                                <svg onClick={() => { onWishlist(product.name) }} className='hidden group-hover:block absolute -translate-x-1/4 -translate-y-1/4 right-0 top-4' xmlns="http://www.w3.org/2000/svg" height="2em" width="2em" viewBox="0 0 512 512"><path fill="#ff0000" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                                                :
                                                <svg onClick={() => { onWishlist(product.name) }} className='hidden group-hover:block absolute -translate-x-1/4 -translate-y-1/4 right-0 top-4' xmlns="http://www.w3.org/2000/svg" height="2em" width="2em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" /></svg>
                                        }
                                    </div>
                                    <p className="text-lg capitalize font-semibold pt-1">{product.name}</p>
                                    <p className="text-xl font-bold  py-1">&#x20B9;{product.price}</p>
                                    {
                                        product.quantityAvailable < 10 && <p className="text-sm font-bold text-red-600 ">Only {product.quantityAvailable} left in stock</p>
                                    }
                                    <div className="py-2" data-hs-input-number>
                                        <div className="flex items-center gap-x-1.5">
                                            <button
                                                type="button"
                                                onClick={() => decrementQuantity(index)}
                                                className="p-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                            </button>
                                            <input className="p-0 w-6 bg-transparent border-0 text-center focus:outline-none focus:ring-0 text-black " type="number"
                                                min={1}
                                                max={Math.min(product.quantityAvailable, 10)}
                                                value={quantityOfEachProduct[index]}
                                                readOnly={true}
                                            />
                                            {/*onChange={(e) => onChangeOfQuantity(e, index)}*/}
                                            <button
                                                type="button"
                                                onClick={() => incrementQuantity(index)}
                                                className="p-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-center items-stretch w-full">
                                        <button onClick={() => onAddToCart(product.name, quantityOfEachProduct[index])}
                                            className="w-1/2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md p-2 text-center mr-2">Add to cart</button>
                                        <button onClick={() => { onBuyNow(index, product) }}
                                            className="w-1/2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-md p-2 text-center">Buy now</button>
                                    </div>
                                </div>

                            );
                        }
                        )
                }
            </div>
            {
                successMessage != null && <SuccessModal successMessage={successMessage} setSuccessMessage={setSuccessMessage} />
            }
            {
                errorMessage != null && <ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            }
        </div>
    );
}

export default Products;