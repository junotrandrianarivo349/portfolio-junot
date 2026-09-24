#!/usr/bin/env bash
# Deployment helper for the portfolio.
#
# Vercel already deploys on every `git push` (Git integration) and reports each deployment
# to GitHub as a commit status. This script only drives git and reads those statuses through
# the public GitHub API: no Vercel dashboard, no Vercel token, no secret to store.
#
# Usage:
#   ./scripts/deploy.sh preview [--skip-tests]   checks → push current branch → wait for CI + Vercel → preview URL
#   ./scripts/deploy.sh prod    [--skip-tests] [--yes]   checks → confirm → merge into main → push → wait → smoke test + PageSpeed
#   ./scripts/deploy.sh status                   CI + Vercel state of the current commit
#   ./scripts/deploy.sh check                    smoke test + PageSpeed of the live site (no deploy)
set -euo pipefail

REPO="junotrandrianarivo349/portfolio-junot"
PROD_URL="https://portfolio-junot.vercel.app"
VERCEL_SCOPE="junot"          # team slug in preview URLs: <project>-git-<branch>-<scope>.vercel.app
PROJECT="portfolio-junot"
MAIN_BRANCH="main"
WAIT_TIMEOUT=900              # seconds

cd "$(dirname "$0")/.."

# ---------- output helpers ----------
bold=$'\e[1m'; green=$'\e[32m'; red=$'\e[31m'; yellow=$'\e[33m'; cyan=$'\e[36m'; reset=$'\e[0m'
step() { printf '\n%s▸ %s%s\n' "$cyan$bold" "$*" "$reset"; }
ok()   { printf '%s✔ %s%s\n' "$green" "$*" "$reset"; }
warn() { printf '%s! %s%s\n' "$yellow" "$*" "$reset"; }
die()  { printf '%s✘ %s%s\n' "$red" "$*" "$reset" >&2; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || die "Commande manquante : $1"; }
need git; need curl; need node; need npm

# Read a JSON field with node (no jq dependency). Usage: json '<js expression on `d`>' < file
json() { node -e "let s='';process.stdin.on('data',c=>s+=c).on('end',()=>{const d=JSON.parse(s);const v=($1);process.stdout.write(v==null?'':String(v))})"; }

gh_api() { curl -fsSL -H 'Accept: application/vnd.github+json' "https://api.github.com/repos/$REPO/$1"; }

current_branch() { git rev-parse --abbrev-ref HEAD; }

preview_url() {
  # Vercel branch alias: lowercase, non-alphanumerics → "-".
  local slug
  slug=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-|-$//g')
  echo "https://$PROJECT-git-$slug-$VERCEL_SCOPE.vercel.app"
}

# ---------- checks ----------
require_clean_tree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    git status --short
    die "Des fichiers ne sont pas commités. Faites un commit (ou git stash) avant de déployer."
  fi
}

run_checks() {
  local skip_tests="$1"
  step "Vérifications locales"
  npm run lint --silent && ok "Lint"
  npm run type-check --silent && ok "Types"
  npm run build --silent >/dev/null && ok "Build (prérendu vite-ssg)"
  [[ -f dist/index.html && -f dist/fr/index.html ]] || die "Le prérendu n'a pas produit dist/index.html et dist/fr/index.html"
  if [[ "$skip_tests" == "1" ]]; then
    warn "Tests Playwright ignorés (--skip-tests)"
  else
    npx playwright test --reporter=dot && ok "Tests Playwright + axe"
  fi
}

# ---------- waiting for GitHub Actions and Vercel ----------
# Prints the final state of the Vercel status for a commit: success | failure | error | timeout
wait_vercel() {
  local sha="$1" start state
  start=$(date +%s)
  while :; do
    state=$(gh_api "commits/$sha/status" 2>/dev/null \
      | json "(d.statuses.find(s=>s.context.startsWith('Vercel'))||{}).state" || true)
    case "$state" in
      success|failure|error) echo "$state"; return ;;
    esac
    (( $(date +%s) - start > WAIT_TIMEOUT )) && { echo timeout; return; }
    sleep 10
  done
}

