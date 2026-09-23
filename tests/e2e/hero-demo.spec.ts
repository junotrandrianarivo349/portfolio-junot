import { test } from './fixtures'

/**
 * PLACEHOLDER — hero offline → synced demo.
 * The demo does not exist yet (hero redesign pending). Implement these scenarios
 * once it ships, then remove `.skip`. Select elements by role / accessible name.
 */
test.describe.skip('hero offline → synced demo (TODO: implement after hero redesign)', () => {
  test('offline: added records are queued with the offline state', async () => {
    // 1. Switch the demo to offline (its own toggle, and/or context.setOffline(true)).
    // 2. Add two or three records.
    // 3. Expect the queue to list each record, marked offline with a TEXT label (not colour only).
    // 4. Expect the status to read "offline" / "N pending".
  })

  test('back online: the queue drains and the status becomes "synced"', async () => {
    // 1. From the offline state above, switch back online.
    // 2. Expect the queue to empty (wait on the locator count, no sleeps).
    // 3. Expect the status to read "synced" and to be announced (aria-live / role=status).
  })

  test('reduced motion: same flow, without animations', async () => {
    // page.emulateMedia({ reducedMotion: 'reduce' }), then repeat both scenarios;
    // the final states must be identical and reached without transition delays.
  })
})
