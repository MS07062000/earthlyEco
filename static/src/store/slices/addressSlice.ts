import { createSlice } from "@reduxjs/toolkit";
import addressReducers from "../reducers/addressReducers";
import addressState from "../interfaces/addressState";

const addressSlice=createSlice({
    name:"address",
    initialState:{
        loading:false,
        addresses:[],
        defaultAddress:null,
        error:null
    } as addressState,
    reducers:addressReducers,
})

export const {fetchAddressesInitiated,fetchAddressesSuccess,fetchAddressesFailed,updateDefaultAddress}=addressSlice.actions;
export default addressSlice.reducer;