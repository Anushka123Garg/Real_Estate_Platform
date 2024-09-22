// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a3a9b.firebaseapp.com",
  projectId: "mern-estate-a3a9b",
  storageBucket: "mern-estate-a3a9b.appspot.com",
  messagingSenderId: "374559258138",
  appId: "1:374559258138:web:9d29211c02df4f598183a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);