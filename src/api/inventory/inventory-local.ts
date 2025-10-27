import toast from "react-hot-toast";
import type { Inventory, InventoryAdjustRequest } from "../../types/Inventory";
import type { IInventoryService } from "./Iinventory-service";

const STORAGE_KEY = "local_inventories";

const getLocalInventories = (): Inventory[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalInventory = (inventories: Inventory[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
};

export const InventoryLocalStorageService: IInventoryService = {
  async getInventory(productId: number): Promise<Inventory> {
    const inventories = getLocalInventories();
    const inventory = inventories.find((i) => i.productId === productId);
    if (!inventory) {
      inventories.push({ productId, quantity: 0 });
      saveLocalInventory(inventories);
      return { productId, quantity: 0 };
    }
    return inventory;
  },

  async adjustInventory(
    productId: number,
    data: InventoryAdjustRequest
  ): Promise<Inventory> {
    const inventories = getLocalInventories();
    const index = inventories.findIndex((i) => i.productId === productId);

    if (index === -1) {
      toast.error("Inevntory não encontrado no LocalStorage");
      throw new Error("Inevntory não encontrado no LocalStorage");
    }

    const updatedInventory: Inventory = {
      ...inventories[index],
      quantity: inventories[index].quantity + data.quantity,
    };

    inventories[index] = updatedInventory;
    saveLocalInventory(inventories);
    return updatedInventory;
  },
};
