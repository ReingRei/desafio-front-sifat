import React, { useState, useEffect } from "react";
import type { Category, ProductFilter } from "../types/Product";
import { ProductService } from "../api/product/products-service";
import CurrencyInput from "react-currency-input-field";

interface ProductFilterPanelProps {
  onFilter: (newFilters: Partial<ProductFilter>) => void;
  onFilterClear: () => void;
  initialFilters?: ProductFilter;
}

const ProductFilterPanel: React.FC<ProductFilterPanelProps> = ({
  onFilter,
  onFilterClear,
  initialFilters,
}) => {
  const [categoryId, setCategoryId] = useState<number | "">(
    initialFilters?.categoryId ?? ""
  );
  const [minPrice, setMinPrice] = useState<string | "">(
    initialFilters?.minPrice?.toString() ?? ""
  );
  const [maxPrice, setMaxPrice] = useState<string | "">(
    initialFilters?.maxPrice?.toString() ?? ""
  );
  const [sort, setSort] = useState<string>(initialFilters?.sort ?? "");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await ProductService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategoryId(initialFilters?.categoryId ?? "");
    setMinPrice(initialFilters?.minPrice?.toString() ?? "");
    setMaxPrice(initialFilters?.maxPrice?.toString() ?? "");
    setSort(initialFilters?.sort ?? "");
  }, [initialFilters]);

  const handleApplyFilters = () => {
    const newFilters: Partial<ProductFilter> = {
      categoryId: categoryId === "" ? undefined : Number(categoryId),
      minPrice:
        minPrice === "" ? undefined : Number(minPrice.replace(",", ".")),
      maxPrice:
        maxPrice === "" ? undefined : Number(maxPrice.replace(",", ".")),
      sort: sort || undefined,
      page: 0,
    };
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    onFilterClear();
  };

  return (
    <div className="mb-4 p-4 border border-slate-300 rounded bg-gray-50 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div>
          <label
            htmlFor="filterCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Categoria
          </label>
          <select
            id="filterCategory"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
            disabled={loadingCategories}
            className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filterMinPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preço Mín.
          </label>
          <CurrencyInput
            id="filterMinPrice"
            value={minPrice}
            onValueChange={(value, name, values) => {
              const aqui = `${value} - ${name} - ${values}`;
              if (values && values.value && aqui) {
                setMinPrice(values.value);
              } else {
                setMinPrice("");
              }
            }}
            decimalsLimit={2}
            decimalSeparator=","
            intlConfig={{ locale: "pt-BR", currency: "BRL" }}
            placeholder="R$ 00,00"
            inputMode="numeric"
            min="0"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="filterMaxPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preço Máx.
          </label>
          <CurrencyInput
            id="filterMaxPrice"
            value={maxPrice}
            onValueChange={(value, name, values) => {
              const aqui = `${value} - ${name} - ${values}`;

              if (values && values.value && aqui) {
                setMaxPrice(values.value);
              } else {
                setMaxPrice("");
              }
            }}
            decimalsLimit={2}
            decimalSeparator=","
            intlConfig={{ locale: "pt-BR", currency: "BRL" }}
            placeholder="R$ 00,00"
            inputMode="numeric"
            min="0"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="filterSort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ordenar por
          </label>
          <select
            id="filterSort"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value === "" ? "" : e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-[42px]"
          >
            <option value="">Nome A-Z</option>
            <option value="name,desc">Nome (Z-A)</option>
            <option value="price,asc">Preço (Menor)</option>
            <option value="price,desc">Preço (Maior)</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={handleClearFilters} className="btn-base">
          Limpar Filtros
        </button>
        <button onClick={handleApplyFilters} className="btn-primary">
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default ProductFilterPanel;
