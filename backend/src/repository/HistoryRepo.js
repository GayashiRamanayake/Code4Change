// HISTORYREPO.JS
// ------------------------------------------------------------
// Repository layer for history data operations.
// Handles Firebase Realtime Database interactions for inventory history.

const { database } = require('../../config/dbConfig');
const HistoryModel = require('../models/HistoryModel');

class HistoryRepo {
  constructor() {
    // Firebase path structure: /history/{date}/{itemId}
    this.historyRef = database.ref('history');
  }

  // Get inventory history for a specific date
  async getHistoryByDate(date) {
    try {
      const dateRef = this.historyRef.child(date);
      const snapshot = await dateRef.once('value');
      
      if (!snapshot.exists()) {
        return [];
      }

      const data = snapshot.val();
      const historyRecords = [];
      
      // Convert Firebase object to array of HistoryModel instances
      Object.keys(data).forEach(key => {
        const record = HistoryModel.fromObject(data[key], key);
        historyRecords.push(record);
      });

      return historyRecords;
    } catch (error) {
      console.error('Error fetching history by date:', error);
      throw new Error('Failed to fetch history records');
    }
  }

  // Get history for a date range
  async getHistoryByDateRange(startDate, endDate) {
    try {
      const snapshot = await this.historyRef
        .orderByKey()
        .startAt(startDate)
        .endAt(endDate)
        .once('value');
      
      if (!snapshot.exists()) {
        return [];
      }

      const data = snapshot.val();
      const historyRecords = [];
      
      // Iterate through dates and items
      Object.keys(data).forEach(date => {
        Object.keys(data[date]).forEach(itemId => {
          const record = HistoryModel.fromObject(data[date][itemId], itemId);
          record.date = date; // Add date field for context
          historyRecords.push(record);
        });
      });

      return historyRecords;
    } catch (error) {
      console.error('Error fetching history by date range:', error);
      throw new Error('Failed to fetch history records for date range');
    }
  }

  // Save/update inventory history for a specific date
  async saveHistoryRecord(date, itemId, historyData) {
    try {
      const historyModel = new HistoryModel(historyData);
      
      if (!historyModel.isValid()) {
        throw new Error('Invalid history data provided');
      }

      const recordRef = this.historyRef.child(date).child(itemId);
      await recordRef.set(historyModel.toObject());
      
      return historyModel;
    } catch (error) {
      console.error('Error saving history record:', error);
      throw new Error('Failed to save history record');
    }
  }

  // Save multiple history records for a date (bulk operation)
  async saveMultipleHistoryRecords(date, records) {
    try {
      const updates = {};
      
      records.forEach(record => {
        const historyModel = new HistoryModel(record);
        if (historyModel.isValid()) {
          updates[`${date}/${record.id}`] = historyModel.toObject();
        }
      });

      if (Object.keys(updates).length === 0) {
        throw new Error('No valid records to save');
      }

      await this.historyRef.update(updates);
      return true;
    } catch (error) {
      console.error('Error saving multiple history records:', error);
      throw new Error('Failed to save multiple history records');
    }
  }

  // Delete history record for a specific date and item
  async deleteHistoryRecord(date, itemId) {
    try {
      const recordRef = this.historyRef.child(date).child(itemId);
      await recordRef.remove();
      return true;
    } catch (error) {
      console.error('Error deleting history record:', error);
      throw new Error('Failed to delete history record');
    }
  }

  // Get all available history dates
  async getAvailableDates() {
    try {
      const snapshot = await this.historyRef.once('value');
      
      if (!snapshot.exists()) {
        return [];
      }

      const dates = Object.keys(snapshot.val()).sort().reverse(); // Most recent first
      return dates;
    } catch (error) {
      console.error('Error fetching available dates:', error);
      throw new Error('Failed to fetch available dates');
    }
  }

  // Check if history exists for a specific date
  async hasHistoryForDate(date) {
    try {
      const snapshot = await this.historyRef.child(date).once('value');
      return snapshot.exists();
    } catch (error) {
      console.error('Error checking history existence:', error);
      return false;
    }
  }
}

module.exports = new HistoryRepo();