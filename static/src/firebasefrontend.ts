// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_APIKEY as string,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN as string,
  projectId: import.meta.env.VITE_APP_PROJECTID as string,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET as string,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID as string,
  appId: import.meta.env.VITE_APP_APPID as string
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//firestore
const db = getFirestore(app);

//firebaseStorage
const storage = getStorage(app);
export { auth, storage, db };