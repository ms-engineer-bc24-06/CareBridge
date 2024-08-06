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

// コンソールに出力
console.log('Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('Firebase Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Firebase Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('Firebase Messaging Sender ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('Firebase App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);


// Firebase アプリの初期化
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
