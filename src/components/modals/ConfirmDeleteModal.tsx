import React from 'react';
import ModalBase from './ModalBase';
import type { Product } from '../../types/Product';
import { DialogTitle } from '@headlessui/react';

interface ConfirmDeleteModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (productId: number) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ product, isOpen, onClose, onConfirm }) => {
    return (
        <ModalBase isOpen={isOpen} onClose={onClose} overlayClose={false}>
            <DialogTitle
                as="h3"
                className="text-xl font-semibold leading-6 text-gray-900 mb-4"
            >
                Confirmar Exclusão
            </DialogTitle>
            <div className="mt-2">
                <p className="text-sm text-gray-600 mb-6">
                    Tem certeza que deseja excluir o produto "{product?.name}"?
                </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className={"btn-base"}>
                    Cancelar
                </button>
                <button type="button" onClick={() => product && onConfirm(product.id)} className={"btn-warn"}>
                    Excluir
                </button>
            </div>
        </ModalBase>
    );
};

export default ConfirmDeleteModal;