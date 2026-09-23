import { test, expect, gotoHome, themeToggle } from './fixtures'

test.describe('theme toggle', () => {
  test('dark by default, toggles to light, persisted after reload', async ({ page }) => {
    await gotoHome(page)
    const html = page.locator('html')
    await expect(html).toHaveClass(/(^|\s)dark(\s|$)/)
    await expect(themeToggle(page)).toHaveAccessibleName('Switch to light mode')

    await themeToggle(page).click()
    await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/)
    await expect(themeToggle(page)).toHaveAccessibleName('Switch to dark mode')
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light')

    await page.reload()
    await expect(themeToggle(page)).toBeVisible()
    await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/)

    await themeToggle(page).click()
    await expect(html).toHaveClass(/(^|\s)dark(\s|$)/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')
  })
})
