// src/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import inventoryRoutes from "./routes/InventoryRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://192.168.8.101:${PORT}`);
});



