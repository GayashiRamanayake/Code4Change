// src/index.js
import "dotenv/config";                     // load environment variables
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Import routes/controllers
import inventoryRoutes from "./routes/InventoryRoutes.js";
import historyRouter from "./controller/HistoryController.js";
import "./firebaseAdmin.js";                 // initialize Firebase Admin SDK

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Mount routes
app.use("/inventory", inventoryRoutes);
app.use("/api/history", historyRouter);

// Health check endpoint
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
