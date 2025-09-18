// Inventory model
/*export default class Inventory {
  constructor(name, category, stock, threshold) {
    this.name = name;
    this.category = category;
    this.stock = stock;
    this.threshold = threshold;
  }
}*/

export default class Inventory {
  constructor(name, category, stock, threshold) {
    this.name = name;
    this.category = category;
    this.stock = stock;
    this.threshold = threshold;
    this.updatedAt = new Date().toISOString().split("T")[0]; // store only date (YYYY-MM-DD)
    this.history = [
      {
        date: this.updatedAt,
        stockBefore: stock,
        stockUsed: 0,
        stockAfter: stock
      }
    ];
  }
}


