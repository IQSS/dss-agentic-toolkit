# dss-agentic-toolchain

An opinionated map of the tools that compose an agentic-AI working surface, organized by function. Live at https://iqss.github.io/dss-agentic-toolchain/.

The prose is generated from a single markdown source that also produces the PDF, so the two never
diverge. The source lives in a separate repository; the chapters here are build products, committed so
that a clone builds without it.

## Build

```sh
quarto preview   # or quarto render; needs Quarto 1.9+
```

Nothing executes, so a render needs only Quarto. The look is the `dss-theme` extension, vendored in
`_extensions/` (`quarto update IQSS/dss-theme` takes a newer version). CI
(`.github/workflows/publish.yml`) renders on every push to `main` and publishes to `gh-pages`.

## Layout

One `.qmd` per chapter in `chapters/`, with the order set by the sidebar in `_quarto.yml`; figures as SVG
in `figures/`. On a Dropbox-synced checkout, `_site` is a symlink outside Dropbox.

## Licence

CC BY 4.0.
