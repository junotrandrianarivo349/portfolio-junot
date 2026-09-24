import { test, expect, gotoHome, langToggle } from './fixtures'

test.describe('contact links', () => {
  test('mailto, WhatsApp, LinkedIn and GitHub links exist', async ({ page }) => {
    await gotoHome(page)
    await expect(page.locator('a[href="mailto:junotrandrianarivo5404@gmail.com"]').first()).toBeAttached()
    await expect(page.locator('a[href^="https://wa.me/261347133579"]').first()).toBeAttached()
    await expect(
      page.locator('a[href="https://www.linkedin.com/in/junot-randrianarivo-b19143196/"]').first(),
    ).toBeAttached()
    await expect(page.locator('a[href="https://github.com/junotrandrianarivo349"]').first()).toBeAttached()
  })

  test('CV link points to the PDF of the active language', async ({ page }) => {
    await gotoHome(page)
    const cv = page.locator('a[href$=".pdf"]')
    await expect(cv.first()).toHaveAttribute('href', '/cv-en.pdf')
    await expect(page.locator('a[href="/cv-fr.pdf"]')).toHaveCount(0)

    await langToggle(page).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(cv.first()).toHaveAttribute('href', '/cv-fr.pdf')
    await expect(page.locator('a[href="/cv-en.pdf"]')).toHaveCount(0)
  })

  test('contact CTAs: "Email me" mailto and "Download my CV", in both languages', async ({ page }) => {
    await gotoHome(page)
    const cases = [
      { email: 'Email me', cv: 'Download my CV (PDF, 205 KB)', file: '/cv-en.pdf' },
      { email: "M'écrire un email", cv: 'Télécharger mon CV (PDF, 209 Ko)', file: '/cv-fr.pdf' },
    ]
    for (const [i, c] of cases.entries()) {
      if (i === 1) {
        await langToggle(page).click()
        await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
      }
      const section = page.locator('#contact')
      const email = section.getByRole('link', { name: c.email, exact: true })
      await expect(email).toHaveAttribute('href', 'mailto:junotrandrianarivo5404@gmail.com')
      const cv = section.getByRole('link', { name: c.cv, exact: true })
      await expect(cv).toHaveAttribute('href', c.file)
      await expect(cv).toHaveAttribute('download', /.*/)
      await cv.scrollIntoViewIfNeeded()
      await expect(email).toBeVisible()
      await expect(cv).toBeVisible()
    }
  })

  for (const file of ['/cv-en.pdf', '/cv-fr.pdf']) {
    test(`${file} is served`, async ({ request }) => {
      const res = await request.get(file)
      expect(res.status()).toBe(200)
      expect(res.headers()['content-type']).toContain('application/pdf')
    })
  }
})
