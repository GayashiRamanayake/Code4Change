import * as logService from "../services/logUsageService.js";

// Controller for adding a usage log
// Handles request, calls service layer, and sends response
async function addLogController(req, res) {
  try {
    const log = await logService.addLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller for fetching logs by date
// Extracts date from query params and delegates to service
async function getLogsByDateController(req, res) {
  try {
    const dateStr = req.query.date;
    const logs = await logService.getLogsByDate(dateStr);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { addLogController, getLogsByDateController };
