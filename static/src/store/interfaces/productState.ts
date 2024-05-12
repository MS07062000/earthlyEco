import Product from "./product";

export default interface ProductState {
  loading: boolean;
  products: Product[];
  successMessage: string | null;
  errorMessage: string | null;
}