# Prints the conclusion of the GitHub Actions CI run for a commit: success | failure | … | timeout
wait_ci() {
  local sha="$1" start result
  start=$(date +%s)
  while :; do
    result=$(gh_api "commits/$sha/check-runs" 2>/dev/null | json "
      (() => { const r = d.check_runs.filter(c => c.app && c.app.slug === 'github-actions');
        if (!r.length) return 'pending';
        if (r.some(c => c.status !== 'completed')) return 'pending';
        const bad = r.find(c => c.conclusion !== 'success' && c.conclusion !== 'skipped');
        return bad ? bad.conclusion + ':' + bad.name : 'success' })()" || true)
    [[ -n "$result" && "$result" != "pending" ]] && { echo "$result"; return; }
    (( $(date +%s) - start > WAIT_TIMEOUT )) && { echo timeout; return; }
    sleep 15
  done
}

wait_all() {
  local sha="$1"
  step "Attente de la CI GitHub et du déploiement Vercel (commit ${sha:0:7})"
  local vercel ci
  vercel=$(wait_vercel "$sha")
  [[ "$vercel" == "success" ]] && ok "Vercel : déploiement terminé" || die "Vercel : $vercel. Détails : https://vercel.com/$VERCEL_SCOPE/$PROJECT"
  ci=$(wait_ci "$sha")
  [[ "$ci" == "success" ]] && ok "CI GitHub : tout est vert" || die "CI GitHub : $ci. Détails : https://github.com/$REPO/actions"
}

# ---------- production smoke test ----------
smoke_test() {
  step "Vérification du site en production"
  local path code
  for path in / /fr/ /cv-en.pdf /cv-fr.pdf /og-image.png /images/photo.jpg; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$PROD_URL$path")
    [[ "$code" == "200" ]] && ok "$path → 200" || die "$path → $code"
  done
  # Download first, then search: piping curl into `grep -q` fails under `pipefail` (grep exits early → curl error 23).
  local html
  html=$(curl -fsSL "$PROD_URL/")
  [[ "$html" == *'<html lang="en"'* ]] && ok "HTML prérendu (EN)" || die "Le HTML de / n'est pas prérendu"
  html=$(curl -fsSL "$PROD_URL/fr/")
  [[ "$html" == *'<html lang="fr"'* ]] && ok "HTML prérendu (FR)" || die "Le HTML de /fr/ n'est pas prérendu"
}

pagespeed() {
  step "PageSpeed Insights (mobile, serveurs Google)"
  # Google no longer serves keyless requests. Optional free key: export PAGESPEED_API_KEY=...
  # (Google Cloud console → APIs & Services → Credentials, enable "PageSpeed Insights API").
  if [[ -z "${PAGESPEED_API_KEY:-}" ]]; then
    warn "Pas de PAGESPEED_API_KEY : mesure manuelle → https://pagespeed.web.dev/?url=$PROD_URL/"
    return
  fi
  local cats="category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO"
  local page body res
  for page in "/" "/fr/"; do
    body=$(curl -sSL --max-time 180 \
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$PROD_URL$page&strategy=mobile&$cats&key=$PAGESPEED_API_KEY" || true)
    res=$(printf '%s' "$body" | json "d.lighthouseResult ? Object.values(d.lighthouseResult.categories).map(c=>c.title+' '+Math.round(c.score*100)).join(' | ') : ''" 2>/dev/null || true)
    if [[ -n "$res" ]]; then ok "$page  $res"; else warn "$page : PageSpeed indisponible. Mesure manuelle : https://pagespeed.web.dev/?url=$PROD_URL$page"; fi
  done
}

# ---------- commands ----------
cmd_status() {
  local sha branch
  sha=$(git rev-parse HEAD); branch=$(current_branch)
  step "État du commit ${sha:0:7} ($branch)"
  if git ls-remote --exit-code origin "refs/heads/$branch" >/dev/null 2>&1 \
     && [[ "$(git rev-parse "origin/$branch" 2>/dev/null)" == "$sha" ]]; then ok "Poussé sur GitHub"; else warn "Ce commit n'est pas encore poussé"; fi
  printf 'Vercel : %s\n' "$(gh_api "commits/$sha/status" 2>/dev/null | json "(d.statuses.find(s=>s.context.startsWith('Vercel'))||{state:'aucun'}).state" || echo '?')"
  printf 'CI     : %s\n' "$(gh_api "commits/$sha/check-runs" 2>/dev/null | json "d.check_runs.filter(c=>c.app&&c.app.slug==='github-actions').map(c=>c.name+'='+(c.conclusion||c.status)).join(', ')||'aucune'" || echo '?')"
  [[ "$branch" == "$MAIN_BRANCH" ]] && echo "URL    : $PROD_URL" || echo "URL    : $(preview_url "$branch")"
}

cmd_preview() {
  local skip_tests="$1" branch sha
  branch=$(current_branch)
  [[ "$branch" == "$MAIN_BRANCH" ]] && die "Vous êtes sur $MAIN_BRANCH. La prévisualisation se fait depuis une branche (ex. git switch -c ma-branche)."
  require_clean_tree
  run_checks "$skip_tests"
  step "Push de la branche $branch"
  git push -u origin "$branch"
  sha=$(git rev-parse HEAD)
  wait_all "$sha"
  printf '\n%sPrévisualisation prête :%s %s\n' "$bold" "$reset" "$(preview_url "$branch")"
  echo "(protégée par Vercel : connectez-vous à Vercel pour l'ouvrir)"
}

cmd_prod() {
  local skip_tests="$1" branch sha answer
  branch=$(current_branch)
  require_clean_tree
  git fetch -q origin
  if [[ "$branch" != "$MAIN_BRANCH" ]]; then
    local ahead
    ahead=$(git rev-list --count "origin/$MAIN_BRANCH..$branch")
    step "Mise en production de la branche $branch ($ahead commit(s) de plus que $MAIN_BRANCH)"
    git log --oneline "origin/$MAIN_BRANCH..$branch" | head -20
  else
    step "Mise en production de $MAIN_BRANCH"
  fi
  run_checks "$skip_tests"

  if [[ "$assume_yes" == "1" ]]; then
    warn "Confirmation fournie par --yes"
  else
    printf '\n%sLe site public %s va être mis à jour.%s Continuer ? (oui/non) ' "$bold" "$PROD_URL" "$reset"
    read -r answer
    [[ "$answer" == "oui" ]] || die "Annulé. Rien n'a été modifié."
  fi

  if [[ "$branch" != "$MAIN_BRANCH" ]]; then
    git push -u origin "$branch"
    git switch "$MAIN_BRANCH"
    git pull --ff-only origin "$MAIN_BRANCH"
    git merge --no-ff "$branch" -m "Merge branch '$branch'"
  fi
  step "Push de $MAIN_BRANCH (Vercel déploie en production)"
  git push origin "$MAIN_BRANCH"
  sha=$(git rev-parse HEAD)
  wait_all "$sha"
  smoke_test
  pagespeed
  printf '\n%sEn ligne :%s %s\n' "$bold$green" "$reset" "$PROD_URL"
}

skip_tests=0
assume_yes=0
for arg in "${@:2}"; do
  case "$arg" in
    --skip-tests) skip_tests=1 ;;
    --yes) assume_yes=1 ;;   # non-interactive prod (only after the owner confirmed in chat)
    *) die "Option inconnue : $arg" ;;
  esac
done

case "${1:-}" in
  preview) cmd_preview "$skip_tests" ;;
  prod)    cmd_prod "$skip_tests" ;;
  status)  cmd_status ;;
  check)   smoke_test; pagespeed ;;
  *) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
