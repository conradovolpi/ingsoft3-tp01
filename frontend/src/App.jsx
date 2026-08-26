import { useEffect, useState } from "react";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import MonthlySummary from "./components/MonthlySummary";

import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "./services/expenseService";

import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState("expenses");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  const handleAdd = async (expense) => {
    const createdExpense = await createExpense(expense);

    setExpenses((current) => [
      ...current,
      createdExpense,
    ]);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);

    setExpenses((current) =>
      current.filter((expense) => expense.id !== id)
    );
  };

  return (
  <main className="container">
    <h1>Mis Gastos</h1>

    <nav className="navigation">
      <button
        onClick={() => setPage("expenses")}
      >
        Gastos
      </button>

      <button
        onClick={() => setPage("summary")}
      >
        Resumen mensual
      </button>
    </nav>

    {page === "expenses" && (
      <>
        <ExpenseSummary expenses={expenses} />

        <ExpenseForm onAdd={handleAdd} />

        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
        />
      </>
    )}

    {page === "summary" && (
      <MonthlySummary />
    )}
  </main>
);
}

export default App;