export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: Category;
    createdAt: string;
}

export interface ProductRequest {
    name: string;
    price: number;
    imageUrl: string;
    categoryId: number;
}

export interface ProductFilter {
    name?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sort?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}