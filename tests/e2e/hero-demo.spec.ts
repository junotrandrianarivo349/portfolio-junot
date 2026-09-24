import type { Page } from '@playwright/test'
import { test, expect, gotoHome, langToggle } from './fixtures'

/**
 * Hero offline → synced demo (src/components/hero/SyncDemo.vue, src/composables/useSyncDemo.ts).
 * Elements are selected by role and accessible name. No sleeps: auto-waiting assertions,
 * and Playwright's fake clock where the exact moment matters (network cut mid-request).
 */

const L = {
  en: {
    figure: /Try it: an enrollment form that works offline/,
    save: 'Save enrollment',
    pendingList: 'Stored on the device',
    syncedList: 'Sent to the server',
    pendingItem: 'pending',
    syncedItem: 'synced',
    sendingItem: 'sending…',
    offline: 'Offline',
    synced: 'Synced',
    syncing: 'Syncing…',
    waiting: (n: number) => `Waiting for network: ${n} enrollment${n > 1 ? 's' : ''}`,
    queueFull: 'Queue full. Turn the network back on to sync.',
  },
  fr: {
    figure: /Essayez : un formulaire d'adhésion qui fonctionne hors ligne/,
    save: "Enregistrer l'adhésion",
    pendingList: "Stockées sur l'appareil",
    syncedList: 'Envoyées au serveur',
    pendingItem: 'en attente',
    syncedItem: 'synchronisée',
    sendingItem: 'envoi…',
    offline: 'Hors ligne',
    synced: 'Synchronisé',
    syncing: 'Synchronisation…',
    waiting: (n: number) => `En attente de réseau : ${n} adhésion${n > 1 ? 's' : ''}`,
    queueFull: 'File pleine. Rétablissez le réseau pour synchroniser.',
  },
}
type Lang = keyof typeof L

function demo(page: Page, lang: Lang = 'en') {
  const s = L[lang]
  const root = page.getByRole('figure', { name: s.figure })
  const listAfter = (title: string) => root.getByText(title, { exact: true }).locator('xpath=following-sibling::ul[1]')
  const pendingList = listAfter(s.pendingList)
  const syncedList = listAfter(s.syncedList)
  return {
    s,
    root,
    network: root.getByRole('switch'),
    save: root.getByRole('button', { name: s.save }),
    pendingItems: pendingList.getByRole('listitem').filter({ hasText: s.pendingItem }),
    syncedItems: syncedList.getByRole('listitem').filter({ hasText: s.syncedItem }),
    // The record being sent stays in the device list, marked "sending…" in cyan.
    sendingItems: pendingList.getByRole('listitem').filter({ hasText: s.sendingItem }),
    pendingTitle: root.getByText(s.pendingList, { exact: true }),
    syncedTitle: root.getByText(s.syncedList, { exact: true }),
    live: root.locator('[aria-live="polite"]'),
    // The visible status badge (the live region is sr-only, so exclude it).
    badge: (text: string) =>
      root.locator('span').filter({ hasText: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }),
  }
}

/** Fake clock, frozen after load: timers fire only on clock.runFor(). */
async function freezeClock(page: Page) {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') })
  return () => page.clock.pauseAt(new Date('2026-01-01T01:00:00Z'))
}

async function openDemo(page: Page, lang: Lang = 'en') {
  await gotoHome(page)
  if (lang === 'fr') {
    await langToggle(page).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  }
  const d = demo(page, lang)
  await d.root.scrollIntoViewIfNeeded()
  await expect(d.network).toHaveAttribute('aria-checked', 'true')
  return d
}

