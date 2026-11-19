#!/usr/bin/env python3
"""Render in temporary storage when a site's cache is outside the project.

Quarto's bundled Deno KV cannot open a database through a parent symlink.
Use rsync and Quarto in a temporary checkout, then copy the finished site to
the existing external output directory. Ordinary checkouts render in place.
"""

import argparse
import subprocess
import tempfile
from pathlib import Path


def main(preview: bool = False, preview_args: list[str] | None = None) -> None:
    site = Path(__file__).resolve().parent.parent
    output = site / "_site"
    external_cache = (site / ".quarto").is_symlink()
    if not external_cache:
        command = ["quarto", "preview", *(preview_args or [])] if preview else ["quarto", "render"]
        subprocess.run(command, cwd=site, check=True)
        return
    if not output.is_symlink() or not output.resolve().is_dir():
        raise SystemExit("External-cache rendering requires an existing external _site directory.")
    with tempfile.TemporaryDirectory(prefix=f"{site.name}-render-") as scratch:
        staging = Path(scratch)
        copy_command = [
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
        ]
        subprocess.run(copy_command, check=True)
        subprocess.run(["quarto", "render"], cwd=staging, check=True)
        subprocess.run(
            ["rsync", "-a", "--delete", f"{staging / '_site'}/", f"{output.resolve()}/"],
            check=True,
        )
        if preview:
            # The editable files stay canonical; copy changes into Quarto's
            # external preview project so its usual live reload keeps working.
            watcher = subprocess.Popen(
                [
                    "watchexec",
                    "--watch",
                    str(site),
                    "--shell",
                    "none",
                    "--ignore",
                    ".quarto*",
                    "--ignore",
                    "_site",
                    "--ignore",
                    ".git",
                    "--exts",
                    "md,qmd,js,css,yml,yaml,json,svg,html,zip,txt",
                    "--",
                    *copy_command,
                ],
                cwd=site,
            )
            try:
                subprocess.run(
                    ["quarto", "preview", *(preview_args or [])], cwd=staging, check=True
                )
            finally:
                watcher.terminate()
                watcher.wait()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview", action="store_true")
    args, extra = parser.parse_known_args()
    if extra and not args.preview:
        parser.error("Extra arguments are only supported with --preview.")
    main(args.preview, extra)
