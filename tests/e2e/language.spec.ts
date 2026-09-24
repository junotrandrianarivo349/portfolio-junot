import { test, expect, gotoHome, langToggle, TITLE_EN, TITLE_FR } from './fixtures'

test.describe('language toggle', () => {
  test('English by default, switches to French, persisted after reload', async ({ page }) => {
    await gotoHome(page)
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(page).toHaveTitle(TITLE_EN)
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()

    await langToggle(page).click()
    await expect(html).toHaveAttribute('lang', 'fr')
    await expect(page).toHaveTitle(TITLE_FR)
    // Visible text changes: the toggles' accessible names are rendered strings.
    // Name = visible "EN / FR" + sr-only hint (label-in-name, WCAG 2.5.3).
    await expect(langToggle(page)).toHaveAccessibleName(/^EN FR \(Read the site in English\)$/)
    await expect(page.getByRole('button', { name: 'Passer en mode clair' })).toBeVisible()
    await expect(page.getByText('Développeur Full-Stack JavaScript', { exact: false }).first()).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('fr')

    await page.reload()
    await expect(html).toHaveAttribute('lang', 'fr')
    await expect(page).toHaveTitle(TITLE_FR)

    await langToggle(page).click()
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(page).toHaveTitle(TITLE_EN)
    expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('en')
  })
})
