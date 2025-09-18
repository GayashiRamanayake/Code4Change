// backend/src/controller/ProfileController.js
const ProfileService = require("../service/ProfileService");

// quick + dirty user resolver (headers). replace with auth middleware later if needed.
function resolveUser(req) {
  const uid = req.headers["x-user-id"];
  const email = req.headers["x-user-email"] || "";
  if (!uid) throw new Error("Missing x-user-id");
  return { uid, email };
}

exports.getMe = async (req, res) => {
  try {
    const { uid, email } = resolveUser(req);
    const data = await ProfileService.fetchFullProfile(uid, email);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { uid, email } = resolveUser(req);
    const data = await ProfileService.fetchFullProfile(uid, email);
    res.json(data.settings);
  } catch (e) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { uid } = resolveUser(req);
    const updated = await ProfileService.updateSettings(uid, req.body || {});
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
};

exports.getAppInfo = (_req, res) => {
  res.json(ProfileService.getAppInfo());
};

exports.logout = (_req, res) => res.status(204).end();
