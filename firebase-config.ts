import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCEFRNR6IsHP2n6l5Lig9X0OXy3d3J9Uw8",
    authDomain: "helper-ai-88586.firebaseapp.com",
    projectId: "helper-ai-88586",
    storageBucket: "helper-ai-88586.firebasestorage.app",
    messagingSenderId: "630983999042",
    appId: "1:630983999042:web:b3c2e21a8d651c448d77db",
    measurementId: "G-RSJD5FL965"
  };

  export const FIREBASE_APP = initializeApp(firebaseConfig);
  export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

