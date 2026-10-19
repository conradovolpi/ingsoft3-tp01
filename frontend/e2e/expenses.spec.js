import { randomUUID } from 'node:crypto'
import { test as base, expect } from '@playwright/test'

const api = process.env.API_BASE_URL.replace(/\/$/, '')

// La pantalla crea y borra los gastos.
// Si una prueba falla, la API real permite limpiar sus datos igualmente.
const test = base.extend({
  ownDescriptions: async ({ request }, use) => {
    const descriptions = new Set()

    try {
      await use(descriptions)
    } finally {
      if (descriptions.size > 0) {
        const response = await request.get(`${api}/api/expenses`)
        expect(response.status()).toBe(200)

        const expenses = await response.json()

        for (const expense of expenses) {
          if (descriptions.has(expense.description)) {
            const deletion = await request.delete(
              `${api}/api/expenses/${expense.id}`,
            )
            expect([204, 404]).toContain(deletion.status())
          }
        }

        const verification = await request.get(`${api}/api/expenses`)
        expect(verification.status()).toBe(200)

        const remaining = (await verification.json()).filter(
          (expense) => descriptions.has(expense.description),
        )
        expect(remaining).toEqual([])
      }
    }
  },
})

function uniqueDescription(ownDescriptions) {
  const description = `TP7-E2E-${Date.now()}-${randomUUID()}`
  ownDescriptions.add(description)
  return description
}

function expenseRow(page, description) {
  return page.locator('.expense-item').filter({
    has: page.getByText(description, { exact: true }),
  })
}

async function fillForm(page, description) {
  const form = page.locator('form.expense-form')

  await form.locator('input[type="text"]').fill(description)
  await form.getByPlaceholder('Monto', { exact: true }).fill('10.25')
  await form.locator('select').selectOption({ label: 'Otros' })
  await form.locator('input[type="date"]').fill(
    new Date().toISOString().slice(0, 10),
  )
}

async function createThroughUI(page, description) {
  await fillForm(page, description)

  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/expenses',
    { timeout: 60_000 },
  )

  await page.getByRole('button', {
    name: 'Agregar gasto',
    exact: true,
  }).click()

  const response = await responsePromise
  expect(response.status()).toBe(201)

  const created = await response.json()
  expect(created.description).toBe(description)

  await expect(expenseRow(page, description)).toBeVisible()
  return created
}

async function deleteThroughUI(page, description, id) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'DELETE' &&
      new URL(response.url()).pathname === `/api/expenses/${id}`,
    { timeout: 60_000 },
  )

  await expenseRow(page, description).getByRole('button', {
    name: 'Eliminar',
    exact: true,
  }).click()

  expect((await responsePromise).status()).toBe(204)
  await expect(expenseRow(page, description)).toHaveCount(0)
}

test('crear un gasto, verlo y eliminarlo', async ({
  page,
  ownDescriptions,
}) => {
  const description = uniqueDescription(ownDescriptions)
  await page.goto('/')

  const created = await createThroughUI(page, description)
  await deleteThroughUI(page, description, created.id)

  await page.reload()
  await expect(expenseRow(page, description)).toHaveCount(0)
})

test('mostrar validacion por monto obligatorio sin crear un gasto', async ({
  page,
  request,
  ownDescriptions,
}) => {
  const description = uniqueDescription(ownDescriptions)
  await page.goto('/')
  await fillForm(page, description)

  const amount = page.getByPlaceholder('Monto', { exact: true })
  await amount.fill('')

  await page.getByRole('button', {
    name: 'Agregar gasto',
    exact: true,
  }).click()

  // El navegador muestra su mensaje de validacion nativa.
  // No dependemos del idioma de ese mensaje.
  expect(await amount.evaluate(
    (input) => input.validity.valueMissing,
  )).toBe(true)

  expect(await amount.evaluate(
    (input) => input.validationMessage,
  )).not.toBe('')

  await expect(amount).toBeFocused()
  await expect(expenseRow(page, description)).toHaveCount(0)

  const response = await request.get(`${api}/api/expenses`)
  expect(response.status()).toBe(200)
  expect((await response.json()).some(
    (expense) => expense.description === description,
  )).toBe(false)
})

test('el gasto persiste despues de recargar la pagina', async ({
  page,
  ownDescriptions,
}) => {
  const description = uniqueDescription(ownDescriptions)
  await page.goto('/')

  const created = await createThroughUI(page, description)

  // Esperamos la consulta real para comprobar la persistencia.
  const listingPromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' &&
      new URL(response.url()).pathname === '/api/expenses',
    { timeout: 60_000 },
  )

  await page.reload()

  const listing = await listingPromise
  expect(listing.status()).toBe(200)
  expect(await listing.json()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: created.id,
        description,
      }),
    ]),
  )

  await expect(expenseRow(page, description)).toBeVisible()
  await deleteThroughUI(page, description, created.id)
})