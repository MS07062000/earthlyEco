import Category from "./category";

export default interface CategoryState {
  loading: boolean;
  categories: Category[] | null;
  successMessage: string | null;
  errorMessage: string | null;
}
