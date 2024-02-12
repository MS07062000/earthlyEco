import CartProductInfo from "./cartProductInfo";

export default interface UserCartState {
  loading: boolean;
  products: CartProductInfo[];
  totalAmount: number;
  successMessage: string | null;
  errorMessage: string | null;
}
