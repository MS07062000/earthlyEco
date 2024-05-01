import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToOrRemoveFromWishlist, fetchWishlist, moveToCartFromWishlist, setWishlistSuccessMessage, setWishlistErrorMessage, setWishlistProducts } from "../../store/actions/wishlistActions";
import { ProductInfo } from "../../store/interfaces";
import { Button, Icon, Message, MessageModal, SortBy, Spinner } from "..";
import { memoizedWishlistSelectors } from "../../store/selectors";


const Wishlist = () => {
    const { auth, wishlist } = useAppSelector(memoizedWishlistSelectors);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.user != null) {
            dispatch(fetchWishlist());
        } else {
            navigate("/signIn");
        }
    }, [auth.user]);

    const deleteFromWishlist = async (productName: string) => {
        if (auth.user != null) {
            dispatch(addToOrRemoveFromWishlist(productName, false, true));
        }
    }

    const moveToCart = async (productName: string) => {
        if (auth.user != null) {
            dispatch(moveToCartFromWishlist(productName));
        }
    }

    const clearSuccessMessage = () => {
        dispatch(setWishlistSuccessMessage(null));
    }

    const clearErrorMessage = () => {
        dispatch(setWishlistErrorMessage(null));
    }

    const setProducts = (products: ProductInfo[]) => {
        dispatch(setWishlistProducts(products));
    }

    return (
        <div className="p-4 mt-12 min-h-screen">
            <p className="pb-2 px-2 text-2xl text-center font-medium fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">My Wishlist</p>
            {
                wishlist.loading
                    ? <Spinner />
                    :
                    (
                        wishlist.products.length > 0 ?
                            <>
                                <SortBy products={wishlist.products} setProducts={setProducts} />
                                <div className="w-full h-auto flex flex-row flex-wrap justify-start items-start gap-4 py-2 mt-[5.25rem] ">
                                    {
                                        wishlist.products.map((product: ProductInfo) => (
                                            <div key={product.name} className="w-full md:w-auto flex flex-row flex-nowrap justify-start items-center gap-3 border-solid border-2 rounded-lg border-black p-2 relative">
                                                <div className="text-center">
                                                    <img className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg" loading="lazy" src={product.image} />
                                                </div>
                                                <div className="flex justify-around items-center flex-col flex-nowrap gap-3">
                                                    <div className="w-full">
                                                        <p className="text-lg font-semibold capitalize">{product.name}</p>
                                                        <p className="text-xl font-bold py-1">&#x20B9;{product.price}</p>
                                                    </div>
                                                    <div className="w-full flex flex-row justify-start flex-nowrap gap-2">
                                                        <Button id={`deleteFromWishlist-${product.name}`} isTextVisible={false} text="Delete" icon={<Icon type="delete" iconClass="h-5 w-5" />} onClick={() => { deleteFromWishlist(product.name); }} buttonClass="text-sm p-2.5" />
                                                        <Button id={`moveToCart-${product.name}`} isTextVisible={false} disabled={product.quantityAvailable <= 0} text="Add To Cart" icon={<Icon type="add_to_cart" iconClass="h-5 w-5" />} onClick={() => { moveToCart(product.name); }} buttonClass="text-sm p-2.5" />
                                                    </div>
                                                </div>
                                                {
                                                    product.quantityAvailable <= 0 &&
                                                    <div id={`outOfStock-${product.name}`} className="w-full flex absolute bg-[white] h-full opacity-[0.65] items-center justify-center left-0 top-0 rounded-lg">
                                                        <p className="text-xl font-bold text-red-700">Out of stock</p>
                                                    </div>
                                                }

                                            </div>
                                        ))
                                    }
                                </div>
                            </> : <div className="mt-[3.25rem]"><Message type="info" message="Your wishlist is empty" /></div>
                    )
            }
            {
                wishlist.successMessage != null && <MessageModal isSuccess={true} message={wishlist.successMessage} setMessage={clearSuccessMessage} />
            }
            {
                wishlist.errorMessage != null && <MessageModal isSuccess={false} message={wishlist.errorMessage} setMessage={clearErrorMessage} />
            }
        </div>
    )
}

export default Wishlist;