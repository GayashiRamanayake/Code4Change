const logUsageRepository = require("../repository/logUsageRepository");

exports.addLog = async (logData) => {
  return await logUsageRepository.addLog(logData);
};

exports.getLogs = async () => {
  return await logUsageRepository.getLogs();
};
