import { randomUUID } from 'node:crypto'
import { test as base, expect } from '@playwright/test'

// Cada prueba registra sus propios gastos.
// La limpieza se ejecuta incluso si una comprobacion falla.
const test = base.extend({
  expenseIds: async ({ request }, use) => {
    const ids = []

    try {
      await use(ids)
    } finally {
      const errors = []

      for (const id of ids) {
        try {
          const deletion = await request.delete(`/api/expenses/${id}`)
          expect([204, 404]).toContain(deletion.status())

          const check = await request.get(`/api/expenses/${id}`)
          expect(check.status()).toBe(404)
        } catch (error) {
          errors.push(error.message)
        }
      }

      expect(errors, 'Todos los gastos de prueba deben quedar borrados')
        .toEqual([])
    }
  },
})

function uniqueName() {
  return `TP7-${Date.now()}-${randomUUID()}`
}

async function createExpense(request, expenseIds, data) {
  const response = await request.post('/api/expenses', { data })

  expect(response.status()).toBe(201)

  const expense = await response.json()
  expect(expense.id).toEqual(expect.any(Number))
  expenseIds.push(expense.id)

  return expense
}

test('crear, consultar y borrar un gasto', async ({
  request,
  expenseIds,
}) => {
  const data = {
    description: uniqueName(),
    amount: 10.25,
    category: 'Prueba integracion',
    date: new Date().toISOString(),
  }

  const created = await createExpense(request, expenseIds, data)

  const detail = await request.get(`/api/expenses/${created.id}`)
  expect(detail.status()).toBe(200)
  expect(await detail.json()).toMatchObject({
    id: created.id,
    description: data.description,
    amount: data.amount,
    category: data.category,
  })

  const listing = await request.get('/api/expenses')
  expect(listing.status()).toBe(200)
  expect(await listing.json()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: created.id,
        description: data.description,
      }),
    ]),
  )

  const deletion = await request.delete(`/api/expenses/${created.id}`)
  expect(deletion.status()).toBe(204)

  const missing = await request.get(`/api/expenses/${created.id}`)
  expect(missing.status()).toBe(404)

  const finalListing = await request.get('/api/expenses')
  expect(finalListing.status()).toBe(200)
  expect((await finalListing.json()).some(
    (expense) => expense.id === created.id,
  )).toBe(false)
})

test('rechazar descripcion vacia sin guardar el gasto', async ({
  request,
  expenseIds,
}) => {
  const category = uniqueName()

  const response = await request.post('/api/expenses', {
    data: {
      description: '',
      amount: 10,
      category,
      date: new Date().toISOString(),
    },
  })

  // Si hubiera un bug y guardara el gasto, registramos su ID
  // para poder limpiarlo antes de finalizar la prueba.
  if (response.status() === 201) {
    const created = await response.json()
    expenseIds.push(created.id)
  }

  const listing = await request.get('/api/expenses')
  expect(listing.status()).toBe(200)

  const unexpected = (await listing.json()).filter(
    (expense) => expense.category === category,
  )

  for (const expense of unexpected) {
    if (!expenseIds.includes(expense.id)) {
      expenseIds.push(expense.id)
    }
  }

  expect(response.status()).toBe(400)
  expect(unexpected).toEqual([])
})

test('el resumen mensual incluye el gasto en su categoria', async ({
  request,
  expenseIds,
}) => {
  const now = new Date()
  const category = uniqueName()
  const amount = 12.34

  await createExpense(request, expenseIds, {
    description: uniqueName(),
    amount,
    category,
    date: now.toISOString(),
  })

  const response = await request.get('/api/expenses/summary', {
    params: {
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1,
    },
  })

  expect(response.status()).toBe(200)

  const summary = await response.json()
  expect(summary.year).toBe(now.getUTCFullYear())
  expect(summary.month).toBe(now.getUTCMonth() + 1)
  expect(summary.byCategory[category]).toBeCloseTo(amount, 2)
})