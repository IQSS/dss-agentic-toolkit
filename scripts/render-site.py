#!/usr/bin/env python3
"""Render in temporary storage when a site's cache is outside the project.

Quarto's bundled Deno KV cannot open a database through a parent symlink.
Use rsync and Quarto in a temporary checkout, then copy the finished site to
the existing external output directory. Ordinary checkouts render in place.
"""

import subprocess
import tempfile
from pathlib import Path


def main() -> None:
    site = Path(__file__).resolve().parent.parent
    output = site / "_site"
    external_cache = (site / ".quarto").is_symlink()
    if not external_cache:
        subprocess.run(["quarto", "render"], cwd=site, check=True)
        return
    if not output.is_symlink() or not output.resolve().is_dir():
        raise SystemExit("External-cache rendering requires an existing external _site directory.")
    with tempfile.TemporaryDirectory(prefix=f"{site.name}-render-") as scratch:
        staging = Path(scratch)
        subprocess.run(
            [
                "rsync",
                "-a",
                "--exclude=/.git/",
                "--exclude=/.quarto*",
                "--exclude=/_site",
                "--exclude=/.graveyard/",
                "--exclude=/AGENTS.md",
                "--exclude=/STATUS.md",
                "--exclude=/TASKS.md",
                f"{site}/",
                f"{staging}/",
            ],
            check=True,
        )
        subprocess.run(["quarto", "render"], cwd=staging, check=True)
        subprocess.run(
            ["rsync", "-a", "--delete", f"{staging / '_site'}/", f"{output.resolve()}/"],
            check=True,
        )


if __name__ == "__main__":
    main()
