import React, { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import ModalBase from "./ModalBase";
import { DialogTitle } from "@headlessui/react";
import type { Inventory } from "../../types/Inventory";
import toast from "react-hot-toast";
import { InventoryService } from "../../api/inventory/inventory-service";

interface StockAdjustModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantityAdjust, setQuantityAdjust] = useState<number | "">("");
  const [inventory, setInventory] = useState<Inventory>();
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reason, setReason] = useState("Ajuste Manual"); // Motivo padrão

  useEffect(() => {
    if (isOpen && product) {
      setQuantityAdjust("");
      setReason("Ajuste Manual");
      setInventory(undefined);

      const fetchInventory = async () => {
        try {
          setLoadingInventory(true);
          setInventory(await InventoryService.getInventory(product?.id));
        } catch (e) {
          console.error(e);
          toast.error("Erro ao carregar o estoque do produto.");
        } finally {
          setLoadingInventory(false);
        }
      };
      fetchInventory();
    }
  }, [isOpen, product]);

  if (!product) return null;

  const handleSubmit = async () => {
    if (quantityAdjust === "") return;
    try {
      setIsSubmitting(true);
      await InventoryService.adjustInventory(product.id, {
        quantity: Number(quantityAdjust),
        reason,
      });
      onClose();
      toast.success("Estoque ajustado com sucesso.");
    } catch (error) {
      console.error("Erro ao ajustar estoque:", error);
      toast.error("Erro ao ajustar estoque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} overlayClose={false}>
      <DialogTitle
        as="h3"
        className="text-xl font-semibold leading-6 text-gray-900 mb-4"
      >
        Ajustar Estoque - {product.name}
      </DialogTitle>
      <div className="mb-4">
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-600">
            Estoque Atual:
          </label>

          {loadingInventory ? (
            <span className="block text-lg font-bold text-gray-500 mt-1 animate-pulse">
              Carregando...
            </span>
          ) : (
            <span className="block text-xl font-bold text-blue-600 mt-1">
              {inventory?.quantity ?? "Erro ao buscar"} unidades
            </span>
          )}
        </div>

        <label
          htmlFor="adjustQty"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ajuste (+/-)
        </label>
        <input
          type="number"
          id="adjustQty"
          inputMode="numeric"
          value={quantityAdjust}
          onChange={(e) =>
            setQuantityAdjust(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          placeholder="Ex: -5 ou 10"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="adjustReason"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Motivo (Opcional)
        </label>
        <input
          type="text"
          id="adjustReason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className={"btn-base"}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={
              isSubmitting ||
              loadingInventory ||
              quantityAdjust === 0 ||
              quantityAdjust === ""
            }
            onClick={handleSubmit}
            className={"btn-primary"}
          >
            {isSubmitting ? "Salvando..." : "Ajustar"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};
export default StockAdjustModal;
