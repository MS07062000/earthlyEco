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
import makeApiRequest from "../../utils/apiUtils";
import { createSession, deleteSession } from "../api";
import { getDocFromCache } from "firebase/firestore";

const getCurrentUserInfo = async (
  currentUser: User
): Promise<UserInfo | null> => {
  try {
    const userInfo: UserInfo = {
      name: currentUser.displayName ?? currentUser.email,
      email: currentUser.email,
    };
    return userInfo;
  } catch (err) {
    console.error("Error getting user token:", err);
    return null;
  }
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
      const userInfo: UserInfo | null = await getCurrentUserInfo(res.user);

      if (userInfo != null) {
        const token = await res.user.getIdToken();
        await createSession(token);
        dispatch(authSuccess(userInfo));
      } else {
        throw new Error("Error signing up with email and password");
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
      const userInfo: UserInfo | null = await getCurrentUserInfo(res.user);

      if (userInfo != null) {
        const token = await res.user.getIdToken();
        // console.log(token);
        await createSession(token);
        dispatch(authSuccess(userInfo));
      } else {
        throw new Error("Error logging in with email and password");
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
      const userInfo: UserInfo | null = await getCurrentUserInfo(res.user);
      if (userInfo != null) {
        const token = await res.user.getIdToken();
        await createSession(token);
        dispatch(authSuccess(userInfo));
      } else {
        throw new Error("Error signing in with Google");
      }
    } catch (err) {
      dispatch(authFailed("Error signing in with Google"));
    }
  };

export const logout =
  (isSessionInvalidated: boolean) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof logoutInitiated>
      | ReturnType<typeof logoutSuccess>
      | ReturnType<typeof logoutFailed>
    >
  ) => {
    dispatch(logoutInitiated());
    try {
      if (!isSessionInvalidated) {
        await deleteSession();
      }
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
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userInfo: UserInfo | null = await getCurrentUserInfo(user);
        if (userInfo != null) {
          const token = await user.getIdToken();
          await deleteSession();
          await createSession(token);
          dispatch(authSuccess(userInfo));
        }
      } else {
        dispatch(logoutSuccess());
      }
    });
  };
