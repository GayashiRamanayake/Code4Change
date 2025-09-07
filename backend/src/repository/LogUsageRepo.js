// backend/repositories/logUsageRepository.js
const { db } = require("../config/firebase");
const LogUsage = require("../models/LogUsage");

const collection = db.collection("logUsage");

async function getAllLogs() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => new LogUsage({ id: doc.id, ...doc.data() }));
}

async function addLog(logData) {
  const newLog = new LogUsage(logData);
  const docRef = await collection.add({ ...newLog });
  return { id: docRef.id, ...newLog };
}

module.exports = { getAllLogs, addLog };
