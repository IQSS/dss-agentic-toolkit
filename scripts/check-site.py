#!/usr/bin/env python3
"""Check a rendered agentic-AI site for the things the conversion can break silently.

Used by both sites from CI, after `quarto render`.

Every failure this looks for is one that leaves a page that renders fine and reads wrong: an authoring
note in the page source, a figure that 404s, a cross-reference to a chapter that moved, a landing-page
control whose chapter was retitled. None of them would fail a render, which is why they need a check
of their own.

    check-site.py [--site _site] [--source source]

Exits non-zero, listing what it found, and touches nothing.
"""

from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

COMMENT = re.compile(r"<!--(.*?)-->", re.S)
FOOTNOTES = re.compile(r'<section[^>]*class="[^"]*footnotes[^"]*".*?</section>', re.S)
# Prose only: a section reference inside a code block is text the reader is meant to see as written,
# and the page's own contents list is generated from heading text after the filter has run.
NOT_PROSE = re.compile(r"<pre.*?</pre>|<nav.*?</nav>|<code.*?</code>", re.S)


def normalise(text: str) -> str:
    return " ".join(text.split())


class PageReferences(HTMLParser):
    """Collect actual attributes, excluding HTML-shaped strings inside scripts."""

    def __init__(self, text: str):
        super().__init__()
        self.ids: set[str] = set()
        self.images: list[str] = []
        self.links: list[str] = []
        self.feed(text)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "img" and values.get("src"):
            self.images.append(values["src"])
        if values.get("href"):
            self.links.append(values["href"])


def check(site: Path, source_dir: Path, root: Path) -> list[str]:
    problems: list[str] = []
    # GitHub project sites live under /repository/, while _site contains the
    # contents of that directory. Quarto includes the prefix on 404-page URLs.
    config = root / "_quarto.yml"
    site_url = re.search(r"^\s*site-url:\s*([^\s#]+)", config.read_text(), re.M) if config.exists() else None
    prefix = urlsplit(site_url[1].strip("'\"")).path.rstrip("/") if site_url else ""

    def local_target(page: Path, path: str) -> Path | None:
        if path.startswith("/"):
            if prefix:
                if not path.startswith(prefix + "/"):
                    return None
                path = path[len(prefix):]
            return (site / path.lstrip("/")).resolve()
        return (page.parent / path).resolve()

    pages = sorted(site.rglob("*.html"))
    if not pages:
        return [f"no rendered pages under {site}; did `quarto render` run?"]
    html = {p: p.read_text(errors="replace") for p in pages}
    references = {page: PageReferences(text) for page, text in html.items()}

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
    # exists to prevent, so its absence is asserted rather than assumed. Intentional
    # code examples (including inline commands in troubleshooting) are not leaks.
    for page, text in html.items():
        prose = re.sub(r"<pre\b.*?</pre>|<code\b.*?</code>", "", text, flags=re.S)
        if "tikzpicture" in prose or "\\begin{" in prose:
            problems.append(f"{page.relative_to(site)}: raw LaTeX reached the page")

    # 3. Every image resolves.
    for page, text in html.items():
        for src in references[page].images:
            if src.startswith(("http://", "https://", "data:")):
                continue
            # Root-absolute, like the links in check 4: resolved against the site root, since a
            # page can sit at any depth and 404.html is served from all of them.
            target = local_target(page, src)
            if target is None or not target.exists():
                problems.append(f"{page.relative_to(site)}: image does not resolve — {src}")

    # 4. Every link resolves: a fragment to an id on this page, a path to a file that exists, and a
    # path with a fragment to an id in that file. Footnote refs and backrefs are fragments too, so
    # this covers them.
    ids = {page: refs.ids for page, refs in references.items()}
    for page, text in html.items():
        for href in references[page].links:
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
            target = local_target(page, path)
            if target is None or not target.exists():
                problems.append(f"{page.relative_to(site)}: link to {path}, which does not exist")
            elif fragment and target.suffix == ".html" and fragment not in ids.get(target, set()):
                problems.append(f"{page.relative_to(site)}: link to {path}#{fragment}, "
                                "which is not in that page")

    # 6. The not-found page links by absolute path. A web host answers a request for any
    # unmatched address with this page's body, and the browser keeps the address it asked for, so a
    # relative link would resolve against whatever wrong path the reader typed: from
    # /chpaters/12-analysis.html, "index.html" points at /chpaters/index.html. Only a root-absolute
    # link is right at every depth. Quarto emits them correctly today; this asserts it, because the
    # failure is silent -- every check still passes and the page breaks only for real 404s, which
    # are exactly the visits nobody is watching.
    notfound = site / "404.html"
    if notfound.is_file():
        for href in references[notfound].links:
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
    # 7. Every console recipe points at a chapter that exists. The landing page is a hand-drawn
    # console (console.js on the research site, garage.js on the toolkit site) whose controls link to
    # chapters by slug, and it builds those links in JavaScript at runtime -- so they never appear in
    # the rendered HTML and check 4 cannot see them. Check against chapters/*.qmd because
    # a stale rendered page in _site could conceal a link to a removed chapter.
    chapters = {p.stem for p in (root / "chapters").glob("*.qmd")}
    for js in sorted(root.glob("*.js")):
        for slug in re.findall(r'slug:\s*"([^"]+)"', js.read_text(errors="replace")):
            if slug not in chapters:
                problems.append(f"{js.name}: recipe slug {slug} has no chapters/{slug}.qmd — "
                                "a retitled or removed chapter; update the console's recipe list")
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

    # The site root is the parent of the source copy: the console file and chapters/ live there,
    # and _site does not (locally it is a symlink to a build directory outside the repository).
    problems = check(site, source_dir, source_dir.parent)
    if problems:
        print(f"{len(problems)} problem(s) in the rendered site:")
        for p in problems[:40]:
            print(f"  - {p}")
        if len(problems) > 40:
            print(f"  … and {len(problems) - 40} more")
        sys.exit(1)
    pages = len(list(site.rglob("*.html")))
    print(f"rendered site is clean: {pages} pages, no leaked comments, no raw LaTeX, "
          "every image and link resolves, every section reference in prose is a link, "
          "every console recipe points at a chapter")


if __name__ == "__main__":
    main()
