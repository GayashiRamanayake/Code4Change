// backend/src/service/firebaseConfig.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // uses GOOGLE_APPLICATION_CREDENTIALS
    databaseURL: process.env.FIREBASE_DB_URL // e.g. https://neko-and-kopi-default-rtdb.firebaseio.com
  });
}

const db = admin.database();
module.exports = { admin, db };
