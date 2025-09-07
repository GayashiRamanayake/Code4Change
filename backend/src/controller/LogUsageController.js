const logUsageService = require("../services/logUsageService");

exports.addLog = async (req, res) => {
  try {
    const logData = req.body;
    const newLog = await logUsageService.addLog(logData);
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await logUsageService.getLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
