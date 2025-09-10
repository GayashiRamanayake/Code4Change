// HISTORYCONTROLLER.JS
// ------------------------------------------------------------
// Controller layer for history API endpoints.
// Handles HTTP requests/responses for inventory history operations.

const historyService = require('../service/HistoryService');

class HistoryController {

  // GET /api/history/:date
  // Get inventory history for a specific date
  async getHistoryByDate(req, res) {
    try {
      const { date } = req.params;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'Date parameter is required',
          message: 'Please provide a date in YYYY-MM-DD format'
        });
      }

      const historyData = await historyService.getInventoryHistoryByDate(date);
      
      res.status(200).json({
        success: true,
        data: historyData,
        message: `History retrieved successfully for ${date}`
      });

    } catch (error) {
      console.error('Error in getHistoryByDate:', error);
      
      if (error.message.includes('Invalid date format')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format',
          message: 'Date must be in YYYY-MM-DD format'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve history data'
      });
    }
  }

  // GET /api/history/range/:startDate/:endDate
  // Get inventory history for a date range
  async getHistoryByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.params;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing parameters',
          message: 'Both startDate and endDate are required'
        });
      }

      const historyData = await historyService.getInventoryHistoryByDateRange(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: historyData,
        message: `History retrieved successfully for ${startDate} to ${endDate}`
      });

    } catch (error) {
      console.error('Error in getHistoryByDateRange:', error);
      
      if (error.message.includes('Invalid date format')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format',
          message: 'Dates must be in YYYY-MM-DD format'
        });
      }

      if (error.message.includes('Start date must be before')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date range',
          message: 'Start date must be before or equal to end date'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve history data'
      });
    }
  }

  // GET /api/history/dates
  // Get all available history dates
  async getAvailableDates(req, res) {
    try {
      const datesData = await historyService.getAvailableHistoryDates();
      
      res.status(200).json({
        success: true,
        data: datesData,
        message: 'Available dates retrieved successfully'
      });

    } catch (error) {
      console.error('Error in getAvailableDates:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve available dates'
      });
    }
  }

  // GET /api/history/export/:date
  // Export history data for a specific date
  async exportHistory(req, res) {
    try {
      const { date } = req.params;
      const { format = 'json' } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'Date parameter is required',
          message: 'Please provide a date in YYYY-MM-DD format'
        });
      }

      const exportData = await historyService.exportHistoryData(date, format);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="inventory-history-${date}.csv"`);
        return res.status(200).send(exportData);
      }

      res.status(200).json({
        success: true,
        data: exportData,
        message: `History data exported successfully for ${date}`
      });

    } catch (error) {
      console.error('Error in exportHistory:', error);
      
      if (error.message.includes('Invalid date format')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format',
          message: 'Date must be in YYYY-MM-DD format'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to export history data'
      });
    }
  }

  // POST /api/history/snapshot
  // Create a snapshot of current inventory (usually automated)
  async createInventorySnapshot(req, res) {
    try {
      const { date, inventoryItems } = req.body;
      
      if (!date || !inventoryItems) {
        return res.status(400).json({
          success: false,
          error: 'Missing required data',
          message: 'Date and inventoryItems are required'
        });
      }

      const result = await historyService.saveInventorySnapshot(date, inventoryItems);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Inventory snapshot created successfully'
      });

    } catch (error) {
      console.error('Error in createInventorySnapshot:', error);
      
      if (error.message.includes('Invalid date format')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format',
          message: 'Date must be in YYYY-MM-DD format'
        });
      }

      if (error.message.includes('No valid inventory items')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid inventory data',
          message: 'No valid inventory items provided'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create inventory snapshot'
      });
    }
  }

  // GET /api/history/search
  // Search history records with filters
  async searchHistory(req, res) {
    try {
      const { 
        startDate, 
        endDate, 
        category, 
        itemName,
        limit = 100 
      } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing parameters',
          message: 'startDate and endDate query parameters are required'
        });
      }

      let historyData = await historyService.getInventoryHistoryByDateRange(startDate, endDate);
      
      // Apply filters
      if (category) {
        Object.keys(historyData.data).forEach(date => {
          historyData.data[date] = historyData.data[date].filter(
            record => record.category.toLowerCase().includes(category.toLowerCase())
          );
        });
      }

      if (itemName) {
        Object.keys(historyData.data).forEach(date => {
          historyData.data[date] = historyData.data[date].filter(
            record => record.name.toLowerCase().includes(itemName.toLowerCase())
          );
        });
      }

      // Apply limit
      let totalCount = 0;
      Object.keys(historyData.data).forEach(date => {
        if (totalCount < limit) {
          const remainingLimit = limit - totalCount;
          historyData.data[date] = historyData.data[date].slice(0, remainingLimit);
          totalCount += historyData.data[date].length;
        } else {
          delete historyData.data[date];
        }
      });

      res.status(200).json({
        success: true,
        data: historyData,
        message: 'History search completed successfully'
      });

    } catch (error) {
      console.error('Error in searchHistory:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search history'
      });
    }
  }

}

module.exports = new HistoryController();
