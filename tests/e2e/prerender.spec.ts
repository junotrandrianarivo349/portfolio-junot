import { test, expect, langToggle, TITLE_EN, TITLE_FR } from './fixtures'

const SITE = 'https://portfolio-junot.vercel.app'
const CASES = ['e-famenoPlus', 'Carheav', 'PharmaPlusLite', 'DataPharm']

const PAGES = [
  { path: '/', lang: 'en', title: TITLE_EN, canonical: `${SITE}/`, projects: 'Case studies' },
  { path: '/fr/', lang: 'fr', title: TITLE_FR, canonical: `${SITE}/fr/`, projects: 'Études de cas' },
] as const

test.describe('prerendered HTML without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const p of PAGES) {
    test(`${p.path} has content and ${p.lang} head`, async ({ page }) => {
      await page.goto(p.path)
      await expect(page.locator('html')).toHaveAttribute('lang', p.lang)
      await expect(page).toHaveTitle(p.title)
      await expect(page.getByRole('heading', { level: 1, name: 'Junot Randrianarivo' })).toBeVisible()
      await expect(page.getByRole('heading', { level: 2, name: p.projects })).toBeAttached()
      for (const name of CASES) {
        await expect(page.getByRole('heading', { level: 3, name, exact: true })).toBeAttached()
      }
      const contact = page.locator('#contact')
      await expect(contact.getByRole('heading', { level: 2, name: 'Contact' })).toBeAttached()
      await expect(contact.locator('a[href="mailto:junotrandrianarivo5404@gmail.com"]').first()).toBeAttached()

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', p.canonical)
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${SITE}/`)
      await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute('href', `${SITE}/fr/`)
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${SITE}/`)
    })
  }
})

test.describe('URL-based language switch', () => {
  test('/ -> /fr/ and back, updating lang and title', async ({ page, consoleErrors }) => {
    await page.goto('/')
    await expect(langToggle(page)).toBeVisible()
    await langToggle(page).click()
    await expect(page).toHaveURL(/\/fr\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page).toHaveTitle(TITLE_FR)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/fr/`)

    await langToggle(page).click()
    await expect(page).toHaveURL(/:\d+\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page).toHaveTitle(TITLE_EN)
    expect(consoleErrors).toEqual([])
  })

  test('keeps the #hash when switching', async ({ page }) => {
    await page.goto('/#contact')
    await expect(langToggle(page)).toBeVisible()
    await langToggle(page).click()
    await expect(page).toHaveURL(/\/fr\/#contact$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')

    await langToggle(page).click()
    await expect(page).toHaveURL(/:\d+\/#contact$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('stored French locale on / redirects to /fr/ without hydration errors', async ({ page, consoleErrors }) => {
    await page.addInitScript(() => localStorage.setItem('locale', 'fr'))
    await page.goto('/')
    await expect(page).toHaveURL(/\/fr\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page).toHaveTitle(TITLE_FR)
    await expect(langToggle(page)).toHaveAccessibleName(/Read the site in English/)
    // Scroll through the lazily hydrated sections so their hydration runs too.
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await expect(page.getByRole('button', { name: "Copier l'adresse email" })).toBeVisible()
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    expect(consoleErrors).toEqual([])
  })
})

test.describe('lazy hydration', () => {
  test('contact copy button works after scrolling to it', async ({ page, context, consoleErrors }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/')
    await expect(langToggle(page)).toBeVisible()
    const copy = page.getByRole('button', { name: 'Copy email address' })
    await copy.scrollIntoViewIfNeeded()
    // The prerendered button is visible before the section hydrates; retry the click until the
    // hydrated handler answers through the live region.
    const status = page.locator('#contact [role="status"]')
    await expect(async () => {
      await copy.click()
      await expect(status).toHaveText('Email address copied', { timeout: 1000 })
    }).toPass()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('junotrandrianarivo5404@gmail.com')
    expect(consoleErrors).toEqual([])
  })
})
