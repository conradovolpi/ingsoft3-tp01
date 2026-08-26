const API_URL = "/api/expenses";

export async function getExpenses() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener gastos");
  }

  return response.json();
}

export async function createExpense(expense) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Error al crear gasto");
  }

  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar gasto");
  }
}

export async function getMonthlySummary(year, month) {
  const response = await fetch(
    `/api/expenses/summary?year=${year}&month=${month}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener el resumen mensual");
  }

  return response.json();
}