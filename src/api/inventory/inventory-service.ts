// src/api/products-service.ts

import { USE_LOCAL_STORAGE } from "../../config/data-source";
import type { IInventoryService } from "./IInventoryService";
import { InventoryApiService } from "./inventory-api";
import { InventoryLocalStorageService } from "./inventory-local";

let serviceInstance: IInventoryService;

if (USE_LOCAL_STORAGE) {
    console.warn("Modo LocalStorage Ativo. Usando InventoryLocalStorageService.");
    serviceInstance = InventoryLocalStorageService; 
} else {
    serviceInstance = InventoryApiService;
}

export const InventoryService = serviceInstance;