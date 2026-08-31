default: render

# Regenerate chapters, figures and the sidebar from the upstream markdown, which is the source of
# truth. Never edit chapters/ or figures/ by hand -- a correction goes upstream, then this re-runs.
sync:
    ../dss-training-ops/scripts/split-chapters.py \
      --upstream ../../publishing/agentic-ai-tool-chain \
      --site .

# Build the site into _site
render:
    quarto render

# Serve locally, rebuilding on save
preview:
    quarto preview
