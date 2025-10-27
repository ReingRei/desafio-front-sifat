import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Dialog } from "@headlessui/react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

vi.mock("./ModalBase", () => {
  return {
    default: vi.fn(({ children }) => (
      <Dialog open={true} onClose={() => {}}>
        {children}
      </Dialog>
    )),
  };
});

import ModalBase from "./ModalBase";
import type { Product } from "../../types/Product";

describe("ConfirmDeleteModal", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  const mockProduct: Product = {
    id: 1,
    name: "Notebook Gamer",
    imageUrl: "http://example.com/notebook.jpg",
    price: 4999.99,
    category: {
      id: 2,
      name: "Eletrônicos",
    },
    createdAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar título e nome do produto", () => {
    render(
      <ConfirmDeleteModal
        product={mockProduct}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Tem certeza que deseja excluir o produto "Notebook Gamer"\?/
      )
    ).toBeInTheDocument();
  });

  it("deve chamar onClose ao clicar em Cancelar", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDeleteModal
        product={mockProduct}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar onConfirm com o id ao clicar em Excluir", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDeleteModal
        product={mockProduct}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: "Excluir" }));
    expect(mockOnConfirm).toHaveBeenCalledWith(1);
  });

  it("não deve chamar onConfirm se product for null", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDeleteModal
        product={null}
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: "Excluir" }));
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("deve renderizar ModalBase com props corretas", () => {
  render(
    <ConfirmDeleteModal
      product={mockProduct}
      isOpen={true}
      onClose={mockOnClose}
      onConfirm={mockOnConfirm}
    />
  );

  const calls = vi.mocked(ModalBase).mock.calls;
  expect(calls).toHaveLength(1);

  const props = calls[0][0];

  expect(props.isOpen).toBe(true);
  expect(props.onClose).toBe(mockOnClose);
  expect(props.overlayClose).toBe(false);
});
});
