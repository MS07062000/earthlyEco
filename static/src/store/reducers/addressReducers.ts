import { PayloadAction } from "@reduxjs/toolkit"
import addressState from "../interfaces/addressState"
import address from "../interfaces/address"

export default {
    fetchAddressesInitiated(state: addressState) {
        state = {
            ...state,
            loading: true,
            error: null
        }
        return state
    },
    fetchAddressesFailed(state: addressState, action: PayloadAction<string>) {
        state = {
            ...state,
            loading: false,
            addresses:[],
            error: action.payload
        }
        return state
    },
    fetchAddressesSuccess(state: addressState, action: PayloadAction<{addresses: address[], defaultAddress: address}>) {
        state = {
            ...state,
            loading: false,
            addresses: action.payload.addresses,
            defaultAddress: action.payload.defaultAddress,
            error: null
        }
        return state
    },
    updateDefaultAddress(state: addressState, action: PayloadAction<address>) {
        state = {
            ...state,
            loading: false,
            defaultAddress: action.payload,
            error: null
        }
        return state
    }
}