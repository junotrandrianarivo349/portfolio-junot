# Junot Randrianarivo — Portfolio

Personal portfolio of Junot Randrianarivo, full-stack JavaScript developer (Vue.js · NestJS · Flutter) based in Madagascar, available for remote work.

## Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript**
- **Vite** for dev server and build
- **Tailwind CSS v4** (configured in CSS, semantic color tokens for dark/light themes)
- **vue-i18n** — bilingual English / French, English by default
- **unplugin-icons** — Simple Icons and Lucide compiled to inline SVG at build time (no runtime requests)
- Self-hosted fonts via **Fontsource** (Bricolage Grotesque, Figtree)
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
| `npm run build`      | Type-check then production build into `dist/`       |
| `npm run preview`    | Serve the production build locally                  |
| `npm run type-check` | Type-check `.ts` and `.vue` files with `vue-tsc`    |
| `npm run lint`       | ESLint (Vue + TypeScript rules)                     |
| `npm run lint:fix`   | ESLint with automatic fixes                         |

## Project structure

```
src/
├── assets/main.css        # Tailwind entry, theme tokens, animations
├── components/
│   ├── layout/            # Header, footer, theme and language toggles
│   ├── sections/          # One component per page section
│   └── ui/                # Small reusable pieces (buttons, badges, titles)
├── composables/           # useTheme, useLocale
├── data/                  # Non-translatable data: stacks, links, icons
├── directives/vReveal.ts  # Fade-in on scroll (IntersectionObserver)
├── locales/en.json, fr.json  # All visible text
└── i18n.ts
CV_Junot_Randrianarivo.md  # Single source of truth for the site content
```

### Editing content

- **Text**: edit `src/locales/en.json` and `src/locales/fr.json`. Both files must have the same keys; `npm run type-check` fails if a French key is missing.
- **Links** (GitHub, LinkedIn, repository): `src/data/contact.ts`. Empty links are hidden automatically.
- **Featured demo**: set `demoUrl` and `codeUrl` in `src/data/featured.ts`; the buttons become active.
- **CV**: replace `public/cv-en.pdf` and `public/cv-fr.pdf`. The download button serves the file matching the current language.
- The lint rule `vue/no-bare-strings-in-template` rejects hard-coded text in templates.

## Quality

- GitHub Actions (`.github/workflows/ci.yml`) runs **lint → type-check → build** on every push and pull request.
- Accessibility: semantic landmarks, skip link, visible keyboard focus, `prefers-reduced-motion` respected, WCAG AA contrasts in both themes (checked with axe-core).
- SEO: localized `<title>` and meta description, `<html lang>` kept in sync, Open Graph image, favicon.

## Deployment (Vercel)

1. Push the repository to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project**, import the repository.
3. Vercel detects Vite automatically: build command `npm run build`, output directory `dist`.
4. Every push to `main` deploys to production; other branches get preview URLs.

After the first deployment, add the absolute site URL to the `og:image` and `og:url` tags in `index.html` so link previews work on every platform.

## License

Content, photo and CV: © Junot Randrianarivo, all rights reserved.
