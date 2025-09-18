/*import express from "express";
import * as InventoryController from "../controller/InventoryController.js";

const router = express.Router();

router.get("/", InventoryController.getInventory);
router.post("/", InventoryController.addInventory);
router.put("/:id", InventoryController.updateInventory);


export default router;*/

import express from "express";
import * as InventoryController from "../controllers/InventoryController.js";

const router = express.Router();

router.post("/", InventoryController.addInventory);
router.get("/", InventoryController.getAllInventory);
router.put("/:id", InventoryController.updateInventory);

// new history route
router.get("/history", InventoryController.getInventoryHistory);

export default router;




