import db from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const INVENTORY_REF = "inventory";

export const addInventoryItem = async (item) => {
  const id = uuidv4();
  const newItem = { id, ...item };
  await db.ref(`${INVENTORY_REF}/${id}`).set(newItem);
  return newItem;
};

export const updateInventoryItem = async (id, item) => {
  await db.ref(`${INVENTORY_REF}/${id}`).update(item);
  const snapshot = await db.ref(`${INVENTORY_REF}/${id}`).once("value");
  return snapshot.val();
};

export const getAllInventory = async () => {
  const snapshot = await db.ref(INVENTORY_REF).once("value");
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};





