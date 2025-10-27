import type { Category, Product, ProductFilter, ProductRequest } from "../../types/Product";


export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface IProductService {
  getProducts(filter: ProductFilter): Promise<PageResponse<Product>>;
  getCategories(): Promise<Category[]>;
  getProductById(id: number): Promise<Product>;
  createProduct(data: ProductRequest): Promise<Product>;
  updateProduct(id: number, data: ProductRequest): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}
