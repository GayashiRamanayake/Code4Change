// backend/src/service/ProfileService.js
const { getProfile, setProfile, getSettings, setSettings } = require("../repository/ProfileRepo");
const { DEFAULT_SETTINGS, DEFAULT_PROFILE } = require("../models/UserModel");

const nowTs = () => Date.now();

async function ensureProfile(uid, emailFromAuth) {
  let prof = await getProfile(uid);
  if (!prof) {
    prof = { ...DEFAULT_PROFILE, email: emailFromAuth || "" };
    await setProfile(uid, prof);
  }
  return prof;
}

async function ensureSettings(uid) {
  let settings = await getSettings(uid);
  if (!settings) {
    settings = { ...DEFAULT_SETTINGS, updatedAt: nowTs() };
    await setSettings(uid, settings);
  }
  return settings;
}

async function fetchFullProfile(uid, emailFromAuth) {
  const [profile, settings] = await Promise.all([
    ensureProfile(uid, emailFromAuth),
    ensureSettings(uid)
  ]);
  return { profile, settings };
}

async function updateSettings(uid, partial) {
  const allowed = {};
  if (typeof partial.notificationsEnabled === "boolean")
    allowed.notificationsEnabled = partial.notificationsEnabled;
  if (typeof partial.lowStockAlertsEnabled === "boolean")
    allowed.lowStockAlertsEnabled = partial.lowStockAlertsEnabled;
  if (typeof partial.qualityAlertsEnabled === "boolean")
    allowed.qualityAlertsEnabled = partial.qualityAlertsEnabled;

  allowed.updatedAt = nowTs();
  await setSettings(uid, allowed);
  return getSettings(uid);
}

function getAppInfo() {
  return {
    name: "Neko & Kopi Inventory",
    version: "1.0.0",
    about: "Professional inventory management system designed specifically for café operations.",
    supportEmail: "support@nekokopi.com"
  };
}

module.exports = { fetchFullProfile, updateSettings, getAppInfo };
