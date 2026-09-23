import { test as base, expect, type Page } from '@playwright/test'

/** Console errors and uncaught page errors collected during a test. */
type Fixtures = { consoleErrors: string[] }

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))
    await use(errors)
  },
})

export { expect }

export const TITLE_EN = 'Junot Randrianarivo — Full-Stack JavaScript Developer'
export const TITLE_FR = 'Junot Randrianarivo — Développeur Full-Stack JavaScript'

/** Loads the page and waits for the Vue app to be mounted. */
export async function gotoHome(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Lire le site en français|Read the site in English/ })).toBeVisible()
}

export function langToggle(page: Page) {
  return page.getByRole('button', { name: /Lire le site en français|Read the site in English/ })
}

export function themeToggle(page: Page) {
  return page.getByRole('button', { name: /Switch to (light|dark) mode|Passer en mode (clair|sombre)/ })
}
