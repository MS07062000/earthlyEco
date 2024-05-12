import {
  Button,
  Icon,
  Message,
  MessageModal,
  SelectAddressModal,
  SortBy,
  Spinner,
} from "..";
import useCart from "../../store/hooks/carthook";
import { CartProductInfo } from "../../store/interfaces";

const Cart: React.FC = () => {
  const {
    cart,
    address,
    setCartProducts,
    increaseQuantityOfProduct,
    decreaseQuantityOfProduct,
    removeProductFromCart,
    moveToWishlistFromCart,
    onBuyNowFromCart,
    placeOrder,
    clearSuccessMessage,
    setErrorMessage,
    processBuyNow,
    processCompleteOrder,
    selectAddress,
    setSelectAddress,
    singleProduct,
    showSelectAddressModal,
    setShowSelectAddressModal,
  } = useCart();

  return (
    <div className="p-4 mt-12 min-h-screen">
      <p className="pb-2 px-2 text-2xl font-medium text-center text-gray-900 fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">
        My Cart
      </p>
      {cart.loading ? (
        <Spinner />
      ) : cart.products && cart.products.length > 0 ? (
        <>
          <SortBy products={cart.products} setProducts={setCartProducts} />
          <div className="w-full flex flex-row flex-wrap justify-start items-center gap-8 pt-7 pb-2 mb-20  mt-[5.25rem]">
            {cart.products.map((product: CartProductInfo, index: number) => (
              <div
                key={product.name}
                className="flex flex-row flex-nowrap justify-start items-center gap-4 rounded-lg p-2 w-full md:w-auto shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369]"
              >
                <div className="text-center">
                  <img
                    className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg"
                    loading="lazy"
                    src={product.image}
                  />
                </div>
                <div className="flex justify-around items-start flex-col flex-nowrap gap-3">
                  <div className="w-full">
                    <p className="text-lg font-semibold capitalize">
                      {product.name}
                    </p>
                    <p className="text-xl font-bold">&#x20B9;{product.price}</p>
                  </div>

                  <div className="flex items-center gap-x-1.5">
                    <Button
                      id={`decrement-${index}`}
                      text=""
                      buttonClass="p-2 text-sm"
                      icon={<Icon type="minus" />}
                      onClick={() => decreaseQuantityOfProduct(index)}
                      isTextVisible={false}
                    />
                    <input
                      className="p-0 w-6 bg-transparent border-0 text-center focus:outline-none focus:ring-0 text-black "
                      type="number"
                      min={1}
                      max={Math.min(product.quantityAvailable, 10)}
                      value={product.quantityByUser}
                      readOnly={true}
                    />
                    {/*onChange={(e) => onChangeOfQuantity(e, index)}*/}
                    <Button
                      id={`increment-${index}`}
                      text=""
                      buttonClass="p-2 text-sm"
                      icon={<Icon type="plus" />}
                      isTextVisible={false}
                      onClick={() => increaseQuantityOfProduct(index)}
                    />
                  </div>

                  <div className="w-full flex flex-row justify-start flex-nowrap gap-2">
                    <Button
                      id={`delete-${index}`}
                      isTextVisible={false}
                      text="Delete"
                      icon={<Icon type="delete" iconClass="h-5 w-5" />}
                      onClick={() => {
                        removeProductFromCart(
                          product.id,
                          product.name,
                          product.quantityByUser
                        );
                      }}
                      buttonClass="text-sm p-2.5"
                    />
                    <Button
                      id={`move-to-wishlist-${index}`}
                      isTextVisible={false}
                      disabled={product.quantityAvailable <= 0}
                      text="Move to Wishlist"
                      icon={<Icon type="red_heart" iconClass="h-5 w-5" />}
                      onClick={() => {
                        moveToWishlistFromCart(
                          product.id,
                          product.name,
                          product.quantityByUser
                        );
                      }}
                      buttonClass="text-sm p-2.5"
                    />
                    <Button
                      id={`buy-now-${index}`}
                      isTextVisible={true}
                      disabled={product.quantityAvailable <= 0}
                      text="Buy Now"
                      onClick={() => {
                        processBuyNow(product);
                      }}
                      buttonClass="hidden md:block w-auto text-md p-2"
                    />
                  </div>
                  <Button
                    id={`buy-now-${index}`}
                    isTextVisible={true}
                    disabled={product.quantityAvailable <= 0}
                    text="Buy Now"
                    onClick={() => {
                      processBuyNow(product);
                    }}
                    buttonClass="block md:hidden w-auto text-md p-2"
                  />
                </div>
                {product.quantityAvailable <= 0 && (
                  <div className="w-full flex absolute bg-[white] h-full opacity-[0.65] items-center justify-center left-0 top-0 rounded-lg">
                    <p className="text-xl font-bold text-red-700">
                      Out of stock
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  flex flex-col  justify-between items-stretch p-2 md:h-16 md:flex-row md:items-center">
            <p className="text-2xl font-medium text-white">
              Subtotal: &#x20B9;{cart.totalAmount}{" "}
            </p>
            <button
              id="place-order"
              type="button"
              onClick={() => {
                processCompleteOrder();
              }}
              className="text-black bg-[#fdd35b] focus:ring-4 focus:outline-none hover:bg-yellow-300 focus:ring-yellow-200 font-medium rounded-lg text-xl p-2 text-center"
            >
              Place Order
            </button>
          </div>
        </>
      ) : (
        <div className=" mt-[3.25rem]">
          <Message type="info" message="Your cart is empty" />
        </div>
      )}
      {cart.successMessage != null && (
        <MessageModal
          isSuccess={true}
          message={cart.successMessage}
          setMessage={clearSuccessMessage}
        />
      )}
      {cart.errorMessage != null && (
        <MessageModal
          isSuccess={false}
          message={cart.errorMessage}
          setMessage={() => setErrorMessage(null)}
        />
      )}
      {showSelectAddressModal && address.addresses && (
        <SelectAddressModal
          listOfAddressInfo={address.addresses}
          selectAddress={selectAddress}
          setSelectAddress={setSelectAddress}
          setShowSelectAddressModal={setShowSelectAddressModal}
          handleProceedToCheckOut={
            singleProduct != null
              ? () => onBuyNowFromCart(singleProduct, selectAddress!)
              : () => placeOrder(selectAddress!)
          }
        />
      )}
    </div>
  );
};

export default Cart;
