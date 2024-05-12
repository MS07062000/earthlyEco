import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/apphook";
import { fetchOrdersAndRefunds } from "../../store/actions/orderAndRefundActions";
import { Order, Refund } from "../../store/interfaces";
import { Message, Spinner } from "..";
import { memoizedOrdersAndRefundsSelectors } from "../../store/selectors";
import { useNavigate } from "react-router-dom";

const OrdersAndRefunds: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth, ordersAndRefunds } = useAppSelector(
    memoizedOrdersAndRefundsSelectors
  );
  useEffect(() => {
    if (auth.user !== null) {
      dispatch(fetchOrdersAndRefunds());
    } else {
      navigate("/signIn");
    }
  }, []);

  return ordersAndRefunds.loading ? (
    <Spinner />
  ) : (
    <>
      {ordersAndRefunds.orders.length > 0 && (
        <div className="mt-[4rem] p-2">
          <h1 className="text-3xl font-bold capitalize text-center">Orders</h1>
          {ordersAndRefunds.orders.map((order: Order) => (
            <div key={order.id}>
              <p className="text-xl font-bold">{order.id}</p>
              <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 md:gap-8 py-4">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-row flex-nowrap justify-start items-center gap-4 rounded-lg p-2 w-full md:w-auto shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369]"
                  >
                    <img
                      className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg"
                      loading="lazy"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <p className="text-xl font-semibold capitalize">
                        {product.name}
                      </p>
                      <p className="text-lg font-semibold capitalize">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-lg font-bold">
                        &#x20B9;{product.price} per quantity
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {ordersAndRefunds.refunds.length > 0 && (
        <div className="p-2">
          <h1 className="text-3xl font-bold capitalize text-center">Refunds</h1>
          {ordersAndRefunds.refunds.map((refund: Refund) => (
            <div key={refund.id}>
              <p className="text-xl font-bold">{refund.id}</p>
              <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 md:gap-8 py-4">
                {refund.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-row flex-nowrap justify-start items-center gap-4 rounded-lg p-2 w-full md:w-auto shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369]"
                  >
                    <img
                      className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg"
                      loading="lazy"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <p className="text-xl font-semibold capitalize">
                        {product.name}
                      </p>
                      <p className="text-lg font-semibold capitalize">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-xl font-bold">
                        &#x20B9;{product.price} per quantity
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {ordersAndRefunds.error != null && (
        <Message type="error" message={ordersAndRefunds.error} />
      )}
    </>
  );
};

export default OrdersAndRefunds;
