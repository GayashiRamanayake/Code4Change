import "dotenv/config";
import express from "express";
import cors from "cors";
import "./firebaseAdmin.js";                 // init Admin SDK once
import historyRouter from "./controller/HistoryController.js";

const app = express();

app.use(cors());                             // allow RN app to call this
app.use(express.json());                     // parse JSON bodies

app.get("/health", (_req, res) => res.json({ ok: true }));

// mount controller directly (since you don't use /routes)
app.use("/api/history", historyRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
