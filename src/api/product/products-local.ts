import toast from "react-hot-toast";
import type {
  Category,
  PageResponse,
  Product,
  ProductFilter,
  ProductRequest,
} from "../../types/Product";
import type { IProductService } from "./Iporduct-service";

const LOCAL_CATEGORIES: Category[] = [
  { id: 1, name: "Eletrônicos" },
  { id: 2, name: "Roupas" },
  { id: 3, name: "Livros" },
  { id: 4, name: "Casa & Decoração" },
  { id: 5, name: "Alimentos" },
];

const STORAGE_KEY = "local_products";

const getLocalProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const getNextId = (products: Product[]): number => {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
};

const applyFiltersAndPagination = (
  allProducts: Product[],
  filter: ProductFilter
): PageResponse<Product> => {
  let filtered = [...allProducts];

  if (filter.name) {
      const nameLower = filter.name.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(nameLower));
  }
  // ...

  const page = filter.page || 0;
  const size = filter.size || 10;
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size);

  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end);

  return {
    content,
    totalElements,
    totalPages,
    number: page,
    size,
  } as PageResponse<Product>;
};


export const ProductLocalStorageService: IProductService = {
  async getProducts(filter: ProductFilter): Promise<PageResponse<Product>> {
    const allProducts = getLocalProducts(); 
    return applyFiltersAndPagination(allProducts, filter);
  },

  async getCategories(): Promise<Category[]> {
    return Promise.resolve(LOCAL_CATEGORIES);
  },

  async getProductById(id: number): Promise<Product> {
    const products = getLocalProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      toast.error("Produto não encontrado no LocalStorage");
      throw new Error("Produto não encontrado no LocalStorage");
    }
    return product;
  },

  async createProduct(data: ProductRequest): Promise<Product> {
    const products = getLocalProducts();
    
    const newProduct: Product = {
      ...data,
      id: getNextId(products),
      category: LOCAL_CATEGORIES.find((c) => c.id === data.categoryId) || {
        id: data.categoryId,
        name: "Desconhecida",
      },
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    saveLocalProducts(products);
    return newProduct;
  },

  async updateProduct(id: number, data: ProductRequest): Promise<Product> {
    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      toast.error("Produto não encontrado para atualização");
      throw new Error("Produto não encontrado para atualização");
    }

    const updatedProduct: Product = {
      ...products[index],
      ...data,
      category:
        LOCAL_CATEGORIES.find((c) => c.id === data.categoryId) ||
        products[index].category,
    };

    products[index] = updatedProduct;
    saveLocalProducts(products);
    return updatedProduct;
  },

  async deleteProduct(id: number): Promise<void> {
    const products = getLocalProducts();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) {
      toast.error("Produto não encontrado para exclusão");
      throw new Error("Produto não encontrado para exclusão");
    }

    saveLocalProducts(filteredProducts);
  },
};