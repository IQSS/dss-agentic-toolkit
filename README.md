# Extending Your Agent’s Toolkit

A guide for researchers, with 18 chapters and five appendices. [Read the guide](https://iqss.github.io/dss-agentic-toolkit/).

## Build and check

The repository includes the manuscript snapshot, generated chapter pages, figures, resources, and DSS theme needed to build the website. The build is self-contained and executes no research code.

Install Quarto 1.9.38, Python 3, and `just`, then run:

```sh
just check      # render and check sources, figures, links, and navigation
just preview    # serve the site locally
```

The preview serves this checkout locally and does not publish it.

The Python checks use the standard library. GitHub Actions runs the same source and rendered-site checks. Successful builds of `main` in the IQSS repository publish to GitHub Pages; pull requests are checked without publishing.

## Maintain the guide

Prepare changes on a branch based on the latest IQSS `main`, preserving newer contributions. Run `just check` and open a pull request. Reviewed merges to `main` publish the website.

The manuscript snapshot is in `source/`; `SOURCE.lock` records its content fingerprint. Chapter pages in `chapters/` are generated from that snapshot, and checks enforce their agreement. Propose prose corrections against the manuscript snapshot; maintainers regenerate the chapter pages as part of review. Chapter identifiers keep URLs stable when titles or order change. The landing illustration and its `garage.js` controls are maintained here. Figures have light and dark variants.

## License

Code, including the guide’s code examples, is [MIT licensed](LICENSE). Text and figures are [CC BY 4.0](LICENSE-content).
