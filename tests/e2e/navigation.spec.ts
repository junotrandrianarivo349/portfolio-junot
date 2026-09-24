import type { Page } from '@playwright/test'
import { test, expect, gotoHome } from './fixtures'

/** Header nav order and labels (EN). */
const NAV = [
  { id: 'projects', label: 'Case studies' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Career' },
  { id: 'contact', label: 'Contact' },
] as const

/**
 * Waits until scrolling has settled (scrollY unchanged over 3 frames), then checks that the
 * section heading is fully inside the viewport and not under the sticky header.
 */
async function expectHeadingClear(page: Page, headingId: string) {
  await expect
    .poll(
      () =>
        page.evaluate(async (id) => {
          const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)))
          const y0 = window.scrollY
          await frame()
          await frame()
          await frame()
          const stable = window.scrollY === y0
          const h = document.getElementById(id)!.getBoundingClientRect()
          const header = document.querySelector('header')!.getBoundingClientRect()
          return stable && h.top >= header.bottom - 1 && h.bottom <= window.innerHeight && window.scrollY > 0
        }, headingId),
      { message: `#${headingId} visible below the sticky header`, timeout: 5_000 },
    )
    .toBe(true)
}

test.describe('anchor navigation', () => {
  test('desktop header links scroll each heading into view below the header', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop nav is hidden below md')
    await gotoHome(page)
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link')).toHaveText(NAV.map((n) => n.label))
    for (const { id, label } of NAV) {
      await nav.getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expectHeadingClear(page, `${id}-title`)
    }
  })

  test('mobile menu links scroll to the section and close the menu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile menu only below md')
    await gotoHome(page)
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden()
    for (const { id, label } of NAV) {
      const menuButton = page.getByRole('button', { name: 'Open menu' })
      await menuButton.click()
      await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
      const menu = page.locator('#mobile-nav')
      await expect(menu).toBeVisible()
      await menu.getByRole('link', { name: label, exact: true }).click()
      await expect(menu).toBeHidden()
      await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expectHeadingClear(page, `${id}-title`)
    }
  })

  test('Escape closes the mobile menu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile menu only below md')
    await gotoHome(page)
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('#mobile-nav')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-nav')).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  test('hero CTA "See the case studies" goes to #projects', async ({ page }) => {
    await gotoHome(page)
    await page.getByRole('link', { name: 'See the case studies' }).click()
    await expect(page).toHaveURL(/#projects$/)
    await expectHeadingClear(page, 'projects-title')
  })

  test('skip link moves focus to <main>', async ({ page }) => {
    await gotoHome(page)
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page.locator('main#main')).toBeFocused()
  })
})
