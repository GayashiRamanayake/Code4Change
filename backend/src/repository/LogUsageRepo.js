const { db } = require("../firebaseConfig");
const LogUsage = require("../models/LogUsage");

const logCollection = db.collection("logUsage");

// Repository method: Add a new usage log document to Firestore
async function addLog(logData) {
  const docRef = await logCollection.add(logData);
  return { id: docRef.id, ...logData };
}

// Repository method: Fetch usage logs filtered by date
// Ordered by `date` in descending order (latest first)
async function getLogsByDate(dateStr) {
  const snapshot = await logCollection
    .where("dateStr", "==", dateStr)
    .orderBy("date", "desc")
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { addLog, getLogsByDate };
