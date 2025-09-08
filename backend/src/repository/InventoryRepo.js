// src/repository/InventoryRepo.js
import db from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const INVENTORY_REF = "inventory";

export const addInventoryItem = async (item) => {
  const id = uuidv4();
  const newItem = { id, ...item };
  await db.ref(`inventory/${id}`).set(newItem); // ✅ correct path
  return newItem;
};


export const getAllInventory = async () => {
  const snapshot = await db.ref(INVENTORY_REF).once("value");
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};




