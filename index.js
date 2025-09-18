// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/profile", profileRoutes);

// mount your other APIs here later: inventory, daily-usage, history, etc.
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/usage", usageRoutes);
// app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));

