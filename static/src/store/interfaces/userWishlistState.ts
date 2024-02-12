import ProductInfo from "./productInfo";

export default interface UserWishlistState {
  loading: boolean;
  products: ProductInfo[];
  successMessage: string | null;
  errorMessage: string | null;
}
