// Inventory model
export default class Inventory {
  constructor(name, category, stock, threshold) {
    this.name = name;
    this.category = category;
    this.stock = stock;
    this.threshold = threshold;
  }
}

