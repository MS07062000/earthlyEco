import Category from "./category";

export default interface CategoryState {
  loading: boolean;
  categories: Category[];
  error: string | null;
}
