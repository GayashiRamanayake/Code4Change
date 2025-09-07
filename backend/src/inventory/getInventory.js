//onValue is a real-time listener. Whenever the data changes in Firebase, this function automatically updates the frontend.
//callback is a function passed from frontend to set inventoryList state.

import { ref, onValue } from "firebase/database";
import { database } from "./firebaseConfig";

// Function to fetch all inventory items
export const fetchInventory = (callback) => {
  const inventoryRef = ref(database, "inventory");

  // onValue listens for changes in real-time
  onValue(inventoryRef, (snapshot) => {
    const data = snapshot.val() || {}; // get data or empty object
    const items = Object.values(data); // convert object to array
    callback(items); // send data to frontend callback
  });
};
