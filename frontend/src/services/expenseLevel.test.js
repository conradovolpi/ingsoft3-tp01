import { describe, expect, it } from "vitest";
import { getExpenseLevel } from "./expenseLevel";

describe("getExpenseLevel", () => {
  it.each([
    [-1, "invalid"],
    [5000, "low"],
    [20000, "medium"],
    [60000, "high"],
  ])(
    "para un monto de %i devuelve %s",
    (amount, expected) => {
      // Arrange: amount y expected vienen de cada caso

      // Act
      const result = getExpenseLevel(amount);

      // Assert
      expect(result).toBe(expected);
    }
  );
});