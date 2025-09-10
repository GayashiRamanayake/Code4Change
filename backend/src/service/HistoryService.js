// HISTORYSERVICE.JS
// ------------------------------------------------------------
// Service layer for history business logic.
// Handles data processing, validation, and business rules for inventory history.

const historyRepo = require('../repository/HistoryRepo');

class HistoryService {
  
  // Get formatted inventory history for a specific date
  async getInventoryHistoryByDate(dateString) {
    try {
      // Validate date format (YYYY-MM-DD)
      if (!this.isValidDateString(dateString)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
      }

      const historyRecords = await historyRepo.getHistoryByDate(dateString);
      
      // Sort records by category and then by name for consistent ordering
      const sortedRecords = historyRecords.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

      // Add calculated fields if needed
      const enrichedRecords = sortedRecords.map(record => ({
        ...record.toObject(),
        // Add any computed fields here if needed
        stockValue: this.parseValue(record.value) || 0,
        usageValue: this.calculateUsageValue(record.usage, record.value)
      }));

      return {
        date: dateString,
        recordCount: enrichedRecords.length,
        totalValue: this.calculateTotalValue(enrichedRecords),
        records: enrichedRecords
      };
    } catch (error) {
      console.error('Error in getInventoryHistoryByDate:', error);
      throw error;
    }
  }

  // Get history for multiple dates (for charts, reports, etc.)
  async getInventoryHistoryByDateRange(startDate, endDate) {
    try {
      if (!this.isValidDateString(startDate) || !this.isValidDateString(endDate)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
      }

      if (startDate > endDate) {
        throw new Error('Start date must be before or equal to end date');
      }

      const historyRecords = await historyRepo.getHistoryByDateRange(startDate, endDate);
      
      // Group by date
      const groupedByDate = this.groupRecordsByDate(historyRecords);
      
      return {
        dateRange: { startDate, endDate },
        totalRecords: historyRecords.length,
        dateCount: Object.keys(groupedByDate).length,
        data: groupedByDate
      };
    } catch (error) {
      console.error('Error in getInventoryHistoryByDateRange:', error);
      throw error;
    }
  }

  // Get available history dates for calendar/picker
  async getAvailableHistoryDates() {
    try {
      const dates = await historyRepo.getAvailableDates();
      
      return {
        dates,
        count: dates.length,
        latestDate: dates.length > 0 ? dates[0] : null,
        oldestDate: dates.length > 0 ? dates[dates.length - 1] : null
      };
    } catch (error) {
      console.error('Error in getAvailableHistoryDates:', error);
      throw error;
    }
  }

  // Export history data (for CSV/Excel export)
  async exportHistoryData(dateString, format = 'json') {
    try {
      const historyData = await this.getInventoryHistoryByDate(dateString);
      
      if (format === 'csv') {
        return this.convertToCSV(historyData.records);
      }
      
      return historyData;
    } catch (error) {
      console.error('Error in exportHistoryData:', error);
      throw error;
    }
  }

  // Create/update history records (usually called from inventory updates)
  async saveInventorySnapshot(date, inventoryItems) {
    try {
      if (!this.isValidDateString(date)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
      }

      if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
        throw new Error('Invalid inventory items array');
      }

      // Validate and format items
      const validItems = inventoryItems.filter(item => this.isValidInventoryItem(item));
      
      if (validItems.length === 0) {
        throw new Error('No valid inventory items provided');
      }

      await historyRepo.saveMultipleHistoryRecords(date, validItems);
      
      return {
        date,
        savedCount: validItems.length,
        skippedCount: inventoryItems.length - validItems.length
      };
    } catch (error) {
      console.error('Error in saveInventorySnapshot:', error);
      throw error;
    }
  }

  // Helper methods
  
  isValidDateString(dateString) {
    if (!dateString || typeof dateString !== 'string') return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  isValidInventoryItem(item) {
    return item && 
           typeof item === 'object' &&
           item.id && 
           item.name && 
           item.category && 
           item.stock !== undefined;
  }

  parseValue(valueString) {
    if (!valueString) return 0;
    // Remove currency symbols and parse
    const cleanValue = valueString.toString().replace(/[$,]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  calculateUsageValue(usage, totalValue) {
    if (!usage || !totalValue) return 0;
    
    // Extract numeric part from usage string (e.g., "5 kg" -> 5)
    const usageAmount = parseFloat(usage.toString());
    const stockValue = this.parseValue(totalValue);
    
    if (isNaN(usageAmount) || stockValue === 0) return 0;
    
    // This is a simplified calculation - you might need more complex logic
    // based on your business rules
    return (stockValue * 0.1); // Placeholder calculation
  }

  calculateTotalValue(records) {
    return records.reduce((total, record) => {
      return total + (record.stockValue || 0);
    }, 0);
  }

  groupRecordsByDate(records) {
    return records.reduce((groups, record) => {
      const date = record.date || record.lastUpdated;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {});
  }

  convertToCSV(records) {
    if (!records || records.length === 0) {
      return 'No data available';
    }

    const headers = ['Name', 'Category', 'Stock', 'Usage', 'Value', 'Last Updated'];
    const csvRows = [headers.join(',')];

    records.forEach(record => {
      const row = [
        `"${record.name || ''}"`,
        `"${record.category || ''}"`,
        `"${record.stock || ''}"`,
        `"${record.usage || ''}"`,
        `"${record.value || ''}"`,
        `"${record.lastUpdated || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
}

module.exports = new HistoryService();