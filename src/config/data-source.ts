export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
export const VITE_API_INVENTORY_BASE_URL: string = import.meta.env
  .VITE_API_INVENTORY_BASE_URL;

export const USE_LOCAL_STORAGE: boolean = !API_BASE_URL;

console.log(
  `[DATA] Modo de operação: ${USE_LOCAL_STORAGE ? "LOCALSTORAGE" : "API"}`
);
