
// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7xaIECw1UOXaDYVza2bxJT_IMqqykSiI",
  authDomain: "neko-and-kopi.firebaseapp.com",
  databaseURL: "https://neko-and-kopi-default-rtdb.firebaseio.com",
  projectId: "neko-and-kopi",
  storageBucket: "neko-and-kopi.firebasestorage.app",
  messagingSenderId: "596432880007",
  appId: "1:596432880007:web:0076e5ce695027c73d1322"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };

