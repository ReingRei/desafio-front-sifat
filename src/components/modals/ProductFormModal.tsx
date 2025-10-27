import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase";
import ProductForm from "../ProductForm";
import type { Product, ProductRequest } from "../../types/Product";
import { ProductService } from "../../api/product/products-service";
import toast from "react-hot-toast";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  productToEdit: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  productToEdit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!productToEdit;

  const handleSubmit = async (formData: ProductRequest) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await ProductService.updateProduct(productToEdit!.id, formData);
        toast.success(`Produto "${formData.name}" atualizado com sucesso!`);
      } else {
        await ProductService.createProduct(formData);
        toast.success(`Produto "${formData.name}" criado com sucesso!`);
      }
      onSaveSuccess();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      overlayClose={false}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {isEditMode ? "Editar Produto" : "Adicionar Novo Produto"}
      </h2>
      <ProductForm
        isOpen={isOpen}
        key={productToEdit?.id ?? "new"}
        initialData={productToEdit}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </ModalBase>
  );
};

export default ProductFormModal;
