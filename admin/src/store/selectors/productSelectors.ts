import { RootState } from "../store";
import { createSelector } from "reselect";

const categorySelector = (state: RootState) => state.category;
const productSelector = (state: RootState) => state.product;

//memoized product selector created using reselect
export default createSelector(
  categorySelector,
  productSelector,
  (category, product) => ({
    category,
    product
  })
);