test.describe('hero offline → synced demo', () => {
  test('online: a saved record is sent and marked synced', async ({ page }) => {
    const d = await openDemo(page)
    // The record sent must be the member shown in the form when the button is pressed.
    const shown = (await d.root.getByRole('definition').first().textContent())!.trim()
    expect(shown).toBe('Rasoa H.')
    await d.save.click()
    await expect(d.syncedTitle).toBeVisible()
    await expect(d.syncedItems).toHaveCount(1)
    await expect(d.syncedItems.first()).toContainText(shown)
    await expect(d.pendingTitle).toHaveCount(0)
    await expect(d.live).toHaveText(d.s.synced)
    await expect(d.badge(d.s.synced)).toBeVisible()
  })

  for (const lang of ['en', 'fr'] as const) {
    test(`offline queue then drain when back online (${lang})`, async ({ page }) => {
      const d = await openDemo(page, lang)

      await d.network.click()
      await expect(d.network).toHaveAttribute('aria-checked', 'false')
      await expect(d.badge(d.s.offline)).toBeVisible()

      for (let i = 0; i < 3; i++) await d.save.click()
      await expect(d.pendingTitle).toBeVisible()
      await expect(d.pendingItems).toHaveCount(3)
      await expect(d.live).toHaveText(d.s.waiting(3))
      await expect(d.badge(d.s.offline)).toBeVisible()
      await expect(d.syncedTitle).toHaveCount(0)

      await d.network.click()
      await expect(d.network).toHaveAttribute('aria-checked', 'true')
      await expect(d.pendingItems).toHaveCount(0)
      await expect(d.pendingTitle).toHaveCount(0)
      await expect(d.syncedItems).toHaveCount(3)
      await expect(d.live).toHaveText(d.s.synced)
      await expect(d.badge(d.s.synced)).toBeVisible()
    })
  }

  test('network cut while syncing puts the record back in the queue', async ({ page }) => {
    // Fake clock: the 450 ms "send" timer only fires when we advance time.
    const pause = await freezeClock(page)
    const d = await openDemo(page)
    await pause()

    await d.save.click()
    await expect(d.live).toHaveText(d.s.syncing)
    await expect(d.badge(d.s.syncing)).toBeVisible()

    await d.network.click() // cut mid-request
    await expect(d.network).toHaveAttribute('aria-checked', 'false')
    await page.clock.runFor(2000) // the cancelled request must not complete
    await expect(d.pendingItems).toHaveCount(1)
    await expect(d.pendingItems.first()).toContainText('Rasoa H.')
    await expect(d.live).toHaveText(d.s.waiting(1))
    await expect(d.badge(d.s.offline)).toBeVisible()
    await expect(d.syncedTitle).toHaveCount(0)

    await d.network.click()
    await page.clock.runFor(2000)
    await expect(d.pendingItems).toHaveCount(0)
    await expect(d.syncedItems).toHaveCount(1)
    await expect(d.live).toHaveText(d.s.synced)
  })

  test('queue is capped at 6: the save button is marked disabled, keeps focus and explains why', async ({ page }) => {
    const d = await openDemo(page)
    await d.network.click()
    await expect(d.network).toHaveAttribute('aria-checked', 'false')
    for (let i = 0; i < 6; i++) await d.save.click()
    await expect(d.pendingItems).toHaveCount(6)
    // aria-disabled (not `disabled`) so keyboard focus is not lost when the cap is reached.
    await expect(d.save).toHaveAttribute('aria-disabled', 'true')
    await expect(d.save).toBeFocused()
    await expect(d.save).toHaveAttribute('aria-describedby', 'demo-full')
    await expect(page.locator('#demo-full')).toHaveText(d.s.queueFull)
    await expect(d.live).toContainText(d.s.waiting(6))
    await expect(d.live).toContainText(d.s.queueFull)
    await page.keyboard.press("Enter") // ignored while full (focus is still on the button)
    await expect(d.pendingItems).toHaveCount(6)

    await d.network.click()
    await expect(d.pendingItems).toHaveCount(0)
    await expect(d.save).toHaveAttribute('aria-disabled', 'false')
    await expect(page.locator('#demo-full')).toHaveCount(0)
    await expect(d.syncedItems).toHaveCount(3) // only the last 3 synced records are shown
    await expect(d.live).toHaveText(d.s.synced)
  })

  test('keyboard only: toggle the network with Space, save with Enter', async ({ page }) => {
    const d = await openDemo(page)
    await d.network.focus()
    await expect(d.network).toBeFocused()
    await page.keyboard.press('Space')
    await expect(d.network).toHaveAttribute('aria-checked', 'false')

    await d.save.focus()
    await expect(d.save).toBeFocused()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    await expect(d.pendingItems).toHaveCount(2)
    await expect(d.live).toHaveText(d.s.waiting(2))

    await page.keyboard.press('Tab')
    await expect(d.network).toBeFocused()
    await page.keyboard.press('Space')
    await expect(d.network).toHaveAttribute('aria-checked', 'true')
    await expect(d.pendingItems).toHaveCount(0)
    await expect(d.syncedItems).toHaveCount(2)
    await expect(d.live).toHaveText(d.s.synced)
  })
})

test.describe('hero demo under reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('queue drains immediately (0 ms delays) with the same final state', async ({ page }) => {
    // With a frozen clock, a 50 ms advance drains 3 records only if the send delay is 0
    // (normal motion: 450 ms each; fake timers clamp 0 ms to 1 ms, hence not runFor(1)).
    const pause = await freezeClock(page)
    const d = await openDemo(page)
    await pause()
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)

    await d.network.click()
    for (let i = 0; i < 3; i++) await d.save.click()
    await expect(d.pendingItems).toHaveCount(3)
    await expect(d.live).toHaveText(d.s.waiting(3))

    await d.network.click()
    await page.clock.runFor(50)
    await expect(d.live).toHaveText(d.s.synced)
    await expect(d.pendingItems).toHaveCount(0)
    await expect(d.syncedItems).toHaveCount(3)
    await expect(d.live).toHaveText(d.s.synced)
    await expect(d.badge(d.s.synced)).toBeVisible()
  })
})

test.describe('hero demo control (normal motion)', () => {
  test('with a frozen clock, a 50 ms advance does not drain the queue', async ({ page }) => {
    // Counterpart of the reduced-motion test: proves that test measures the delay, not luck.
    const pause = await freezeClock(page)
    const d = await openDemo(page)
    await pause()
    await d.network.click()
    for (let i = 0; i < 3; i++) await d.save.click()
    await d.network.click()
    await page.clock.runFor(50)
    await expect(d.live).toHaveText(d.s.syncing)
    await expect(d.sendingItems).toHaveCount(1)
    await expect(d.pendingItems).toHaveCount(2)
    await page.clock.runFor(3 * 450 + 50)
    await expect(d.pendingItems).toHaveCount(0)
    await expect(d.live).toHaveText(d.s.synced)
  })
})
