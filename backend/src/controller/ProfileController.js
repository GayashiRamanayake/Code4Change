// src/controller/ProfileController.js
import * as ProfileService from "../service/ProfileService.js";

// Read user info from headers (keeps it simple / no auth changes)
function resolveUser(req) {
  const uid = req.headers["x-user-id"] || "demo-user";
  const email = req.headers["x-user-email"] || "";
  return { uid, email };
}

export async function getMe(req, res) {
  try {
    const { uid, email } = resolveUser(req);
    const data = await ProfileService.fetchFullProfile(uid, email);
    res.json(data); // { profile, settings }
  } catch (e) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
}

export async function getSettings(req, res) {
  try {
    const { uid, email } = resolveUser(req);
    const data = await ProfileService.fetchFullProfile(uid, email);
    res.json(data.settings);
  } catch (e) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
}

export async function updateSettings(req, res) {
  try {
    const { uid } = resolveUser(req);
    const updated = await ProfileService.updateSettings(uid, req.body || {});
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message || "Bad Request" });
  }
}

export function getAppInfo(_req, res) {
  res.json(ProfileService.getAppInfo());
}

export function logout(_req, res) {
  res.status(204).end();
}
