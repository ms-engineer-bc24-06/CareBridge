// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDt5tZuQktKWbH4HPOKpykHjSmFgPfZfAM",
  authDomain: "carebridge-3eb49.firebaseapp.com",
  projectId: "carebridge-3eb49",
  storageBucket: "carebridge-3eb49.appspot.com",
  messagingSenderId: "202846085412",
  appId: "1:202846085412:web:c84df0388a96268a8dd3b1"
};



// Firebase アプリの初期化
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
