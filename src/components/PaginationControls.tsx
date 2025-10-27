import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  currentSize: number;
  onPageChange: (newPage: number) => void;
  onSizeChange: (newSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalElements,
  currentSize,
  onPageChange,
  onSizeChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };
  const handleSizeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onSizeChange(Number(event.target.value));
  };

  const isPreviousDisabled = currentPage === 0;
  const isNextDisabled = currentPage >= totalPages - 1 || totalPages === 0;

  if (totalElements === 0 && currentPage === 0) {
    return null;
  }

  return (
    <div
      className="
            mt-6 py-2 px-4 bg-gray-50 border-t border-gray-200
            sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:z-10 sm:shadow-md
            flex items-center justify-between flex-wrap gap-y-2
        "
    >
      <div className="text-sm text-gray-700">
        Total de {totalElements} itens
      </div>

      <div className="flex items-center space-x-3">
        <select
          id="pageSize"
          value={currentSize}
          onChange={handleSizeSelectChange}
          className="border border-gray-300 rounded text-slate-600 text-sm p-1 h-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" // Ajustado tamanho e foco
          aria-label="Itens por página"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">por página</span>

        <button
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className={"btn-primary"}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <span className="text-sm text-gray-700 font-medium">
          {currentPage + 1} de {totalPages > 0 ? totalPages : 1}{" "}
        </span>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={"btn-primary"}
          aria-label="Próxima página"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
