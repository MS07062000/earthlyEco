import { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import Spinner from "../Spinner";
import { getOrderProcessed } from "./helpers/getOrderProcessed";
import { getRefundProcessed } from "./helpers/getRefundProcessed";
import { categoryWithProductsInfo } from "../cart/helpers/createOrder";
import ErrorMessage from "../ErrorMessage";

interface order {
    orderID: string;
    categoryWithProducts: categoryWithProductsInfo[];
}

interface refund {
    refundID: string;
    paymentID: string;
    categoryWithProducts: refundProductInfo[];
}

interface refundProductInfo {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

const OrdersAndRefunds = () => {
    const { user } = useUserAuth();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [orderProcessed, setOrderProcessed] = useState<order[]>([]);
    const [refundProcessed, setRefundProcessed] = useState<refund[]>([]);
    const [errorMessage,setErrorMessage]=useState<string|null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const orderData: order[] = await getOrderProcessed(user.uid);
                    setOrderProcessed(orderData);

                    const refundData: refund[] = await getRefundProcessed(user.uid);
                    setRefundProcessed(refundData);
                }
            } catch (error) {
                setErrorMessage('Unable to get orders and refunds');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return isLoading ? <Spinner /> : (
        <>
            {
                orderProcessed.length > 0 &&
                <div className="mt-[4rem] p-2">
                    <h1 className="text-3xl font-bold capitalize text-center">Orders</h1>
                    {
                        orderProcessed.map((order: order) => (
                            <div key={order.orderID}>
                                <p className="text-xl font-bold">{order.orderID}</p>
                                <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2">
                                    {
                                        order.categoryWithProducts.map((categoryWithProducts: categoryWithProductsInfo, index: number) => (
                                            <>
                                                {
                                                    categoryWithProducts.products.map((product) => (
                                                        <div key={product.name} className="flex flex-row flex-nowrap justify-start items-center gap-4 border-solid border-2 border-black rounded-lg p-2 w-full md:w-auto">
                                                            <img className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg" loading="lazy" src={product.image} alt={product.name} />
                                                            <div>
                                                                <p className="text-xl font-semibold capitalize">{product.name}</p>
                                                                <p className="text-lg font-semibold capitalize">Quantity: {product.quantity}</p>
                                                                <p className="text-lg font-bold">&#x20B9;{product.price} per quantity</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
            {
                refundProcessed.length > 0 && <div className="p-2">
                    <h1 className="text-3xl font-bold capitalize text-center">Refunds</h1>
                    {refundProcessed.map((refund: refund) => (
                        <div key={refund.refundID}>
                            <p className="text-xl font-bold">{refund.refundID}</p>
                            <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2">
                                {
                                    refund.categoryWithProducts.map((product: refundProductInfo) => (

                                        <div key={product.name} className="flex flex-row flex-nowrap justify-start items-center gap-4 border-solid border-2 border-black rounded-lg p-2 w-full md:w-auto">
                                            <img className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg" loading="lazy" src={product.image} alt={product.name} />
                                            <div>
                                                <p className="text-xl font-semibold capitalize">{product.name}</p>
                                                <p className="text-lg font-semibold capitalize">Quantity: {product.quantity}</p>
                                                <p className="text-xl font-bold">&#x20B9;{product.price} per quantity</p>
                                            </div>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            }
            {
                errorMessage !=null && <ErrorMessage errorMessage={errorMessage} />
            }
        </>
    );
};

export default OrdersAndRefunds;
