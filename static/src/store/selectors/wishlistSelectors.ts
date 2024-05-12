import { RootState } from "../store";
import { createSelector } from "reselect";

const authSelector = (state: RootState) => state.auth;
const wishlistSelector = (state: RootState) => state.wishlist;

export default createSelector(
  authSelector,
  wishlistSelector,
  (auth, wishlist) => ({
    auth,
    wishlist,
  })
);
