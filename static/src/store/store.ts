import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import {
  authReducer,
  addressReducer,
  categoryReducer,
  productReducer,
  userCartReducer,
  userOrdersAndRefundsReducer,
  userWishlistReducer,
} from "./slices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
    category: categoryReducer,
    cart: userCartReducer,
    ordersAndRefunds: userOrdersAndRefundsReducer,
    product: productReducer,
    wishlist: userWishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
