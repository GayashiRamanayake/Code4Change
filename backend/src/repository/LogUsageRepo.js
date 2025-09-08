// backend/repository/logUsageRepository.js
const { db } = require("../firebaseConfig");
const LogUsage = require("../models/LogUsage");

const logCollection = db.collection("logUsage");

async function addLog(logData) {
  const docRef = await logCollection.add(logData);
  return { id: docRef.id, ...logData };
}

async function getLogsByDate(dateStr) {
  const snapshot = await logCollection
    .where("dateStr", "==", dateStr)
    .orderBy("date", "desc")
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { addLog, getLogsByDate };
