import { expect, type Page, test } from '@playwright/test'

const authUser = {
  id: 'user-profile-1',
  email: 'emma.analyst@example.com',
  username: 'emma-old',
  firstName: 'Emma',
  lastName: 'Analyse',
  createdAt: '2026-01-01T00:00:00.000Z',
}

let player = {
  id: authUser.id,
  username: 'emma-old',
  elo: 1420,
  rating: 'intermediate',
  createdAt: '2026-01-01T00:00:00.000Z',
  bio: 'Je prépare mes ouvertures tous les matins.',
  country: 'FR',
  preferredColor: 'Blancs',
}

async function loginThroughStorage(page: Page) {
  await page.addInitScript(({ user }) => {
    window.localStorage.setItem('chess-auth', JSON.stringify({
      state: { token: 'fake-token', user },
      version: 0,
    }))
  }, { user: authUser })
}

async function mockProfileApis(page: Page) {
  await page.route('http://localhost:3000/api/players/user-profile-1', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(player),
      })
      return
    }

    if (route.request().method() === 'PATCH') {
      const body = route.request().postDataJSON()
      player = { ...player, ...body }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(player),
      })
      return
    }

    await route.abort()
  })

  await page.route('http://localhost:3000/api/users/user-profile-1', async (route) => {
    if (route.request().method() === 'PATCH') {
      const body = route.request().postDataJSON()
      Object.assign(authUser, body)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(authUser),
      })
      return
    }

    await route.abort()
  })

  await page.route('http://localhost:3000/notifications', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })

  await page.route('http://localhost:3000/notifications/stream', async (route) => {
    await route.abort()
  })
}

test.beforeEach(async ({ page }) => {
  player = {
    id: authUser.id,
    username: 'emma-old',
    elo: 1420,
    rating: 'intermediate',
    createdAt: '2026-01-01T00:00:00.000Z',
    bio: 'Je prépare mes ouvertures tous les matins.',
    country: 'FR',
    preferredColor: 'Blancs',
  }
  authUser.firstName = 'Emma'
  authUser.lastName = 'Analyse'

  await loginThroughStorage(page)
  await mockProfileApis(page)
})

test('opens the edit drawer with existing values and keeps saved changes after reopening', async ({ page }) => {
  await page.goto('/profile')

  await expect(page.getByRole('heading', { name: 'Profil' })).toBeVisible()
  await expect(page.getByText('Emma Analyse')).toBeVisible()
  await expect(page.getByText('Je prépare mes ouvertures tous les matins.')).toBeVisible()

  await page.getByRole('button', { name: 'Modifier le profil' }).click()

  await expect(page.getByText('Les modifications sont sauvegardées sur votre compte.')).toBeVisible()
  await expect(page.getByLabel('Prénom')).toHaveValue('Emma')
  await expect(page.getByRole('textbox', { name: 'Nom', exact: true })).toHaveValue('Analyse')
  await expect(page.getByLabel("Nom d'utilisateur")).toHaveValue('emma-old')
  await expect(page.getByLabel('Email')).toHaveValue('emma.analyst@example.com')
  await expect(page.getByLabel('Biographie')).toHaveValue('Je prépare mes ouvertures tous les matins.')

  await page.getByLabel('Prénom').fill('Eva')
  await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('Roque')
  await page.getByLabel("Nom d'utilisateur").fill('eva-roque')
  await page.getByLabel('Biographie').fill('Je travaille les finales et les sacrifices positionnels.')
  await page.getByRole('button', { name: 'Noirs' }).click()
  await page.getByRole('button', { name: 'Enregistrer' }).click()

  await expect(page.getByText('Profil sauvegardé')).toBeVisible()
  await expect(page.getByText('Les modifications sont sauvegardées sur votre compte.')).toBeHidden()
  await expect(page.getByText('Eva Roque')).toBeVisible()
  await expect(page.getByText('Je travaille les finales et les sacrifices positionnels.')).toBeVisible()
  await expect(page.getByText('Noirs')).toBeVisible()

  await page.getByRole('button', { name: 'Modifier le profil' }).click()

  await expect(page.getByLabel('Prénom')).toHaveValue('Eva')
  await expect(page.getByRole('textbox', { name: 'Nom', exact: true })).toHaveValue('Roque')
  await expect(page.getByLabel("Nom d'utilisateur")).toHaveValue('eva-roque')
  await expect(page.getByLabel('Biographie')).toHaveValue('Je travaille les finales et les sacrifices positionnels.')
})

test('keeps the drawer open and shows validation errors when required values are cleared', async ({ page }) => {
  await page.goto('/profile')
  await page.getByRole('button', { name: 'Modifier le profil' }).click()

  await page.getByLabel("Nom d'utilisateur").fill('')
  await page.getByRole('button', { name: 'Enregistrer' }).click()

  await expect(page.getByText("Le nom d'utilisateur est requis.")).toBeVisible()
  await expect(page.getByText('Les modifications sont sauvegardées sur votre compte.')).toBeVisible()
})
