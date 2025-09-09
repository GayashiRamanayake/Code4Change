import * as InventoryRepo from "../repository/InventoryRepo.js";

export const addInventory = async (item) => {
  return await InventoryRepo.addInventoryItem(item);
};

export const updateInventory = async (id, item) => {
  try {
    await db.ref(`inventory/${id}`).update(item);
    return { id, ...item };
  } catch (err) {
    console.error("Error updating Firebase item:", err);
    throw err;
  }
};


export const getAllInventory = async () => {
  return await InventoryRepo.getAllInventory();
};





