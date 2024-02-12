import CategoryInfo from "./categoryInfo";

export default interface CategoryState {
  loading: boolean;
  categories: CategoryInfo[];
  error: string | null;
}
