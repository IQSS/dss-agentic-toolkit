# Extending Your Agent’s Toolkit

A guide for researchers, with 18 chapters and five appendices. [Read the guide](https://iqss.github.io/dss-agentic-toolkit/).

## Build and check

The repository includes the manuscript snapshot, generated chapter pages, figures, resources, and DSS theme needed to build the website. Building does not require access to the private authoring repositories or execute research code.

Install Quarto 1.9.38, Python 3, and `just`, then run:

```sh
just check      # render and check sources, figures, links, and navigation
just preview    # serve the site locally
```

The Python checks use the standard library. GitHub Actions runs the same source and rendered-site checks. Successful builds of `main` in the IQSS repository publish to GitHub Pages; pull requests are checked without publishing.

## Maintain the guide

Prose and figures are authored in the separate `agentic-ai-toolkit` manuscript project. `SOURCE.lock` identifies the committed manuscript snapshot. Maintainers with the authoring repositories and shared `dss-training-ops` tooling can use `just sync` to refresh this site and `just verify` to check it against those sources. `just watch` supports local editorial previews, including uncommitted prose; make a normal sync from committed source before publishing.

Edit prose upstream rather than in generated `chapters/` pages. Chapter identifiers keep URLs stable when titles or order change. The landing illustration and its `garage.js` controls are maintained here. Figures have light and dark variants.

An existing private Cloudflare preview can be refreshed with `just deploy-preview`, using locally supplied `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables. This is separate from the public GitHub Pages deployment.

## License

Code, including the guide’s code examples, is [MIT licensed](LICENSE). Text and figures are [CC BY 4.0](LICENSE-content).
