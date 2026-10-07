export function getExpenseLevel(amount) {
  if (amount <= 0) {
    return 'invalid'
  }

  if (amount < 10000) {
    return 'low'
  }

  if (amount < 50000) {
    return 'medium'
  }

  return 'high'
}
