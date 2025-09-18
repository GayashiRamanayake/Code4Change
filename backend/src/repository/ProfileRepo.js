// src/repository/ProfileRepo.js
import { getDatabase } from "firebase-admin/database";

// uses the default Admin app initialized in src/firebaseAdmin.js
const db = getDatabase();

const profileRef  = (uid) => db.ref(`users/${uid}/profile`);
const settingsRef = (uid) => db.ref(`users/${uid}/settings`);

// ---- Profile ----
export async function getProfile(uid) {
  const snap = await profileRef(uid).get();
  return snap.exists() ? snap.val() : null;
}

export async function setProfile(uid, data) {
  // merge (don’t overwrite whole node)
  await profileRef(uid).update(data);
}

// ---- Settings ----
export async function getSettings(uid) {
  const snap = await settingsRef(uid).get();
  return snap.exists() ? snap.val() : null;
}

export async function setSettings(uid, data) {
  // merge (don’t overwrite whole node)
  await settingsRef(uid).update(data);
}
