// src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import inventoryRoutes from "./routes/InventoryRoutes.js";
import historyRouter from "./controller/HistoryController.js";
import "./firebaseAdmin.js";

// ↓↓↓ this must match the real filename (lowercase p)
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/inventory", inventoryRoutes);
app.use("/api/history", historyRouter);

// mount profile API
app.use("/api/profile", profileRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
