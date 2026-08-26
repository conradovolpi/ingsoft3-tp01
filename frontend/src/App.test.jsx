import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'

vi.mock('./services/expenseService', () => ({
  getExpenses: vi.fn(() => Promise.resolve([])),
  createExpense: vi.fn(),
  deleteExpense: vi.fn(),
}))

test('muestra el titulo de la aplicacion', async () => {
  render(<App />)

  const title = await screen.findByText('Mis Gastos')

  expect(title).toBeInTheDocument()
})