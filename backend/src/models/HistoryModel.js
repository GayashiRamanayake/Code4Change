// HISTORYMODEL.JS
// ------------------------------------------------------------
// Data model for inventory history records.
// Defines the structure of history data stored in Firebase.

class HistoryModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.category = data.category || '';
    this.stock = data.stock || '';
    this.value = data.value || '';
    this.usage = data.usage || '';
    this.lastUpdated = data.lastUpdated || '';
    this.timestamp = data.timestamp || Date.now();
  }

  // Convert to plain object for Firebase storage
  toObject() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      stock: this.stock,
      value: this.value,
      usage: this.usage,
      lastUpdated: this.lastUpdated,
      timestamp: this.timestamp
    };
  }

  // Create from Firebase data
  static fromObject(obj, id = null) {
    return new HistoryModel({
      id: id || obj.id,
      ...obj
    });
  }

  // Validation method
  isValid() {
    return this.name && this.category && this.stock && this.lastUpdated;
  }
}

module.exports = HistoryModel;
