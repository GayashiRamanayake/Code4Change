// backend/models/LogUsage.js
class LogUsage {
  constructor({ id = null, itemId, itemName, amount, date, note = "" }) {
    this.id = id;
    this.itemId = itemId;
    this.itemName = itemName;
    this.amount = amount;
    this.date = date;
    this.note = note;
    this.dateStr = date ? date.toISOString().split("T")[0] : null; // YYYY-MM-DD
  }
}

module.exports = LogUsage;
