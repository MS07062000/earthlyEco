import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserInfo } from "../interfaces";

export default {
  authInitiated(state: AuthState) {
    state = {
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
      user: null,
      sessionError: false,
    };
    return state;
  },
  authSuccess(state: AuthState, action: PayloadAction<UserInfo>) {
    state = {
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: null,
      user: action.payload,
    };
    return state;
  },
  authFailed(state: AuthState, action: PayloadAction<string>) {
    state = {
      ...state,
      loading: false,
      errorMessage: action.payload,
      successMessage: null,
      user: null,
    };
    return state;
  },
  logoutInitiated(state: AuthState) {
    state = {
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    };
    return state;
  },
  logoutSuccess(state: AuthState) {
    state = {
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: null,
      user: null,
      sessionError: false,
    };
    return state;
  },
  logoutFailed(state: AuthState, action: PayloadAction<string>) {
    state = {
      ...state,
      loading: false,
      errorMessage: action.payload,
      successMessage: null,
    };
    return state;
  },
  forgetPasswordInitiated(state: AuthState) {
    state = {
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
      user: null,
    };
    return state;
  },
  forgetPasswordSuccess(state: AuthState, action: PayloadAction<string>) {
    state = {
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: action.payload,
      user: null,
    };
    return state;
  },
  forgetPasswordFailed(state: AuthState, action: PayloadAction<string>) {
    state = {
      ...state,
      loading: false,
      errorMessage: action.payload,
      successMessage: null,
      user: null,
    };
    return state;
  },
  updateSessionError(state: AuthState) {
    state = {
      ...state,
      sessionError: true,
    };
    return state;
  }
};
