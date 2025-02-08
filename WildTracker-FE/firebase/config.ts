
// wildtracker-fe/firebase/config.ts

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlrXe3fnMsoHAnkdaqvpCMxoLLavQa0LY",
  authDomain: "wildtracker-438e0.firebaseapp.com",
  projectId: "wildtracker-438e0",
  storageBucket: "wildtracker-438e0.firebasestorage.app",
  messagingSenderId: "103186647108",
  appId: "1:103186647108:web:693f36f2d11cedfb1c5411"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

