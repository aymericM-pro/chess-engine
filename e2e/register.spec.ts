import { expect, type Page, test } from '@playwright/test'

async function fillRegisterForm(
  page: Page,
  options: {
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
  } = {},
) {
  const {
    username = 'test-player',
    email = 'test@example.com',
    password = 'Password123!',
    confirmPassword = password,
  } = options

  await page.getByPlaceholder('Wynn4Life').fill(username)
  await page.getByPlaceholder('vous@exemple.com').fill(email)
  await page.getByPlaceholder('8 caractères minimum').fill(password)
  await page.locator('input[type="password"]').nth(1).fill(confirmPassword)
  await page.getByRole('checkbox').check()
}

test('creates an account from the register page', async ({ page }) => {
  await page.route('http://localhost:3000/api/auth/register', async (route) => {
    const body = route.request().postDataJSON()

    expect(body).toEqual({
      email: 'test@example.com',
      username: 'test-player',
      password: 'Password123!',
    })

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake-token',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          username: 'test-player',
        },
      }),
    })
  })

  await page.goto('/register')
  await fillRegisterForm(page)
  await page.getByRole('button', { name: 'Créer mon compte' }).click()

  await expect(page.getByRole('heading', { name: 'Bienvenue sur ChessMate' })).toBeVisible()
})

test('shows an error when passwords do not match', async ({ page }) => {
  let registerCalled = false

  await page.route('http://localhost:3000/api/auth/register', async (route) => {
    registerCalled = true
    await route.abort()
  })

  await page.goto('/register')
  await fillRegisterForm(page, { confirmPassword: 'AnotherPassword123!' })
  await page.getByRole('button', { name: 'Créer mon compte' }).click()

  await expect(page.getByText('Les mots de passe ne correspondent pas')).toBeVisible()
  expect(registerCalled).toBe(false)
})

test('shows the API error when registration is rejected', async ({ page }) => {
  await page.route('http://localhost:3000/api/auth/register', async (route) => {
    await route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Email déjà utilisé' }),
    })
  })

  await page.goto('/register')
  await fillRegisterForm(page)
  await page.getByRole('button', { name: 'Créer mon compte' }).click()

  await expect(page.getByText('Email déjà utilisé')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bienvenue sur ChessMate' })).toBeHidden()
})
