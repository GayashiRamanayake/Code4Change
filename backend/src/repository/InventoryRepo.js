import db from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const INVENTORY_REF = "inventory";

/*export const addInventoryItem = async (item) => {
  const id = uuidv4();
  const newItem = { id, ...item };
  await db.ref(`${INVENTORY_REF}/${id}`).set(newItem);
  return newItem;
};

export const updateInventoryItem = async (id, item) => {
  await db.ref(`${INVENTORY_REF}/${id}`).update(item);
  const snapshot = await db.ref(`${INVENTORY_REF}/${id}`).once("value");
  return snapshot.val();
};*/

export const addInventoryItem = async (item) => {
  const id = uuidv4();
  const today = new Date().toISOString().split("T")[0];
  const newItem = { 
    id, 
    ...item, 
    updatedAt: today,
    history: [
      {
        date: today,
        stockBefore: item.stock,
        stockUsed: 0,
        stockAfter: item.stock
      }
    ]
  };
  await db.ref(`${INVENTORY_REF}/${id}`).set(newItem);
  return newItem;
};

export const updateInventoryItem = async (id, item) => {
  const today = new Date().toISOString().split("T")[0];
  const snapshot = await db.ref(`${INVENTORY_REF}/${id}`).once("value");
  const currentItem = snapshot.val();

  const stockBefore = currentItem?.stock || 0;
  const stockAfter = item.stock;
  const stockUsed = Math.max(stockBefore - stockAfter, 0);

  const newHistoryEntry = {
    date: today,
    stockBefore,
    stockUsed,
    stockAfter
  };

  const updatedItem = {
    ...currentItem,
    ...item,
    updatedAt: today,
    history: currentItem?.history
      ? [...currentItem.history, newHistoryEntry]
      : [newHistoryEntry]
  };

  await db.ref(`${INVENTORY_REF}/${id}`).set(updatedItem);
  return updatedItem;
};


export const getAllInventory = async () => {
  const snapshot = await db.ref(INVENTORY_REF).once("value");
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};





