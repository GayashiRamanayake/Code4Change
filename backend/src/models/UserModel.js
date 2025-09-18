// backend/src/models/UserModel.js
const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  lowStockAlertsEnabled: true,
  qualityAlertsEnabled: true,
  updatedAt: 0
};

const DEFAULT_PROFILE = {
  displayName: "Café Manager",
  email: "",
  role: "manager",
  avatarUrl: "",
  version: "1.0.0"
};

module.exports = { DEFAULT_SETTINGS, DEFAULT_PROFILE };

