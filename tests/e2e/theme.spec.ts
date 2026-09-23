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

test.describe('theme regressions', () => {
  // A scoped `:global(.dark) x` selector once compiled to `.dark { opacity: .14 }` and faded the whole page.
  test('no ancestor of the content is faded in either theme', async ({ page }) => {
    for (const theme of ['dark', 'light']) {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
      await page.goto('/')
      const opacities = await page.evaluate(() =>
        [document.documentElement, document.body, document.querySelector('main')!].map((el) => getComputedStyle(el).opacity),
      )
      expect(opacities, `theme ${theme}`).toEqual(['1', '1', '1'])
    }
  })
})
