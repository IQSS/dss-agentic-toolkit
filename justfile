default: check

# Build the website from the files included in this repository.
render:
    python3 scripts/render-site.py

# Match the source, figure, link, and navigation checks run by GitHub Actions.
check: render
    scripts/split-chapters.py --check --site .
    scripts/check-site.py

# Serve locally, rebuilding when files change.
preview:
    python3 scripts/render-site.py --preview
