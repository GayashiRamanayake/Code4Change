// backend/models/LogUsage.js
class LogUsage {
  constructor({ id = null, item, amount, date, note = "" }) {
    this.id = id;        // Firestore doc ID
    this.item = item;    // string (ingredient name)
    this.amount = amount; // string/number (e.g. "-0.5 kg")
    this.date = date;    // string or timestamp
    this.note = note;    // optional string
  }
}

module.exports = LogUsage;
