#!/usr/bin/env python3
"""Build JavaScript-free landing navigation from the manuscript's chapter headings."""

import html
import runpy
from pathlib import Path


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    sources = list((root / "source").glob("*.md"))
    if len(sources) != 1:
        raise SystemExit("Expected one manuscript in source/.")
    splitter = runpy.run_path(str(root / "scripts/split-chapters.py"))
    chapters, _ = splitter["find_chapters"](sources[0].read_text().splitlines())
    output = [
        '```{=html}',
        '<noscript>',
        '<style>.console-scene,.console-legend,.garage-scene,.garage-legend {display:none!important}</style>',
        '<nav class="landing-contents" aria-labelledby="landing-contents-title">',
        '<h1 id="landing-contents-title">Contents</h1>',
    ]
    current = None
    for chapter in chapters:
        part = chapter["part"] or "Chapters"
        if part != current:
            if current is not None:
                output.append('</ul></section>')
            output.extend([f'<section><h2>{html.escape(part)}</h2>', '<ul>'])
            current = part
        output.append(
            f'<li><a href="chapters/{chapter["slug"]}.html">'
            f'{html.escape(chapter["title"])}</a></li>'
        )
    output.extend(['</ul></section>', '</nav>', '</noscript>', '```', ''])
    (root / "_landing-contents.qmd").write_text("\n".join(output), encoding="utf-8")


if __name__ == "__main__":
    main()
