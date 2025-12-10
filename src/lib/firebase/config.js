// lib/firebase/config.js
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on client side
let app;
let auth;
let db;
let storage;

if (typeof window !== "undefined") {
  // Client-side initialization
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  auth.useDeviceLanguage();

  // Set persistence
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Firebase auth persistence set");
    })
    .catch((error) => {
      console.error("Error setting persistence:", error);
    });

  db = getFirestore(app);
  storage = getStorage(app);

  console.log("Firebase initialized on client");
} else {
  // Server-side - return null
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { app, auth, db, storage };
export default app;
