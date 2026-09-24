import { test, expect, gotoHome, langToggle } from './fixtures'

const NAMES = ['e-famenoPlus', 'Carheav', 'PharmaPlusLite', 'DataPharm']

const STACKS: Record<string, { en: string[]; fr: string[] }> = {
  'e-famenoPlus': { en: ['Java/Android', 'PHP/Symfony', 'MySQL'], fr: ['Java/Android', 'PHP/Symfony', 'MySQL'] },
  Carheav: {
    en: ['Flutter', 'Vue.js', 'NestJS', 'PostgreSQL', 'REST APIs'],
    fr: ['Flutter', 'Vue.js', 'NestJS', 'PostgreSQL', 'API REST'],
  },
  PharmaPlusLite: { en: ['Java/Android', 'PHP/Symfony', 'MySQL'], fr: ['Java/Android', 'PHP/Symfony', 'MySQL'] },
  DataPharm: { en: ['Vue.js', 'NestJS', 'MySQL'], fr: ['Vue.js', 'NestJS', 'MySQL'] },
}

const LOCALES = {
  en: {
    title: 'Case studies',
    labels: ['The problem', 'What I built', 'My role', 'Status'],
    phase1: 'Phase 1: hired by PSI Madagascar',
    phase2: /^Phase 2: the mutual chose to continue with Xonobox directly/,
    sprints: [
      ['Sprint 1', 'Delivered'],
      ['Sprint 2', 'In progress'],
      ['Sprint 3', 'Requested by the client'],
    ],
    caption: 'Illustration: fictional interface and data.',
    confidential: 'Illustration with fictional data. The real code and data are confidential.',
  },
  fr: {
    title: 'Études de cas',
    labels: ['Le problème', "Ce que j'ai construit", 'Mon rôle', 'Statut'],
    phase1: 'Phase 1 : engagé par PSI Madagascar',
    phase2: /^Phase 2 : la mutuelle a choisi de poursuivre directement avec Xonobox/,
    sprints: [
      ['Sprint 1', 'Livré'],
      ['Sprint 2', 'En cours'],
      ['Sprint 3', 'Demandé par le client'],
    ],
    caption: 'Illustration : interface et données fictives.',
    confidential: 'Illustration aux données fictives. Le code et les données réels sont confidentiels.',
  },
} as const

for (const lang of ['en', 'fr'] as const) {
  const L = LOCALES[lang]

  test.describe(`case studies (${lang})`, () => {
    test.beforeEach(async ({ page }) => {
      await gotoHome(page)
      if (lang === 'fr') {
        await langToggle(page).click()
        await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
      }
    })

    test('four case studies in order, each complete', async ({ page }) => {
      const section = page.getByRole('region', { name: L.title })
      await expect(section.getByRole('heading', { level: 3 })).toHaveText(NAMES)
      const articles = section.getByRole('article')
      await expect(articles).toHaveCount(4)

      for (const name of NAMES) {
        const article = section.getByRole('article', { name })

        // Image: non-empty alt, loads once scrolled into view (it is lazy).
        const img = article.getByRole('img')
        await expect(img).toHaveCount(1)
        await expect(img).toHaveAttribute('alt', /\S{10,}/)
        await img.scrollIntoViewIfNeeded()
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)

        // Caption: confidential wording only on the company projects.
        const confidential = name === 'PharmaPlusLite' || name === 'DataPharm'
        await expect(article.locator('figcaption')).toHaveText(confidential ? L.confidential : L.caption)

        // Labels, each with a non-empty value.
        const terms = article.locator('dl > div > dt:not(.sr-only)')
        await expect(terms).toHaveText([...L.labels])
        for (let i = 0; i < L.labels.length; i++) {
          await expect(article.locator('dl > div').nth(i).locator('dd')).toHaveText(/\S/)
        }

        // Stack list.
        const stack = article.locator('dl dd').getByRole('list').getByRole('listitem')
        await expect(stack).toHaveText(STACKS[name][lang])
      }
    })

    test('e-famenoPlus shows the PSI phase, the direct-contract phase and 3 sprints', async ({ page }) => {
      const article = page.getByRole('article', { name: 'e-famenoPlus' })
      const path = article.getByRole('heading', { level: 4 }).locator('xpath=..')
      await expect(path.getByText(L.phase1, { exact: true })).toBeVisible()
      await expect(path.getByText(L.phase2)).toBeVisible()
      const sprints = path.locator('ol ol > li')
      await expect(sprints).toHaveCount(3)
      for (let i = 0; i < 3; i++) {
        const [nameText, state] = L.sprints[i]
        await expect(sprints.nth(i)).toContainText(nameText)
        await expect(sprints.nth(i)).toContainText(state)
      }
    })
  })
}
