#!/usr/bin/env bash
# Rename the product everywhere it is shown to users.
#   scripts/rebrand.sh "New Name"            (current name is read from brand.ts)
set -euo pipefail
NEW="${1:?usage: scripts/rebrand.sh \"New Name\"}"
cd "$(dirname "$0")/.."
OLD=$(sed -n "s/^  name: '\(.*\)',$/\1/p" libraries/helpers/src/utils/brand.ts)
[ -n "$OLD" ] || { echo "could not read the current name from brand.ts"; exit 1; }
esc() { printf '%s' "$1" | sed 's/[\/&]/\\&/g'; }
grep -rIl --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.next \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.svg' --include='*.md' \
  -- "$OLD" apps libraries README.md NOTICE.md 2>/dev/null \
  | xargs -r sed -i "s/$(esc "$OLD")/$(esc "$NEW")/g"
OLD_L=$(printf '%s' "$OLD" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
NEW_L=$(printf '%s' "$NEW" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
sed -i "100,290s/\b$OLD_L\b/$NEW_L/g" apps/frontend/src/components/public-api/public.component.tsx
echo "Renamed \"$OLD\" to \"$NEW\". Replace the logo in apps/frontend/src/components/new-layout/logo.tsx,"
echo "apps/frontend/src/components/ui/logo-text.component.tsx and apps/frontend/public/ (favicon, brand*.svg), then rebuild."
