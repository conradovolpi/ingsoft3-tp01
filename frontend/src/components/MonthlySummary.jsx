import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/expenseService";

function MonthlySummary() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [summary, setSummary] = useState({
    total: 0,
    byCategory: {},
  });

  useEffect(() => {
    loadSummary();
  }, [month, year]);

  const loadSummary = async () => {
    try {
      const data = await getMonthlySummary(year, month);
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Resumen mensual</h2>

      <div className="summary-filters">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          <option value={1}>Enero</option>
          <option value={2}>Febrero</option>
          <option value={3}>Marzo</option>
          <option value={4}>Abril</option>
          <option value={5}>Mayo</option>
          <option value={6}>Junio</option>
          <option value={7}>Julio</option>
          <option value={8}>Agosto</option>
          <option value={9}>Septiembre</option>
          <option value={10}>Octubre</option>
          <option value={11}>Noviembre</option>
          <option value={12}>Diciembre</option>
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      <div className="summary">
        <h3>Total del mes</h3>

        <p>
          ${Number(summary.total).toLocaleString("es-AR")}
        </p>
      </div>

      <h3>Gastos por categoría</h3>

      {Object.keys(summary.byCategory).length === 0 ? (
        <p>No hay gastos registrados para este mes.</p>
      ) : (
        <div>
          {Object.entries(summary.byCategory).map(
            ([category, amount]) => (
              <div
                className="category-item"
                key={category}
              >
                <span>{category}</span>

                <strong>
                  ${Number(amount).toLocaleString("es-AR")}
                </strong>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default MonthlySummary;