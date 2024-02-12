import { createSlice } from "@reduxjs/toolkit";
import { ProductState } from "../interfaces";
import productReducers from "../reducers/productReducers";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    successMessage: null,
    errorMessage: null,
  } as ProductState,
  reducers: productReducers,
});

export const {
  fetchProductsInitiated,
  fetchProductsSuccess,
  fetchProductsError,
  updateProductErrorMessage,
  updateProductSuccessMessage,
} = productSlice.actions;
export default productSlice.reducer;
