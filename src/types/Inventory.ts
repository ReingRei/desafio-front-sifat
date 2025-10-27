export interface Inventory {
    productId: number;
    quantity: number;
}

export interface InventoryAdjustRequest {
    quantity: number;
    reason: string;
}