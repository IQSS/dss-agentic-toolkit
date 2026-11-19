default: check

# Build the committed public snapshot. GitHub Actions publishes checked main builds.
render:
    python3 scripts/render-site.py

check: render
    python3 scripts/split-chapters.py --check --site .
    python3 scripts/check-site.py
