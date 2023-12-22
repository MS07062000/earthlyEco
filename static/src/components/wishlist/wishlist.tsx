import { SetStateAction, useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { getUserWishlistWithProductDetails } from "./helpers/getUserWishlistWithProductDetails";
import { addOrRemoveProductToWishListOfUser } from "../products/helpers/addOrRemoveProductToWishListOfUser";
import { addProductToCartOfUser } from "../products/helpers/addProductToCartOfUser";
import SortBy from "../sortBy/sortBy";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import Spinner from "../Spinner";
import InfoMessage from "../InfoMessage";

interface ProductInfo {
    name: string;
    image: string;
    quantityAvailable: number;
    price: number;
}

const Wishlist = () => {
    const { user } = useUserAuth();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [wishlistProducts, setWishlistProducts] = useState<ProductInfo[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const getWishlistProducts = () => {
        getUserWishlistWithProductDetails(user!.uid).then((data) => {
            setWishlistProducts(data);
            setLoading(false);
        }).catch((error) => {
            setErrorMessage(error.message);
            setLoading(false);
        })
    }

    useEffect(() => {
        if (user != null) {
            console.log(user.uid);
            getWishlistProducts();
        }
    }, [user]);

    const onDeleteFromWishlist = async (productName: string) => {
        if (user != null) {
            try {
                await addOrRemoveProductToWishListOfUser(user!.uid, productName);
                getWishlistProducts();
                setSuccessMessage(`${productName} removed from wishlist successfully`);
            } catch (error) {
                setErrorMessage(`Unable to remove ${productName} from wishlist`);
            }

        }
    }

    const moveToCartFromWishlist = async (productName: string) => {
        if (user != null) {
            try {
                await addProductToCartOfUser(user!.uid, productName, 1);
                await addOrRemoveProductToWishListOfUser(user!.uid, productName);
                getWishlistProducts();
                setSuccessMessage(`${productName} moved to cart successfully`);
            } catch (error) {
                setErrorMessage(`Unable to move ${productName} to cart`);
            }
        }
    }
    return (
        <div className="p-4 mt-12 min-h-screen">
            <p className="pb-2 px-2 text-2xl text-center font-medium fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">My Wishlist</p>
            {
                isLoading
                    ? <Spinner />
                    :
                    (
                        wishlistProducts.length > 0 ?
                        <>
                            <SortBy products={wishlistProducts} setProducts={setWishlistProducts} />
                            <div className="w-full h-auto flex flex-row flex-wrap justify-start items-start gap-4 py-2 mt-[5.25rem] ">
                                {
                                    wishlistProducts.map((product: ProductInfo) => (
                                        <div key={product.name} className="w-full md:w-auto flex flex-row flex-nowrap justify-start items-center gap-3 border-solid border-2 rounded-lg border-black p-2 relative">
                                            <div className="text-center">
                                                <img className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg" loading="lazy" src={product.image}  />
                                            </div>
                                            <div className="flex justify-around items-center flex-col flex-nowrap gap-3">
                                                <div className="w-full">
                                                    <p className="text-lg font-semibold capitalize">{product.name}</p>
                                                    <p className="text-xl font-bold py-1">&#x20B9;{product.price}</p>
                                                </div>
                                                <div className="w-full flex flex-row justify-start flex-nowrap gap-2">
                                                    <button onClick={() => { onDeleteFromWishlist(product.name) }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm p-2.5 text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" fill="currentColor" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
                                                    </button>
                                                    <button disabled={product.quantityAvailable <= 0} onClick={() => { moveToCartFromWishlist(product.name) }} className=" text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" fill="currentColor" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" /></svg>
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
                        </> :<div className="mt-[3.25rem]"><InfoMessage infoMessage="Your wishlist is empty"/></div>
                    )
            }
            {
                successMessage != null && <SuccessModal successMessage={successMessage} setSuccessMessage={setSuccessMessage} />
            }
            {
                errorMessage != null && <ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            }
        </div>
    )
}

export default Wishlist;