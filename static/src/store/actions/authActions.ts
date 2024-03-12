import { Dispatch } from "@reduxjs/toolkit";
import { UserInfo } from "../interfaces";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebasefrontend";
import {
  forgetPasswordFailed,
  forgetPasswordInitiated,
  forgetPasswordSuccess,
  authFailed,
  authInitiated,
  authSuccess,
  logoutFailed,
  logoutInitiated,
  logoutSuccess,
} from "../slices/authSlice";

const getCurrentUserInfo = (currentUser: User): UserInfo => {
  const userInfo: UserInfo = {
    uid: currentUser.uid,
    name:
      currentUser.displayName != null
        ? currentUser.displayName
        : currentUser.email,
    email: currentUser.email,
  };
  return userInfo;
};

export const signUpWithEmailAndPassword =
  (email: string, password: string, confirmPassword: string) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof authInitiated>
      | ReturnType<typeof authSuccess>
      | ReturnType<typeof authFailed>
    >
  ) => {
    dispatch(authInitiated());
    try {
      if (password !== confirmPassword) {
        dispatch(authFailed("Password and Confirm Password do not match"));
        return;
      }
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userInfo = getCurrentUserInfo(res.user);
      if (userInfo.uid != null) {
        dispatch(authSuccess(userInfo));
      }
    } catch (err) {
      dispatch(authFailed("Error signing up with email and password"));
    }
  };

export const loginWithEmailAndPassword = (email: string, password: string) => {
  return async (
    dispatch: Dispatch<
      | ReturnType<typeof authInitiated>
      | ReturnType<typeof authSuccess>
      | ReturnType<typeof authFailed>
    >
  ) => {
    dispatch(authInitiated());
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userInfo = getCurrentUserInfo(res.user);
      if (userInfo.uid != null) {
        dispatch(authSuccess(userInfo));
      }
    } catch (err) {
      dispatch(authFailed("Error logging in with email and password"));
    }
  };
};

export const signInWithGoogle =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof authInitiated>
      | ReturnType<typeof authSuccess>
      | ReturnType<typeof authFailed>
    >
  ) => {
    dispatch(authInitiated());
    try {
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      const userInfo: UserInfo = getCurrentUserInfo(res.user);
      if (userInfo.uid.length > 0) {
        dispatch(authSuccess(userInfo));
      }
    } catch (err) {
      dispatch(authFailed("Error signing in with Google"));
    }
  };

export const logout =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof logoutInitiated>
      | ReturnType<typeof logoutSuccess>
      | ReturnType<typeof logoutFailed>
    >
  ) => {
    dispatch(logoutInitiated());
    try {
      await signOut(auth);
    } catch (err) {
      dispatch(logoutFailed("Error logging out"));
      return;
    }
    dispatch(logoutSuccess());
  };

export const forgetPassword =
  (email: string) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof forgetPasswordInitiated>
      | ReturnType<typeof forgetPasswordSuccess>
      | ReturnType<typeof forgetPasswordFailed>
    >
  ) => {
    dispatch(forgetPasswordInitiated());
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      dispatch(forgetPasswordFailed("Error sending password reset email"));
      return;
    }
    dispatch(forgetPasswordSuccess("Password reset email sent"));
  };

export const authStateChange =
  () =>
  (
    dispatch: Dispatch<
      ReturnType<typeof logoutSuccess> | ReturnType<typeof authSuccess>
    >
  ) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userInfo: UserInfo = getCurrentUserInfo(user);
        if (userInfo.uid != null) {
          dispatch(authSuccess(userInfo));
        }
      } else {
        dispatch(logoutSuccess());
      }
    });
  };
