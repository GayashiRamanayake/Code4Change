import { database } from "../firebaseConfig.js";
import { ref, push, query, orderByChild, equalTo, get, update } from "firebase/database";

// Service for adding a usage log and updating inventory
async function addLog({ itemId, itemName, amount, note }) {
  const dateObj = new Date();
  const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
  const amt = parseFloat(amount);

  // 1. Get the inventory item from Firebase Realtime DB
  const itemRef = ref(database, `inventory/${itemId}`);
  const snapshot = await get(itemRef);

  if (!snapshot.exists()) {
    throw new Error("Item not found");
  }

  const item = snapshot.val();

  // 2. Update item stock (subtract used amount)
  const newStock = (item.stock || 0) - amt;
  await update(itemRef, { stock: newStock });

  // 3. Save usage log in `logUsage` collection
  const logRef = ref(database, "logUsage");
  const newLog = {
    itemId,
    itemName,
    amount: amt,
    note: note || "",
    date: dateObj.toISOString(),
    dateStr,
  };

  const pushedLog = await push(logRef, newLog);

  // 4. Check if item stock has dropped below threshold
  const lowStock = newStock <= item.threshold;

  return {
    id: pushedLog.key,
    ...newLog,
    remaining: newStock,
    threshold: item.threshold,
    lowStock, // true if stock is low
  };
}

// Service for fetching logs by a specific date
async function getLogsByDate(dateStr) {
  const logsRef = ref(database, "logUsage");
  const logsQuery = query(logsRef, orderByChild("dateStr"), equalTo(dateStr));
  const snapshot = await get(logsQuery);

  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val()).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

export { addLog, getLogsByDate };
