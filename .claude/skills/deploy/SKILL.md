---
name: deploy
description: Deploy Junot's portfolio (preview, production, status, live check) with scripts/deploy.sh. Use when Junot asks to preview, publish, put online, deploy, check the live site or its deployment state.
---

# Déployer le portfolio

Toujours passer par `./scripts/deploy.sh` à la racine du dépôt. Ne pas utiliser le tableau de bord Vercel ni la CLI Vercel.

1. **Choisir la commande**
   - Prévisualisation : `./scripts/deploy.sh preview` (refuse de tourner sur `main` ; créer une branche avant si besoin).
   - Production : `./scripts/deploy.sh prod --yes`, **uniquement** si Junot a demandé explicitement la mise en ligne
     dans le message en cours. Sinon : lui résumer les commits qui partiront (`git log --oneline origin/main..HEAD`)
     et demander « Je mets en ligne ? ».
   - État : `./scripts/deploy.sh status` ; santé du site en ligne : `./scripts/deploy.sh check`.
2. **Avant** : l'arbre de travail doit être propre (commiter d'abord). Ajouter `--skip-tests` seulement si
   `npx playwright test` vient de passer sur le même commit.
3. **Lancer** avec un timeout long (jusqu'à 25 min) : le script attend Vercel puis la CI GitHub.
4. **Interpréter** :
   - `✘ Vercel : failure` → lire les logs de build Vercel (le lien est affiché) et corriger ; ne jamais relancer à l'aveugle.
   - `✘ CI GitHub : failure:<job>` → ouvrir https://github.com/junotrandrianarivo349/portfolio-junot/actions,
     reproduire en local (`npm run lint`, `npm run type-check`, `npx playwright test`).
   - `✘ <url> → <code>` après prod → le site en ligne a un problème : le signaler tout de suite à Junot.
5. **Rendre compte** en français : ce qui est parti, l'URL (preview ou prod), l'état CI/Vercel, et les scores
   PageSpeed s'ils sont disponibles (sinon proposer la mesure sur https://pagespeed.web.dev).
