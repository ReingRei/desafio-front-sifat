import { API_BASE_URL } from '../../config/data-source';
import axios, { type AxiosInstance } from 'axios';
import type { IProductService, PageResponse } from './IProductService';
import type { ProductFilter, Product, Category, ProductRequest } from '../../types/Product';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ProductApiService: IProductService = {

    async getProducts(filter: ProductFilter): Promise<PageResponse<Product>> {
        const response = await api.get<PageResponse<Product>>('/products', { params: filter });
        return response.data;
    },

    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    async getProductById(id: number): Promise<Product> {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    async createProduct(data: ProductRequest): Promise<Product> {
        const response = await api.post<Product>('/products', data);
        return response.data;
    },

    async updateProduct(id: number, data: ProductRequest): Promise<Product> {
        const response = await api.put<Product>(`/products/${id}`, data);
        return response.data;
    },

    async deleteProduct(id: number): Promise<void> {
        return await api.delete(`/products/${id}`);
    }
};