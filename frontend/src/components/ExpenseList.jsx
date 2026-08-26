function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p>No hay gastos registrados.</p>;
  }

  return (
    <div>
      <h2>Mis gastos</h2>

      {expenses.map((expense) => (
        <div className="expense-item" key={expense.id}>
          <div>
            <strong>{expense.description}</strong>
            <p>
              {expense.category} - {expense.date?.substring(0, 10)}
            </p>
          </div>

          <strong>
            ${Number(expense.amount).toLocaleString("es-AR")}
          </strong>

          <button onClick={() => onDelete(expense.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;