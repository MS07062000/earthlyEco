// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
require('dotenv').config({path:'../.env'});
// require('dotenv').config();
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_APP_APIKEY,
  authDomain: process.env.VITE_APP_AUTHDOMAIN,
  projectId: process.env.VITE_APP_PROJECTID,
  storageBucket: process.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VITE_APP_MESSAGINGSENDERID,
  appId: process.env.VITE_APP_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//firestore
export const db = getFirestore(app);
