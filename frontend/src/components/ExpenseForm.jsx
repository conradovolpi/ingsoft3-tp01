import { useState } from "react";

function ExpenseForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Comida");
  const [date, setDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const expense = {
      description,
      amount: Number(amount),
      category,
      date,
    };

    await onAdd(expense);

    setDescription("");
    setAmount("");
    setCategory("Comida");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Nuevo gasto</h2>

      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Comida</option>
        <option>Transporte</option>
        <option>Ocio</option>
        <option>Servicios</option>
        <option>Otros</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Agregar gasto</button>
    </form>
  );
}

export default ExpenseForm;