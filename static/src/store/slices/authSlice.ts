import { createSlice } from "@reduxjs/toolkit";
import AuthState from "../interfaces/authState";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../reducers/authReducers";

const authSlicer = createSlice({
  name: "auth" as string,
  initialState: {
    user: null,
    errorMessage: null,
    loading: false,
    successMessage: null,
    sessionError: false,
  } as AuthState,
  reducers: authReducer,
});

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlicer.reducer
);

export const {
  authInitiated,
  authSuccess,
  authFailed,
  logoutInitiated,
  logoutSuccess,
  logoutFailed,
  forgetPasswordInitiated,
  forgetPasswordSuccess,
  forgetPasswordFailed,
  updateSessionError,
} = authSlicer.actions;

export default persistedAuthReducer;
