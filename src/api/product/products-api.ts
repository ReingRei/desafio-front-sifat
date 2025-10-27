import type { IProductService, PageResponse } from './Iporduct-service';
import type { ProductFilter, Product, Category, ProductRequest } from '../../types/Product';
import productApiClient from '../product-client';


export const ProductApiService: IProductService = {

    async getProducts(filter: ProductFilter): Promise<PageResponse<Product>> {
        const response = await productApiClient.get<PageResponse<Product>>('/products', { params: filter });
        return response.data;
    },

    async getCategories(): Promise<Category[]> {
        const response = await productApiClient.get<Category[]>('/categories');
        return response.data;
    },

    async getProductById(id: number): Promise<Product> {
        const response = await productApiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    async createProduct(data: ProductRequest): Promise<Product> {
        const response = await productApiClient.post<Product>('/products', data);
        return response.data;
    },

    async updateProduct(id: number, data: ProductRequest): Promise<Product> {
        const response = await productApiClient.put<Product>(`/products/${id}`, data);
        return response.data;
    },

    async deleteProduct(id: number): Promise<void> {
        return await productApiClient.delete(`/products/${id}`);
    }
};