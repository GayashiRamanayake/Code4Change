// backend/services/logUsageService.js
import { database } from "../config/firebase.js";
import { ref, push, query, orderByChild, equalTo, get } from "firebase/database";

async function addLog({ itemId, itemName, amount, note }) {
  const dateObj = new Date();
  const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

  const logRef = ref(database, 'logUsage');
  const newLog = {
    itemId,
    itemName,
    amount,
    note: note || "",
    date: dateObj.toISOString(),
    dateStr
  };

  const pushedLog = await push(logRef, newLog);
  return { id: pushedLog.key, ...newLog };
}

async function getLogsByDate(dateStr) {
  const logsRef = ref(database, 'logUsage');
  const logsQuery = query(logsRef, orderByChild('dateStr'), equalTo(dateStr));
  const snapshot = await get(logsQuery);

  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...value }));
}

export { addLog, getLogsByDate };
