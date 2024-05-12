import { Product } from "../../store/interfaces";
import {
  Button,
  Icon,
  Message,
  MessageModal,
  SelectAddressModal,
  Spinner,
} from "..";
import useProduct from "../../store/hooks/producthook";

const Products: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const category: string = searchParams.get("category") ?? "nuts";

  const {
    product,
    address,
    productsPresentInWishlist,
    quantityOfEachProduct,
    selectAddress,
    setSelectAddress,
    showSelectAddressModal,
    setShowSelectAddressModal,
    onWishlist,
    onAddToCart,
    incrementQuantity,
    decrementQuantity,
    onBuyNow,
    processBuyNow,
    clearErrorMessage,
    clearSuccessMessage,
  } = useProduct(category);

  return (
    <div className="p-4 mt-14 min-h-screen">
      <p className="pb-4 px-2 text-2xl capitalize font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">
        {category}
      </p>
      {product.loading ? (
        <Spinner />
      ) : product.products.length === 0 ? (
        <div className="mt-[3.25rem]">
          <Message type="info" message="No products found" />
        </div>
      ) : (
        <div className="flex flex-row flex-wrap content-center justify-center gap-8 mt-16">
          {product.products
            .filter((product: Product) => product.quantityAvailable > 0)
            .map((product: Product, index: number) => {
              return (
                <div
                  key={product.id}
                  className="max-w-xs flex flex-col justify-between items-start rounded-lg shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369]  p-2"
                >
                  <div className="group relative z-1 ">
                    <img
                      className="h-[320px] w-[320px] rounded-lg text-center"
                      loading="lazy"
                      src={product.image}
                    />
                    <button
                      onClick={() => {
                        onWishlist(product.id, index);
                      }}
                      className="hidden group-hover:block absolute -translate-x-1/4 -translate-y-1/4 right-0 top-4"
                    >
                      {productsPresentInWishlist[index] ? (
                        <Icon
                          type="red_heart"
                          iconClass="w-8 h-8 text-red-500"
                        />
                      ) : (
                        <Icon type="heart_outline" iconClass="w-8 h-8" />
                      )}
                    </button>
                  </div>
                  <p className="text-lg capitalize font-semibold pt-1">
                    {product.name}
                  </p>
                  <p className="text-xl font-bold  py-1">
                    &#x20B9;{product.price}
                  </p>
                  {product.quantityAvailable < 10 && (
                    <p className="text-sm font-bold text-red-600 ">
                      Only {product.quantityAvailable} left in stock
                    </p>
                  )}
                  <div className="py-2" data-hs-input-number>
                    <div className="flex items-center gap-x-1.5">
                      <Button
                        id="decrement-button"
                        text=""
                        buttonClass="p-2 text-sm"
                        icon={<Icon type="minus" />}
                        onClick={() => decrementQuantity(index)}
                        isTextVisible={false}
                      />
                      <input
                        className="p-0 w-6 bg-transparent border-0 text-center focus:outline-none focus:ring-0 text-black "
                        type="number"
                        min={1}
                        max={Math.min(product.quantityAvailable, 10)}
                        value={quantityOfEachProduct[index] ?? 1}
                        readOnly={true}
                      />
                      {/*onChange={(e) => onChangeOfQuantity(e, index)}*/}
                      <Button
                        id="increment-button"
                        text=""
                        buttonClass="p-2 text-sm"
                        icon={<Icon type="plus" />}
                        isTextVisible={false}
                        onClick={() => incrementQuantity(index)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-stretch w-full">
                    <Button
                      id="add-to-cart-button"
                      text="Add to cart"
                      buttonClass={"w-1/2 text-md p-2 mr-2"}
                      isTextVisible={true}
                      onClick={() =>
                        onAddToCart(
                          product.id,
                          product.name,
                          quantityOfEachProduct[index]
                        )
                      }
                    />
                    <Button
                      id="buy-now-button"
                      text="Buy now"
                      buttonClass={"w-1/2 text-md p-2"}
                      isTextVisible={true}
                      onClick={() => processBuyNow(index, product)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {product.successMessage != null && (
        <MessageModal
          isSuccess={true}
          message={product.successMessage}
          setMessage={clearSuccessMessage}
        />
      )}
      {product.errorMessage != null && (
        <MessageModal
          isSuccess={false}
          message={product.errorMessage}
          setMessage={clearErrorMessage}
        />
      )}
      {showSelectAddressModal && address.addresses && (
        <SelectAddressModal
          listOfAddressInfo={address.addresses}
          selectAddress={selectAddress}
          setSelectAddress={setSelectAddress}
          setShowSelectAddressModal={setShowSelectAddressModal}
          handleProceedToCheckOut={onBuyNow}
        />
      )}
    </div>
  );
};

export default Products;
