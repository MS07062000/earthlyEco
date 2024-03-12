import { RootState } from "../store";
import { createSelector } from "reselect";

const authSelector = (state: RootState) => state.auth;
const productSelector = (state: RootState) => state.product;
const wishlistSelector = (state: RootState) => state.wishlist;
const addressSelector = (state: RootState) => state.address;

//memoized product selector created using reselect
export default createSelector(
    authSelector,
    productSelector,
    wishlistSelector,
    addressSelector,
    (auth, product, wishlist, address) => ({
        auth,
        product,
        wishlist,
        address
    })
)