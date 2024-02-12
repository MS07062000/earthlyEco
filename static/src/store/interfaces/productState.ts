import  ProductInfo from "./productInfo";

export default interface ProductState {
  loading: boolean;
  products: ProductInfo[];
  successMessage: string | null;
  errorMessage: string | null;
}