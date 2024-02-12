import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder } from "../../store/api/createOrder";
import { loadScript } from "../../helpers/loadRazorpayScript";
import { proceedForPayment } from "../../helpers/proceedForPayment";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchAddress } from "../../store/actions/addressActions";
import { addToOrRemoveFromWishlist, fetchWishlist } from "../../store/actions/wishlistActions";
import { addProductToCart, fetchProducts, setProductErrorMessage, setProductSuccessMessage } from "../../store/actions/productActions";
import { Address, ProductInfo, CategoryWithProductsInfo } from "../../store/interfaces";
import { Button, Icon, Message, MessageModal, SelectAddressModal } from "..";

const Products = () => {
    const { auth, wishlist, address, product } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const category: string = searchParams.get("category") ?? "nuts";
    const [quantityOfEachProduct, setQuantityOfEachProduct] = useState<any>([]);
    const [selectAddress, setSelectAddress] = useState<Address | null>(null);
    const [showSelectAddressModal, setShowSelectAddressModal] = useState<boolean>(false);
    const [singleProduct, setSingleProduct] = useState<ProductInfo | null>(null);
    const [quantityToBuyNow, setQuantityToBuyNow] = useState<number>(1);

    const getWishlistProducts = () => {
        dispatch(fetchWishlist(auth.user!.uid));
    }
    const getListOfAddressesOfUser = () => {
        dispatch(fetchAddress(auth.user!.uid));
        if (address.addresses.length > 0) {
            setSelectAddress(address.addresses[0]);
        }
    }

    useEffect(() => {
        dispatch(fetchProducts(category));
    }, [category])

    useEffect(() => {
        if (auth.user != null) {
            getWishlistProducts();
            getListOfAddressesOfUser();
        } else {
            navigate("/login");
        }
    }, [auth.user]);

    useEffect(() => {
        setQuantityOfEachProduct(Array(product.products.length).fill(1));
    }, [product.products]);
    const checkWishlist = (productName: string) => {
        return (wishlist.products.filter((product) => product.name === productName).length > 0);
    }

    const onWishlist = async (productName: string) => {
        if (auth.user != null) {
            dispatch(addToOrRemoveFromWishlist(auth.user.uid, productName, true));//logic check needed here also
        }
    }

    const onAddToCart = async (productName: string, quantity: number) => {
        if (auth.user != null) {
            dispatch(addProductToCart(auth.user.uid, productName, quantity));
        }
    }

    const incrementQuantity = (index: number) => {
        const prevQuantity = [...quantityOfEachProduct];
        if (prevQuantity[index] + 1 <= product.products[index].quantityAvailable && prevQuantity[index] < 10) {
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

    const onBuyNow = async () => {
        if (auth.user != null && singleProduct != null) {
            const categoryWithProducts: CategoryWithProductsInfo[] = [{ category: category, products: [{ name: singleProduct.name, image: singleProduct.image, quantity: quantityToBuyNow, price: singleProduct.price }] }];
            try {
                const orderID = await createOrder(auth.user!.uid, categoryWithProducts, quantityToBuyNow * singleProduct.price, selectAddress!);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(auth.user!.email, orderID).then((isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    dispatch(setProductSuccessMessage(`Your order for the product ${singleProduct.name} with a quantity of ${quantityToBuyNow} has been processed with order id ${orderID}.`));
                                }
                            })
                        } else {
                            dispatch(setProductErrorMessage("We are unable to load our payment provider"));
                        }
                    })
                }
            } catch (error) {
                dispatch(setProductErrorMessage("Unable to place order"));
            }
        }
    }

    const processBuyNow = (index: number, product: ProductInfo) => {
        if (address.addresses.length === 0) {
            dispatch(setProductErrorMessage("Please add address for delivery in your profile"));
            return;
        }
        setQuantityToBuyNow(quantityOfEachProduct[index]);
        setSingleProduct(product);
        setShowSelectAddressModal(true);
    }

    const clearErrorMessage = () => {
        dispatch(setProductErrorMessage(null));
    }

    const clearSuccessMessage = () => {
        dispatch(setProductSuccessMessage(null));
    }

    return (
        <div className="p-4 mt-14 min-h-screen">
            <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">{category}</p>
            {
                product.products.length === 0 && <p className="text-center font-semibold">No Products in this category</p>
            }
            <div className="flex flex-row flex-wrap content-center justify-center gap-4 mt-12">
                {
                    product.products.length > 0 ?
                        product.products
                            .filter((product: ProductInfo) => product.quantityAvailable > 0)
                            .map((product: ProductInfo, index: number) => {
                                return (
                                    <div key={product.name} className="max-w-xs flex flex-col justify-between items-start rounded-lg border-solid border-2 border-black  p-2">
                                        <div className='group relative z-1 '>
                                            <img className="h-[320px] w-[320px] rounded-lg text-center" loading="lazy" src={product.image} />
                                            <button onClick={() => { onWishlist(product.name) }} className="hidden group-hover:block absolute -translate-x-1/4 -translate-y-1/4 right-0 top-4" >
                                                {checkWishlist(product.name) ? <Icon type="red_heart" iconClass="w-8 h-8 text-red-500" /> : <Icon type="heart_outline" iconClass="w-8 h-8" />}
                                            </button>
                                        </div>
                                        <p className="text-lg capitalize font-semibold pt-1">{product.name}</p>
                                        <p className="text-xl font-bold  py-1">&#x20B9;{product.price}</p>
                                        {
                                            product.quantityAvailable < 10 && <p className="text-sm font-bold text-red-600 ">Only {product.quantityAvailable} left in stock</p>
                                        }
                                        <div className="py-2" data-hs-input-number>
                                            <div className="flex items-center gap-x-1.5">
                                                <Button text="" buttonClass="p-2 text-sm" icon={<Icon type="minus" />} onClick={() => decrementQuantity(index)} isTextVisible={false} />
                                                <input className="p-0 w-6 bg-transparent border-0 text-center focus:outline-none focus:ring-0 text-black " type="number"
                                                    min={1}
                                                    max={Math.min(product.quantityAvailable, 10)}
                                                    value={quantityOfEachProduct[index]}
                                                    readOnly={true}
                                                />
                                                {/*onChange={(e) => onChangeOfQuantity(e, index)}*/}
                                                <Button text="" buttonClass="p-2 text-sm" icon={<Icon type="plus" />} isTextVisible={false} onClick={() => incrementQuantity(index)} />
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center items-stretch w-full">
                                            <Button text="Add to cart" buttonClass={"w-1/2 text-md p-2 mr-2"} isTextVisible={true} onClick={() => onAddToCart(product.name, quantityOfEachProduct[index])} />
                                            <Button text="Buy now" buttonClass={"w-1/2 text-md p-2"} isTextVisible={true} onClick={() => processBuyNow(index, product)} />
                                        </div>
                                    </div>
                                );
                            }
                            ) : <div className="mt-[3.25rem]">
                            <Message type="info" message="No products found" />
                        </div>
                }
            </div>
            {
                product.successMessage != null && <MessageModal isSuccess={true} message={product.successMessage} setMessage={clearSuccessMessage} />
            }
            {
                product.errorMessage != null && <MessageModal isSuccess={false} message={product.errorMessage} setMessage={clearErrorMessage} />
            }
            {
                showSelectAddressModal && <SelectAddressModal listOfAddressInfo={address.addresses} selectAddress={selectAddress} setSelectAddress={setSelectAddress} setShowSelectAddressModal={setShowSelectAddressModal} handleProceedToCheckOut={onBuyNow} />
            }
        </div>
    );
}

export default Products;