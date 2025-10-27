import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ProductFormModal from "./modals/ProductFormModal";

interface TopActionBarProps {
  onSearch: (name: string) => void;
  onToggleFilters: () => void;
  onDataChanged: () => void;
  isFilterPanelOpen: boolean;
}

const TopActionBar: React.FC<TopActionBarProps> = ({
  onSearch,
  onToggleFilters,
  onDataChanged,
  isFilterPanelOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearchClick = () => {
    if (searchTerm.trim().length > 0) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSuccess = () => {
    handleCloseAddModal();
    onDataChanged();
  };

  const isSearchDisabled = searchTerm.trim() === "";
  const showClearButton = searchTerm.trim() !== "";

  return (
    <>
      {" "}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-grow flex relative items-center space-x-2">
          <input
            id="pesquisa-produto-input"
            type="text"
            value={searchTerm}
            maxLength={255}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar produto por nome..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
            aria-label="Buscar produto por nome"
          />
          {showClearButton && (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              aria-label="Limpar busca"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleSearchClick}
            className={"btn-icon"}
            aria-label="Pesquisar"
            disabled={isSearchDisabled}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center sm:justify-end space-x-2 flex-shrink-0">
          <button
            onClick={onToggleFilters}
            className={`btn-icon ${isFilterPanelOpen ? "bg-gray-200" : ""}`}
            aria-label="Mostrar/Esconder Filtros"
            aria-expanded={isFilterPanelOpen}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>

          <button
            onClick={handleOpenAddModal}
            className={"btn-primary flex items-center space-x-1"}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Adicionar</span>
          </button>
        </div>

        <ProductFormModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSaveSuccess={handleAddSuccess}
          productToEdit={null}
        />
      </div>
    </>
  );
};

export default TopActionBar;
