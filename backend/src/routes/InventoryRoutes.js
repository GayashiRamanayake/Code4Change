import express from "express";
import * as InventoryController from "../controller/InventoryController.js";

const router = express.Router();

router.get("/", InventoryController.getInventory);
router.post("/", InventoryController.addInventory);
router.put("/:id", InventoryController.updateInventory);


export default router;



