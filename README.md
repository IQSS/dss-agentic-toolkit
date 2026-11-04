# Extending Your Agent’s Toolkit

The website is generated from the canonical manuscript in `workspace/publishing/agentic-ai-toolkit/`, which also builds the PDF. Edit prose and figures upstream; regenerate the chapter copies here. Explicit chapter ids keep addresses stable when titles or order change.

## Local reading draft

The November 3, 2026 structure review has 19 chapters in six parts and four reference appendices. The local render has 26 pages, including the landing page, 404 page, and a redirect from the former standalone checks chapter. Source and link checks pass. The source lock records the matching committed manuscript. The existing landing artwork has updated numbers, groups, and destinations; its visual redesign remains deferred until the chapter review is complete.

## Build and check

```sh
just sync       # refresh from the committed upstream manuscript
just check      # render and validate sources, figures, links, and navigation
just preview    # serve locally
```

Quarto renders prebuilt prose and SVG figures without executing research code. The vendored DSS theme supplies the site treatment. On this Dropbox checkout, `_site` points to an external render cache. `just watch` supports authoring against uncommitted upstream changes.

Chapter pages, sidebar/maps, figure palettes, and shared checks are generated through `dss-training-ops/scripts/split-chapters.py`. The landing illustration and its garage.js controls are maintained here. Figures can be enlarged and have both light and dark variants.

Publication uses the existing Cloudflare Pages direct-upload recipe, `just deploy`, after its validation gates. It is separate from the editorial build and from CI checks. This revision has not been deployed; hosting and final public addresses remain release-stage work.

## License


Code is MIT, see `LICENSE`: the scripts, the Lua filters, the site configuration, and the landing
page's JavaScript and CSS. The guide's text and figures are CC BY 4.0, see `LICENSE-content`. The code
examples inside the guide are MIT too, so they can be copied into a project without attribution.
