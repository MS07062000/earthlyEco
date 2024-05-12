import ProductInfo from "./product";

export default interface UserWishlistState {
  loading: boolean;
  products: ProductInfo[] | null;
  successMessage: string | null;
  errorMessage: string | null;
}
