default: check

# Regenerate chapters, figures, the filter and the sidebar from the upstream markdown, which is the
# source of truth. Never edit anything it writes by hand -- a correction goes upstream, then this
# re-runs, and `just check` fails until it does.
sync:
    ../dss-training-ops/scripts/split-chapters.py \
      --upstream ../../publishing/agentic-ai-tool-chain \
      --site .

# Build the site into _site
render:
    quarto render

# What CI runs: the committed tree is what the source produces, and the rendered site is clean.
check: render
    scripts/split-chapters.py --check --site .
    scripts/check-site.py

# Serve locally, rebuilding on save
preview:
    quarto preview
