import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebasefrontend';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

interface UserInfo {
  uid: string;
  name: string|null;
  email: string|null;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

interface AuthFunctions {
  registerWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<string>;
  signInWithGoogle: () => Promise<void>;
}

interface UserContextValue {
  user: UserInfo | null;
  authFunctions?: AuthFunctions;
}

export const UserContext = createContext<UserContextValue>({user:null});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserInfo | null >(null);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();


  const getCurrentUserInfo = (currentUser:User):UserInfo => {
    const userInfo :UserInfo = {
      uid: currentUser.uid,
      name: currentUser.displayName != null ? currentUser.displayName : currentUser.email,
      email: currentUser.email
    }
    // console.log(userInfo);
    return userInfo;
  }

  const authFunctions:Partial<AuthFunctions> = {};

  (authFunctions as AuthFunctions).registerWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userInfo = getCurrentUserInfo(res.user);
      setUser(userInfo);
    } catch (err) {
      throw err;
    }
  };


  (authFunctions as AuthFunctions).logInWithEmailAndPassword = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };


  (authFunctions as AuthFunctions).logOut = async () => {
    await signOut(auth);
  }


  (authFunctions as AuthFunctions).sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset link sent!";
    } catch (err) {
      throw err;
    }
  };


  (authFunctions as AuthFunctions).signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userInfo:UserInfo = getCurrentUserInfo(res.user);
      setUser(userInfo);
    } catch (err) {
      throw err;
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser != null) {
        // console.log(currentUser);
        const userInfo = getCurrentUserInfo(currentUser);
        setUser(userInfo);
        const currentPath = window.location.pathname;
        if (
          currentPath === '/signIn' ||
          currentPath === '/signUp' ||
          currentPath === '/forgetPassword'
        ) {
          navigate('/');
        }
      } else {
        const currentPath = window.location.pathname;
        if (
          currentPath !== '/signIn' &&
          currentPath !== '/signUp' &&
          currentPath !== '/forgetPassword'
        ) {
          navigate('/signUp');
        }
      }
    });

    return () => { unsubscribe() };
  }, []);

  const userContextValue: UserContextValue = {
    user: user,
    authFunctions: authFunctions as AuthFunctions
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserAuth = () => { return useContext(UserContext); };
