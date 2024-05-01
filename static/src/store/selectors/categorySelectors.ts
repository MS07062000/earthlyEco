import { RootState } from "../store";
import { createSelector } from "reselect";

const authSelector = (state: RootState) => state.auth;
const categorySelector = (state: RootState) => state.category;

//memoized category selector created using reselect
export default createSelector(
    authSelector,
    categorySelector,
    (auth, category) => ({
        auth,
        category
    })
)