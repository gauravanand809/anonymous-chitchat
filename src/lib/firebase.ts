
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpYAXtHQmiXacUl7zsb9D418E5aBcIcrw",
  authDomain: "anon-chat-app-d7b33.firebaseapp.com",
  databaseURL: "https://anon-chat-app-d7b33-default-rtdb.firebaseio.com",
  projectId: "anon-chat-app-d7b33",
  storageBucket: "anon-chat-app-d7b33.firebasestorage.app",
  messagingSenderId: "186704437505",
  appId: "1:186704437505:web:885195aea184482838fb00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
