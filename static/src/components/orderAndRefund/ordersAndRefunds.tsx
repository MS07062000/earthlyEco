import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOrdersAndRefunds } from "../../store/actions/orderAndRefundActions";
import { Order, Refund, RefundProductInfo, CategoryWithProductsInfo } from "../../store/interfaces";
import { Message, Spinner } from "..";
import { memoizedOrdersAndRefundsSelectors } from "../../store/selectors";

const OrdersAndRefunds = () => {
    const dispatch = useAppDispatch();
    const { auth, ordersAndRefunds } = useAppSelector(memoizedOrdersAndRefundsSelectors);
    useEffect(() => {
        if (auth.user != null) {
            dispatch(fetchOrdersAndRefunds(auth.user.uid));
        }
    }, []);

    return ordersAndRefunds.loading ? <Spinner /> : (
        <>
            {
                ordersAndRefunds.orders.length > 0 &&
                <div className="mt-[4rem] p-2">
                    <h1 className="text-3xl font-bold capitalize text-center">Orders</h1>
                    {
                        ordersAndRefunds.orders.map((order: Order) => (
                            <div key={order.orderID}>
                                <p className="text-xl font-bold">{order.orderID}</p>
                                <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2">
                                    {
                                        order.categoryWithProducts.map((categoryWithProducts: CategoryWithProductsInfo, index: number) => (
                                            <div key={categoryWithProducts.category} className="flex flex-row gap-4">
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
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
            {
                ordersAndRefunds.refunds.length > 0 && <div className="p-2">
                    <h1 className="text-3xl font-bold capitalize text-center">Refunds</h1>
                    {
                        ordersAndRefunds.refunds.map((refund: Refund) => (
                            <div key={refund.refundID}>
                                <p className="text-xl font-bold">{refund.refundID}</p>
                                <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 py-2">
                                    {
                                        refund.categoryWithProducts.map((product: RefundProductInfo) => (
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
                        ))
                    }
                </div>
            }
            {
                ordersAndRefunds.error != null && <Message type="error" message={ordersAndRefunds.error} />
            }
        </>
    );
};

export default OrdersAndRefunds;
