// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
require('dotenv').config({path:'../.env'});

// require('dotenv').config();
const admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

// Your web app's Firebase configuration
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: process.env.VITE_APP_APIKEY,
  authDomain: process.env.VITE_APP_AUTHDOMAIN,
  projectId: process.env.VITE_APP_PROJECTID,
  storageBucket: process.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VITE_APP_MESSAGINGSENDERID,
  appId: process.env.VITE_APP_APPID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

//firestore
export const db = getFirestore(app);
