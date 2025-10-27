// src/api/products-service.ts

import { USE_LOCAL_STORAGE } from "../../config/data-source";
import { type IProductService } from "./IProductService";
import { ProductApiService } from "./products-api";
import { ProductLocalStorageService } from "./products-local";

let serviceInstance: IProductService;

if (USE_LOCAL_STORAGE) {
    console.warn("Modo LocalStorage Ativo. Usando ProductLocalStorageService.");
    serviceInstance = ProductLocalStorageService; 
} else {
    serviceInstance = ProductApiService;
}

export const ProductService = serviceInstance;