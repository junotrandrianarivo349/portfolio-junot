# Portfolio de Junot — instructions pour Claude

Site : https://portfolio-junot.vercel.app (EN `/`, FR `/fr/`). Dépôt : `junotrandrianarivo349/portfolio-junot`.
Réponds à Junot en français. Code, commits (en anglais) et commentaires suivent le style existant.

## Contenu
- La seule source de contenu est `CV_Junot_Randrianarivo.md`. N'invente aucune expérience, chiffre, client ni témoignage.
  Si Junot donne une nouvelle information, ajoute-la d'abord dans ce fichier.
- Tous les textes visibles sont dans `src/locales/en.json` et `fr.json` (mêmes clés ; le type-check échoue sinon).
  La règle ESLint `vue/no-bare-strings-in-template` interdit le texte en dur.
- Formulations imposées par Junot, à ne pas « corriger » : « démo validée » (Carheav), « M'écrire un email »,
  « GMT+3 », « disponible en remote », « sprint 3 demandé par le client ».

## Déploiement — toujours via le script
Vercel déploie à chaque `git push` (intégration Git). Le script pilote tout via git et l'API publique GitHub :
pas de tableau de bord Vercel, pas de token Vercel.

| Demande de Junot | Commande |
|---|---|
| « montre-moi / prévisualise » (depuis une branche) | `./scripts/deploy.sh preview` |
| « mets en ligne / déploie en prod » | `./scripts/deploy.sh prod --yes` (voir règle ci-dessous) |
| « le site marche ? / état du déploiement » | `./scripts/deploy.sh status` puis `./scripts/deploy.sh check` |

- `--skip-tests` saute Playwright ; à n'utiliser que si les tests viennent de passer sur **ce même commit**.
- **Règle production** : n'utilise `--yes` qu'après une demande explicite de Junot dans le chat, dans le message
  en cours, pour cette mise en ligne précise. Sinon, demande-lui confirmation d'abord.
- Travail normal : crée une branche (`git switch -c <sujet>`), commite, `preview`, puis `prod` quand Junot valide.
- `prod` depuis une branche : merge `--no-ff` dans `main`, push, attend Vercel + CI, puis vérifie les URL clés.
- Scores PageSpeed : nécessitent `PAGESPEED_API_KEY` ; sinon mesurer via https://pagespeed.web.dev (Chrome si connecté).
- Les URL de preview sont protégées par Vercel Authentication (Junot doit être connecté à Vercel pour les ouvrir).

## Git et comptes
- Remote : `git@github-junot349:junotrandrianarivo349/portfolio-junot.git` (alias SSH, clé `~/.ssh/id_junot349`).
- Auteur des commits : `Junot Randrianarivo <junotrandrianarivo349@gmail.com>` (config globale).
- Ne jamais réécrire l'historique de `main` ni forcer un push sans accord explicite.

## Qualité — avant de dire « c'est fait »
`npm run lint`, `npm run type-check`, `npm run build` (vite-ssg), `npx playwright test` (100+ tests, axe inclus).
Vérifier visuellement en sombre ET en clair : un bug de sélecteur `:global(.dark) x` en style scoped a déjà
rendu toute la page à 14 % d'opacité. Pas de `:global()` dans les styles scoped : utiliser les variantes Tailwind `dark:`.

## Agents de revue
`.claude/agents/` : `ux-designer`, `accessibility-auditor`, `qa-tester`. Les lancer après un changement visuel notable.
