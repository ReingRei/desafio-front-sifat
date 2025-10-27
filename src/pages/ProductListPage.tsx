import React, { useState, useEffect } from "react";
import { ProductService } from "../api/product/products-service";
import type { Product, ProductFilter, PageResponse } from "../types/Product";
import PaginationControls from "../components/PaginationControls";
import ProductFilterPanel from "../components/ProductFilterPanel";
import TopActionBar from "../components/TopActionBar";
import ProductTable from "../components/ProductTable";
import toast from "react-hot-toast";

const ProductListPage: React.FC = () => {
  const [productsPage, setProductsPage] =
    useState<PageResponse<Product> | null>(null);
  const [filters, setFilters] = useState<ProductFilter>({ page: 0, size: 10 });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductService.getProducts(filters);
        setProductsPage(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar produtos."
        );
      toast.error(`Erro ao buscar produtos.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (newSize: number) => {
    setFilters((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleNameSearch = (name: string) => {
    setFilters((prev) => ({
      ...prev,
      name: name || undefined,
    }));
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handlePanelFilterApply = (
    appliedPanelFilters: Partial<ProductFilter>
  ) => {
    setFilters((prev) => ({
      ...prev,
      ...appliedPanelFilters,
    }));
    setShowFilters(false);
  };

  const handlePanelFilterClear = () => {
    setFilters((prev) => ({
      name: prev.name,
      page: 0,
      size: prev.size,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
    }));
    setShowFilters(false);
  };

  const handleDataChanged = () => {
    setFilters((prev) => ({ ...prev }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>

      <TopActionBar
        onSearch={handleNameSearch}
        onToggleFilters={handleToggleFilters}
        onDataChanged={handleDataChanged}
        isFilterPanelOpen={showFilters}
      />

      {showFilters && (
        <div id="filter-panel" className="mb-4">
          <ProductFilterPanel
            onFilter={handlePanelFilterApply}
            onFilterClear={handlePanelFilterClear}
            initialFilters={filters}
          />
        </div>
      )}

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}
      {productsPage && productsPage.content.length > 0 && !loading && (
        <ProductTable
          products={productsPage.content}
          onDataChanged={handleDataChanged}
        />
      )}
      {productsPage && productsPage.content.length === 0 && !loading && (
        <p>Nenhum produto encontrado.</p>
      )}

      {productsPage && (
        <PaginationControls
          currentPage={productsPage.number}
          totalPages={productsPage.totalPages}
          totalElements={productsPage.totalElements}
          currentSize={productsPage.size}
          onPageChange={handlePageChange}
          onSizeChange={handleSizeChange}
        />
      )}
    </div>
  );
};

export default ProductListPage;
