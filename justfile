default: verify

# Everything: that this site is what a fresh sync would produce, and that it renders clean.
verify: check-upstream check

# Regenerate chapters, figures, the filter and the sidebar from the upstream markdown, which is the
# source of truth. Never edit anything it writes by hand -- a correction goes upstream, then this
# re-runs, and the checks below fail until it does.
sync:
    ../dss-training-ops/scripts/split-chapters.py \
      --upstream ../../publishing/agentic-ai-toolkit \
      --site .

# Is this site current with the upstream document and the shared tooling? Green means `just sync`
# would change nothing. CI cannot ask this -- it clones this repository alone, and reaching upstream
# would put a credential in the workflow -- so it is asked here, by whoever is working in the repo.
check-upstream:
    ../dss-training-ops/scripts/check-upstream.py --site . \
      --upstream ../../publishing/agentic-ai-toolkit \
      --tooling ../dss-training-ops/scripts

# Build the site into _site
render:
    python3 scripts/render-site.py

# What CI runs: the committed tree is what the committed source produces, and the render is clean.
check: render
    scripts/split-chapters.py --check --site .
    scripts/check-site.py

# Serve locally, rebuilding on save
preview:
    python3 scripts/render-site.py --preview

# Live local preview while the author edits the guide: one sync, then quarto serves and reloads
# the browser on save while watchexec re-runs the sync whenever the upstream source markdown or a
# figure SVG changes. The sync here passes --allow-dirty, because the point is to see edits before
# they are committed; SOURCE.lock then names a commit that lacks them, so run a plain `just sync`
# after the edits are committed (check-upstream will say so). Nothing deploys. Ctrl-C stops both.
# Needs watchexec (brew install watchexec).
watch:
    #!/usr/bin/env bash
    set -euo pipefail
    up=../../publishing/agentic-ai-toolkit
    sync="../dss-training-ops/scripts/split-chapters.py --upstream $up --site . --allow-dirty"
    $sync
    # The initial sync is complete; another startup sync would race the preview's file copy.
    watchexec --postpone --watch "$up/source" --watch "$up/figures" --exts md,svg -- $sync &
    watcher=$!
    trap 'kill "$watcher" 2>/dev/null || true' EXIT INT TERM
    python3 scripts/render-site.py --preview

# Refresh the existing private Cloudflare preview. Public publication uses GitHub Actions.
# Supply credentials in the local environment; never commit them.
deploy-preview: verify
    #!/usr/bin/env bash
    set -euo pipefail
    : "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN for the private preview}"
    : "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID for the private preview}"
    wrangler pages deploy _site --project-name dss-agentic-toolkit --branch main

# Retain the existing private-preview command for maintainer scripts.
alias deploy := deploy-preview
