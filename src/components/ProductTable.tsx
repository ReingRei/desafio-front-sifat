import React, { useState } from "react";
import type { Product } from "../types/Product";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import ProductFormModal from "./modals/ProductFormModal";
import StockAdjustModal from "./modals/StockAdjustModal";
import {
  PencilSquareIcon,
  TrashIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { ProductService } from "../api/product/products-service";
import toast from "react-hot-toast";

interface ProductTableProps {
  products: Product[];
  onDataChanged: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDataChanged,
}) => {
  const [modalState, setModalState] = useState<{
    type: "edit" | "delete" | "stock" | null;
    product: Product | null;
  }>({ type: null, product: null });

  const handleOpenEdit = (product: Product) =>
    setModalState({ type: "edit", product });
  const handleOpenDelete = (product: Product) =>
    setModalState({ type: "delete", product });
  const handleOpenStock = (product: Product) =>
    setModalState({ type: "stock", product });
  const handleCloseModals = () => setModalState({ type: null, product: null });

  const handleConfirmDelete = async (productId: number) => {
    try {
      await ProductService.deleteProduct(productId);
      handleCloseModals();
      onDataChanged();
      toast.success(`Produto excluído com sucesso!`);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error(`Erro ao excluir produto.`);
    }
  };

  const handleModalSaveSuccess = () => {
    handleCloseModals();
    onDataChanged();
  };

  return (
    <>
      {" "}
      <div className="overflow-x-auto shadow-md sm:rounded-lg mb-4 border border-slate-300">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3">
                Preço
              </th>
              <th scope="col" className="px-6 py-3">
                Imagem
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Ações</span> Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b border-slate-300 hover:bg-gray-100"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {product.name}
                </th>
                <td className="px-6 py-4">
                  {product.category?.name || "N/A"}{" "}
                </td>
                <td className="px-6 py-4">
                  R$ {product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    "Sem imagem"
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => handleOpenEdit(product)}>
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleOpenStock(product)}>
                      <ArchiveBoxIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleOpenDelete(product)}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={modalState.type === "delete"}
        product={modalState.product}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
      />
      <ProductFormModal
        isOpen={modalState.type === "edit"}
        productToEdit={modalState.product}
        onClose={handleCloseModals}
        onSaveSuccess={handleModalSaveSuccess}
      />
      <StockAdjustModal
        isOpen={modalState.type === "stock"}
        product={modalState.product}
        onClose={handleCloseModals}
      />
    </>
  );
};

export default ProductTable;
