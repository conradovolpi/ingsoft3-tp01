import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getExpenses,
  createExpense,
  deleteExpense,
  getMonthlySummary,
} from "./expenseService";

describe("expenseService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getExpenses devuelve los gastos recibidos de la API", async () => {
    // Arrange
    const expenses = [
      {
        id: 1,
        description: "Supermercado",
        amount: 1500,
        category: "Comida",
      },
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(expenses),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await getExpenses();

    // Assert
    expect(fetchMock).toHaveBeenCalledWith("/api/expenses");
    expect(result).toEqual(expenses);
  });

  it("createExpense envia el gasto por POST y devuelve el gasto creado", async () => {
    // Arrange
    const expense = {
      description: "Nafta",
      amount: 20000,
      category: "Transporte",
      date: "2026-10-07",
    };

    const createdExpense = {
      id: 10,
      ...expense,
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(createdExpense),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await createExpense(expense);

    // Assert
    expect(fetchMock).toHaveBeenCalledWith("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    expect(result).toEqual(createdExpense);
  });

  it.each([1, 5, 99])(
    "deleteExpense llama a la URL correcta para el id %i",
    async (id) => {
      // Arrange
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
      });

      vi.stubGlobal("fetch", fetchMock);

      // Act
      await deleteExpense(id);

      // Assert
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      );
    }
  );

  it("getMonthlySummary lanza error si la API responde con error", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act + Assert
    await expect(
      getMonthlySummary(2026, 10)
    ).rejects.toThrow(
      "Error al obtener el resumen mensual"
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/expenses/summary?year=2026&month=10"
    );
  });
});