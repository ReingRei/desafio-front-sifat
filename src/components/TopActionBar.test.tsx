import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import TopActionBar from "./TopActionBar";

vi.mock("./modals/ProductFormModal", () => {
  return {
    default: vi.fn(() => null),
  };
});
import ProductFormModal from "./modals/ProductFormModal";

const mockOnSearch = vi.fn();
const mockOnToggleFilters = vi.fn();
const mockOnDataChanged = vi.fn();

const defaultProps = {
  onSearch: mockOnSearch,
  onToggleFilters: mockOnToggleFilters,
  onDataChanged: mockOnDataChanged,
  isFilterPanelOpen: false,
};

describe("TopActionBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar os botões e o input de busca", () => {
    render(<TopActionBar {...defaultProps} />);

    expect(
      screen.getByLabelText("Buscar produto por nome")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Pesquisar")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Mostrar/Esconder Filtros")
    ).toBeInTheDocument();
    expect(screen.getByText("Adicionar")).toBeInTheDocument();
  });

  it("deve atualizar o input de busca ao digitar", async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    const searchInput = screen.getByLabelText("Buscar produto por nome");
    await user.type(searchInput, "Notebook");

    expect(searchInput).toHaveValue("Notebook");
  });

  it("deve chamar onSearch ao clicar no botão de pesquisa", async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    const searchInput = screen.getByLabelText("Buscar produto por nome");
    const searchButton = screen.getByLabelText("Pesquisar");

    await user.type(searchInput, "Notebook");
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("Notebook");
  });

  it("deve chamar onSearch ao pressionar Enter no input", async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    const searchInput = screen.getByLabelText("Buscar produto por nome");

    await user.type(searchInput, "Tablet{enter}");

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("Tablet");
  });

  it("deve desabilitar o botão de pesquisa se o input estiver vazio ou só com espaços", async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    const searchButton = screen.getByLabelText("Pesquisar");

    expect(searchButton).toBeDisabled();

    const searchInput = screen.getByLabelText("Buscar produto por nome");
    await user.type(searchInput, "   ");
    expect(searchButton).toBeDisabled();

    await user.type(searchInput, "teste");
    expect(searchButton).not.toBeDisabled();
  });

  it("deve mostrar o botão de limpar, e ao clicar, chamar onSearch com string vazia", async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    const searchInput = screen.getByLabelText("Buscar produto por nome");

    expect(screen.queryByLabelText("Limpar busca")).not.toBeInTheDocument();

    await user.type(searchInput, "Teste");

    const clearButton = screen.getByLabelText("Limpar busca");
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);

    expect(searchInput).toHaveValue("");

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("");

    expect(screen.queryByLabelText("Limpar busca")).not.toBeInTheDocument();
  });

  it("deve chamar onToggleFilters ao clicar no botão de filtros", async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    const filterButton = screen.getByLabelText("Mostrar/Esconder Filtros");
    await user.click(filterButton);

    expect(mockOnToggleFilters).toHaveBeenCalledTimes(1);
  });

  it('deve adicionar a classe "active" no botão de filtro se isFilterPanelOpen for true', () => {
    render(<TopActionBar {...defaultProps} isFilterPanelOpen={true} />);

    const filterButton = screen.getByLabelText("Mostrar/Esconder Filtros");
    expect(filterButton).toHaveClass("bg-gray-200");
  });

  it('deve abrir o modal de "Adicionar" ao clicar no botão', async () => {
    const user = userEvent.setup();
    render(<TopActionBar {...defaultProps} />);

    let calls = vi.mocked(ProductFormModal).mock.calls;

    expect(calls[0][0]).toEqual(expect.objectContaining({ isOpen: false }));

    const addButton = screen.getByText("Adicionar");
    await user.click(addButton);

    calls = vi.mocked(ProductFormModal).mock.calls;

    expect(calls[calls.length - 1][0]).toEqual(
      expect.objectContaining({ isOpen: true, productToEdit: null })
    );
  });
});
