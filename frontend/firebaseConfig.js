
// backend/src/service/firebaseConfig.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    // uses GOOGLE_APPLICATION_CREDENTIALS from env
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DB_URL
  });
}

const db = admin.database();

module.exports = { admin, db };


