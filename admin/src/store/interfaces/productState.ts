import Product from "./product";

export default interface ProductState {
  loading: boolean;
  products: Product[] | null;
  successMessage: string | null;
  errorMessage: string | null;
}
