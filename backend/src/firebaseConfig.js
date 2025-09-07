// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//This sets up Firebase so all backend JS files can access the Realtime Database.
//database is the instance used for reading and writing inventory data.

// Your web app's Firebase configuration
// Your Firebase config copied from Firebase console
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

// Export Realtime Database instance for backend files to use
export const database = getDatabase(app);
