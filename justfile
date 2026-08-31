default: verify

# Everything: that this site is what a fresh sync would produce, and that it renders clean.
verify: check-upstream check

# Regenerate chapters, figures, the filter and the sidebar from the upstream markdown, which is the
# source of truth. Never edit anything it writes by hand -- a correction goes upstream, then this
# re-runs, and the checks below fail until it does.
sync:
    ../dss-training-ops/scripts/split-chapters.py \
      --upstream ../../publishing/agentic-ai-tool-chain \
      --site .

# Is this site current with the upstream document and the shared tooling? Green means `just sync`
# would change nothing. CI cannot ask this -- it clones this repository alone, and reaching upstream
# would put a credential in the workflow -- so it is asked here, by whoever is working in the repo.
check-upstream:
    ../dss-training-ops/scripts/check-upstream.py --site . \
      --upstream ../../publishing/agentic-ai-tool-chain \
      --tooling ../dss-training-ops/scripts

# Build the site into _site
render:
    quarto render

# What CI runs: the committed tree is what the committed source produces, and the render is clean.
check: render
    scripts/split-chapters.py --check --site .
    scripts/check-site.py

# Serve locally, rebuilding on save
preview:
    quarto preview
