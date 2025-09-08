import { Router } from "express";
import { HistoryService } from "../service/HistoryService.js";
import { validateHistoryInput } from "../models/HistoryModel.js";

const router = Router();

// GET /api/history?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const date = String(req.query.date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Query param 'date' (YYYY-MM-DD) is required" });
    }
    const rows = await HistoryService.getByDate(date);
    res.json({ date, count: rows.length, items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/history/export?date=YYYY-MM-DD
router.get("/export", async (req, res) => {
  try {
    const date = String(req.query.date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Query param 'date' (YYYY-MM-DD) is required" });
    }
    const rows = await HistoryService.getByDate(date);
    const csv = await HistoryService.toCsv(rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="inventory_${date}.csv"`);
    res.send(csv);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/history
router.post("/", async (req, res) => {
  try {
    const payload = req.body || {};
    const check = validateHistoryInput(payload);
    if (!check.ok) {
      return res.status(400).json({ error: "Validation failed", details: check.errors });
    }
    const created = await HistoryService.createOne(payload);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
