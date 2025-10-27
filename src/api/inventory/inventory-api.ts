import type { Inventory, InventoryAdjustRequest } from '../../types/Inventory';
import type { IInventoryService } from './Iinventory-service';
import inventoryApiClient from '../inventory-client';

export const InventoryApiService: IInventoryService = {

    async getInventory(productId: number): Promise<Inventory> {
        const response = await inventoryApiClient.get<Inventory>(`/inventory/${productId}`);
        return response.data;
    },

    async adjustInventory(productId: number, data: InventoryAdjustRequest): Promise<Inventory> {
        const response = await inventoryApiClient.patch<Inventory>(`/inventory/${productId}/adjust`, data);
        return response.data;
    },

};