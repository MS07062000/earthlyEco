import { createSelector } from 'reselect';
import { RootState } from '../store';

const authSelector = (state: RootState) => state.auth;
const addressSelector = (state: RootState) => state.address;
const cartSelector = (state: RootState) => state.cart;

//memoized cart selector created using reselect
export default createSelector(
  authSelector,
  addressSelector,
  cartSelector,
  (auth, address, cart) => ({
    auth,
    address,
    cart
  })
);