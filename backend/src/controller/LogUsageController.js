// backend/controllers/logUsageController.js
import * as logService from "../services/logUsageService.js";

async function addLogController(req, res) {
  try {
    const log = await logService.addLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLogsByDateController(req, res) {
  try {
    const dateStr = req.query.date; // 'YYYY-MM-DD'
    const logs = await logService.getLogsByDate(dateStr);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { addLogController, getLogsByDateController };


