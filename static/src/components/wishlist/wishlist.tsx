import { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { getUserWishlistWithProductDetails } from "./helpers/getUserWishlistWithProductDetails";
import { addOrRemoveProductToWishListOfUser } from "../products/helpers/addOrRemoveProductToWishListOfUser";
import { addProductToCartOfUser } from "../products/helpers/addProductToCartOfUser";
import SortBy from "../sortBy/sortBy";
import MessageModal from "../MessageModal";
import Spinner from "../Spinner";
import Message from "../Message";
import Button from "../Button";
import Icon from "../Icon";

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
            setLoading(false);
            setErrorMessage("Error in getting wishlist products");
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
                                                <Button isTextVisible={false} text="Delete" icon={<Icon type="delete" iconClass="h-5 w-5"/>} onClick={() => { onDeleteFromWishlist(product.name); } } buttonClass="text-sm p-2.5" />
                                                <Button isTextVisible={false} disabled={product.quantityAvailable <= 0} text="Add To Cart" icon={<Icon type="add_to_cart" iconClass="h-5 w-5"/>} onClick={() => { moveToCartFromWishlist(product.name); } } buttonClass="text-sm p-2.5" /> 
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
                        </> :<div className="mt-[3.25rem]"><Message type="info" message="Your wishlist is empty"/></div>
                    )
            }
            {
                successMessage != null && <MessageModal isSuccess={true} message={successMessage} setMessage={setSuccessMessage} />
            }
            {
                errorMessage != null && <MessageModal isSuccess={false} message={errorMessage} setMessage={setErrorMessage} />
            }
        </div>
    )
}

export default Wishlist;