import { VITE_API_INVENTORY_BASE_URL } from '../../config/data-source';
import axios, { type AxiosInstance } from 'axios';
import type { Inventory, InventoryAdjustRequest } from '../../types/Inventory';
import type { IInventoryService } from './IInventoryService';

const api: AxiosInstance = axios.create({
    baseURL: VITE_API_INVENTORY_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const InventoryApiService: IInventoryService = {

    async getInventory(productId: number): Promise<Inventory> {
        const response = await api.get<Inventory>(`/inventory/${productId}`);
        return response.data;
    },

    async adjustInventory(productId: number, data: InventoryAdjustRequest): Promise<Inventory> {
        const response = await api.patch<Inventory>(`/inventory/${productId}/adjust`, data);
        return response.data;
    },

};