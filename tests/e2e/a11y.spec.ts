import AxeBuilder from '@axe-core/playwright'
import { test, expect, gotoHome, langToggle, themeToggle } from './fixtures'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

test.describe('accessibility (axe, WCAG 2.1 AA)', () => {
  test('dark theme, English', async ({ page }) => {
    await gotoHome(page)
    await expect(page.locator('html')).toHaveClass(/(^|\s)dark(\s|$)/)
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })

  test('light theme, French', async ({ page }) => {
    await gotoHome(page)
    await themeToggle(page).click()
    await langToggle(page).click()
    await expect(page.locator('html')).not.toHaveClass(/(^|\s)dark(\s|$)/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
})
