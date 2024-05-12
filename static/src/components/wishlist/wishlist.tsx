import { Product } from "../../store/interfaces";
import { Button, Icon, Message, MessageModal, SortBy, Spinner } from "..";
import useWishlist from "../../store/hooks/wishlisthook";

const Wishlist = () => {
  const {
    wishlist,
    setProducts,
    deleteFromWishlist,
    moveToCart,
    clearSuccessMessage,
    clearErrorMessage,
  } = useWishlist();

  return (
    <div className="p-4 mt-12 min-h-screen">
      <p className="pb-2 px-2 text-2xl text-center font-medium fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">
        My Wishlist
      </p>
      {wishlist.loading ? (
        <Spinner />
      ) : wishlist.products && wishlist.products.length > 0 ? (
        <>
          <SortBy products={wishlist.products} setProducts={setProducts} />
          <div className="w-full h-auto flex flex-row flex-wrap justify-start items-start gap-8 pt-7 pb-2 mt-[5.25rem]">
            {wishlist.products.map((product: Product) => (
              <div
                key={product.id}
                className="w-full md:w-auto flex flex-row flex-nowrap justify-start items-center gap-3 rounded-lg p-2 shadow-[-10px_10px_20px_#d7b34d,10px_-10px_20px_#fff369]"
              >
                <div className="text-center">
                  <img
                    className="w-[6.5rem] max-w-[6.5rem] h-[6.5rem] max-h-[6.5rem] rounded-lg"
                    loading="lazy"
                    src={product.image}
                  />
                </div>
                <div className="flex justify-around items-center flex-col flex-nowrap gap-3">
                  <div className="w-full">
                    <p className="text-lg font-semibold capitalize">
                      {product.name}
                    </p>
                    {product.quantityAvailable <= 0 ? (
                      <p className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Out of Stock</p>
                    ) : (
                      <p className="text-xl font-bold py-1">
                        &#x20B9;{product.price}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex flex-row justify-start flex-nowrap gap-2">
                    <Button
                      id={`deleteFromWishlist-${product.name}`}
                      isTextVisible={false}
                      text="Delete"
                      icon={<Icon type="delete" iconClass="h-5 w-5" />}
                      onClick={() => {
                        deleteFromWishlist(product.id, product.name);
                      }}
                      buttonClass="text-sm p-2.5"
                    />
                    {product.quantityAvailable > 0 && (
                      <Button
                        id={`moveToCart-${product.name}`}
                        isTextVisible={false}
                        disabled={product.quantityAvailable <= 0}
                        text="Add To Cart"
                        icon={<Icon type="add_to_cart" iconClass="h-5 w-5" />}
                        onClick={() => {
                          moveToCart(product.id, product.name);
                        }}
                        buttonClass="text-sm p-2.5"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-[3.25rem]">
          <Message type="info" message="Your wishlist is empty" />
        </div>
      )}
      {wishlist.successMessage != null && (
        <MessageModal
          isSuccess={true}
          message={wishlist.successMessage}
          setMessage={clearSuccessMessage}
        />
      )}
      {wishlist.errorMessage != null && (
        <MessageModal
          isSuccess={false}
          message={wishlist.errorMessage}
          setMessage={clearErrorMessage}
        />
      )}
    </div>
  );
};

export default Wishlist;
