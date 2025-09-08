// src/controller/InventoryController.js
import * as InventoryService from "../service/InventoryService.js";

export const addInventory = async (req, res) => {
  try {
    console.log("POST /inventory body:", req.body); // debug
    const newItem = await InventoryService.addInventory(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Failed to add inventory item:", err);
    res.status(500).json({ error: "Failed to add inventory item" });
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




