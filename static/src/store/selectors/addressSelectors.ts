import { RootState } from "../store";
import { createSelector } from "reselect";

const authSelector = (state: RootState) => state.auth;
const addressSelector = (state: RootState) => state.address;

//memoized address selector created using reselect
export default createSelector(
    authSelector,
    addressSelector,
    (auth, address) => ({
        auth,
        address
    })
);

