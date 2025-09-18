// backend/src/repository/ProfileRepo.js
const { db } = require("../service/firebaseConfig");

const userRoot    = (uid) => db.ref(`users/${uid}`);
const profileRef  = (uid) => userRoot(uid).child("profile");
const settingsRef = (uid) => userRoot(uid).child("settings");

// ---- Profile ----
async function getProfile(uid) {
  const snap = await profileRef(uid).get();
  return snap.exists() ? snap.val() : null;
}

async function setProfile(uid, data) {
  await profileRef(uid).update(data); // merge, not overwrite
}

// ---- Settings ----
async function getSettings(uid) {
  const snap = await settingsRef(uid).get();
  return snap.exists() ? snap.val() : null;
}

async function setSettings(uid, data) {
  await settingsRef(uid).update(data); // merge, not overwrite
}

module.exports = {
  getProfile,
  setProfile,
  getSettings,
  setSettings
};
