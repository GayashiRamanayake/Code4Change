// src/service/InventoryService.js
import db from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid"; // install uuid: npm install uuid

export const addInventory = async (item) => {
  const id = uuidv4(); // unique id for the item
  const newItem = { id, ...item };

  try {
    await db.ref(`inventory/${id}`).set(newItem); // write to Firebase
    return newItem;
  } catch (err) {
    console.error("Error writing to Firebase:", err);
    throw err;
  }
};

export const getAllInventory = async () => {
  try {
    const snapshot = await db.ref("inventory").once("value");
    return snapshot.val() ? Object.values(snapshot.val()) : [];
  } catch (err) {
    console.error("Error fetching inventory:", err);
    throw err;
  }
};




