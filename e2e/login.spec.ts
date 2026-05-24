import { expect, type Page, test } from '@playwright/test'

async function fillLoginForm(
  page: Page,
  options: {
    email?: string
    password?: string
  } = {},
) {
  const {
    email = 'player@example.com',
    password = 'Password123!',
  } = options

  await page.getByPlaceholder('vous@exemple.com').fill(email)
  await page.locator('input[type="password"]').fill(password)
}

test('shows validation errors without calling the API', async ({ page }) => {
  let loginCalled = false

  await page.route('http://localhost:3000/api/auth/login', async (route) => {
    loginCalled = true
    await route.abort()
  })

  await page.goto('/login')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByText("L'email est requis.")).toBeVisible()
  await expect(page.getByText('Le mot de passe est requis.')).toBeVisible()
  expect(loginCalled).toBe(false)
})

test('shows attempts left when credentials are invalid', async ({ page }) => {
  await page.route('http://localhost:3000/api/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        requestId: 'request-1',
        timestamp: new Date().toISOString(),
        path: '/api/auth/login',
        code: 'USER_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        attemptsLeft: 2,
      }),
    })
  })

  await page.goto('/login')
  await fillLoginForm(page)
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByText('Connexion impossible')).toBeVisible()
  await expect(page.getByText('Identifiants invalides. Il vous reste 2 tentatives.')).toBeVisible()
})

test('shows locked account delay', async ({ page }) => {
  await page.route('http://localhost:3000/api/auth/login', async (route) => {
    await route.fulfill({
      status: 423,
      contentType: 'application/json',
      body: JSON.stringify({
        requestId: 'request-2',
        timestamp: new Date().toISOString(),
        path: '/api/auth/login',
        code: 'USER_LOGIN_LOCKED',
        message: 'Compte temporairement bloqué.',
        retryAfterMinutes: 15,
      }),
    })
  })

  await page.goto('/login')
  await fillLoginForm(page)
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByText('Compte temporairement bloqué. Réessayez dans 15 min.')).toBeVisible()
})

test('logs in and redirects without success toast', async ({ page }) => {
  await page.route('http://localhost:3000/api/auth/login', async (route) => {
    const body = route.request().postDataJSON()

    expect(body).toEqual({
      email: 'player@example.com',
      password: 'Password123!',
    })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake-token',
        user: {
          id: 'user-1',
          email: 'player@example.com',
          username: 'player',
          createdAt: new Date().toISOString(),
        },
      }),
    })
  })

  await page.goto('/login')
  await fillLoginForm(page)
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByText('Connexion réussie')).toBeHidden()
})
