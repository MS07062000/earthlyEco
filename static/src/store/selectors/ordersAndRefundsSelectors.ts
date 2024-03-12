import { RootState } from "../store";
import { createSelector } from "reselect";

const authSelector = (state: RootState) => state.auth;
const ordersAndRefundsSelector = (state: RootState) => state.ordersAndRefunds;

//memoized ordersAndRefunds selector created using reselect
export default createSelector(
    authSelector,
    ordersAndRefundsSelector,
    (auth, ordersAndRefunds) => ({
        auth,
        ordersAndRefunds
    })
)