import { render, screen, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Product, Category } from "../types/Product";
import ProductTable from "./ProductTable";

import { ProductService } from "../api/product/products-service";
vi.mock("../api/product/products-service");

import toast from "react-hot-toast";
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("./modals/ConfirmDeleteModal", () => ({
  default: vi.fn(() => null),
}));
vi.mock("./modals/ProductFormModal", () => ({
  default: vi.fn(() => null),
}));
vi.mock("./modals/StockAdjustModal", () => ({
  default: vi.fn(() => null),
}));

import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import ProductFormModal from "./modals/ProductFormModal";
import StockAdjustModal from "./modals/StockAdjustModal";

const mockCategory: Category = { id: 1, name: "Eletrônicos" };
const mockProducts: Product[] = [
  {
    id: 101,
    name: "Notebook Pro",
    price: 5000,
    imageUrl: "http://image.com/notebook.jpg",
    category: mockCategory,
    createdAt: "2023-10-26T10:00:00Z",
  },
  {
    id: 102,
    name: "Mouse Gamer",
    price: 150.75,
    imageUrl: "",
    category: mockCategory,
    createdAt: "2023-10-27T11:00:00Z",
  },
];

const mockOnDataChanged = vi.fn();

const defaultProps = {
  products: mockProducts,
  onDataChanged: mockOnDataChanged,
};

type MockModalProps = {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm?: (id: number) => void;
  onSaveSuccess?: () => void;
  productToEdit?: Product | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLastModalProps = (mockedComponent: any): MockModalProps => {
  const lastCallArgs = vi.mocked(mockedComponent).mock.lastCall;
  if (!lastCallArgs) {
    throw new Error(`Modal ${mockedComponent.name} não foi chamado.`);
  }
  return lastCallArgs[0] as MockModalProps;
};

describe("ProductTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ProductService.deleteProduct).mockResolvedValue();
  });

  it("deve renderizar os produtos na tabela", () => {
    render(<ProductTable {...defaultProps} />);

    expect(
      screen.getByRole("columnheader", { name: "Nome" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Categoria" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Preço" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Imagem" })
    ).toBeInTheDocument();
    const headers = screen.getAllByRole("columnheader");
    expect(headers[headers.length - 1]).toHaveTextContent("Ações");

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    expect(within(row1).getByText("Notebook Pro")).toBeInTheDocument();
    expect(within(row1).getByText("Eletrônicos")).toBeInTheDocument();
    expect(within(row1).getByText("R$ 5000.00")).toBeInTheDocument();
    expect(
      within(row1).getByRole("img", { name: "Notebook Pro" })
    ).toBeInTheDocument();

    const row2 = screen.getByRole("row", { name: /Mouse Gamer/i });
    expect(within(row2).getByText("Mouse Gamer")).toBeInTheDocument();
    expect(within(row2).getByText("Eletrônicos")).toBeInTheDocument();
    expect(within(row2).getByText("R$ 150.75")).toBeInTheDocument();
    expect(within(row2).getByText("Sem imagem")).toBeInTheDocument();
  });

  it("deve abrir o modal de Edição ao clicar no botão de lápis", async () => {
    const user = userEvent.setup();
    render(<ProductTable {...defaultProps} />);

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    const editButton = within(row1).getAllByRole("button")[0]; // Assumindo que é o primeiro botão

    await user.click(editButton);

    expect(vi.mocked(ProductFormModal)).toHaveBeenCalledTimes(2);
    expect(getLastModalProps(ProductFormModal)).toMatchObject({
      isOpen: true,
      productToEdit: mockProducts[0],
    });
  });

  it("deve abrir o modal de Estoque ao clicar no botão de caixa", async () => {
    const user = userEvent.setup();
    render(<ProductTable {...defaultProps} />);

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    const stockButton = within(row1).getAllByRole("button")[1]; // Assumindo que é o segundo botão

    await user.click(stockButton);

    expect(vi.mocked(StockAdjustModal)).toHaveBeenCalledTimes(2);
    expect(getLastModalProps(StockAdjustModal)).toMatchObject({
      isOpen: true,
      product: mockProducts[0],
    });
  });

  it("deve abrir o modal de Deletar ao clicar no botão de lixeira", async () => {
    const user = userEvent.setup();
    render(<ProductTable {...defaultProps} />);

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    const deleteButton = within(row1).getAllByRole("button")[2]; // Assumindo que é o terceiro botão

    await user.click(deleteButton);

    expect(vi.mocked(ConfirmDeleteModal)).toHaveBeenCalledTimes(2);
    expect(getLastModalProps(ConfirmDeleteModal)).toMatchObject({
      isOpen: true,
      product: mockProducts[0],
    });
  });

  it("deve chamar deleteProduct, onDataChanged e toast ao confirmar exclusão", async () => {
    const user = userEvent.setup();
    render(<ProductTable {...defaultProps} />);

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    await user.click(within(row1).getAllByRole("button")[2]);

    const modalProps = getLastModalProps(ConfirmDeleteModal);
    await act(async () => {
      modalProps.onConfirm!(mockProducts[0].id);
    });

    expect(ProductService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(ProductService.deleteProduct).toHaveBeenCalledWith(
      mockProducts[0].id
    );
    expect(mockOnDataChanged).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Produto excluído com sucesso!");
    expect(getLastModalProps(ConfirmDeleteModal).isOpen).toBe(false);
  });

  it("deve chamar onDataChanged ao salvar edição com sucesso", async () => {
    const user = userEvent.setup();
    render(<ProductTable {...defaultProps} />);

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    await user.click(within(row1).getAllByRole("button")[0]);

    const modalProps = getLastModalProps(ProductFormModal);
    await act(async () => {
      modalProps.onSaveSuccess!();
    });

    expect(mockOnDataChanged).toHaveBeenCalledTimes(1);
    expect(getLastModalProps(ProductFormModal).isOpen).toBe(false);
  });

  it("deve fechar o modal ao chamar o callback onClose", async () => {
    const user = userEvent.setup();
    render(<ProductTable {...defaultProps} />);

    const row1 = screen.getByRole("row", { name: /Notebook Pro/i });
    await user.click(within(row1).getAllByRole("button")[0]);

    const modalProps = getLastModalProps(ProductFormModal);
    await act(async () => {
      modalProps.onClose();
    });

    expect(getLastModalProps(ProductFormModal).isOpen).toBe(false);
    expect(mockOnDataChanged).not.toHaveBeenCalled();
  });
});
