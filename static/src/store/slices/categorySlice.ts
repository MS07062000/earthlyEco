import { createSlice } from "@reduxjs/toolkit";
import CategoryState from "../interfaces/categoryState";
import categoryReducers from "../reducers/categoryReducers";

const categorySlice = createSlice({
    name: "category" as string,
    initialState: {
        loading: false,
        categories: [],
        error: null,
    } as CategoryState,
    reducers: categoryReducers,
});

export const { fetchCategoriesInitiated,fetchCategoriesSuccess,fetchCategoriesError } = categorySlice.actions;
export default categorySlice.reducer;