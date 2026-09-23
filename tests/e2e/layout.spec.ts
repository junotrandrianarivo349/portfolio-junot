import { test, expect, gotoHome } from './fixtures'

test.describe('layout health', () => {
  test('no horizontal overflow', async ({ page }) => {
    await gotoHome(page)
    // Scroll through the page so lazy content and scroll-triggered styles are applied.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth, 'document is wider than the viewport').toBeLessThanOrEqual(clientWidth)
  })

  test('no console errors', async ({ page, consoleErrors }) => {
    await gotoHome(page)
    await page.waitForLoadState('networkidle')
    expect(consoleErrors).toEqual([])
  })
})
