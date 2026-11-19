# Extending Your Agent’s Toolkit

A guide for researchers, with 18 chapters and five appendices. [Read the guide](https://iqss.github.io/dss-agentic-toolkit/).

## Build and check

This repository contains the public manuscript snapshot, generated chapter pages, figures, resources, and DSS theme. It builds independently and does not execute research code.

Install Quarto 1.9.38, Python 3, and `just`, then run `just check`. The Python checks use the standard library. GitHub Actions checks pull requests and publishes successful `main` builds to GitHub Pages.

## Contribute and maintain

Start from the latest public version and propose changes through a pull request. Preserve contributions already incorporated here. `SOURCE.lock` identifies the manuscript snapshot used to generate the chapters.

The author maintains development material in a separate private repository. Approved guide content and its required website files are transferred into a branch of this repository and reviewed through a pull request. Private repositories are never merged or mirrored here. Do not edit generated chapter pages directly; reconcile manuscript changes before regenerating them. Chapter identifiers keep URLs stable when titles or order change.

## License

Code, including the guide’s code examples, is [MIT licensed](LICENSE). Text and figures are [CC BY 4.0](LICENSE-content).
