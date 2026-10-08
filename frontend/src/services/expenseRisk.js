export function getExpenseRisk(amount, category) {
  if (amount <= 0) {
    return "invalid"
  }

  if (!category) {
    return "missing-category"
  }

  if (amount > 100000) {
    return "critical"
  }

  if (amount > 50000) {
    return "high"
  }

  if (amount > 20000) {
    return "medium"
  }

  if (category === "Comida" && amount > 10000) {
    return "attention"
  }

  return "low"
}
