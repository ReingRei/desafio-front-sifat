/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach} from 'vitest';

import ProductListPage from './ProductListPage';

import { ProductService } from '../api/product/products-service';
import type { PageResponse, Product } from '../types/Product';
vi.mock('../api/product/products-service');

vi.mock('../components/TopActionBar', () => ({
  default: ({ onSearch, onToggleFilters, onDataChanged }: any) => (
    <div data-testid="top-action-bar">
      <input
        data-testid="search-input"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        data-testid="toggle-filters-btn"
        onClick={onToggleFilters}
      ></button>
      <button data-testid="refresh-btn" onClick={onDataChanged}></button>
    </div>
  ),
}));

vi.mock('../components/ProductTable', () => ({
  default: ({ products }: { products: any[] }) => (
    <div data-testid="product-table">{products.length} produtos na tabela</div>
  ),
}));

vi.mock('../components/PaginationControls', () => ({
  default: ({ onPageChange, totalPages }: any) => (
    <div data-testid="pagination-controls">
      <span>{totalPages} páginas</span>
      <button data-testid="next-page-btn" onClick={() => onPageChange(1)}>
        Próxima
      </button>
    </div>
  ),
}));

vi.mock('../components/ProductFilterPanel', () => ({
  default: ({ onFilter, onFilterClear }: any) => (
    <div data-testid="filter-panel">
      <button
        data-testid="apply-filter-btn"
        onClick={() => onFilter({ categoryId: 1 })}
      >
        Aplicar
      </button>
      <button data-testid="clear-filter-btn" onClick={onFilterClear}>
        Limpar
      </button>
    </div>
  ),
}));

const mockProducts: Product[] = [
  { 
    id: 1, 
    name: 'Produto Teste 1', 
    price: 10, 
    category: { id: 1, name: 'Cat1' },
    imageUrl: 'test.jpg',
    createdAt: new Date().toISOString()
  },
];

const mockPageResponse: PageResponse<Product> = {
  content: mockProducts,
  number: 0,
  size: 10,
  totalPages: 2,
  totalElements: 11,
};

const mockEmptyPageResponse = {
  ...mockPageResponse,
  content: [],
  totalPages: 0,
  totalElements: 0,
};

describe('ProductListPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(ProductService.getProducts).mockResolvedValue(mockPageResponse);
  });

  it('deve renderizar o estado de carregamento e buscar produtos', async () => {
    render(<ProductListPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledWith({
        page: 0,
        size: 10,
      });
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });
  });

  it('deve renderizar a tabela de produtos em caso de sucesso', async () => {
    render(<ProductListPage />);

    await waitFor(() => {
      const table = screen.getByTestId('product-table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveTextContent('1 produtos na tabela');
    });

    const pagination = screen.getByTestId('pagination-controls');
    expect(pagination).toBeInTheDocument();
    expect(pagination).toHaveTextContent('2 páginas');
  });

  it('deve renderizar a mensagem de "nenhum produto" se a lista estiver vazia', async () => {
    vi.mocked(ProductService.getProducts).mockResolvedValue(
      mockEmptyPageResponse
    );

    render(<ProductListPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Nenhum produto encontrado.')
      ).toBeInTheDocument();
    });

    expect(screen.queryByTestId('product-table')).not.toBeInTheDocument();
  });

  it('deve renderizar a mensagem de erro se a API falhar', async () => {
    vi.mocked(ProductService.getProducts).mockRejectedValue(
      new Error('Falha na API')
    );

    render(<ProductListPage />);

    await waitFor(() => {
      expect(screen.getByText('Ocorreu um erro')).toBeInTheDocument();
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });

    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-table')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Nenhum produto encontrado.')
    ).not.toBeInTheDocument();
  });

  it('deve chamar a API novamente ao mudar de página', async () => {
    render(<ProductListPage />);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(1);
    });

    const nextPageButton = screen.getByTestId('next-page-btn');
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(2);
      expect(ProductService.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1 })
      );
    });
  });

  it('deve chamar a API novamente ao buscar por nome', async () => {
    render(<ProductListPage />);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(1);
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Produto' } });

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(2);
      expect(ProductService.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ name: 'Produto' })
      );
    });
  });

  it('deve mostrar e esconder o painel de filtros', async () => {
    render(<ProductListPage />);

    await screen.findByTestId('top-action-bar');

    expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();

    const toggleButton = screen.getByTestId('toggle-filters-btn');
    fireEvent.click(toggleButton);

    expect(await screen.findByTestId('filter-panel')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
    });
  });

  it('deve aplicar filtros do painel e fechar', async () => {
    render(<ProductListPage />);
    await screen.findByTestId('top-action-bar');

    fireEvent.click(screen.getByTestId('toggle-filters-btn'));

    const applyButton = await screen.findByTestId('apply-filter-btn');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(2);
      expect(ProductService.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ categoryId: 1 })
      );
    });

    expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
  });

  it('deve limpar filtros do painel e fechar', async () => {
    render(<ProductListPage />);
    await screen.findByTestId('top-action-bar');

    fireEvent.click(screen.getByTestId('toggle-filters-btn'));

    const clearButton = await screen.findByTestId('clear-filter-btn');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(2);
      expect(ProductService.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          categoryId: undefined,
          minPrice: undefined,
        })
      );
    });

    expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
  });

  it('deve tentar buscar produtos novamente ao clicar em "Tentar novamente"', async () => {
    vi.mocked(ProductService.getProducts).mockRejectedValue(
      new Error('Falha na API')
    );

    render(<ProductListPage />);

    const retryLink = await screen.findByText('Tentar novamente');

    vi.mocked(ProductService.getProducts).mockResolvedValue(mockPageResponse);

    fireEvent.click(retryLink);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByTestId('product-table')).toBeInTheDocument();
    expect(screen.queryByText('Ocorreu um erro')).not.toBeInTheDocument();
  });
});