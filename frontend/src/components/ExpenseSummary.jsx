function ExpenseSummary({ expenses }) {
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="summary">
      <h2>Total gastado</h2>
      <p>${total.toLocaleString("es-AR")}</p>
    </div>
  );
}

export default ExpenseSummary;