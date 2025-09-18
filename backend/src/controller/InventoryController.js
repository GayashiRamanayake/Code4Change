import * as InventoryService from "../service/InventoryService.js";

export const addInventory = async (req, res) => {
  try {
    console.log("POST /inventory body:", req.body);
    const newItem = await InventoryService.addInventory(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Failed to add inventory item:", err);
    res.status(500).json({ error: "Failed to add inventory item" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await InventoryService.updateInventory(id, req.body);
    res.json(updatedItem);
  } catch (err) {
    console.error("Failed to update inventory item:", err);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
};


export const getInventory = async (req, res) => {
  try {
    const inventoryList = await InventoryService.getAllInventory();
    res.json(inventoryList);
  } catch (err) {
    console.error("Failed to fetch inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

export const getInventoryHistory = async (req, res) => {
  try {
    const { date } = req.query; // /inventory/history?date=2025-09-18
    const allItems = await InventoryService.getAllInventory();

    const history = allItems.map(item => {
      const entry = item.history?.find(h => h.date === date);
      return entry ? { ...item, ...entry } : null;
    }).filter(Boolean);

    res.json(history);
  } catch (err) {
    console.error("Failed to fetch inventory history:", err);
    res.status(500).json({ error: "Failed to fetch inventory history" });
  }
};






