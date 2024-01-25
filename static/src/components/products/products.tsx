import { useLocation } from "react-router-dom";
import { addOrRemoveProductToWishListOfUser } from "./helpers/addOrRemoveProductToWishListOfUser";
import { useUserAuth } from "../../context/AuthContext";
import { getWishlistProductOfUser } from "./helpers/getWishlistProductOfUser";
import { useEffect, useState } from "react";
import { addProductToCartOfUser } from "./helpers/addProductToCartOfUser";
import MessageModal from "../MessageModal";
import { categoryWithProductsInfo, createOrder } from "../cart/helpers/createOrder";
import { loadScript } from "../cart/helpers/loadRazorpayScript";
import { proceedForPayment } from "../cart/helpers/proceedForPayment";
import Message from "../Message";
import { addressCard } from "../address/address";
import { getAddressesOfUser } from "../address/helpers/getAddressesOfUser";
import SelectAddressModal from "../cart/selectAddressModal";
import Icon from "../Icon";
import Button from "../Button";

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
    const [selectAddress, setSelectAddress] = useState<addressCard | null>(null);
    const [listOfAddressInfo, setListOfAddressInfo] = useState<addressCard[]>([]);
    const [showSelectAddressModal, setShowSelectAddressModal] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [singleProduct, setSingleProduct] = useState<ProductInfo | null>(null);
    const [quantityToBuyNow, setQuantityToBuyNow] = useState<number>(1);

    const getWishlistProducts = () => {
        getWishlistProductOfUser(user!.uid).then((data) => {
            setWishlistProducts(data);
        });
    }
    useEffect(() => {
        if (user != null) {
            getWishlistProducts();
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

    const onBuyNow = async () => {
        if (user != null && singleProduct != null) {
            const categoryWithProducts: categoryWithProductsInfo[] = [{ category: category, products: [{ name: singleProduct.name, image: singleProduct.image, quantity: quantityToBuyNow, price: singleProduct.price }] }];
            try {
                const orderID = await createOrder(user!.uid, categoryWithProducts, quantityToBuyNow * singleProduct.price, selectAddress!);
                if (orderID) {
                    loadScript().then((isScriptLoaded) => {
                        if (isScriptLoaded) {
                            proceedForPayment(user.email, orderID).then((isPaymentSuccess) => {
                                if (isPaymentSuccess) {
                                    setSuccessMessage(`Your order for the product ${singleProduct.name} with a quantity of ${quantityToBuyNow} has been processed with order id ${orderID}.`);
                                }
                            })
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

    const processBuyNow = (index: number, product: ProductInfo) => {
        if (listOfAddressInfo.length === 0) {
            setErrorMessage("Please add address for delivery in your profile");
            return;
        }
        setQuantityToBuyNow(quantityOfEachProduct[index]);
        setSingleProduct(product);
        setShowSelectAddressModal(true);
    }

    return (
        <div className="p-4 mt-14 min-h-screen">
            <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">{category}</p>
            {
                products.length === 0 && <p className="text-center font-semibold">No Products in this category</p>
            }
            <div className="flex flex-row flex-wrap content-center justify-center gap-4 mt-12">
                {
                    products.length > 0 ?
                        products
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
                                                <Button text="" buttonClass="p-2 text-sm" icon={<Icon type="minus" />} onClick={() => decrementQuantity(index)} isTextVisible={false}/>
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
                successMessage != null && <MessageModal isSuccess={true} message={successMessage} setMessage={setSuccessMessage} />
            }
            {
                errorMessage != null && <MessageModal isSuccess={false} message={errorMessage} setMessage={setErrorMessage} />
            }
            {
                showSelectAddressModal && <SelectAddressModal listOfAddressInfo={listOfAddressInfo} selectAddress={selectAddress} setSelectAddress={setSelectAddress} setShowSelectAddressModal={setShowSelectAddressModal} handleProceedToCheckOut={onBuyNow} />
            }
        </div>
    );
}

export default Products;