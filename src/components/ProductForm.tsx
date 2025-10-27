import React, { useState, useEffect } from "react";
import type { Product, ProductRequest, Category } from "../types/Product";
import { ProductService } from "../api/product/products-service";
import CurrencyInput from "react-currency-input-field";

interface ProductFormProps {
  initialData?: Product | null;
  isOpen: boolean;
  onSubmit: (data: ProductRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  isOpen,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState<string | "">(
    initialData?.price.toString() ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [categoryId, setCategoryId] = useState<number | "">(
    initialData?.category?.id ?? ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductRequest, string>> & { submit?: string }
  >({});

  useEffect(() => {
    if (isOpen && !categories.length) {
      const fetchCategories = async () => {
        try {
          setLoadingCategories(true);
          setCategories(await ProductService.getCategories());
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen, categories.length, loadingCategories]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductRequest, string>> = {};
    if (!name.trim()) newErrors.name = "O nome é obrigatório.";
    if (name.trim().length > 255)
      newErrors.name = "O nome não pode exceder 255 caracteres.";
    if (imageUrl.trim().length > 512)
      newErrors.imageUrl = "A URL da imagem não pode exceder 512 caracteres.";
    if (price === "" || Number(price) <= 0)
      newErrors.price = "O preço deve ser um número positivo.";
    if (categoryId === "") newErrors.categoryId = "A categoria é obrigatória.";
    if (imageUrl && !imageUrl.startsWith("http"))
      newErrors.imageUrl = "URL da imagem inválida.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData: ProductRequest = {
      name: name.trim(),
      price: Number(price.replace(',','.')),
      imageUrl: imageUrl.trim(),
      categoryId: Number(categoryId),
    };

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {" "}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            id="productName"
            value={name}
            maxLength={255}
            onChange={(e) => setName(e.target.value)}
            required
            className={`mt-1 block w-full border rounded px-3 py-2 text-sm shadow-sm ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="productPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Preço
          </label>
          <CurrencyInput
            id="productPrice"
            value={price}
            required
            onValueChange={(value, name, values) => {
              const aqui = `${value} - ${name}`;
              
              if (values && values.value && aqui) {
                setPrice(values.value);
              } else {
                setPrice("");
              }
            }}
            decimalsLimit={2}
            decimalSeparator=","
            intlConfig={{ locale: "pt-BR", currency: "BRL" }}
            placeholder="R$ 00,00"
            inputMode="numeric"
            className={`mt-1 block w-full border rounded px-3 py-2 text-sm shadow-sm ${
              errors.price
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="productCategory"
            className="block text-sm font-medium text-gray-700"
          >
            Categoria
          </label>
          <select
            id="productCategory"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
            disabled={loadingCategories}
            className={`mt-1 block w-full border rounded px-3 py-2 text-sm shadow-sm bg-white ${
              errors.categoryId
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } h-[42px]`} // Ajuste de altura
          >
            <option value="" disabled>
              Selecione...
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="productImageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL da Imagem
          </label>
          <input
            type="url"
            id="productImageUrl"
            value={imageUrl}
            maxLength={512}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={`mt-1 block w-full border rounded px-3 py-2 text-sm shadow-sm ${
              errors.imageUrl
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-xs text-red-600">{errors.imageUrl}</p>
          )}
        </div>

        {errors.submit && (
          <p className="mt-1 text-sm text-red-600">{errors.submit}</p>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className={"btn-base"}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className={"btn-primary"} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
