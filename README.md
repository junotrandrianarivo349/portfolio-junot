# Junot Randrianarivo — Portfolio

Personal portfolio of Junot Randrianarivo, full-stack JavaScript developer (Vue.js · NestJS · Flutter) based in Madagascar, available for remote work.

**Live:** https://portfolio-junot.vercel.app

[![CI](https://github.com/junotrandrianarivo349/portfolio-junot/actions/workflows/ci.yml/badge.svg)](https://github.com/junotrandrianarivo349/portfolio-junot/actions/workflows/ci.yml)

## Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript**
- **Vite** + **vite-ssg**: static prerendering, one HTML page per language (`/` and `/fr/`)
- **Tailwind CSS v4** (configured in CSS, semantic color tokens for dark/light themes)
- **vue-i18n** (messages precompiled at build time) and **vue-router** — English at `/`, French at `/fr/`
- **@unhead/vue** — per-language `<title>`, description, canonical, hreflang and Open Graph tags in the static HTML
- **unplugin-icons** — Simple Icons and Lucide compiled to inline SVG at build time (no runtime requests)
- Self-hosted fonts via **Fontsource** (Bricolage Grotesque, IBM Plex Sans)
- **Playwright** + **@axe-core/playwright** end-to-end and accessibility tests, **Lighthouse** audit
- No backend: fully static site, deployed on **Vercel**

## Getting started

Requirements: Node.js 22+ and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server on http://localhost:5173
```

## Scripts

| Command              | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Dev server with hot reload                          |
| `npm run build`      | Type-check then prerender both pages into `dist/`   |
| `npm run preview`    | Serve the production build locally                  |
| `npm run type-check` | Type-check `.ts` and `.vue` files with `vue-tsc`    |
| `npm run lint`       | ESLint (Vue + TypeScript rules)                     |
| `npm run lint:fix`   | ESLint with automatic fixes                         |
| `npm run test:e2e`   | Playwright tests (1440 / 768 / 375 px) + axe        |
| `npm run lighthouse` | Lighthouse audit of a running preview (port 4173)   |

## Project structure

```
src/
├── assets/main.css        # Tailwind entry, theme tokens, animations
├── components/
│   ├── layout/            # Header, footer, theme and language toggles
│   ├── sections/          # One component per page section
│   └── ui/                # Small reusable pieces (buttons, badges, titles)
│   ├── hero/              # Offline → synced demo, topographic background
│   └── projects/          # e-famenoPlus contract path
├── composables/           # useSyncDemo (demo state machine), useTheme, useLocale (head + language switch)
├── data/                  # Non-translatable data: case studies, skills, links, site URL
├── pages/HomePage.vue     # Page composition; sections below the hero hydrate on visibility
├── locales/en.json, fr.json  # All visible text
├── router.ts              # / (en) and /fr/ (fr)
└── i18n.ts                # One i18n instance per app (safe for prerendering)
tests/e2e/                 # Playwright specs
.claude/agents/            # Review subagents: ux-designer, accessibility-auditor, qa-tester
CV_Junot_Randrianarivo.md  # Single source of truth for the site content
```

### Editing content

- **Text**: edit `src/locales/en.json` and `src/locales/fr.json`. Both files must have the same keys; `npm run type-check` fails if a French key is missing.
- **Links** (GitHub, LinkedIn, WhatsApp, repository): `src/data/contact.ts`. Empty links are hidden automatically.
- **Case studies**: `src/data/projects.ts` (order, stack, image) and `projects.items.*` in the locale files.
- **CV**: replace `public/cv-en.pdf` and `public/cv-fr.pdf`. The download button serves the file matching the current language.
- The lint rule `vue/no-bare-strings-in-template` rejects hard-coded text in templates.

## Quality

- GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request:
  1. **lint → type-check → prerender**, then checks the content is present in the static HTML of both languages;
  2. **Playwright** on desktop, tablet and mobile, including the offline demo and an **axe** WCAG 2.1 AA scan.
- Accessibility: semantic landmarks, skip link, visible keyboard focus, `prefers-reduced-motion` respected, WCAG AA contrasts in both themes (checked with axe-core).
- SEO: localized `<title>` and meta description, `<html lang>` kept in sync, Open Graph image, favicon.

## Deployment

Vercel deploys automatically on every `git push` (Git integration). `scripts/deploy.sh` wraps the whole flow and
reads the CI and Vercel states from the public GitHub API, so no Vercel token or dashboard is needed:

```bash
npm run deploy:preview   # checks (lint, types, prerender, Playwright) → push branch → wait CI + Vercel → preview URL
npm run deploy:prod      # same checks → confirmation → merge into main → push → wait → smoke test + PageSpeed Insights
npm run deploy:status    # CI and Vercel state of the current commit
npm run deploy:check     # smoke test + PageSpeed Insights of the live site, without deploying
```

Add `-- --skip-tests` to skip Playwright (e.g. `npm run deploy:preview -- --skip-tests`).

### First-time setup (Vercel)


1. Push the repository to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project**, import the repository.
3. Vercel detects Vite automatically: build command `npm run build` (vite-ssg), output directory `dist`.
4. Every push to `main` deploys to production; other branches get preview URLs.

Live site: **https://portfolio-junot.vercel.app** — if the domain changes, update the canonical, `og:url` and `og:image` URLs in `index.html`.

## License

Content, photo and CV: © Junot Randrianarivo, all rights reserved.
