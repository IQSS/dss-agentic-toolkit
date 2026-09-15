#!/usr/bin/env python3
"""Check a rendered agentic-AI site for the things the conversion can break silently.

Used by both sites from CI, after `quarto render`. See
training/dss-training-ops/docs/plans/2026-08-30-agentic-sites-conversion-plan.md, Phase 4.

Every failure this looks for is one that leaves a page that renders fine and reads wrong: an authoring
note in the page source, a figure that 404s, a cross-reference to a chapter that moved. None of them
would fail a render, which is why they need a check of their own.

    check-site.py [--site _site] [--source source]

Exits non-zero, listing what it found, and touches nothing.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

COMMENT = re.compile(r"<!--(.*?)-->", re.S)
FOOTNOTES = re.compile(r'<section[^>]*class="[^"]*footnotes[^"]*".*?</section>', re.S)
# Prose only: a section reference inside a code block is text the reader is meant to see as written,
# and the page's own contents list is generated from heading text after the filter has run.
NOT_PROSE = re.compile(r"<pre.*?</pre>|<nav.*?</nav>|<code.*?</code>", re.S)


def normalise(text: str) -> str:
    return " ".join(text.split())


def check(site: Path, source_dir: Path) -> list[str]:
    problems: list[str] = []
    pages = sorted(site.rglob("*.html"))
    if not pages:
        return [f"no rendered pages under {site}; did `quarto render` run?"]
    html = {p: p.read_text(errors="replace") for p in pages}

    # 1. No comment from the source survives into the page. Comparing against the source rather than
    # banning comments outright is what keeps this honest: the theme emits a dozen layout markers of
    # its own, and an allowlist of those would rot at the next theme update.
    source_comments = set()
    for md in sorted(source_dir.glob("*.md")):
        for body in COMMENT.findall(md.read_text()):
            if normalise(body):
                source_comments.add(normalise(body))
    for page, text in html.items():
        for body in COMMENT.findall(text):
            if normalise(body) in source_comments:
                problems.append(f"{page.relative_to(site)}: an authoring comment from the source "
                                f"reached the page — {normalise(body)[:70]}…")

    # 2. Raw LaTeX. Pandoc drops it for HTML without a word, which is the failure this whole pipeline
    # exists to prevent, so its absence is asserted rather than assumed.
    for page, text in html.items():
        if "tikzpicture" in text or "\\begin{" in text:
            problems.append(f"{page.relative_to(site)}: raw LaTeX reached the page")

    # 3. Every image resolves.
    for page, text in html.items():
        for src in re.findall(r'<img[^>]+src="([^"]+)"', text):
            if src.startswith(("http://", "https://", "data:")):
                continue
            # Root-absolute, like the links in check 4: resolved against the site root, since a
            # page can sit at any depth and 404.html is served from all of them.
            base = site if src.startswith("/") else page.parent
            if not (base / src.lstrip("/")).exists():
                problems.append(f"{page.relative_to(site)}: image does not resolve — {src}")

    # 4. Every link resolves: a fragment to an id on this page, a path to a file that exists, and a
    # path with a fragment to an id in that file. Footnote refs and backrefs are fragments too, so
    # this covers them.
    ids = {page: set(re.findall(r'id="([^"]+)"', text)) for page, text in html.items()}
    for page, text in html.items():
        for href in re.findall(r'href="([^"]+)"', text):
            if href.startswith(("http://", "https://", "mailto:", "#/", "data:")) or href in ("", "#"):
                continue
            path, _, fragment = href.partition("#")
            if not path:
                if fragment not in ids[page]:
                    problems.append(f"{page.relative_to(site)}: link to #{fragment}, which is not on the page")
                continue
            # A root-absolute href resolves against the site root, not the page's own folder.
            # Quarto emits these on 404.html deliberately -- see check 6 -- and joining them to
            # the page's folder would resolve them against the filesystem root instead.
            base = site if path.startswith("/") else page.parent
            target = (base / path.lstrip("/")).resolve()
            if not target.exists():
                problems.append(f"{page.relative_to(site)}: link to {path}, which does not exist")
            elif fragment and target.suffix == ".html" and fragment not in ids.get(target, set()):
                problems.append(f"{page.relative_to(site)}: link to {path}#{fragment}, "
                                "which is not in that page")

    # 6. The not-found page links by absolute path. Cloudflare Pages answers a request for any
    # unmatched address with this page's body, and the browser keeps the address it asked for, so a
    # relative link would resolve against whatever wrong path the reader typed: from
    # /chpaters/12-analysis.html, "index.html" points at /chpaters/index.html. Only a root-absolute
    # link is right at every depth. Quarto emits them correctly today; this asserts it, because the
    # failure is silent -- every check still passes and the page breaks only for real 404s, which
    # are exactly the visits nobody is watching.
    notfound = site / "404.html"
    if notfound.is_file():
        for href in re.findall(r'href="([^"]+)"', html.get(notfound, notfound.read_text())):
            if href.startswith(("http://", "https://", "mailto:", "#", "data:", "/")) or href == "":
                continue
            problems.append(f"404.html: link to {href} is relative; the page is served at whatever "
                            "address the reader mistyped, so its links must start with /")

    # 5. Every section reference in prose is a link. An unlinked one means the filter did not
    # recognise the chapter, which is exactly how a renumbered document goes quietly wrong.
    for page, text in html.items():
        prose = NOT_PROSE.sub("", FOOTNOTES.sub("", text))
        prose = re.sub(r'<a href="[^"]*">§\d+[a-z]?</a>', "", prose)
        for stray in re.findall(r"§\d+[a-z]?", prose):
            problems.append(f"{page.relative_to(site)}: {stray} is not a link — "
                            "no such chapter in _quarto.yml's chapter-map?")
    return problems


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--site", default="_site", type=Path, help="the rendered site (default: _site)")
    ap.add_argument("--source", default="source", type=Path,
                    help="the site's copy of the upstream markdown (default: source)")
    args = ap.parse_args()

    # Resolved separately, and not one from the other: locally `_site` is a symlink to a build
    # directory outside the repository, so the source copy is not beside the rendered pages.
    site, source_dir = args.site.resolve(), args.source.resolve()
    if not site.is_dir():
        sys.exit(f"error: no rendered site at {site}")
    if not source_dir.is_dir():
        sys.exit(f"error: no source copy at {source_dir}")

    problems = check(site, source_dir)
    if problems:
        print(f"{len(problems)} problem(s) in the rendered site:")
        for p in problems[:40]:
            print(f"  - {p}")
        if len(problems) > 40:
            print(f"  … and {len(problems) - 40} more")
        sys.exit(1)
    pages = len(list(site.rglob("*.html")))
    print(f"rendered site is clean: {pages} pages, no leaked comments, no raw LaTeX, "
          "every image and link resolves, every section reference in prose is a link")


if __name__ == "__main__":
    main()
