import type { Inventory, InventoryAdjustRequest } from "../../types/Inventory";

export interface IInventoryService {
  getInventory(productId: number): Promise<Inventory>;
  adjustInventory(productId: number, data: InventoryAdjustRequest): Promise<Inventory>;
}
