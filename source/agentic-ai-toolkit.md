---
title: Agentic AI Tool Chain
subtitle: An Opinionated Ecosystem Map
version: "1.8.1"
---

# Introduction

This is a map of the tools that compose an agentic-AI working surface for data scientists, organized by *function* rather than by brand. The aim is to give my future self (or a colleague) a fast answer to two questions: *what role does this category of tool play?*, and *which specific tool would I reach for first?*.

It's a snapshot in time, biased toward what I actually run for my own projects. Not a tutorial, not a neutral survey, not exhaustive. Every section makes a pick, names notable alternatives, and explains why. The macOS picks are tools I run. The second column is Ubuntu: what each tool advertises for Linux, reached via WSL2 on Windows or on a Linux box, and untested by me (the note after the matrix explains how to read it). Desktop-app surfaces (`Claude Desktop`, `ChatGPT` desktop client, etc.) are out of scope, as is the data-science middle layer (data versioning, experiment tracking, deep model-development tooling), except where it becomes part of agent control, reproducibility, or verification (the topics in §12 integration, §13 permissions and sandboxing, §14 telemetry, and §15 pipelines and QA). The picks lean toward Anthropic in places, reflecting my current setup: OpenAI and other vendors offer equivalents. The audience is data scientists, not developers, which shaped terminology in places (§14 is "Agent Telemetry," not "Observability") and which alternatives earned a mention. A companion guide, *Doing Research with AI Agents*, walks the day-to-day practice this map only names — the working habits, the checks, and the file conventions in use; this map argues the picks.

Different categories age at different rates. The *stable layers* (foundation §1, configuration & environment §2, doc production §3, prompt themes §5c, long-running jobs §7, integration and memory §12, permissions and sandboxing §13, reproducible pipelines §15) rest on slow-moving infrastructure — LaTeX distributions, OS sandbox primitives, file-based conventions — and warrant an annual look. The *unstable layers* (CLI agents §10, IDE-side agents §9b, browser and computer-use §11, multi-agent orchestration §16, personal AI assistant §18) can shift within a quarter, so they warrant a check every six months. The framing of each section is more durable than the specific pick inside it. I'd revisit the whole map if a major shift in how agents are deployed reset the assumptions, or if one of the unstable categories settled enough to consolidate.

There are four entry points to controlling agents: terminal (covered at §10), IDE (§9), chat-based for personal AI assistant (§18), and desktop apps (out of scope). The doc's section ordering follows the terminal-first stack I actually use, but readers driving an IDE-first or chat-first workflow can use the corresponding sections as the primary entry point.

![](figures/entry-points.svg){#fig-entry-points fig-alt="Four entry points to controlling agents — terminal, IDE and chat around a central Agents box, with desktop apps marked out of scope." above="22pt" below="6pt"}

::: {.pagebreak}
:::

Of the two code-driving entry points — terminal and IDE — the choice between them shapes what the working relationship with the agent feels like. Three axes capture this contrast.

- *Working relationship:* In an IDE the agent is a co-pilot bound to an editor window: we write code together, with me reading along, accepting or rejecting changes chunk by chunk, and the language server feeding back as the agent types. In the terminal the agent is a process I delegate to. I describe the goal — what I want done, and the constraints around it — and the agent decides how to implement it inside the guardrails set by the plan we develop together (per §10), the project's context files (per §17b), and sandbox policy (per §13). I review the outcome, not each step. Because the agent is a process rather than a window-bound conversation, I can keep several whole projects live at once, one per multiplexer pane (§6), and move between them issuing commands and steering a different agent in each. Less often, I run several sessions on a single project across branches and worktrees (§16). An IDE window is essentially one project at a time, so this multi-project parallelism is the clearest terminal-side advantage in my own use. In short, the difference between them is the working relationship itself: co-pilot versus delegate, not just how the review works.

- *What the agent sees:* Inside an IDE the agent inherits ambient context — open files, current selection, cursor position, language-server symbols — without asking. From the terminal the agent sees nothing until it reads a file via an explicit tool call. The IDE flavor is faster on small in-flow edits; the terminal flavor leaves an auditable read trail and won't pull in an irrelevant scratch file I happened to leave open.

- *What the agent can do:* The IDE flavor treats file edits as the native verb; shell commands and build-and-test loops are bolted on. The terminal flavor treats the shell as the native verb: `git`, `gh`, the test runner, the package manager, and deployment commands sit on the same surface as file edits. This is why the terminal is the natural home for long-horizon work: refactors across dozens of files, test-and-fix loops, scripted pipeline runs.

Where I use each: the IDE-side flavor for tight in-flow edits to code I'm actively reading and writing; the terminal flavor for everything that crosses the file boundary or runs unattended. In my own setup the bulk of daily activity is on the terminal side.

The unifying theme for everything that follows: agents are allowed to help because project files (§17b), version control (§1b), permissions and sandboxing (§13), and deterministic pipelines (§15) keep the work inspectable, reversible, and bounded. The picks below follow from that operating model. The *bounded* half of that has a shape worth seeing up front: the permission and sandboxing layers nest as concentric containment around the agent, with secrets kept out of scope and version control underneath as the recovery path. §13 fills in each ring.

![](figures/security-layers-intro.svg){#fig-security-layers-intro fig-alt="The permission and sandboxing layers as nested containment around an agent action. Captioned: secrets out of scope, and a mistake stays reversible and inspectable." above="10pt" below="14pt"}

::: {.pagebreak}
:::

## The Operating Model

Whichever entry point you choose, the model underneath is the same: four pillars, and every section that follows serves one of them.

![](figures/four-pillars.svg){#fig-four-pillars fig-alt="The four pillars of the operating model: be a supervisor; teach the agent your way; verify and reproduce; keep it bounded." above="26pt"}

::: {.subsection-rule state="off"}
:::

::: {.pagebreak newpage="true"}
:::

## Tools by Function

Skim the table below to find the functional row you care about. Then jump to the section for that row to read the *why*. Rows with a green highlight contain tools I use daily.

::: {.vspace height="20pt"}
:::

| # | Function | macOS | Ubuntu / Windows (WSL2) |
|:-----|:------------------------------------|:----------------------------|----------------------------:|
| 1a | [Package manager](#package-manager) | [Homebrew]{.tool} | [Homebrew]{.tool} |
| 1b | [Version control & remote host](#version-control-and-remote-host) | [git]{.tool} + [GitHub]{.tool} + [gh]{.tool} (HTTPS) | [git]{.tool} + [GitHub]{.tool} + [gh]{.tool} (HTTPS) |
| 2a | [Dotfile manager](#dotfile-manager) | [chezmoi]{.tool} | [chezmoi]{.tool} |
| 2b | [Secrets & credentials](#secrets-and-credentials) | [op]{.tool} or [gopass]{.tool} | [op]{.tool} or [gopass]{.tool} |
| 2c | [Environment manager](#environment-manager) | [direnv]{.tool} | [direnv]{.tool} |
| 2d | [Runtime manager](#runtime-manager) | [mise]{.tool} | [mise]{.tool} |
| 3a | [Computational documents](#computational-documents) | [Quarto]{.tool} + [pandoc]{.tool} + [MacTeX]{.tool} / [TeX Live]{.tool} | [Quarto]{.tool} + [pandoc]{.tool} + [MacTeX]{.tool} / [TeX Live]{.tool} |
| 3b | [Non-computational publishing](#non-computational-publishing) | [pandoc]{.tool} + [XeTeX]{.tool} + [MacTeX]{.tool} / [TeX Live]{.tool} | [pandoc]{.tool} + [XeTeX]{.tool} + [MacTeX]{.tool} / [TeX Live]{.tool} |
| 4 | [Terminal emulator](#terminal-emulator) | [iTerm2]{.tool} | [Windows Terminal]{.tool} |
| 5a | [Shell](#shell) | [zsh]{.tool} | [zsh]{.tool} |
| 5b | [Shell framework](#shell-framework) | [Oh My Zsh]{.tool} | [Oh My Zsh]{.tool} |
| 5c | [Prompt theme](#prompt-theme) | [Powerlevel10k]{.tool} | [Powerlevel10k]{.tool} |
| 6 | [Multiplexer & session persistence](#session-persistence-and-pane-management) | [Zellij]{.tool} | [Zellij]{.tool} |
| 7 | [Long-running jobs](#long-running-jobs) | [Pueue]{.tool} | [Pueue]{.tool} |
| 8a | [General-purpose language](#general-purpose-language-python) | [Python]{.tool} ([uv]{.tool} or [pixi]{.tool}) | [Python]{.tool} ([uv]{.tool} or [pixi]{.tool}) |
| 8b | [Data-science language](#data-science-language-r) | [R]{.tool} ([rig]{.tool} + [renv]{.tool}) | [R]{.tool} ([rig]{.tool} + [renv]{.tool}) |
| 9a | [IDE](#ide) | [Positron]{.tool} or [VSCodium]{.tool} / [VS Code]{.tool} | [Positron]{.tool} or [VSCodium]{.tool} / [VS Code]{.tool} |
| 9b | [IDE-side agent](#ide-side-agent) | [Claude Code]{.tool} or [Codex]{.tool} | [Claude Code]{.tool} or [Codex]{.tool} |
| 10a | [CLI agent (single-vendor)](#cli-agent-single-vendor) | [Claude Code]{.tool} or [Codex]{.tool} | [Claude Code]{.tool} or [Codex]{.tool} |
| 10b | [CLI agent (multi-vendor)](#cli-agent-multi-vendor) | [opencode]{.tool} | [opencode]{.tool} |
| 11a | [Browser surface](#browser-surface) | [Claude in Chrome]{.tool} | [Claude in Chrome]{.tool} |
| 11b | [Browser automation (MCP)](#browser-automation-mcp) | [Playwright MCP]{.tool} | [Playwright MCP]{.tool} |
| 11c | [Computer-use API](#computer-use-api) | [Anthropic Computer Use]{.tool} | [Anthropic Computer Use]{.tool} |
| 12 | [Integration & memory](#integration-and-memory) | MCP + ACP + memory | MCP + ACP + memory |
| 13a | [Agent permission settings](#agent-permission-settings) | [Claude]{.tool} [settings.json]{.tool} + [Codex]{.tool} config + rules | [Claude]{.tool} [settings.json]{.tool} + [Codex]{.tool} config + rules |
| 13b | [Sandboxing (lightweight)](#sandboxing-lightweight-os-native-process-sandbox) | [Seatbelt]{.tool} ([sandbox-exec]{.tool}) | [WSL2]{.tool} isolation |
| 13c | [Sandboxing (heavyweight)](#sandboxing-heavyweight-container-runtime) | [Colima]{.tool} | [Docker Engine]{.tool} |
| 14a | [Agent telemetry (Claude)](#telemetry-for-claude) | [ccusage]{.tool} + [claude-trace]{.tool} | [ccusage]{.tool} + [claude-trace]{.tool} |
| 14b | [Agent telemetry (Codex)](#telemetry-for-codex) | [ccusage]{.tool} + [OpenAI Platform]{.tool} | [ccusage]{.tool} + [OpenAI Platform]{.tool} |
| 15a | [General pipeline runner](#general-pipeline-runner-just) | [just]{.tool} | [just]{.tool} |
| 15b | [Data-pipeline runner (R)](#data-pipeline-runner-r-targets) | [targets]{.tool} | [targets]{.tool} |
| 15c | [Data-pipeline runner (Python)](#data-pipeline-runner-python-snakemake) | [Snakemake]{.tool} | [Snakemake]{.tool} |
| 15d | [Project isolation](#project-isolation) | [Dockerfile]{.tool} | [Dockerfile]{.tool} |
| 16 | [Multi-agent orchestration](#multi-agent-orchestration) | Manual (worktrees + [Zellij]{.tool}) | Manual (worktrees + [Zellij]{.tool}) |
| 17a | [Task manager (human-native)](#task-manager-human-native) | [dstask]{.tool} | [dstask]{.tool} |
| 17b | [Task planner (agent-native)](#task-planner-agent-native) | [AGENTS.md]{.tool} + [TASKS.md]{.tool} | [AGENTS.md]{.tool} + [TASKS.md]{.tool} |
| 18 | [Personal AI assistant](#personal-ai-assistant) | [Hermes]{.tool} | [Hermes]{.tool} |

::: {.subsection-rule state="on"}
:::

::: {.pagebreak}
:::

## Starting from zero

Two small starting sets, both assuming §1a (package manager) and `.git/` cloud-sync-excluded per §1's cloud-sync subsection:

- *Terminal track:* `git` + GitHub (§1b) → terminal emulator (§4) → shell (§5a) → CLI agent (§10) → `AGENTS.md` + `TASKS.md` (§17b) → one permission posture (§13) → one build/check command (§15a).
- *IDE track:* `git` + GitHub (§1b) → Positron or your existing IDE (§9a) → IDE-side agent (§9b) → `AGENTS.md` + `TASKS.md` (§17b) → one permission posture (§13) → one build/check command (§15a).

## The second column is Ubuntu

I run macOS. The second column is **Ubuntu**, and it's untested by me — it reflects what each tool advertises for Linux, not anything I've benchmarked. There are two ways to be in that column: inside **WSL2** on Windows (what my two Windows teammates run) or on **bare-metal Linux**. Both are the same Ubuntu underneath, so the column reads the same either way.

This works because the stack is Unix-native: macOS and Ubuntu share the same POSIX foundations, so most of the matrix is a single entry, identical on both — which is why those rows collapse to one centered cell. The job of the WSL2 layer is just to *get* a Windows machine into that Ubuntu world; once you're in the Ubuntu shell, the recipes are the macOS recipes.

What's genuinely native Windows is a thin GUI *host* layer, not part of the Unix stack: the terminal-emulator window (`Windows Terminal`, which renders the WSL2 shell, §4), the IDE window (`VS Code` or `Positron` reaching into Ubuntu via Remote-WSL, §9a), the `1Password` desktop app that `op` unlocks against (§2b), and a browser when you drive one (§11). Everything else — shell, framework, prompt, multiplexer, languages, agents, pipelines, the secrets backend — lives in Ubuntu.

Where the repository lives: pick one owner per project. WSL2 ownership (`~/projects/...` on the WSL2 side) is the default the rest of the stack assumes. *What you should not do* is edit the same working copy from both the Windows and WSL2 sides — that way lies line-ending corruption, credential confusion (Windows Credential Manager vs `gh auth` in WSL2), file-permission churn, and Windows Defender scanning a WSL2 `.git/` through the `\\wsl$\` mount. The dual-write pattern is solvable once you've made deliberate decisions about `core.autocrlf`, credential storage, and filesystem-performance trade-offs; until then, single ownership is the safe default.

You can run pieces of this natively on Windows instead — `PowerShell`, native installers, a native-Windows package manager — but the doc doesn't cover that route, and I wouldn't take it: you give up the single Unix stack and end up maintaining two of everything, for a POSIX-shaped workflow that fits WSL2 far better. The GUI host layer above is the one place native Windows is unavoidable, and it's there by necessity, not preference.

::: {.pagebreak}
:::

## Workflows: how the pieces fit together

The matrix lists every tool by function. The two diagrams below show how those tools chain together for typical workflow shapes, one for data-science work and one for general development. Use them as a self-routing aid: the diagram tells you which sections of this doc matter for the kind of work you do, and which you can skip. Boxes are colored by stage — foundation (periwinkle), language / runtime (sage), authoring (dusty red), pipeline (gold), output (gray). Where the macOS and Ubuntu / Windows columns differ, the second variant appears in italics under the macOS picks. Boxes without a second annotation are identical on both: the same tool, reached via `WSL2` on Windows or natively on Linux.

![](figures/workflow-data-science.svg){#fig-workflow-data-science fig-alt="The data-science workflow as a flowchart, from foundation and environment through language and authoring to pipeline and output." above="26pt"}

![](figures/workflow-development.svg){#fig-workflow-development fig-alt="The general development workflow as a flowchart, the non-data-science counterpart to the previous figure." below="26pt"}

Two things to notice across the diagrams. First, the *Setup* stage is nearly identical between them. The foundation layer (§1, §2a, §2b, §2c) pays off in every workflow. Second, the *language / runtime* stage is where the workflows diverge: data science uses language-specific stacks (§8), general development uses `mise` (§2d) for one-off tool-version pinning. The *Pipeline runner* / *Build runner* stage at the bottom tells you which §15 subsection matters for your workflow — `targets` / `Snakemake` carry the analysis pipeline in data-science projects, with `just` typically wrapping them as the project-level entry point (`just build` = run the pipeline plus render the paper); for general development, `just` alone covers task running.

# 1. Foundation

Two foundational picks sit beneath everything else in this doc: the package manager that installs the rest of the stack, and the version-control system that makes agent work reversible. Both are set up first on a new machine; both are assumed in every section that follows.

## Package manager

The package manager is the front door to your machine. Almost every other tool in this doc gets installed through it, so this is the first thing to set up on a new machine.

### Role

The choice of package manager matters more than it looks because it defines an implicit contract for *where things live* and *how they get updated*. That contract then leaks into your dotfiles, your automated build scripts, and the install-from-zero story you give a teammate.

### macOS / Ubuntu: Homebrew

`Homebrew` is the practical default — on macOS for years, and on Linux (so WSL2) just as well. Most CLI tools, language runtimes, fonts, and libraries install with `brew install`, and the same commands and dotfiles carry from macOS into a WSL2 or Linux Ubuntu shell unchanged. On macOS, casks cover the GUI-app side through the same mechanism, so an application install list is scriptable. `Homebrew` on Linux handles only a limited cask set (fonts, AppImages, standalone binaries), but on Windows the GUI apps (the §9a IDE, a browser, the `1Password` app) are native anyway, so the command-line set is all WSL2's `Homebrew` needs to cover.

The installed set is itself reproducible through a committed `Brewfile`, the package-manager analogue of a `requirements.txt`. `brew bundle dump` records the install-on-request formulae, casks, and taps; `brew bundle install` recreates that set on a new machine in one command. It pins the *set* of packages, not exact versions (Homebrew is rolling-release), and it lives under version control with the dotfiles (§2a), so the machine's tool inventory is rebuildable rather than remembered. The `Brewfile` is itself a `chezmoi`-tracked dotfile (§2a), so a fresh-machine rebuild is two commands: `chezmoi init --apply` lays down the configs — including the `Brewfile` — and `brew bundle install` then installs the package set it lists.

### Alternatives and why not

`Nix` is more complicated but affords full reproducibility and declarative system config. The complexity might be worth it if you want a setup you can recreate on any machine from a single config file or you're scaffolding a shared development environment across a team that needs exact reproducibility. For most workflows, `Homebrew` is faster to set up and easier to use, and for per-project reproducibility, a project container (§15d) is the lighter-weight answer than going to `Nix`.

`Scoop` is the native-Windows package manager, the closest in spirit to `Homebrew` there. It's only relevant if you run the stack natively on Windows instead of in WSL2.

### When I'd reconsider

For project-level "works on my machine" problems, a per-project container (§15d) is the lower-cost answer — pin the environment per project rather than switching the system-wide package manager. The trigger for `Nix` is system-level reproducibility: recreating an entire machine from a single config file, or archival-grade pinning.

### Other installers you'll meet

`Homebrew` is the package manager you *choose*. But a working agent stack also brushes against the installers of other ecosystems, because much of the agent-adjacent tooling ships through them. You never adopt those ecosystems. The useful skill is recognizing which installer a copy-paste command belongs to, and whether its runtime is already on the machine.

| Installer | Ecosystem | Where it shows up in this stack |
|:------------------------|:---------------------------|:--------------------------------------------------------------|
| `Homebrew` | OS-level (the pick above) | Everything you install deliberately |
| `apt` | Ubuntu (WSL2 or Linux) | Distro/system packages outside Homebrew: §13c's Docker Engine, §3's TeX Live |
| `uv` / `uvx` | Python (§8a) | Project dependencies; `uvx` runs a Python tool without installing it (some MCP servers, per §12) |
| `renv` | R (§8b) | Per-project R packages |
| `npm` / `npx` | JavaScript / Node.js | Agent-adjacent tools (§14's `ccusage` and `claude-trace`, many MCP servers); `npx` runs a package without installing it. Needs `Node` (`brew install node`) |
| `yarn` / `pnpm` / `cargo` | JavaScript siblings; Rust | Only inside web-product projects (§2d's example) or other tools' build instructions; nothing in this stack asks you to run them |

`npm` deserves the one-sentence introduction since it recurs the most: it is the package manager of the JavaScript/Node.js world — what `install.packages()` is to `R`, or `pip` to `Python` — and a surprising amount of agent tooling is distributed through it even though none of this stack's own work is written in JavaScript.

## Version control and remote host

### Role

Version control is the substrate that makes agent work tolerable. Every change an agent makes is a `git` change. Multi-agent layouts in §16 run against `git` worktrees. A rollback when an agent goes wrong is `git reset` or `git revert`, and every PR a reviewer reads is a `git diff`. The doc leans on this throughout — `chezmoi` for dotfiles (§2a) is a `git` repository underneath, the agent-detachment pattern (§15) hinges on `git status` being clean before a long-running job starts, the safety preflight at the top of §10 lists a clean working copy as a precondition. Because version control makes every change inspectable and every mistake reversible, the rest of the stack can safely let agents do far more than they otherwise could.

### macOS / Ubuntu: `git` + GitHub + `gh`, with HTTPS auth

`git` is the version-control system and GitHub is the remote host; `gh` is the CLI that wraps GitHub's API for issue, PR, release, and Actions operations. The three compose: `git` handles local history, GitHub holds the canonical remote, and `gh` lets the rest of this stack (agents included) drive PR workflow from the terminal.

The authentication pick is HTTPS, with credentials managed by `gh auth login`. That one command handles credentials for both `git push` and `gh` API calls, which means token rotation is one `gh auth refresh` rather than the more involved SSH-key rotation dance (regenerate, add to GitHub, remove the old one, re-authorize anywhere it was trusted).

On WSL2, keep the repository on the WSL2 side (`~/projects/...`) and run `git`, `gh`, and the agent CLIs from there — the repo-ownership and dual-write hazards (line endings, credential confusion, Defender scanning a WSL2 `.git/`) are covered in the second-column note above. GitHub Desktop is an option if you'd rather pick branches and inspect diffs in a UI than in `git log`; it operates on the same repositories without interference. I don't use it.

### Alternatives and why not

GitLab and Bitbucket are the obvious hosting alternatives to GitHub. Both work fine with `git` itself, so the case for GitHub is not about the underlying version control. It is the surrounding ecosystem: GitHub Actions for the remote checks in §15, `gh` as the CLI, Anthropic and OpenAI agent surfaces that integrate with GitHub pull requests and issues by default, and the largest population of templates and workflows to copy from. Nothing else in this stack has that. But if you want to use GitLab or Bitbucket the rest of this doc still applies, with `glab` substituting for `gh` and GitLab CI substituting for GitHub Actions.

SSH is the alternative authentication pick. SSH wins for automated pushes from infrastructure where agent forwarding is cleaner than HTTPS credential helpers, for environments where browser-based credential flows can't run, and for users who already have a deeply-configured `~/.ssh/config`. None of those apply to this stack as it currently runs: there are no automated pushes from infrastructure, every machine can run a browser, and `gh auth login` covers the credential setup for both `git` and `gh` in one flow. SSH is the better choice if any of those constraints change.

`Jujutsu` (`jj`) is the newer entrant — a git-compatible VCS with a repository-level operations log (undo for the entire repo state, including botched rebases) and no staging area, so every commit is directly editable without `git add` and `--amend` steps. It sits on top of an existing `.git/` directory, so the GitHub side of the equation is unchanged. The reason it doesn't displace `git` here is the agent stack: every CLI agent in §10 and every IDE-side agent in §9b reaches for `git status`, `git diff`, `git log`, and `git commit` by default. Running `jj` on top while sub-agents drive the git layer means translating between two mental models on every operation, which costs more than the cleaner CLI saves.

### When I'd reconsider

If my work moves toward automated agent pushes from cloud infrastructure (cloud-spawned agents per §10's out-of-scope subsection), SSH-via-agent-forwarding becomes the cleaner credential path and HTTPS-via-`gh-auth-login` stops being the right default for those workflows. If GitHub itself develops policies incompatible with the data-handling rules in §13 (training-data use, AI-feature defaults that can't be opted out of), the hosting pick would move to GitLab self-hosted or similar.

## Cloud sync and project infrastructure

Many data scientists keep their projects in a cloud-synced directory (`Dropbox`, `Google Drive`, `OneDrive`, `iCloud Drive`) for backup and cross-machine availability. That works fine for most files but interacts badly with two specific kinds of project infrastructure: the `git` repository's `.git/` directory and language virtual environments (`.venv/`, `node_modules/`, and similar).

The issue: cloud sync services try to sync every file in the directory, and these infrastructure folders contain thousands of small files that change rapidly during normal use. The result is sync storms (every `git commit` triggers thousands of upload events), severe performance hits, and occasional state corruption when the sync engine catches a `git` pack file or venv binary mid-write.

The fix is general: configure your cloud sync to ignore these directories per-project. Each service has its own mechanism (`Dropbox` uses an extended attribute, `Google Drive` has selective-sync rules, `OneDrive` has equivalents). I deal with this by putting a reminder in my global `AGENTS.md` (per §13) that agents should configure cloud-sync ignores when scaffolding new projects, particularly when creating venvs or initializing `git` repositories. The interference is hard to diagnose after the fact, so catching it at setup is cheaper than debugging it later. This is foundational infrastructure: it applies to every project from setup, before any pipeline (§15) or environment isolation (§15d) decisions matter.


# 2. Configuration and Environment

Four tools that together define your working environment. Each owns a different orthogonal axis (config *files*, secret *values*, environment *variables*, runtime *versions*), and they compose into a coherent stack rather than overlapping. The subsections below are in install order — set them up in the order a fresh machine would need them. Secrets storage (§2b) and environment injection (§2c) are adjacent because they form the two halves of the per-project secrets pipeline; runtime version pinning (§2d) is an independent concern and comes last.

§2b covers two co-equal paths because the choice is driven by whether you're willing to pay for `1Password`: the primary path uses `op` (the `1Password` CLI) and is what I run; the open-source path uses `gopass` with `age` encryption. The rest of §2 is identical regardless of which storage tool you pick.

| Tool | Job | What it owns |
|:-------------------|:------------------------------------|:-------------------------------------------|
| `chezmoi` (§2a) | Where do your *config files* live? | `.zshrc`, `.gitconfig`, `~/.config/foo/config.toml` |
| `op` or `gopass` (§2b) | Where do your secret *values* live? | API keys, tokens, passwords in an encrypted vault |
| `direnv` (§2c) | Which *environment variables* are active in this shell? | `PATH`, `DATABASE_URL`, `GITHUB_PAT` — set/unset on `cd`, including secrets pulled from §2b |
| `mise` (§2d) | Which *runtime versions* are active? | Python 3.12, ripgrep 14 — installed per project |

They compose: `chezmoi` puts your `.zshrc` in place, and the `.zshrc` activates `direnv` and `mise`. When you `cd` into a project, `direnv` reads the project's `.envrc` and exports its environment variables (including secrets pulled from the §2b store via `op read` or `gopass show`), while `mise` switches to the project's pinned runtimes. Each tool does one job and the integration points are stable.

## Dotfile manager

### Role

Your dotfiles are the configuration that distinguishes your machine from a stock install. A dotfile manager carries them across machines, keeps them in version control, and reduces the "set up a new laptop" task to one command. It's also where per-machine differences (user names, work vs. personal API keys, OS-specific paths) get resolved without forking config files.

The reason this needs a dedicated tool rather than plain `git`: dotfiles aren't a folder you can version. They're scattered across `\$HOME` at paths each tool dictates (`~/.zshrc`, `~/.gitconfig`, `~/.config/`, `~/.claude/`), and you can't `git init` in `\$HOME` without tracking the entire home directory (every cache, key, and download). Plain `git` can version the files, but it cannot put them where each tool expects to find them. A dotfile manager does both: it keeps the history and it writes each file out to the path its tool reads. Hand-symlinking each file from a central directory gets you part of the way, but some tools won't follow a symlinked config, and the symlink count climbs fast once the shell, prompt, and multiplexer are all in play. Keeping the files in a repository also buys history: trying a setting and cleanly reverting it becomes a `git` operation rather than a guess.

### macOS / Ubuntu: chezmoi

`chezmoi` is what I use, and it's fully cross-platform — one dotfile repository carries macOS and an Ubuntu (WSL2 or Linux) shell without forking, with templates resolving per-machine. It manages a `git` repository of your dotfiles and applies them to your home directory on demand. Three features that matter:

- *Templates.* A single source file can produce different output on different machines. One `.gitconfig` template can resolve to your work email on the work laptop and your personal email on the personal laptop, for example.
- *Encrypted secrets.* When a secret has to be physically present in a config file, `chezmoi` can either store it encrypted in the repository (via `age`, a modern encryption tool, or `gpg`, the older standard) and decrypt it on apply, or pull it from your `op` / `gopass` store at apply time so nothing — not even ciphertext — reaches the repository. For most users this feature is rarely used (see "Division of labor with §2b" below).
- *Preview before apply.* `chezmoi diff` shows what would change in your home directory before `chezmoi apply` makes the change. Useful for not accidentally overwriting a config file you'd hand-edited.

![](figures/chezmoi-source-and-applied.svg){#fig-chezmoi-source-and-applied fig-alt="How chezmoi relates its source tree to the applied dotfiles and the per-agent symlinks." above="16pt" below="14pt"}

The figure shows how this works, with my agent-config setup as the example. The source files live in a `chezmoi`-tracked directory — a private `git` repository, not your live home directory. `chezmoi apply` materializes each one as an ordinary file at the path its tool expects. Edit one of those applied files in place, and `chezmoi re-add` captures the change back into the source repository as an ordinary `git` commit. The agent files are the interesting case. Rather than leaving each at the scattered path its tool dictates, they are collected into a single directory, `~/.config/agents/`, called the hub, and each tool's expected path (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, and the rest) becomes a symlink pointing into it.

Why gather them like this, when `chezmoi` already puts each file where its tool reads it? Because the hub answers a different question than `chezmoi` does. `chezmoi` handles reproducibility and placement across machines. The hub is a layout choice on top, and the payoff shows up when you edit: with every rule and config file in one folder, the whole set opens in a single editor. `Typora` lists every file in the folder in its side nav, so reading or editing the entire rule set is one task instead of a hunt across `~/.claude/`, `~/.codex/`, and the rest. And because the hub is one `chezmoi` repository underneath, that whole rule set is backed up and rebuildable from a single `chezmoi init --apply` if the machine is ever wiped or replaced. The symlinks the figure shows are what reconcile this with each tool's fixed read path, and `chezmoi` makes and tracks them as part of the same apply.

On disk, the arrangement the figure summarizes:

```
~/.local/share/chezmoi/dot_config/agents/  # chezmoi source (private git repo)
|-- AGENTS.md                       # source of truth; CLAUDE.md symlinks to it
|-- CONVENTIONS.md                  # general conventions, naming, paths
|-- TEMPLATES.md                    # per-shape templates + scaffolding
|-- WRITING.md                      # prose voice and style
|-- CODING.md                       # code style conventions
|-- MODELING.md                     # statistical modeling rules
|-- DESIGN.md                       # product design principles
|-- TOOLCHAIN.md                    # CLI tool inventory
|-- WORKSPACE.md                    # index of projects on this machine
|-- ALIASES.md                      # shared shell aliases
|-- SANDBOX.md                      # sandbox/permission rationale (per §13a)
|-- claude-settings.json            # Claude Code permissions/sandbox (per §13a)
|-- codex-config.toml               # Codex sandbox/profiles (per §13a)
`-- codex-rules/                    # Codex command-policy rules
    `-- default.rules

~/                                  # home directory (chezmoi-applied)
|-- .config/agents/                 # real directory, populated by chezmoi
|       (every file from the source tree above, materialized here)
|
|-- .claude/CLAUDE.md       -> ~/.config/agents/AGENTS.md
|-- .claude/settings.json   -> ~/.config/agents/claude-settings.json
|-- .codex/AGENTS.md        -> ~/.config/agents/AGENTS.md
|-- .codex/config.toml      -> ~/.config/agents/codex-config.toml
|-- .codex/rules            -> ~/.config/agents/codex-rules
`-- ...                # one symlink per agent tool you use
                       # (the symlinks are chezmoi-tracked too)
```

Two details the figure can't show. Every vendor-specific name (`CLAUDE.md`, `.codex/AGENTS.md`, and the rest) is a symlink pointing back at the one source of truth, so switching agents or adding one never forks your conventions across files — and the symlinks are tracked as `chezmoi` template-symlinks, so they resolve against the right home directory on each machine. And a new ancillary file dropped next to `AGENTS.md` is picked up by the same apply: no per-tool reconfiguration when the rule set grows.

What I actually keep in mine: standard dotfiles (`.zshrc`, `.gitconfig`, `.p10k.zsh`, shell aliases, the Zellij layouts from §6), the entire `~/.config/agents/` tree shown above (so the global agent rules apply identically on every machine), the per-agent symlinks `Claude Code` and `Codex` read, and a few small productivity scripts — for instance a `typora` shim at `~/.local/bin/typora` so I can `typora <file>` from the terminal, and shell functions like `agents CONVENTIONS.md` (opens that metadata file in Typora) and `cda` (`cd` into the global metadata folder). A single `chezmoi init --apply <repo>` on a fresh macOS machine rebuilds every dotfile.

### Division of labor with §2b

Most of what you'll need to keep secret (API keys, tokens, deploy keys, database credentials) belongs in your §2b secrets store (`op` or `gopass`), not in `chezmoi`'s encrypted-secrets feature. The §2b store keeps secrets encrypted at rest; `direnv` (per §2c) pulls them into the process environment of each project on `cd`-in, so they never sit unencrypted in a file on disk. `chezmoi`'s encryption is for the narrow case where a secret has to live inside a config file rather than in the project environment. Most users never touch the encryption feature, because the configs they manage reference §2b (via `direnv`) for any credentials they need.

### Alternatives and why not

`stow` is the simpler alternative. It places symlinks from your home directory back to files in a central directory: no templates, no encryption, no per-machine logic. That symlink fan-out is exactly what the agent hub relies on, but `chezmoi` already makes and tracks those symlinks on apply, so pairing it with `stow` would be redundant. `stow` on its own is fine for a small set of dotfiles on one machine, and adding a second machine or an encrypted credential is where it starts to fall short.

### When I'd reconsider

If I were going to use `Nix` on §1, I'd switch to `Home Manager` (the dotfile-manager built into `Nix`) instead of `chezmoi`, to keep the foundation layer on one tool. Otherwise I won't leave `chezmoi`.

## Secrets and credentials

### Role

How API keys, tokens, and other credentials get *stored* in a canonical encrypted place so that the injection layer (§2c) can pull them into the process environment without leaking into shell history, dotfiles, or commit logs. The surface area is small but the consequences of getting it wrong are large: a leaked credential in a public repository or pasted into a chat. This is foundational because credentials are needed before any tool that reads them from an environment variable can work: agent CLIs that call commercial APIs, database clients, deployment commands, and scripts that hit web services. (`git push` over HTTPS and `gh` sit outside this path — they authenticate through the OS credential manager / `gh`'s own keyring, not an environment variable, so they don't depend on §2b/§2c at all.) This section covers *storage*. §2c covers the *injection* half: how stored secrets land in the environment of the process that needs them.

### Two co-equal paths

The doc treats two paths as co-equal because the choice between them is genuinely down to taste and budget, not capability:

- *Primary path: `op` + `1Password`.* What I run. Touch ID unlock, vendor-managed cloud sync, ~\$3/mo `1Password Personal` subscription. The GUI is nice if you also use it for human-facing logins (banks, web accounts, 2FA backup codes). Easiest on macOS specifically because biometric unlock is a single tap.
- *Open-source path: `gopass` + `age`.* Free, no vendor, secrets are encrypted at rest with `age` and synced across machines via a private `git` repository you control. (`age` is a modern file-encryption tool.) Worth the slightly rougher UX if you don't want to pay a subscription for credential storage or you object to vendor lock-in for any reason.

Everything *outside* §2b is identical regardless of which path you pick: `direnv` (§2c) reads a per-project `.envrc`, the `.envrc` calls either `op read` or `gopass show`, and the project gets the secrets it needs. The per-shape `.envrc` templates in `TEMPLATES.md` come in both flavors. Switching from one to the other later is a sed-and-migrate job, not an architectural change.

### Primary path: op (macOS and Ubuntu)

`op` is the `1Password` command-line interface, distinct from the `1Password` GUI app. (Install via `brew install --cask 1password-cli` on macOS; on Ubuntu it installs the same way through `Homebrew`, and inside WSL2 it unlocks against the `1Password` desktop app on the Windows side.) After enabling "Integrate with `1Password` CLI" in the desktop app's developer settings, `op` authenticates via the same biometric unlock you use for the GUI — no separate `op signin` session token to manage. If you don't run the desktop app at all, the `gopass` path below needs no GUI.

Two CLI patterns matter:

- `op read op://Vault/Item/field` — pulls a single value to stdout. Used inside an `.envrc` to populate one environment variable.
- `op run --env-file=.env.template -- <command>` — wraps a command, reads `op://...` references from `.env.template`, exports them to the wrapped process's environment, and discards them when it exits. Used when you want secrets to live only for one command's lifetime rather than the whole shell session.

The pattern, with §2c as the consumer:

```
# stored in 1Password as item "github-pat-personal" with a credential field, in the Credentials vault.
# Pulled into the project env via direnv (.envrc — see §2c for the full per-project template):
export GITHUB_PAT="\$(op read op://Credentials/github-pat-personal/credential)"
```

One syntactic constraint worth knowing in advance: `op://` references can't contain parentheses, slashes, colons, or other punctuation that `1Password` permits inside *item titles*. This bites first on keychain-imported logins, which arrive with shapes like `apple.com (user@example.com)`. When an item's title has any of those characters, reference the item by its UUID instead — `op item list --vault <name> --format=json` prints the IDs, and a reference of the form `op://<vault>/<id>/credential` resolves the same way as the title form.

### Open-source path: gopass + age (macOS and Ubuntu)

`gopass` is an `age`-encrypted secret store on disk, synced across machines via a private `git` repository. Each secret lives as a small encrypted file under a tree like `personal/github/pat`, and `gopass show personal/github/pat` decrypts the file and prints the value to your terminal. Install via `brew install gopass age` on macOS (same install inside `WSL2` on Windows). On first machine, `gopass setup --create --crypto age --storage gitfs` generates an `age` keypair and initializes the local store; on subsequent machines you import the same `age` private key and `gopass clone <git-remote>`.

The unlock story is the only material difference vs. `op`: the `age` identity is passphrase-encrypted, so the first `gopass show` after a fresh login prompts (in your terminal, via `pinentry`) for the passphrase. After that, `gopass`'s built-in age agent caches the unlocked identity in memory for the lifetime of the agent process — every subsequent `gopass show` is silent, across shells and subprocesses. So the practical UX is "type a passphrase once per login session, then silent" rather than `op`'s "Touch ID tap once per session, then silent."

The pattern, with §2c as the consumer:

```
# stored in gopass under personal/github/pat
gopass insert personal/github/pat

# pulled into the project env via direnv (.envrc — see §2c for the full per-project template):
export GITHUB_PAT="\$(gopass show -o personal/github/pat)"
```

The `-o` flag prints only the first line (the secret value) and suppresses the metadata line `gopass` prepends to multi-line entries.

The `git` remote for the encrypted store should be private (`gh repo create gopass-store --private` is enough). The repository only ever contains ciphertext, so a private repository on any host you already use is fine; the threat model the encryption defeats is loss of the cloud host's storage, not loss of access control over it.

### Disaster recovery (open-source path only)

`gopass`'s entire security model rests on the `age` private key at `~/.config/gopass/age/identities`. If you lose that key, the encrypted store on every machine becomes unrecoverable. Back the key up somewhere durable that isn't the same git host the store syncs through: a hard copy filed with your passport, or a digital copy in a password manager like `1Password` if you use one. Treat it like any other one-time-write credential you can't afford to lose. The `op` path doesn't have an equivalent step — `1Password` handles your master credential's recovery via the recovery code they generate at signup.

### Division of labor with §2a chezmoi

The two tools cover different secret-shapes:

- §2b handles *runtime secrets*: anything an agent or script reads from an environment variable. API keys, tokens, deploy keys, database credentials. The secret is decrypted on demand and exported into a project's environment by `direnv` (per §2c) for the duration of the shell session, never sitting unencrypted in a file on disk.
- `chezmoi`'s encrypted-secrets feature (per §2a) handles *config-file secrets*: the narrow case where a secret must live inside a config file rather than in the project environment.

For most users, §2b covers ~90% of what they need and `chezmoi` just manages config files without using its encryption feature, because the configs reference §2b (via `direnv`) for any credentials they touch.

### Other alternatives

`Bitwarden` is the third name worth knowing: a free tier for personal use, `Vaultwarden` for self-hosting if you'd rather not put secrets in a vendor cloud. The non-interactive story is rougher than either `op`'s Touch ID or `gopass`'s agent-cached unlock — you capture a session token (`BW_SESSION=\$(bw unlock --raw)`) and persist it somewhere for scheduled scripts to find. Reasonable pick if `1Password`'s subscription is the blocker but you want a GUI experience that `gopass` doesn't provide.

`sops` is the option for teams that need to encrypt whole files (`YAML`, `JSON`) and share them in a `git` repository. The natural pick if your team already runs `Kubernetes` / `Terraform` infrastructure where shared encrypted config files are a normal pattern. Overkill for solo CLI work.

Plaintext `.env` files (the simpler-but-risky pattern people often land on first) sit on disk unencrypted, any process can read them once exported, and they're easy to accidentally commit. They are *not* a secrets-storage option. `direnv`'s `.envrc` (per §2c) is for *injection*, not storage — the values it injects come from §2b, not from a committed plaintext file.

### When I'd reconsider

If I joined a team that genuinely shared a vault — multiple humans needing read access to the same credentials — `op` (paired with `1Password Teams`) becomes the right answer for the shared subset; `gopass` works too via repository collaborator access. If I started managing `Kubernetes` / `Terraform` infrastructure, I'd evaluate `sops` for the structured-file half of the storage problem. If `1Password` ever stopped working for me (price hike, policy change, mobile experience regression), `gopass` is the path I'd switch to without changing anything else in §2c onward.

## Environment manager

### Role

An environment manager auto-loads project-specific environment variables when you `cd` into a project directory, and unloads them when you leave. Under §2b's storage choice (either `op` or `gopass`), the environment manager is also the *injection* half of the secrets pipeline: a project's `.envrc` (present only when that project's own code or tooling consumes a credential at runtime) calls `op read` (or `gopass show`) to pull the credentials it needs and exports them into the shell. So this section covers two related jobs in one tool: (a) per-project secrets *injection* (the primary job), and (b) per-project non-secret env scoping — `PATH` tweaks, project flags, virtualenv markers — the secondary job.

### macOS / Ubuntu: direnv

`direnv` reads a `.envrc` file at the project root when you `cd` in, exports whatever environment variables it declares, and unloads them when you leave the directory. It's small, fast, and unobtrusive once configured. You approve each project's `.envrc` once with `direnv allow` so a malicious `.envrc` from a cloned repository can't auto-execute.

The canonical pattern: a project gets an `.envrc` only when its own code or tooling consumes a credential at runtime, and that `.envrc` exports just those secrets from §2b plus any non-secret env the project needs. Paper-shaped projects typically need only `GITHUB_PAT`, consumed by `renv` to authenticate GitHub package installs (it avoids API rate limits and is needed for private-repo packages), *not* by `git` or `gh`, which authenticate through the credential manager. A paper project that doesn't use `renv` needs no `.envrc` at all, and push-only, minimal, and publishing projects generally don't get one either. Data projects layer data-source API keys on top of `GITHUB_PAT`, and SaaS-shaped projects pull a fuller stack. Per-project-shape templates for the `.envrc` live in `TEMPLATES.md` so an agent scaffolding a new project can write the right one from the shape definition. The templates come in two flavors — `op read` for the primary path, `gopass show` for the open-source path — and which one applies is determined by which §2b path the user picked.

A typical data-shaped project `.envrc`, primary (`op`) path — `GITHUB_PAT` for `renv` plus one data-source key:

```
# in .envrc — per-project secrets from 1Password + non-secret env
export GITHUB_PAT="\$(op read op://Credentials/github-pat-personal/credential)"
export CENSUS_API_KEY="\$(op read op://Credentials/us-census-api/credential)"

# non-secret project env
export PATH="\$PWD/scripts:\$PATH"
export PROJECT_FLAG=foo
```

The same project's `.envrc` on the open-source (`gopass`) path:

```
# in .envrc — per-project secrets from gopass + non-secret env
export GITHUB_PAT="\$(gopass show -o personal/github/pat)"
export CENSUS_API_KEY="\$(gopass show -o personal/census/api-key)"

# non-secret project env
export PATH="\$PWD/scripts:\$PATH"
export PROJECT_FLAG=foo
```

AI-provider keys belong in an `.envrc` only when the project's *own code* calls the API at runtime — and then they route through the Bedrock item, since there is no standalone Anthropic key and no OpenAI key at all (Codex runs on a Pro account):

```
export ANTHROPIC_API_KEY="$(op read op://Credentials/aws-bedrock-claude/credential)"
```

Don't add an AI-provider key to an `.envrc` just to point an agent at a backend: `direnv` would export it for *every* shell started in that directory, so a subscription-mode launch would silently pick it up and route onto billed API usage. Agent-backend selection happens at launch, not in the `.envrc`.

`direnv` captures these exports into the shell on `cd`-in and unsets them on `cd`-out, so secrets exist in environment only while you are working in that project directory. The `.envrc` itself is safe to commit in *private* project repositories — it holds vault *paths*, not values, so the repository only reveals which named credentials the project consumes. For *public* repositories, the vault path itself can leak more than you mean to: service names, client names, internal item labels, the shape of your secrets layout. The conservative pattern for public repositories is to commit a `.envrc.example` with generic item names (`op://Vault/PROJECT_TOKEN/credential` rather than `op://Acme/AcmeProductionAPI/credential`) and keep the real `.envrc` gitignored, expecting each contributor to derive their own from the example.

The first time you `cd` into a project after cloning it, `direnv` prints a warning and refuses to load until you run `direnv allow`. This is the safety mechanism that prevents arbitrary shell code from executing just because you opened a directory.

### Alternatives and why not

*Loading every secret in `~/.zshrc`* is the simpler "just put them all in the shell" pattern. Works fine if your secrets are stable across projects and you want zero per-project setup. The reason `direnv` wins for me: my project mix varies enough — paper-shaped projects (R, only `GITHUB_PAT` for `renv`), data projects (data-source API keys layered on top), the React/TypeScript SaaS project (a whole stack of project-specific tokens) — that loading everything in every shell either over-exposes secrets to projects that don't use them or under-fills the environment for the project that does. The per-project `.envrc` also doubles as the manifest of which credentials each project depends on.

*Per-command secret-injection wrappers* (`op run --env-file=...` is the canonical example; gopass has no equivalent built-in) inject secrets only into the wrapped process's environment and discard them when the command exits. The right pick when you need strict isolation between processes — multi-user machines, regulated environments, or scheduled jobs where you want secrets to vanish the moment the job completes. Overkill for solo CLI work where the threat model is "don't leave plaintext on disk," not "isolate one process from another." The extra wrapper around every command is friction without benefit at this scale.

`mise` (per §2d) has its own `[env]` block in `mise.toml` that can set environment variables per project. For static, low-sensitivity variables (`RUST_LOG=debug`, project tool versions), `mise`'s `[env]` does the same job. Reach for `direnv` instead when you need to run shell commands at directory entry — `op read` or `gopass show` calls for secrets, dynamic `PATH` extension — which `mise`'s declarative TOML can't do. For workflows where projects need *neither* secrets injection *nor* dynamic environment variables, `mise` alone covers the static environment-variable case.

### When I'd reconsider

If `mise` adds support for executing shell commands in its env section (similar to `direnv`'s `.envrc`), the two tools collapse and one of them — probably `direnv` — becomes redundant. If my project mix narrowed to one shape with stable secrets, the zshrc-loaded pattern would compete more seriously. If I started running unattended cron jobs that should not leave secrets sitting in shell env after they complete, I'd add a per-command wrapper for those specific jobs while keeping `direnv` for interactive use.

Putting §2b and §2c together, the whole secrets path is one short flow:

![](figures/secrets-flow.svg){#fig-secrets-flow fig-alt="Secrets from storage to injection to use: the 1Password and gopass paths converging on per-project environment variables. Captioned: injection is needs-based, so a project gets an .envrc only when its own code or tooling consumes a credential." above="18pt" below="16pt"}

## Runtime manager

### Role

This subsection covers a single tool that pins multiple runtime versions per project and activates them on `cd`. It's most valuable for real product-development work where a single project mixes several runtimes. A concrete example from my own stack: a React.js / TypeScript SaaS on a `Supabase` backend that pins a specific `Node` major and a specific `pnpm` version at the project root, so every shell — interactive, agent-spawned, or a continuous-integration runner — picks up the same versions automatically.

Single-language projects don't need a runtime manager: §8a's `uv` covers `Python` interpreter pinning alongside its dependencies, and §8b's `renv` covers R packages on top of a system R install. The runtime manager pays off once the language count crosses two and you'd rather have one config format pinning all of them than a separate single-language manager per tool.

The boundary with §8: this section handles runtime/CLI version pinning; §8 handles full transitive dependency closures (`pixi.toml` + `pixi.lock` for Python, `renv.lock` for R) where version *and* environment management are managed together by language-specific tooling.

### macOS / Ubuntu: mise

`mise` (formerly `rtx`) is a multi-language runtime manager: one Rust binary that replaces `pyenv` and similar single-language version managers. It reads a `.tool-versions` file at the project root and switches to the right versions when you `cd` in. The plugin ecosystem covers `Python`, `Node`, `Pandoc`, `TeX Live`, and the long tail of CLI tools — the runtime versions a project actually needs to pin. The `.tool-versions` file is portable, so a project pins the same versions on macOS and Ubuntu alike.

### Alternatives and why not

`asdf` is the original polyglot runtime manager — same shape as `mise`, same `.tool-versions` file format, same plugin model. `mise` is essentially a from-scratch Rust rewrite (`asdf` is implemented in Bash with shim files), so the performance difference shows up on every `cd` and every command invocation in a deep project tree. Anyone with an existing `.tool-versions` setup can adopt `mise` as a transparent upgrade.

`devbox` (from Jetify) and `devenv` (from the Cachix team) take a more ambitious approach: both wrap `Nix` (covered as the heavier-weight reproducibility option in §15d) to declare a project's full toolchain — runtimes, system libraries, services like databases — in a single config file. The reproducibility ceiling is higher than `mise`'s because you're pinning the entire dependency graph rather than just runtime versions, but the adoption tax is also higher (`Nix` has a real learning curve and its own conceptual model). Worth a look for projects that need bit-exact reproducibility or that span runtimes `Nix` covers well but `mise` plugins don't.

### When I'd reconsider

If a future runtime manager solves `R`-version management properly, I'd revisit. `mise`'s `R` plugin is functional but thin, which is why §8b adds `rig` as a companion tool. That gap is the weakest part of `mise`'s coverage today.


# 3. Documentation Production

Data-science work often ships as documents: papers, reports, slide decks, analyses. The doc-production pipeline is foundational for anyone whose output is communication rather than running code.

## Role

Two workflows worth distinguishing. *Computational documents* mix narrative prose with executed code, tables, figures, and citations (analysis reports, manuscripts, reviewer-facing model summaries); `Quarto` is the top-level system there. *Non-computational publishing* (this document, slide decks, CVs) uses raw `pandoc` plus a custom LaTeX template for more design control. Both pipelines share the same backend: `pandoc` for conversion, a TeX distribution for PDF output. The split is real enough that the two flows get separate subsections below, where the tool choices are mostly the same across macOS and Ubuntu, with the TeX distribution as the main difference.

## Computational documents

### Role

When the document has executed code, model output, tables, and figures that should refresh whenever the source changes (analysis reports, manuscripts, reviewer-facing model summaries, parameterized notebooks), the top-level document system is `Quarto`. A single `.qmd` source holds prose, R code, `Python` code, model output, tables, figures, citations, cross-references, and appendices, and renders to HTML, PDF, slides, manuscripts, or dashboards. It is built on `pandoc`; for PDF output it needs a TeX distribution. Cross-references §8b on the R side.

### macOS: Quarto + pandoc + MacTeX

MacTeX is the LaTeX distribution on macOS: full TeX Live in a single installer. `pandoc` is the conversion pipeline that `Quarto` invokes (or you call directly). For lighter setups, BasicTeX (from the MacTeX distribution) provides the LaTeX core with on-demand package installation.

### Ubuntu / Windows (WSL2): Quarto + pandoc + TeX Live

Same `Quarto` + `pandoc` story. The TeX distribution is TeX Live (`apt install texlive-full`, or just the `texlive-*` packages a project needs). It's the same TeX Live that MacTeX bundles on macOS — so one `template.tex`, the same fonts, and the same build rebuild identically across both columns. A full TeX Live install carries every package rather than fetching on demand, which is the safer base for archive-grade rebuilds; for true long-term reproducibility, pin it in a project container (§15d).

### Alternatives and why not

`RMarkdown` is the predecessor `Quarto` was built to replace. It still works, but `Quarto` is the forward-looking pick: multilingual, more output formats, actively developed by Posit. No reason to start a new project on `RMarkdown`; old projects can stay on it without harm.

`Jupyter` notebooks are the Python-native alternative for the same niche. Right pick for Python-heavy workflows where the notebook *is* the document. For mixed R/Python work, `Quarto` is more flexible.

### When I'd reconsider

`Quarto` has consolidated the computational-document niche for the foreseeable future. The most likely shift is `RMarkdown`-to-`Quarto` migration for older R projects; I wouldn't migrate away from `Quarto` for a new one.

## Non-computational publishing

### Role

When the document doesn't have executed code (design-controlled standalone publishing like this doc, slide decks, CVs, briefs, reports written from finished analyses rather than rebuilt from them), `Quarto`'s computational machinery is overhead. The lighter alternative is a direct markdown → `pandoc` → XeTeX pipeline with a custom LaTeX template. You get full typography control, custom fonts, custom section styles, and the kind of layout polish that `Quarto`'s default themes can't match.

I drive this pipeline with XeTeX rather than classic LaTeX. XeTeX can use system fonts directly, avoiding the font-handling steps classic LaTeX requires.

### macOS: pandoc + XeTeX + MacTeX

Same `pandoc` and same MacTeX as §3a, but the build is driven directly: `pandoc` reads your markdown source, applies a custom `template.tex` and Lua filters, and emits PDF via `\xelatex`. No `.qmd` envelope. A `just` recipe (per §15a) wraps the invocation, so `just build` is the same one-command rebuild whether you're producing this doc, a slide deck, or a CV.

### Ubuntu / Windows (WSL2): pandoc + XeTeX + TeX Live

Same pipeline shape as macOS, with TeX Live in place of MacTeX (the same TeX Live underneath). The `template.tex`, Lua filters, `justfile`, and `\xelatex` invocation are all cross-platform and work unchanged. As in §3a, a full TeX Live install is the reproducible base; pin it in a project container (§15d) for archive-grade rebuilds.

### Markdown editor

Viewing and editing the markdown source directly is part of the production workflow when you want to scan structure, fix typos, restructure sections, or review a diff without going through a full rebuild. The picks are cross-platform.

My pick is `Typora`: WYSIWYG markdown editing on file-based markdown anywhere on disk, designed for project-side markdown files rather than for managing a knowledge graph like `Obsidian`. Cross-platform (macOS and Windows).

`Marked 2` is the alternative for view-only workflows; it pairs with any text editor and renders markdown with custom styles, math support, and live preview. macOS only.

`MarkText` is the open-source counterpart to `Typora` (Electron-based, WYSIWYG, GPL-licensed, cross-platform), less refined than `Typora` but functional. The fallback if `Typora`'s development pace continues to slow.

### Alternatives and why not

`Quarto` is the alternative when you decide the design-control advantage isn't worth the extra plumbing. The trade-off: `Quarto`'s default themes give you a working PDF with no configuration, but customizing typography or layout beyond what its templates expose pulls you back toward a custom LaTeX template anyway.

`Typst` is a lighter-weight LaTeX analogue: one binary, no TeX distribution to install. I use it for non-data-science documents: service and product roadmaps, billing invoices. Those don't need `pandoc`'s filters or a custom LaTeX template, and Typst compiles and previews faster than a full XeTeX rebuild. For the publishing this section covers — math-heavy, citation-heavy, rebuilt from analyses — it isn't there yet: it's short of LaTeX on math and citations, and there's no equivalent to `pandoc`'s filters. So I keep the markdown → `pandoc` → XeTeX pipeline for those and reach for Typst on the simpler standalone work. I check back on it every six months or so.

### When I'd reconsider

This pipeline is the most stable category in the doc. `pandoc` has been the doc-production substrate for over a decade with no real challengers, and LaTeX distributions are slow-moving infrastructure. The most likely shift is on the markdown-editor side.


# 4. Terminal Emulator

The terminal emulator is the surface almost every other tool in this stack appears through, so it has to be fast and reliable. This is a solved problem on both platforms.

## Role

The renderer. It draws characters, handles input, and stays out of the way. The picks below differ less on raw performance (modern emulators are all fast enough) than on the small conveniences you hit dozens of times an hour: search across scrollback, profiles per project, hotkey window.

## macOS: iTerm2

`iTerm2` has been the default among power users on macOS for years. It supports GPU-accelerated rendering, profiles per project, scrollback search, a hotkey window, and `tmux` integration. The UI is showing its age compared to newer entrants. 

## Ubuntu / Windows (WSL2): Windows Terminal, or a Linux terminal

This is the one section that's genuinely host-specific, because the terminal emulator is a GUI window the host OS draws: not part of the Unix stack. On Windows, `Windows Terminal` is the renderer: it ships preinstalled on Windows 11, and launching the Ubuntu distro opens your `zsh` session inside it, so you rarely touch it beyond pointing the WSL2 profile at a Nerd Font (so `Powerlevel10k`'s glyphs render — §5c). On bare-metal Linux, the emulator is whatever your distro ships (GNOME Terminal, Konsole, Kitty, Alacritty), and the choice is yours and orthogonal to everything else. Either way, the shell, framework, and prompt inside it are the same Ubuntu stack.

## Alternatives and why not

Three macOS alternatives worth knowing about, each in a different niche:

- `Ghostty` is the minimalist challenger. Native macOS feel, fast, fewer features than `iTerm2` today. Worth tracking.
- `Warp` is the AI-augmented option with a "blocks" model and a command palette built around natural language. Two reasons it doesn't earn the pick: workflow fit (the agent layer is already handled at §9 and §10, so the terminal doesn't need to also be the agent surface), and a telemetry caveat (it's a commercial product that sends usage data home).
- `WezTerm` has wide feature coverage and is Lua-configurable, with multiplexing built in: both halves of §6: pane management (splits, tabs, named layouts) *and* session persistence (a headless server you can attach to and detach from). A different shape from `iTerm2` because it absorbs §6's job: pick `WezTerm` and `Zellij` becomes redundant.
- `Kaku` is a WezTerm fork tuned for AI-coding workflows, distinguished by convenience rather than capability. It ships with sensible defaults and requires virtually no setup. Built-in pane multiplexing carries over from upstream WezTerm (tabs, `Cmd+D` / `Cmd+Shift+D` splits, named workspaces), but the headless multiplexer-server mode has been stripped: so unlike upstream `WezTerm`, `Kaku` has *pane management* but not *session persistence*; you'd still pair it with `Zellij` for the latter. 

On Windows the same three niches (minimalist, AI-augmented, multiplexer-bundled) map to slightly different tools: `WezTerm` carries over directly, `Warp` has Windows support with the same telemetry caveat, and `Alacritty` fills the minimalist-GPU-accelerated niche that `Ghostty` fills on macOS, because `Ghostty` has no official Windows build and none is planned (the community ports, `Noctty` and the `ghostty-windows` forks, are separate projects built on its terminal core). `Kaku` has no Windows port either.

## When I'd reconsider

I'd switch to `Ghostty` the first time it hits feature parity with `iTerm2` on session restoration and profile management. `WezTerm` earns a fresh look if I ever decide the multiplexer + emulator boundary in §6 is causing me more friction than it's saving. `Kaku` has really nice aesthetics and if the multiplexer server were re-added I'd consider switching.

# 5. Shell, Framework, and Prompt

Three adjacent decisions on the same surface: the shell (the language), the shell framework (the plugin and load-order manager), and the prompt theme (the visual presentation). All three configure in the same dotfile (`.zshrc`), so they're treated together here even though some prompt tools (like `Oh My Posh`) work across shells. The shell is foundational; the framework and prompt are layers on top of it.

## Shell

### Role

The shell is where every command you type runs and where most of your dotfiles live. It's the layer underneath the agent CLIs in §10, the environment-variable injection in §2c, the multiplexer in §6, and most other parts of the stack. Picking the wrong shell makes everything above it worse; picking a sensible default keeps the rest of the stack consistent.

### macOS / Ubuntu: zsh

`zsh` has been the macOS default since Catalina and has the largest plugin ecosystem of any current shell: `zsh-syntax-highlighting` (highlights commands as you type), `zsh-autosuggestions` (greys-out command suggestions based on history), `fzf-tab` (fuzzy-finder tab completion), and others. Most agentic-tool examples and dotfiles assume a POSIX-style shell (one that follows the Unix command-language conventions, of which `zsh` and `bash` are the standard examples). `zsh` covers that without fighting the macOS default. Sticking with it avoids the friction of swapping the shell out from under the rest of the stack.

On Ubuntu, `zsh` is one `apt install zsh` (or `brew install zsh`) away and identical to the macOS setup. The Windows path is the *same* `zsh`, reached by first installing `WSL2` (Windows Subsystem for Linux 2, Microsoft's official Linux-on-Windows runtime) and running `zsh` inside its Ubuntu — which is far less work than bending `PowerShell` into the POSIX shape the agent CLIs and dotfiles assume.

### Alternatives and why not

`PowerShell 7` is the Windows-native answer and works differently from `zsh`. Where `zsh` and `bash` pass plain text between commands, `PowerShell` passes structured objects, with direct access to the .NET libraries and Windows APIs. If you primarily script Windows itself (managing Active Directory, Exchange, system administration), it's the right pick. For agent CLIs and POSIX-style dotfiles, it will fight you.

`fish` ships with usable defaults and doesn't require a `Powerlevel10k`-style configuration assembly. The "I want it to just work" niche. The downside is that `fish` doesn't follow POSIX conventions, so scripts that assume them (many `bash` snippets you'll find online) won't run unmodified.

`nushell` is the structured-data shell, with typed pipelines and a query-language flavor. The reason to watch it specifically for statistical work isn't shell novelty: it's that structured tables map naturally to CSV, JSON, and tabular inspection, which could matter once the ecosystem matures. 

`bash` is the default shell on most remote servers (university clusters, cloud VMs, HPC nodes) and the language most portable shell scripts assume. Reach for it when SSHing into a machine you don't control or when you want a script to run anywhere. For interactive daily work on your own laptop, `zsh` is the modern default.

### When I'd reconsider

If `nushell`'s plugin and tooling ecosystem matures enough that the agentic stack starts shipping nu-aware extensions, I'd seriously try it. Today, the cost of being a `nushell`-only user is too high.

## Shell framework

### Role

A shell framework manages your plugins, your theme, and the load order between them. Without one, you write your own `source` lines in `.zshrc` and manage plugin clones by hand. With one (`Oh My Zsh`, `antidote`, etc.), you declare what you want and the framework handles loading. Whether you need one depends on how many plugins you run and how much you care about shell startup time.

### macOS / Ubuntu: Oh My Zsh

`Oh My Zsh` is what I run. It has the largest community and the most-documented setup path of any `zsh` framework. Most blog posts, dotfile repositories, and tutorials that mention a shell framework assume `Oh My Zsh`, so searching for a fix usually returns relevant answers. The plugin set is broad, themes are abundant, and updates are automated. The known downside is performance: `Oh My Zsh` earned plugin managers their poor performance reputation, and shell startup can feel heavier than alternatives if your plugin set grows.

### Alternatives and why not

`antidote` is the lighter-weight alternative: the actively-released successor to `antibody`, written in `zsh`. You list plugins in a plain-text `.zsh_plugins.txt` manifest and `antidote bundle` static-compiles them into one file the shell sources at startup, so startup stays fast without any turbo or async machinery to reason about. It can pull individual `Oh My Zsh` or `prezto` plugins as snippets without installing the whole framework. The trade-off against `Oh My Zsh` is the familiar one — most snippet-style help online is still `Oh My Zsh`-flavored. I name it over the more powerful `zinit` for a maintenance reason: `zinit` hasn't cut a release since April 2025 (occasional branch commits notwithstanding), while `antidote` ships regular tagged releases. I still run `Oh My Zsh`; the conditions that would move me to `antidote` are in *When I'd reconsider* below.

*None (direct source)* is the minimalist alternative: write your own `source` lines in `.zshrc`, manage plugin clones via `chezmoi`, no framework dependency. Fits advanced `zsh` users with a small plugin footprint who want zero abstraction. Not a sensible default for newcomers: going framework-less assumes you already understand `zsh`'s sourcing model, plugin file structure, clone management, and update flow.

### When I'd reconsider

`Oh My Zsh`'s performance gets noticeable when the plugin set grows. If that ever became a real annoyance, the lighter-weight `antidote` (above) is where I'd look — but my plugin set is small enough that it hasn't, and I'm not planning a migration. Beyond that, I'd only revisit if a fundamentally different shell framework emerges; switching between current options is mostly lateral.

## Prompt theme

### Role

A good prompt surfaces the state your shell already knows (`git` branch, exit code, virtualenv, time-of-last-command) so you don't have to ask. In an agentic stack that matters more than usual: parallel agents land on different branches per §16, worktrees mean the same project lives at multiple paths, and which language runtime is active changes what an agent will run. A bad prompt either tells you nothing, or it tells you so much it slows down every command.

Prompt themes are mostly shell-coupled (`Powerlevel10k` is zsh-specific), but the cross-shell tools (`Oh My Posh`, `Starship`) work alongside whatever shell you picked in §5a, so this subsection applies even if you went with `fish` or another shell.

### macOS / Ubuntu: Powerlevel10k

`Powerlevel10k` is what I run, and the pick. It's the most performant `zsh` prompt available (`zsh-bench`, from the same author, is the relevant benchmark: <https://github.com/romkatv/zsh-bench>), information density is high, and its *instant prompt* feature renders the prompt before the rest of `.zshrc` finishes loading, so the shell feels ready immediately. It surfaces everything I want from a prompt — `git` state, exit status, runtime versions, virtualenv, command duration, transient prompt, right prompt — and on a stack where parallel agents land on different branches (§16) and worktrees put the same project at several paths, I rely on that prompt to tell me which branch and path I'm on. Install via `brew install powerlevel10k` and configure with `p10k configure`. Its powerline glyphs need a Nerd Font selected in the terminal emulator (§4), the one host-side setting the prompt depends on, on macOS or Windows alike.

The honest caveat is maintenance: `Powerlevel10k`'s README now states that support is very limited, no new features are planned, and most bugs will go unfixed. I keep it anyway because it's mature and feature-complete: there's nothing I'm waiting on it to add, and the limited-maintenance status hasn't cost me anything in practice. If it ever does, the migration path is `Oh My Posh` (below) and it's straightforward — but "the maintainer stopped adding features to a prompt that already does everything I need" is a weak reason to walk away from a fast, stable setup.

### Alternatives and why not

`Oh My Posh` is what I'd switch to if `Powerlevel10k`'s limited maintenance ever became a real problem, or if I needed a prompt outside `zsh`. It's cross-shell and actively maintained: the same `*.omp.json` theme works in `zsh`, `PowerShell`, `fish`, and `nushell`, and it's visually comparable to `Powerlevel10k`. Theming is well-covered: scores of official themes ship with it, and a community-built visual configurator (James Montemagno's, at <https://jamesmontemagno.github.io/ohmyposh-configurator>) lets you assemble one by eye instead of hand-editing the JSON. It's a standalone binary rather than an `Oh My Zsh` plugin, activated with a single `oh-my-posh init` line in `.zshrc`, and on the Ubuntu side it installs from the same Homebrew tap as on macOS. Being cross-shell, it's also what you'd reach for in the rare case you needed a prompt outside `zsh`. The only reason I don't run it is that `Powerlevel10k` is faster and already does everything I need.

`Starship` is the simpler cross-shell alternative: a single Rust binary, TOML config, fast enough that the gap from `Powerlevel10k`'s instant-prompt mode isn't perceptible in normal use. Less visual depth than `Oh My Posh`. Pick `Starship` if you want a low-maintenance default and `Oh My Posh` if you want more expressiveness.

`Pure` is the minimalist `zsh` prompt: almost no config, shows the essentials only. For users who find `Powerlevel10k`'s or `Oh My Posh`'s configuration overwhelming, or who don't want a feature-rich prompt.

### When I'd reconsider

I'd move off `Powerlevel10k` if its unmaintained status actually bit me — a real bug left unfixed, or a `zsh` change it failed to keep up with — or if I needed a prompt outside `zsh`. `Oh My Posh` is the migration target in either case. Short of that, the prompt-theme category is stable enough that I wouldn't expect to revisit for years unless a fundamentally different shape emerges.

## Reading and editing files in the shell

A handful of lightweight tools cover reading and editing files without leaving the terminal: the terminal-side counterpart to the IDE in §9, and what a terminal-first workflow actually reaches for. `nano` is for a quick config-file edit. `micro` handles a slightly longer edit or a fast sanity-check of something an agent just wrote (mouse support and syntax highlighting, with `nano`-level approachability). `bat` is for *viewing* a file with syntax highlighting, line numbers, and `git` change markers (a `cat` upgrade, not an editor). One small convenience worth setting up: bind the editors and pager to a common exit — I use `Ctrl+X`, mirroring `nano` — so the muscle memory carries across them (in `bat`'s case via its `less` pager). Anything longer than a quick look belongs in the IDE (§9).

| Tool | Kind | Reach for it when |
|:--------|:------------------|:----------------------------------------------------------------|
| `cat` | viewer (built in) | Dumping a short file straight to the terminal, no frills |
| `bat` | viewer | Reading a file with syntax highlighting, line numbers, and `git` change markers |
| `nano` | editor | A quick config-file edit |
| `micro` | editor | A slightly longer edit, or sanity-checking something an agent just wrote |

## CLI tools the agents reach for

A handful of modern CLI tools sit underneath the agents' day-to-day work, even though I rarely type them myself. An agent doing a refactor runs `rg` dozens of times to find call sites, reaches for `fd` to locate files, reads files through `bat`, and parses command output with `jq`. They're in the Brewfile (§1a) because the agentic workflow leans on them, not because they're part of my own routine. The classic `grep` / `find` / `cat` still work; the agents just default to the faster, more structured versions when they're installed.

| Tool | Role | The agent uses it to |
|:-----------------|:---------------------------------------|:--------------------------------------------------|
| `ripgrep` (`rg`) | recursive search (a faster `grep`) | find where a name or pattern lives before editing |
| `fd` | file finder (a friendlier `find`) | locate files by name or extension |
| `bat` | file viewer (`cat` with highlighting) | read a file with syntax and line numbers |
| `jq` | JSON processor | parse JSON from APIs, configs, and tool output |
| `yq` | YAML/TOML processor (`jq` for YAML) | read `.yml` / `.toml` config |

## Getting around the shell

Two interactive helpers for moving around faster — both things I type, not things the agents reach for. `zoxide` replaces `cd` with jumps ranked by how often and how recently I have visited a directory: `z proj` lands in the one I use most that matches "proj", no full path required. `fzf` is a general fuzzy finder wired into the shell — `Ctrl+R` fuzzy-searches history, `Ctrl+T` drops a file path onto the command line, `Alt+C` fuzzy-`cd`s into a subdirectory — and it also backs `zoxide`'s interactive `zi` picker.

| Tool | Kind | Reach for it when |
|:----------------|:-------------------|:-------------------------------------------------------------------------------|
| `zoxide` (`z`) | smarter `cd` | Jumping to a directory by partial name instead of typing out the path |
| `fzf` | fuzzy finder | Searching history (`Ctrl+R`), picking a file or directory, or filtering any list |

# 6. Session Persistence and Pane Management

Two problems show up routinely in data-science work: keeping an interactive *shell* alive across closing and reopening the terminal (so an `R` REPL or a multi-step build doesn't lose state when you quit `iTerm2` at the end of the day), and the need to watch several things at once (the model run, the log, the agent, `git` status). Once you're running multiple agents in parallel (per §10), the second problem becomes constant. A *terminal multiplexer* solves both: it splits one window into multiple side-by-side panes, and it keeps the shells inside those panes running after the terminal window closes. The related but separate problem — keeping a long-running *job* alive across reboot or agent-session reset (`brm()` fits, overnight scrapes) — is §7's job; a multiplexer alone isn't enough for that.

## Role

A terminal multiplexer does two jobs that look related but aren't: it lets a session survive disconnect (so closing the terminal window or quitting the terminal app doesn't kill the shells inside, and you reopen the terminal, `zellij attach`, and pick up exactly where you left off), and it splits one terminal window into many panes with named layouts (so several parallel agents are a single keystroke away from each other). What it does *not* cover is a job dying when *its* shell dies, even if the surrounding pane stayed alive — most commonly when an agent session ends and the shells it spawned go with it. §7 is where that broader job-persistence problem lives. Session persistence is the baseline; declarative layouts are what make two parallel patterns cheap to set up.

The one I lean on most is keeping several whole projects live at once, one per pane, so I can move between them issuing commands and steering a different agent in each; within any one of those panes the agent may be editing dozens of files, so the aggregate is scores of files across a handful of projects, all attended in parallel. The second, which I reach for less often, is the worktree-per-agent pattern in §16: several agents working a *single* project, each in its own worktree. Both are still *project-shaped* work, one pane bounded by one project root. Genuinely *cross-project* work is a different shape and not an agent-in-a-pane job: cross-project task tracking lives in `dstask` (§17), code work items in GitHub issues, and cross-project content search — "which projects touched X" — is just `rg` across the workspace.

On screen, the first pattern looks like this:

![](figures/zellij-panes.svg){#fig-zellij-panes fig-alt="The working model of one Zellij pane per project, with several projects live at once. Captioned: move between panes to steer a different agent in each; each pane is one project root, so parallel projects rather than many agents on one project." above="18pt" below="16pt"}

## macOS / Ubuntu: Zellij

`Zellij` is a Rust multiplexer with usable keybindings by default, a status bar that shows the current mode and the available keys, layouts in KDL so a project can declare its standard layout once and reload it on demand, and adequate plugin support. For agentic work specifically, layouts let you scaffold a standard arrangement with a single command. It runs identically in an Ubuntu shell (so inside WSL2), once your shell is there per §5a.

## Alternatives and why not

`tmux` is the long-standing default. Large ecosystem, configurable, plugins for most things. The downside: the config language and prefix-based keybindings are archaic and difficult to learn. `tmux` can be useful on a remote machine where it's preinstalled and `Zellij` isn't.

`WezTerm`'s built-in multiplexer handles persistence and panes itself.

## When I'd reconsider

I'd reconsider only if the §16 orchestrators matured enough to retire hand-laying-out parallel agents — and even then `Zellij`'s one-pane-per-project job would remain, which `WezTerm`'s built-in multiplexer could absorb if you'd already chosen it at §4.

# 7. Long-Running Jobs

Keeping a job alive after the shell that spawned it goes away. Different problem from §6 (terminal-session persistence): `Zellij` keeps the *shell* alive when the terminal closes; this section keeps the *job* alive when the shell itself goes away.

The mechanism is worth spelling out because it explains why the problem is invisible until it bites. Every script you launch from a shell is a *child process* of that shell, linked to it through the operating system's process bookkeeping. When the shell goes away, the operating system sends a hangup signal — `SIGHUP`, the standard Unix way of telling a process "your parent is gone" — to every process linked to it, and the default response is for those processes to exit. The signal cascades down: a long script that itself spawned helper subprocesses will lose those too, all the way through the chain. Nothing is logged; the job simply stops mid-step.

The agent process tree is the most acute case. Sessions reset, context windows compact, you type `/clear`, the harness reclaims an idle agent shell — and `SIGHUP` cascades to every long-running job started inside it. But the same problem affects any shell session that closes: a `Zellij` session being killed, a terminal tab closing, a reboot during a long fit. The agent surface just makes it routine.

## What each layer survives

The same underlying problem — keeping a job alive past whatever closes its parent — has five solutions at different price points, running from "what your terminal does by default" to "ship the job off this machine entirely":

| Layer | Survives | Breaks at |
|:---------------|:---------------------|:---------------------|
| 1 — Terminal panes (`iTerm2`, `Kaku`) | Pane operations inside one open terminal | Closing the window or quitting the app |
| 2 — Multiplexer server (`Zellij` / `tmux`, §6) | Terminal close, app swap, SSH disconnect — sessions and the jobs in them keep running | Reboot, power-off, agent-session reset (agent's tool-call shells aren't inside the multiplexer's process tree by default) |
| 3 — Detached background job (`nohup`) | Shell close, terminal close, agent-session reset, sleep | Reboot, power-off; no queue and no status command, so you wire up your own poll and log-grep to know what happened |
| 4 — Job queue daemon (`pueue`) | All of the above; the daemon comes back on reboot via `launchd`, queue state persists, completed-job exit codes and logs are preserved | Power-off / reboot kills *actively running* jobs (the queue survives, the running process does not — application-level checkpoint problem) |
| 5 — Cluster / cloud | Anything happening to your laptop is irrelevant | The remote machine going down; credentials, network, and cost overhead at setup |

The practical reading: layers 1 and 2 keep your *interactive workflow* coherent across closes and reopens. They're about you, not your jobs. Layer 3 is the minimum way to keep a *job* from dying when the agent session ends, with zero infrastructure beyond the shell. Layer 4 is the same problem solved with a real job queue — what you reach for once you've been bitten by layer 3's silent failures more than once. Layer 5 is for jobs that need to run *while you're not at the machine at all*: overnight cluster fits, multi-day scrapes, anything where "what if I close the laptop" matters.

The most common mistake is reaching for layer 1 or 2 when the job's failure mode actually wants layer 4. A `brm()` fit running in a `Zellij` pane *feels* safe — there's a server, you can re-attach — but the moment the agent that started it has its session reset, the agent's shell goes away and the fit dies with it. `Zellij` guards against the terminal closing, but the failure here is the agent's session resetting, which is what `pueue` survives.

## Role

Any job that might run more than about five minutes is exposed to this risk, regardless of language: Bayesian fits, machine-learning training runs, web scrapers, ETL pipelines, long builds, model-comparison sweeps. The function has two halves: launch the job somewhere that *isn't* a shell process tree, so it's unreachable by the `SIGHUP` cascade that would otherwise kill it; and give the caller — most often an agent — a clean way to find out whether the job succeeded or died. Without the first, `brm()` fits and overnight scrapes die silently when the agent session ends. Without the second, the agent has no idea whether a job is still running, has finished, or has gone silently dark.

## macOS / Ubuntu: Pueue

The shape of the fix is to launch the job from a long-running background program that the operating system keeps alive independently of any terminal, shell, or login session: what Unix calls a *daemon*. A daemon starts when the machine boots, runs in its own process tree managed by the operating system's service supervisor (`launchd` on macOS, `systemd` on Linux, `Windows Services` on Windows), and is unaffected by any of the events that take down an agent shell. Processes the daemon launches become children of the daemon, not children of your terminal — so the hangup cascade stops at the boundary where the daemon stands.

`Pueue` is a task queue built around exactly this idea. It ships with an always-on daemon called `pueued` that runs as a `launchd` service. You submit a command with `pueue add` and the daemon — not the agent shell, not the current `Zellij` pane — becomes the parent. Session boundaries, context-window compactions, `/clear`, and the agent's tool-call lifetime all happen well outside the daemon's process tree. The daemon also survives reboots, so a fit submitted Friday night is still running Monday morning if it needs to be.

Install via Homebrew and start the daemon as a service:

```
brew install pueue
brew services start pueue
```

The pattern, once the daemon is up, is two shell calls:

```
# Submit and capture the task ID
ID=$(pueue add --print-task-id -- Rscript code/fit-model.R)

# Wait (in a separate backgrounded shell call), then read the outcome.
# `pueue wait` exits 0 whether the task succeeded or failed.
pueue wait $ID
OK='.tasks[$id].status.Done.result == "Success"'
if pueue status --json | jq -e --arg id "$ID" "$OK" >/dev/null
then echo "DONE"; else echo "FAILED"; pueue log $ID; fi
```

`pueue add` queues the command on the daemon and returns immediately with the task ID. `pueue wait $ID` blocks inside the daemon until the task finishes, so there is no polling loop to maintain. It exits 0 whether the task succeeded or failed, so its exit code says nothing about the outcome; the outcome is read from `pueue status --json`, where a finished task carries its result. On failure, `pueue log $ID` prints the task's stdout and stderr so the agent can see how the job died. The full queue is inspectable any time with `pueue status` and `pueue log`. Short jobs (under about five minutes) that you're certain will complete inside the immediate session don't need this — use the agent's plain background-task tracking and rely on the harness's own completion notification.

The `pueue add` + `pueue wait` pair belongs in your global `AGENTS.md` so any agent reading those rules submits long-running work through the daemon by default. A one-paragraph instruction plus the canonical form is enough — the agent doesn't need the full reasoning every time, just the form and the rule to use it.

The most common applications are wrapping language-specific pipeline runners — `targets` (§15b) for R, `Snakemake` (§15c) for `Python` or multi-language pipelines — so multi-hour fits or overnight runs survive agent sessions and terminal exits. See those sections for the engine-specific recipes.

One boundary worth knowing before §13 covers it in full: this whole mechanism runs outside the lightweight OS sandbox (§13b). `pueue` is on the sandbox exemption list because its commands must reach the daemon's socket, and the submitted job runs as a child of the daemon — a long-lived process of yours, not of the agent — with your full user permissions and none of the agent's filesystem or network bounds. The same goes for the `nohup` fallback when it is launched through a one-off attended run. The agent's permission rules (§13a) gate the *submission command's text*, not what the wrapped script does once it is running, so the script deserves the scrutiny the sandbox would otherwise provide: review it like the §15 pipeline artifact it usually is before letting an agent queue it unattended.

## Alternatives and why not

`nohup` is the shell-standard fallback when a daemon isn't available (a fresh machine before `pueue`, or a teammate's system). The launch form is

```
nohup <command> > log 2>&1 < /dev/null &
```

where `nohup` makes the job ignore `SIGHUP`, the redirects capture output and detach stdin, and `&` backgrounds it. Finding out whether it finished then takes a hand-rolled poll of the PID plus a `grep` of the log for a success marker — more moving parts than the daemon-backed approach, and worth replacing with `pueue` once the daemon is up.

`tmux` and `GNU Screen` detach *terminal sessions* rather than queuing *jobs* — that's `Zellij`'s function (§6), not this one. A job inside a detached `tmux` session still dies if the server is killed or the host reboots, so the guarantee is weaker than `pueue`'s daemon-backed one.

`at(1)` and `batch(1)` are one-shot schedulers, not queues — submit a command for later execution, then exit. No `wait`, no `log`, no `status`, no resubmission. Useful for the narrow "run this once at 2 a.m." case; not what you want for the bulk of long-running work.

## Scheduled tasks

When a workflow should run on its own (overnight pipeline rebuild, periodic data refresh, weekly QA check), `cron` (macOS/Linux) and `Task Scheduler` (Windows) are the OS-native schedulers. `cron` composes with `pueue`: schedule the task at a specific time and submit it to the daemon. `launchd` is the modern macOS-native equivalent. I use both: `cron` for simple time-triggered jobs, `launchd` when a job needs more (run only when the network is up, restart on failure, scheduling that doesn't fit crontab syntax). The agent isn't in the loop. The work gets done, and you read the log when you're back.

The scheduled-task pattern crosses into §15: see the agent-detachment-pattern subsection for the pipeline version.

## Notifications

Two things pull me back to the terminal when my attention is elsewhere: an agent that needs input, and a long job that finishes. For the first, `Claude Code`'s `Notification` hook fires a desktop popup the moment the agent is waiting on me — a permission prompt, or an idle turn. Mine runs `terminal-notifier` (a small macOS notifier) from a one-line hook in `settings.json`, so I can work in another window and get pulled back exactly when the agent is blocked.

For the second, the `pueue wait $ID` I already use to block until a job finishes also carries the ping: `pueue wait $ID; terminal-notifier -message done` fires when that one job finishes, whatever its outcome. `pueue`'s global `callback` config runs after every task instead, for when I'd rather hear about all of them.

## When I'd reconsider

`Pueue` is stable, actively maintained, and fits the agent-driven long-running-job problem cleanly. I'd reconsider if something emerged with similar guarantees and tighter agent integration — a daemon the agent could query over MCP, say — but the current shape (shell-callable, file-backed logs, exit-code-faithful `wait`) is what agents need. Re-evaluate yearly.

# 8. Programming Languages

The language layer. Each subsection covers a complete *language stack*: the language itself plus its version manager, environment manager, and package manager, organized together. Treating each language as a stack rather than scattering its tooling across the doc matches how you set up a project — pick a language, reach for that language's installer, reach for that language's env / package tools, all in one motion. The §2d runtime manager handles the *single-tool-version-pinning* case; this section handles *full language stacks with transitive dependency closures*.

`Python` is universal infrastructure for the agentic stack: agents shell out to it, MCP servers commonly run on it, many CLI tools (`yt-dlp`, `awscli`, `ruff`, `pre-commit`, much more) ship as `Python` packages. Even on a team where nobody writes `Python` by hand, `Python` is lurking in your tooling and needs to be set up well.

`R` is the second language in the picture, but in a different role. It lives on the team's stack for data-science and statistical work specifically. Agents don't usually depend on `R` as infrastructure (CLI agents and MCP servers aren't typically written in `R`), but they can edit and run `R` scripts, `Quarto` documents, package tests, and `targets` pipelines: `R` is what the agent works *on* for statistical workflows, even when it's not what the agent is built *from*. The project tooling around it is different from `Python`'s.

`Julia` is the third language covered. It has real strengths in HPC, certain optimization workflows, GPU-accelerated numerical work, and stochastic differential equations. The §8c subsection covers its canonical tooling.

## General-purpose language: Python

### Role

`Python` is present throughout this stack: many CLI tools are written in it, MCP servers commonly run on it, and agents themselves often invoke `Python` for sub-tasks. The decision isn't whether to install `Python` (you will) but which dependency-management tool to use, since the modern Python world has two — `uv` and `pixi` — that each dominate a different slice of the ecosystem.

The criterion is simple: **default to `uv`; switch to `pixi` when any dependency lives outside `PyPI`** — compiled scientific libraries from conda-forge (`GDAL`, `PROJ`, `HDF5`, `NetCDF`), CUDA-bundled ML stacks (`PyTorch` / `JAX` with GPU), `Bioconda`, R packages mixed with Python, or system CLI tools as project-scoped dependencies. The test is what's in the dependency tree, not the kind of project: a "data science" project that only needs `pandas` / `numpy` / `scikit-learn` stays on `uv`, while a "general scripting" project that needs `GDAL` goes to `pixi`.

Both are the right pick within their respective scopes. Neither is going away: Astral (the `uv` team) is building the broader PyPI-native Python tooling stack (`ruff`, `ty`); Prefix.dev (the `pixi` team) owns the conda-forge solver lineage that's irreplaceable for compiled scientific binaries.

### macOS / Ubuntu: uv or pixi

#### `uv` (default — PyPI-resolvable projects)

`uv` (from Astral) is one Rust binary that handles installer + venv + dependency resolution + interpreter installation + script running. The project manifest is `pyproject.toml`, the lockfile is `uv.lock`, the interpreter version is pinned via `.python-version` — all committed. `uv sync` reproduces the environment from a fresh clone in seconds. Anything else in the Astral stack (`ruff`, `ty`) assumes `uv` conventions, so projects on `uv` get the cleanest integration with that tooling lineage.

Install via `Homebrew`: `brew install uv`.

#### `pixi` (conda-forge + PyPI)

`pixi` (from Prefix.dev) is one Rust binary that handles installing the `Python` interpreter, creating per-project environments, resolving dependencies from a unified `pixi.toml`, and running tasks. It uses `conda-forge` as the primary channel (giving the same compiled-scientific-library coverage as `conda` / `micromamba` — most of `Bioconda`, the geo stack, GPU/CUDA, neuroimaging, anything system-library-linked) but can also resolve `PyPI` packages in the same lockfile, so a project can mix `conda-forge` and `PyPI` dependencies cleanly.

The practical loop: `pixi init`, `pixi add numpy gdal`, `pixi run python my-script.py`. Environments live project-local at `.pixi/envs/default/` by default, so deleting the project directory cleans up everything it installed. The lockfile (`pixi.lock`) is multi-platform — one file pinning exact versions across macOS, Linux, and Windows for every dependency in the project, so a teammate on a different OS gets exactly the resolved versions without a separate `conda-lock` pass.

`pixi` also covers `R` (`r-base`, `r-tidyverse`, and the 2,000-odd `r-*` packages on conda-forge), `RStudio` (`rstudio-desktop`), and many CLI tools — useful when you want one tool managing a mixed Python + R environment in a single project, with the caveat that R's serious package coverage (CRAN, ~21,000 packages) is way beyond what conda-forge mirrors. For R-led work that needs broad CRAN coverage, §8b's `rig` + `renv` stays the better pick.

`pixi` has a built-in task runner (`[tasks]` in `pixi.toml`, run via `pixi run task-name`). It works fine within a pixi project, but §15a recommends `just` as the universal task runner across the whole doc — and that recommendation holds inside `pixi` projects too. `just` works for every project type (doc-build, scrape, R analysis, mixed) and keeps one task-runner mental model across all of them, where `pixi run` is necessarily project-local to pixi-managed projects.

Install via `Homebrew`: `brew install pixi`. Developed by Prefix.dev (the team behind `mamba`), with corporate backing and active monthly releases.

Both `uv` and `pixi` are cross-platform, and their lockfiles resolve per-platform: a `pixi.lock` (or `uv.lock`) committed on macOS produces the same dependency tree for a teammate on Ubuntu — one of the cleaner cross-platform reproducibility stories in modern Python today.

### Comparing uv, pixi, and micromamba

The three serious modern Python-stack tools, each suited to different work:

| | `uv` | `pixi` | `micromamba` |
|---|---|---|---|
| Primary use | `PyPI`-only projects | Greenfield scientific projects | Existing `conda` / `environment.yml` projects |
| Package sources | `PyPI` only | `conda-forge` + `PyPI` unified | `conda-forge` (or any `conda` channel) |
| Lockfile | `uv.lock` | Single multi-platform `pixi.lock` | `environment.yml` (use `conda-lock` for cross-platform pins) |
| R support | No | Yes (conda-forge `r-*` packages) | Yes (same) |
| Task runner | None — pair with `just` (§15a) | Built-in (`pixi run`); §15a's `just` recommended anyway | None — pair with `just` (§15a) |
| Maturity | Dominant for `PyPI` since 2024 | Active, growing; `mamba` lineage | Stable, drop-in conda compat |

`micromamba` is the third option, used when bringing forward an existing conda-managed project where rewriting `environment.yml` as `pixi.toml` is more friction than just installing `micromamba` and pointing it at the existing file.

### Alternatives and why not

`micromamba` is the drop-in `conda` client. Single static binary, speaks the `conda` protocol (`micromamba create -n env`, `micromamba install -c conda-forge gdal`), works with existing `environment.yml` files. Right pick when bringing forward an established `conda`-managed project that already has its environment declared, or when working in an organization that's standardized on `conda`. `mamba` (the conda-built-in faster solver) and `Miniforge` (the conda-forge-defaults conda distribution) are adjacent — same lineage, heavier installs. For greenfield projects, `pixi` is the modern answer; `micromamba` is the conservative one.

`pip` + `venv` is the legacy default. `poetry` and `pdm` have been effectively absorbed by `uv`, which runs much faster. `pyenv` is redundant, since both `pixi` and `uv` (and `mise` from §2d) install `Python` themselves.

### When I'd reconsider

If Astral added conda-forge resolution to `uv` (effectively absorbing `pixi`'s scope), the dual-pick collapses to one tool and the criterion stops mattering, but that's a major architectural shift, not on the visible roadmap. If Prefix.dev added PyPI-native UX parity with `uv` (faster resolution for pure-PyPI cases, full integration with the Astral lint/format/type-check stack), the criterion might tilt the other way — `pixi` for everything regardless of conda-forge need. Neither change is in flight today.

## Data-science language: R

### Role

`R` is the data-science workspace language for anyone doing statistical modeling or data analysis that doesn't involve heavy use of machine learning / deep learning. Unlike `Python`, `R` isn't infrastructure for the rest of the stack: agents don't reach for it for general tasks, and CLI tools don't depend on it. But for the people using it, `R` sits at the center of their daily work: data manipulation in `tidyverse`, statistical models with `lme4` / `brms` / `Stan`, papers via `Quarto` or `RMarkdown`, dashboards via `Shiny`.

### macOS / Ubuntu: R

Three tools compose into the R stack: `rig` for the R interpreter, `renv` for the project lockfile, and `pak` as `renv`'s install backend. Every R project is an `renv` project by default; the one-off scratch script outside `renv` is the exception, not the rule.

`rig` (Posit / r-lib) is a single-purpose CLI for installing and switching R versions: "install `R 4.3`", "switch to `R 4.2` for this project", "list installed versions". It fills the gap that `mise`'s `R` plugin only partially covers.

`renv` (Posit) is the per-project dependency manager — the equivalent of `uv`'s project-tooling role: project-local package libraries, `renv.lock` for reproducibility, environments isolated per project. `renv::init()` at project creation, `renv::install("pkg")` adds a dependency, `renv::snapshot()` writes the lockfile, and teammates run `renv::restore()` once after cloning.

`pak` (Posit / r-lib) replaces `install.packages()` as the install layer underneath `renv`. Set `options(renv.config.pak.enabled = TRUE)` in `~/.Rprofile` and `renv` delegates the actual install operations to `pak`: parallel downloads, parallel installs, up-front dependency resolution (so version conflicts surface before anything gets installed instead of mid-way through), built-in support for GitHub / GitLab / Bitbucket / URL / local sources without separate `devtools::install_*` functions, and a sub-process model so a botched install doesn't pollute the calling R session.

Loading packages into a session is kept as a separate step from installing them. I use a small `load_pkgs()` wrapper defined in a project-root `functions.R` and sourced from `setup.R`: quoted-string `...` signature, strictly loads (no install fallback), so the install channel stays single: `renv` for installs, `library()` (via `load_pkgs()`) for loading. I find this is nicer than having many `library()` calls at the top of a script. One vector of quoted package names, loaded by one function call, which live at the top of `setup.R` and that feeds everything downstream. The wrapper's definition lives in the global `CODING.md` so an agent walking into a new R project knows the contract.

Use all four: `rig` for the R install and version, `renv` for the per-project package set, `pak` as `renv`'s install backend, and `load_pkgs()` (per project) for loading.

On Ubuntu the same `rig` + `renv` + `pak` stack installs the same way; the IDE that attaches to the R session is the §9a GUI window (`Positron` via Remote-WSL on Windows, or a native Linux build). The rule that doesn't move, wherever you work, is that each project declares and restores its package set via `renv`.

### Alternatives and why not

`mise`'s `R` plugin does work and would let you avoid adding `rig` to your stack. The catch is that the plugin is functional but thin compared to `mise`'s `Python` coverage; `rig` is more established and simpler to use for `R` version management specifically.

`pixi` (per §8a) is the right pick for *mixed Python + R* projects where you want one tool managing both languages' environments — `pixi` installs `r-base`, `r-tidyverse`, and the conda-forge `r-*` packages alongside Python dependencies in a single `pixi.lock`. The caveat is package coverage: conda-forge mirrors maybe 2,000 R packages, while CRAN has ~21,000. Pixi-for-R works for the common-package case (tidyverse, ggplot2, dplyr, the obvious stack) but breaks down for anything in the long tail. For R-led work that pulls from CRAN, `renv` is the only path that covers the full ecosystem.

`conda` is an option here too if you're already in a `conda` `Python`+`R` workflow — but `pixi` is the modern replacement for that case, so for greenfield, start with `pixi`.

### When I'd reconsider

If `mise`'s `R` plugin reaches feature parity with `rig` (proper installer, easy version switching, good error messages), I'd consolidate on `mise` + `renv` and drop `rig`. That would also let §2d carry more of the load.

Conda-managed R is the other path I would *not* take. It exists, but the experience is rough — slow solver, frequent version conflicts with the Python side of mixed environments, and poor coordination with `renv`. Reach for `conda` for R only when an organizational policy locks you into it.

## Numerical-computing language: Julia

### Role

`Julia` lives in a narrow but meaningful niche — high-performance numerical computing where you want a higher-level language than C++ but more performance than `Python`. HPC, scientific simulation, optimization, PDE solvers, GPU-accelerated numerical work, stochastic differential equations.

### macOS / Ubuntu: juliaup + Pkg

`juliaup` is the official `Julia` installer and version manager, analogous to `rig` for R: install a version, list installed versions, switch the active version, set a per-project version. The package manager `Pkg` ships built-in with `Julia` and is the canonical answer — no third-party package manager has displaced it the way `uv` displaced `pip` in Python. Together they cover the same role as `rig` + `renv` on the R side: version per project, package set per project.

Install `juliaup` via `Homebrew`: `brew install juliaup`. Then run `juliaup add release` followed by `juliaup default release` to get the current stable `Julia`. Per-project versions go in a `Manifest.toml` (which `Pkg` writes for you) plus a `juliaup`-managed `.julia-version` file. `juliaup` and `Pkg` are cross-platform, so the same setup carries to an Ubuntu shell unchanged.

### When I'd reconsider

If I started doing serious HPC, optimization, or stochastic-DE work, this is where I'd look first.

# 9. IDE and IDE-Side Agent

One of the four entry points for driving an agent (per the introduction): you open a project in your editor, and the agent runs inside it with full access to your open files, cursor position, and diagnostics. Two adjacent decisions: the editor itself, and the AI integration that runs inside it. They get separate subsections because the picks are genuinely independent. For `Positron`, `VSCodium`, or `VS Code` users, the agent comes as an extension you choose. For `Cursor` or `Zed` users, the agent is baked into the editor itself, and the IDE-side-agent subsection collapses into the IDE one.

For agentic work I live almost entirely in the terminal: the §10 CLI agents and a multiplexer are where my work happens, and even the occasional file inspection usually stays in the terminal rather than opening the IDE for a glance — `nano` for a config tweak, `micro` for a quick edit or sanity-check of agent output, `bat` for a syntax-highlighted read (all covered in §5). The IDE is worth opening for genuine reading-and-writing sessions, not glances. The pick below reflects what I'd choose if I were running an IDE-first workflow rather than what I open daily today: the doc isn't here to pigeon-hole readers into my current preferences, and the IDE-first entry point is one of the legitimate ways to drive agentic work (per the four-entry-points framing in the introduction).

## IDE

### Role

The IDE is where work becomes readable and editable across many files at once: project search, an integrated terminal, diagnostics, debuggers, the extension ecosystem. What that's *for* splits by the kind of work — which is why this subsection names two picks. For data science it's where `R` sessions attach interactively, `Jupyter` notebooks render, `Quarto` documents preview, and data inspection happens visually (`View()`, the variables pane, plot history); for general and web development it's language servers, refactoring tools, and debuggers across a codebase.

### macOS: Positron or VSCodium

Two picks, split by the kind of work — the same split the two intro workflow diagrams already make. For **R / Python / Quarto data-science work**, `Positron` (from Posit) is the forward-looking choice: built on `Code OSS` (the open-source base of `VS Code`) with `R` and `Python` as primary languages, an integrated Data Explorer that filters and facets more cleanly than `RStudio`'s `View()`, and native `Jupyter` and `Quarto` support. It's multilingual where `RStudio` is R-primary, and Posit positions it as the successor to `RStudio` for new work.

For **general / cross-stack development** (web, TypeScript, plain coding, anything that isn't R or `Python` data analysis), `VSCodium` is what I use. It's the community build of `VS Code` compiled from the same source tree, minus Microsoft's branding and telemetry. It behaves identically to `VS Code` for editing, with one structural difference: its extension view points at `Open VSX` rather than Microsoft's Marketplace. Most of what a data scientist needs is on `Open VSX`: the `Claude Code` and `Codex` agent extensions (§9b), Microsoft's open-licensed `ms-python` Python extension, the `ms-azuretools` Docker tooling, Ruff. The carve-outs are Microsoft's *proprietary* pieces, which are licensed not to run on non-Microsoft builds — chiefly `Pylance` (swap in `basedpyright` + Ruff, both on `Open VSX`) and the Remote-Development extensions (Remote-SSH and Dev Containers on macOS; Remote-WSL on Windows). On macOS none of those costs me anything, so dropping the telemetry is pure upside. On Windows the Remote-WSL gap is exactly why the comparator differs (below).

`Positron` ships its own built-in AI assistant; `VSCodium`, unlike `VS Code`, does *not* bundle `GitHub Copilot` (another Microsoft-proprietary piece). That doesn't matter for this stack, because the part that counts is that both editors host the `Claude Code` and `Codex` extensions (§9b), installed through `Open VSX` or the `Code OSS` extension APIs. So the editor choice doesn't constrain the agent: pick the one that fits the project and run the same agents inside either.

### Ubuntu / Windows (WSL2): Positron or VS Code

The IDE is the GUI host layer (per the second-column note): the editor window runs on the host OS, but the project, extensions, language servers, and integrated terminal all live in Ubuntu. **On Windows**, that means native `VS Code` or `Positron` reaching into the WSL2 Ubuntu through the **Remote - WSL** extension — which is Microsoft-proprietary and won't run on `VSCodium`, so the general-purpose pick flips from `VSCodium` (macOS) back to the official `VS Code` build here. `Positron` is the data-science pick on both platforms, with the same remote story into WSL2. **On bare-metal Linux** there's no WSL2 layer to reach across: run the Linux build of `Positron`, `VSCodium`, or `VS Code` directly, exactly as on macOS, so `VSCodium` is fine again. Either way the editor is a window onto the same Ubuntu environment.

### Alternatives and why not

`VS Code`, Microsoft's official build, is the editor I reach for on macOS only when I need something `VSCodium` can't do: the macOS-relevant Remote-Development extensions (Remote-SSH, Dev Containers) or a Marketplace-only extension such as `Pylance`. It's also the Windows pick, for the Remote-WSL reason (above), since that extension is Windows-only. The trade is Microsoft's telemetry and branding, which is why on macOS it's the fallback rather than the default. Everything else — the extension model, settings, keybindings, the `Claude Code` / `Codex` extensions — is identical, so moving a project between the two is friction-free.

`RStudio` (also from Posit) is what most existing R users live in. It still has a more refined workflow specifically for R package development (Build pane, devtools integration, document/check/install/test as one-click actions), Shiny app development (Run App workflow, integrated viewer, hot reload), and a small set of legacy formats (Sweave, classic R Notebooks). For a project that's primarily R analysis without those concerns, `Positron` is the better forward-looking pick; for active R package development, `RStudio` is still less friction. Where `RStudio` falls short for *this* stack specifically is agents: it has no built-in AI assistant by default and can't host the `Claude Code` or `Codex` extensions, so agentic work runs in a terminal beside it rather than inside the editor — exactly the gap `Positron` and the `VS Code` family (`VSCodium` included) close.

`Cursor` is a `VS Code` fork with the agent baked in. The case for `Cursor` is convenience: there's no extension to manage separately and the agent UI is more tightly integrated. The case against is that `Cursor` is a paid product with a different data model than open-source `VS Code` / `Positron`, and `Cursor`-specific workflows don't translate back cleanly if you decide to leave.

`Zed` is a Rust-written editor by ex-`Atom` team members. Faster than `VS Code` in benchmarks, with collaborative editing built in and native agent integration via ACP (the Agent Client Protocol, the editor↔agent layer covered in §12). `Zed` lists `Claude Code`, `Codex CLI`, `Gemini CLI`, `Goose`, and `opencode` as ACP integrations.

`PyCharm` (from `JetBrains`) is the structured `Python` IDE with deep refactoring, integrated debuggers, and `JetBrains`' own AI Assistant. The Assistant is functional but currently behind `Claude Code` and `Codex` on the agentic side. Smaller extension ecosystem than `VS Code` / `Positron`.

`JupyterLab` + `Jupyter AI` is the notebook-first alternative for `Python` data scientists who live in notebooks rather than scripts. `Jupyter AI` uses ACP and connects mainstream coding agents to the notebook environment. 

### When I'd reconsider

If `Zed`'s ACP integration plus its language-server and `Jupyter` coverage become competitive with `Positron` for data-science work, I'd evaluate it on those grounds. And the day I need Dev Containers or Remote-SSH on macOS (or Remote-WSL on the Windows side), I'd move that project to `VS Code` proper — the one workflow where `VSCodium`'s `Open VSX` boundary is a real wall rather than a cosmetic one. For now, `Positron` is the right IDE-first pick for the data-science niche; `VSCodium` covers the cross-stack cases where `Positron` doesn't fit.

## IDE-side agent

### Role

The IDE-side agent is the AI integration that runs locally inside your editor. It has the editor's full context (open files, cursor position, diagnostics, project structure) at no extra cost, which makes it the right surface for "I'm reading this code and want a quick edit" or "explain this function." "IDE-side" specifically means the agent runs locally inside the editor. Cloud-spawned agents (`Codex` invoked from a GitHub PR comment, `Copilot`'s autonomous-coding-via-GitHub workflows) are a different surface, deferred to §10 and §16. The IDE-side agent is complementary to a CLI agent rather than a replacement: the CLI agent owns multi-file refactors and long-running tasks; the IDE-side agent owns small in-the-moment edits.

One distinction worth drawing sharply: running a CLI agent in the editor's *integrated terminal* is not the same thing as an IDE-side agent. A CLI in the terminal panel shares window pixels with the editor but inherits none of the editor-integrated affordances: inline edit-this-selection, a chat anchored to the active file, diagnostic-aware suggestions, edits applied across multiple cursors. It is also a degraded terminal: tied to the editor's lifecycle, with none of the session persistence or pane layouts a real terminal emulator plus a multiplexer gives you (§4, §6). The integrated terminal panel is fine for a one-off command, but it is neither a true IDE-side agent nor a substitute for the terminal stack — treating "open the terminal panel" as the IDE-side option quietly files a CLI-shaped agent under an IDE-shaped label.

### macOS / Ubuntu: Claude Code or Codex

Both `Claude Code` and `Codex` ship official extensions. They install in `VS Code` directly via the official marketplace, and on the `Code OSS`-derived editors (`Positron`, `VSCodium`) via `Open VSX` or a direct `Code OSS` extension-API install — the same Extensions-view flow, just pointed at a different registry. The `Claude Code` extension installs cleanly on `VSCodium` from `Open VSX`. Both vendors document support for `Code OSS`-derived editors generally, but verify the `Codex` install on your current `Positron` / `VSCodium` version before adopting it for daily use. They're effectively the same agents you'd run as CLIs (§10a), with an editor surface added. Which one you reach for depends on the task; they're complementary not redundant. On Windows, the same extensions run with the editor on Windows and the agent inside the WSL2 Ubuntu via Remote - WSL (per §9a).

### Alternatives and why not

`GitHub Copilot` is no longer just inline completion. Its agent mode does autonomous code editing with terminal-command suggestions and iteration. Plan mode lays out multi-step changes before applying them. It supports MCP, custom instructions, and multi-file edits. The case against `Copilot` for this workflow isn't "it's just autocomplete" anymore: it's model quality (the user's call), workflow fit (the official `Claude Code` and `Codex` extensions integrate more tightly with their respective agent CLIs), and subscription/account constraints.

`Cody` (from Sourcegraph) is more codebase-aware than `GitHub Copilot` and is multi-model. It sits in a niche between `GitHub Copilot` and `Claude Code` / `Codex`: more capable than `GitHub Copilot`, less integrated than the official extensions from Anthropic and OpenAI.

`Continue` is open source and BYO-model. Useful if you want to route the IDE agent through your own LLM provider via `LiteLLM` or `OpenRouter`, accepting more configuration work to get there.

Important caveat: if you picked `Cursor` or `Zed` on §9a, this entire section is moot. Both ship their own agents and you don't layer an extension on top.

### When I'd reconsider

If ACP (per §12) becomes the lingua franca for editor↔agent integration, the calculus shifts: I'd evaluate IDE-side agent extensions on protocol fit rather than vendor. For now, the official `Claude Code` and `Codex` extensions are the right defaults.

# 10. CLI Agentic Coding Tools

The core of this stack. A coding agent that lives in a terminal, reads and writes files, runs commands, and is driven by your project's context files (per §17b). Two flavors worth distinguishing: agents tightly coupled to a single model vendor, and agents that route across vendors.

The IDE-side surface for the same agents is at §9 (and the contrast between the two surfaces is laid out in the introduction). Orchestrating multiple parallel agent sessions is at §16.

Before running an agent against real project work, six conditions are worth having in place. The picks in this section assume them; agent work without them is harder to roll back when it goes wrong, and the conditions are individually cheap to set up.

- The project has an `AGENTS.md`, a `STATUS.md`, and a `TASKS.md`, so the agent inherits your conventions, the current state, and the open tasks (§17b).
- You've decided which paths the agent may touch and which are off limits (§13a's data-permissions subsection).
- Secrets are injected per project via `op` or `gopass`, not committed in plaintext `.env` files (§2b and §2c).
- You've set a permission posture (§13) — default to more prompts when you're new to agents and relax items as you trust the boundaries.
- `git status` is clean enough that the agent's changes will show up as a reviewable diff (§1b).
- The project has a canonical check or build command (`just check`, `just build`) so the agent can verify its own work (§15a).

## CLI agent (single-vendor)

### Role

A single-vendor agent is tightly coupled to one model provider: `Claude Code` talks to Anthropic, `Codex` talks to OpenAI. You get a deeper fit with that one vendor, and give up the ability to switch. Committing to one vendor lets the agent integrate with that vendor's specifics (caching, tool use, thinking modes, prompt-caching idioms) and use features that generic multi-vendor agents can't match. This is where most of my daily work happens.

### macOS / Ubuntu: Claude Code or Codex

Both. `Claude Code` (from Anthropic) and `Codex` (from OpenAI) are the two strongest single-vendor agents available, with different strengths. `Claude Code` tends to do better on multi-file reasoning, careful edits, and longer-horizon planning: useful for reading a whole analysis, preserving statistical intent across many files, and working through messy project conventions. `Codex` tends to do better on tightly scoped tasks and quick "implement this to the spec" jobs. Run both. For statistical work, judge them on whether they preserve the analysis question, the reproducibility contract, and the data integrity: not on lines-of-code throughput. Cost: one extra CLI to install and one extra API key wired into the project's `.envrc` (per §2c). On Windows, run both inside the WSL2 Ubuntu — the native-Windows installs work but are less proven than the WSL2 path.

### Alternatives and why not

`Gemini CLI` is the third CLI worth keeping installed. Open source, MCP support, Google Search grounding (useful for web-grounded research tasks), non-interactive scripting mode, and a context window large enough to ingest whole repositories for repository-wide questions. Not a candidate as the *only* agent (Anthropic and OpenAI have stronger CLI tooling and tighter agent-CLI ecosystems), but useful as a third option for long-context repository questions and Google-grounded research.

Worth a brief mention: `Cline` and `Amp` (from Sourcegraph) are both Anthropic-flavored agents that overlap heavily with `Claude Code` itself. `Cline` is more transparent and hackable; `Amp` leans on Sourcegraph's deep codebase indexing. Both are interesting but less differentiated against `Claude Code` than `Gemini CLI` is.

### When I'd reconsider

The single-vendor agent landscape changes faster than any other category in this doc. I'd re-evaluate the picks every six months. The framing (run multiple single-vendor agents because their strengths differ) is more durable than which specific two are recommended at any given moment.

### Patterns and extension points worth knowing inside Claude Code

A few capabilities worth knowing once you're using `Claude Code` daily: both day-to-day patterns and longer-term extension surfaces. All listed in the docs, but easy to miss at first.

Daily patterns:

- *`git` worktrees* for parallel work. Each agent gets its own worktree (and its own branch) so concurrent agents don't fight over the working tree. This is the foundation of §16's manual multi-agent orchestration.
- *Background agents* for tasks that are *parallel* and *bounded*, not for tasks that are *long*. Each background-agent invocation is a tool-call-shaped child process with the same ~10-minute timeout cap as any other tool call, and the child is reaped when the parent agent session ends. Useful for "run these tests while I work on something else" or "do a quick parallel search" — not for `brm()` fits, overnight scrapes, or anything that needs to outlive the current session. For genuinely long-running work, reach for `pueue` (§7) instead; the daemon-backed pattern is what survives session boundaries cleanly. Pairs well with §14 (telemetry) for "what did the background agent do while I was working."
- *Plan mode* for any task whose shape isn't obvious before you start: the agent reads what it needs, drafts a step-by-step plan with the files it intends to touch, and waits for approval — catching a wrong-shaped solution at the plan stage instead of twenty file edits later.

Extension surfaces (documented prominently in `Claude Code`'s docs):

- *`CLAUDE.md` / `AGENTS.md`*: the project brief the agent reads on entry (per §17b).
- *Hooks*: pre- and post-tool-call shell hooks for guardrails. Lets you enforce conventions ("don't push to main", "always run tests before committing") at the agent layer rather than relying on the agent to remember.
- *Slash commands and skills*: packaged reusable workflows the agent can invoke by name. Your accumulated `/` commands become a shared vocabulary (`/review`, `/deploy`, `/security-review`) that anyone on a project can invoke without re-explaining context. The three I use most: `/scaffold` (set up a new project from the project-shape templates in `TEMPLATES.md`), `/pueue` (submit and wait on long-running jobs per §7), and `/targets` (the `targets` + `crew` + `pueue` pattern from §15b).
- *MCP servers*: extend the agent's tool inventory at runtime (per §12's integration-layer subsection).
- *Subagents*: within a single session, the parent agent can spawn focused subagents to handle scoped tasks (the in-session counterpart to §16's cross-session orchestration).
- *Agent teams*: declarative groups of agents with assigned roles for multi-step coordinated work.
- *Plugins and marketplaces*: distribution surface for skills and MCP integrations from the broader community.

Most extension surfaces become useful once you've moved past basic single-session use. Subagents in particular handle a layer of orchestration that sits below §16's worktree-and-pane pattern: useful before you reach for external orchestrators.

### Long-running and scheduled tasks

Long-running tasks (`brm()` fits, `Snakemake` runs, long scrapes, model-comparison sweeps) come up routinely in agent work, and the agent's process tree is the most acute case of the broader long-running-job problem covered in §7: tool-call lifetime caps, session boundaries, context-window compactions, and `/clear` all tear down the children. The canonical pattern is to submit the job through the `pueue` daemon (per §7) so it lives outside the agent's process tree, then `pueue wait $ID` from a second backgrounded call to classify success or silent death. The same pattern handles scheduled tasks via `cron` / `launchd` / `Task Scheduler` submitting to the daemon. See §7 for the canonical form, the `nohup` fallback for daemon-less environments, and the full alternatives discussion.

## CLI agent (multi-vendor)

### Role

A multi-vendor agent talks to many model providers through a common interface. Same agent UI, but you can point it at `Claude` this week and `Gemini` next week, or use cheap models for bulk work and expensive models for hard reasoning. The trade is the inverse of the single-vendor case: less depth in any one vendor's idioms, more flexibility about which model is doing the work. This shape pays off when you want to compare model performance, route by cost or capability, or just hedge against any single vendor's pricing or availability.

### macOS / Ubuntu: opencode

I don't run a multi-vendor agent today — `Claude Code` and `Codex` (per §10a) cover my workflow. If I needed multi-vendor routing (comparing models on the same task, cost-routing cheap-vs-expensive models, hedging against any one vendor's pricing or availability), `opencode` is what I'd pick.

`opencode` (from the sst team, open source) has become the category's default choice: the largest community among multi-vendor agents, and the most active development. In shape it is the closest thing to a vendor-neutral `Claude Code` — a terminal interface you hand a goal to, with the same delegate-and-review working relationship — and it talks to dozens of providers through one configuration: the major vendors, gateway services, and any OpenAI-compatible endpoint, which includes local models served through `Ollama`. The local-endpoint path is a data-sovereignty option rather than a capability one (open-weights models still trail the frontier for agentic work; the `PyGPT` entry below makes the same trade in desktop form).

### Alternatives and why not

`Aider` is the original terminal AI pair-programmer, and its working model is genuinely different from the agentic shape: interactive, file-scoped edits where every change lands as a descriptive `git` commit, so reviewing a session reduces to `git log` and rollback to `git revert`. It is lightweight, precise, robust with cheaper and local models, and it maintains a public leaderboard of model coding performance (`aider.chat/docs/leaderboards`) that is useful even if you never run the tool. If your workflow is "small edit, review the diff, commit, repeat," `Aider` is the tighter fit; for the multi-vendor *agent* role this subsection names, `opencode`'s adoption, activity, and provider breadth now dominate.

`Goose` is the MCP-native automation agent, donated by Block to the Linux Foundation in 2026 — the strongest open-governance story in the category. Its center of mass sits one step beyond coding: reusable "recipes" that automate workflows across external systems, with MCP as the plumbing throughout. Right pick if what you want is automation infrastructure rather than a coding agent.

The *ACP-aware niche*: `Goose`, `opencode`, and other agents that integrate with editors via the Agent Client Protocol (§12) are worth tracking specifically on protocol fit, not just on maturity. Agents that speak it natively compose with future editor surfaces in ways that vendor-flavored extensions can't. Right pick if you anticipate moving editor frequently or want one agent that follows you across IDEs.

Worth knowing: `LiteLLM` and `OpenRouter` aren't alternatives to `opencode`. They're the routing layer underneath multi-vendor agents. `LiteLLM` is a self-hosted proxy that translates between vendor APIs; `OpenRouter` is a hosted API gateway with one key for hundreds of models. If you're driving a multi-vendor agent against several providers, you'll usually interact with one of them as the connection layer.

`PyGPT` is the local-only option when data sovereignty makes cloud APIs unworkable. Not a CLI agent — a desktop GUI assistant — but listed here because the niche is project-shape agent work, local-only for data-sovereignty reasons. Supports local models via `Ollama` and `llama.cpp` alongside cloud providers, with MCP integration, plugins, and computer-use. Reach for it when the data must stay on the machine; it loses to `Claude Code` on reasoning quality, and sovereignty is the reason to accept that.

### When I'd reconsider

I'd start using a multi-vendor agent if I needed to compare model output on the same task systematically (rather than ad-hoc, one prompt at a time across two CLI sessions), or if vendor-pricing or availability swings made a single-vendor commitment risky. Neither has been true so far: `Claude Code` and `Codex` give me enough of a two-vendor comparison via running them side by side that adding a multi-vendor router on top hasn't earned its place.

## Choosing among them

The picks and alternatives from §10a and §10b, cut by scenario:

| Scenario | Pick | Why |
|:--------------------------------------------|:-----------------------------|:-------------------------------------------------------|
| Daily agentic work in this stack | [Claude Code]{.tool} or [Codex]{.tool} (§10a) | The two I run; the §12–§14 tooling here assumes them |
| One agent across many providers, or local models | [opencode]{.tool} (§10b) | Largest multi-vendor community; dozens of providers, including `Ollama` endpoints, in one configuration |
| Small reviewable edits with a clean history | [Aider]{.tool} | Every change lands as a `git` commit; robust with cheaper models |
| Long-context repository questions, web-grounded research | [Gemini CLI]{.tool} | Open source; Google Search grounding; whole-repository context window |
| Automating workflows beyond code | [Goose]{.tool} | MCP-driven recipes across external systems; Linux Foundation governance |
| Data that cannot leave the machine | [opencode]{.tool} or [Aider]{.tool} + [Ollama]{.tool}; [PyGPT]{.tool} (§9b) | Local model endpoints; sovereignty over capability |

## Cloud-spawned coding agents: out of scope, with a boundary

A separate surface worth naming explicitly so that the guidance above isn't assumed to transfer: cloud-spawned coding agents that run on remote infrastructure rather than as a local CLI process. They exist, they are growing, and they are not what this section covers. The guidance in §10a and §10b is for local CLI agents, and several of its assumptions stop holding when the agent moves to remote infrastructure.

Concretely: data leaves the local sandbox the moment a cloud-spawned agent reads it, so §13's local data-permissions story changes shape. Credentials need to be reachable from the remote agent, so the `op`/`gopass` injection pattern in §2 needs to be replaced (or extended) by whatever credential surface the cloud agent exposes. Repository access goes through cloud APIs or remote SSH rather than the local working copy, so the `.git/`-and-worktree assumptions in §1b and §16 don't carry. And the agent may open PRs autonomously rather than handing diffs back for local review, which moves the review step from `git diff` to GitHub's PR UI and changes who sees what when.

For sensitive consulting or human-subject data: treat this surface as out of scope until the project has explicitly approved it, with credential, data-boundary, and review-model decisions made for that specific project. The picks in this section don't transfer there by default.

# 11. Browser and Computer-Use

Browser and computer-use tools sit at the boundary between analysis and the outside world. They're useful for ad-hoc research, documentation lookup, downloading public data, scraping public sources, checking rendered `Quarto` reports, and automating repetitive browser tasks. They aren't how I fit statistical models, but they matter when work crosses from local analysis into anything that touches a remote site or service.

This section covers three layers, easy to conflate:

- *User-facing products* you click and interact with: `Claude in Chrome`, `ChatGPT agent mode`, `Atlas`, `Comet`.
- *Agent-driven browser automation* exposed as an MCP tool server: `Playwright MCP`.
- *Model-level computer-use APIs* that code calls to drive a browser or screen programmatically: `Anthropic Computer Use`, OpenAI's `CUA`.

§11a is the product layer, §11b the MCP tool-server layer, and §11c the vendor API layer.

## The scraping ladder

For pulling data off a website, browser automation is the last resort, not the first. Escalate down this ladder and stop at the first tier that works — each lower rung is heavier, slower, and more easily blocked.

1. *A structured source* — always try this first. A documented API, a bulk export (data dump, sitemap, RSS feed), or the *hidden JSON endpoint* the page itself calls: open the browser's network panel and look for the `fetch`/XHR request that hydrates the page with data. Hitting it directly is far more robust than parsing rendered HTML, and often turns an apparent "need a browser" job back into a plain HTTP request.
2. *Static fetch and parse* — the committed-pipeline default when there's no API. Pull the raw HTML with an HTTP client and parse it (§8a covers the Python stack). Works whenever the content is in the initial page rather than rendered by JavaScript.
3. *A scripted headless browser* — raw `Playwright` (§11b's alternatives), only when the content is genuinely JavaScript-rendered or the task needs interaction like login or infinite scroll. Even here, prefer capturing the page's network JSON over scraping the rendered DOM.
4. *An agent-driven browser* — `Claude in Chrome` (§11a) or `Playwright MCP` (§11b), for one-off or low-volume extraction, for recon (working out a site's structure, or finding the hidden endpoint that moves the job back to tier 1), and for human-in-the-loop flows. Highest per-page cost; never for bulk or repeatable collection.

Tiers 1–3 are committed pipeline code; tier 4 is an agent action, not part of the saved scraper. The tools this section covers sit at the bottom — reach for §11a and §11b only when the rungs above genuinely can't do the job.

## Browser surface

The agent drives *your* logged-in browser via a `Chrome` extension. Lowest-friction setup, uses your real browser session and cookies, but slower per action (one LLM call per step) and non-deterministic.

### Role

The browser surface is for ad-hoc tasks where the agent needs to interact with web pages as you would: research a topic across several sites, work through a vendor's settings UI, summarize a long page, fill in a form. Because the agent is using your real browser, you get the benefit of being already logged in everywhere (no separate auth, no fresh session, no captcha-induced friction). The cost is that everything is non-deterministic (the agent decides each step from screenshots) and slow (every action is an LLM call), so it's the wrong tool for anything you'd want to repeat reliably.

The flip side of using your real browser: the blast radius is high. Don't point a browser agent at client portals, IRB-sensitive systems, private datasets, or authenticated research systems unless the project has explicitly approved that use (cross-references §13a agent permission settings, including its data-permissions subsection).

### macOS / Ubuntu: Claude in Chrome

`Claude in Chrome` is Anthropic's official browser extension (currently in beta for paid plans; check Anthropic's docs for current availability since this changes quickly). You install it, sign in with your Anthropic account, and the agent can read, click, and navigate websites in your browser. Currently the most actively-developed option in this niche.

### Alternatives and why not

`ChatGPT agent mode` is OpenAI's counterpart, integrated directly into `ChatGPT`. `Claude in Chrome` extends your existing browser; agent mode instead runs in OpenAI's environment but can take browser actions on your behalf. Different shape, same target use case.

`ChatGPT Atlas` is OpenAI's full browser-with-agent product. Different shape again: it's a separate browser, not an extension. Worth tracking if you'd consider moving your browsing life into a model-vendor's browser, but not a like-for-like replacement for an extension on your existing browser.

`Comet` (Perplexity) is the third AI-native browser in the category. Same "separate browser, agent built in" shape as `Atlas`.

### When I'd reconsider

If `Codex` ships a comparable Chrome extension, that becomes a viable option for users primarily working with that vendor. The category is moving fast: re-evaluate every six months.

## Browser automation (MCP)

The agent drives a `Playwright`-controlled browser via MCP (the runtime tool-integration protocol, defined in §12). Programmatic, fast, deterministic per call. Configurable for either a fresh isolated browser process or a persistent profile depending on what the task needs.

### Role

`Playwright` is Microsoft's open-source browser automation library. It controls `Chrome`, `Firefox`, or `Safari` programmatically with click, type, wait, and screenshot primitives. These are the same primitives web scrapers and automated test suites have used for years. The `Playwright MCP` server wraps that automation API as MCP tool calls, so any MCP-aware agent (`Claude Code`, `Codex`, `opencode`, `Goose`) can drive a browser without you writing the `Playwright` script yourself.

When an agent needs to do browser work that's repeatable, scriptable, or runs in the background (scraping data, running automated checks, navigating a workflow many times), `Playwright MCP` is the working tool. It bridges traditional automation-as-code (you write the `Playwright` script) and agentic browser work (the agent figures out the steps): the speed and determinism of `Playwright` with agent reasoning on top.

### macOS / Ubuntu: Playwright MCP

Microsoft's official `Playwright MCP` server (`microsoft/playwright-mcp`) is what provides this. Install it, register it with your agent, and the agent gains browser-automation capabilities. Cross-platform.

### Alternatives and why not

`browser-use-mcp` and similar third-party MCP servers wrap `Playwright` or `Puppeteer` (Google's older browser automation library, to which `Playwright` is the successor) with minor variations. Same niche, sometimes more permissive default config, sometimes simpler API surface. Worth knowing about, but the official Microsoft `Playwright MCP` is the safer default.

Raw `Playwright` (no MCP, you write the script yourself) is a different category. That's automation-as-code; the agent doesn't drive the browser. Right pick when you have a stable, repeatable workflow you want to encode and run many times. The two shapes are complementary: prototype the workflow with `Playwright MCP` and an agent, then once it's stable, freeze it into raw `Playwright` code.

### When I'd reconsider

If a clearly better headless-browser MCP emerges with capabilities `Playwright MCP` lacks, I'd switch. The category is reasonably stable today; this section is more durable than §11a and §11c.

## Computer-use API

The agent takes screenshots of your desktop and controls the mouse and keyboard at the OS level. Highest blast radius of the three approaches in §11. The safety pattern: run in a heavily isolated environment (per §13c heavyweight container), never on a desktop that has sensitive data or credentials present. Experimental for routine use today.

### Role

Computer-use is what you reach for when the task can't be confined to a browser. Driving a desktop application, OS-level operations, UI-testing native software: anything that needs the screen, not just a browser tab. Because the agent has the full desktop, the blast radius is unbounded (it can click anything, type anywhere), so this section should always be paired with §13c heavyweight sandboxing — run it inside a container, never on a machine that has sensitive data or credentials in scope.

### macOS / Ubuntu: Anthropic Computer Use

`Anthropic Computer Use` is the most accessible option for code-driven use. You can drive it from your own code, run the controlled environment in a container, and get full screen-and-keyboard control. It isn't yet a tool for routine everyday use, but it's past the proof-of-concept stage.

The host OS barely matters here: the API drives a container on §13c's runtime (in WSL2 on Windows, or native on Linux), not your real desktop.

### Alternatives and why not

OpenAI's `CUA` (Computer-Using Agent) is the API-exposed version of the same model behind its user-facing products (`ChatGPT agent mode` and `Atlas`, per §11a). Reach for `CUA` directly when you want to drive a screen from your own code rather than through OpenAI's product UI.

`Google Project Mariner` is Google's experimental computer-use agent. In limited preview as of now, so not yet a real choice for serious work.

Maturity caveat: all three are still finding their footing, so today's pick is provisional — `Anthropic Computer Use` is the most hackable and accessible, which is why it's primary.

### When I'd reconsider

Constantly. This is the section most likely to shift. Re-evaluate every six months until the field settles.

# 12. Integration and Memory

Not a tool category but the integration layer: the two open protocols that connect an agent to things beyond its own process, and the memory systems that let it remember across sessions. The markdown files that brief agents are a convention rather than a tool, and the convention — `AGENTS.md` plus the `STATUS.md` / `TASKS.md` pair, five meta-files per project — lives at §17b.

## The integration layer: MCP and ACP

Two open protocols connect an agent to things beyond its own process, and they point in opposite directions. *MCP* (Model Context Protocol) is the agent reaching out to tools and data. *ACP* (Agent Client Protocol) goes the other way: it is how an editor reaches the agent. Pairing them here is deliberate, because MCP is how an agent reaches a database or a browser, ACP is how an IDE reaches an agent, and one agent can speak both.

MCP is the open standard for extending an agent with new tools and data sources at runtime. An MCP server exposes a set of capabilities (read these files, query this database, fetch from this API, scrape this page) and any MCP-aware agent can use them. The protocol matters because it commoditizes the integration layer: instead of every agent shipping its own bespoke filesystem connector or database connector, they all use the same protocol, and the connectors are a separate ecosystem.

When MCP pays off, concretely: browser automation (`Playwright` MCP, per §11b) so the agent can drive a real browser, local file/document search MCPs for navigating large directories, a GitHub MCP for issue / PR / release operations, and a `Postgres` or Supabase MCP when the agent needs to query a project database. When it doesn't pay off: when the data is already in files the agent reads naturally, or when the MCP server adds latency without adding capability the agent didn't have via tool calls.

In my own use, the MCP server I run with any regularity is `Playwright MCP`, and only for the bottom rung of the scraping ladder (§11) — launched scoped to the project that needs it, not globally. Everything else I add per project, and only when one is genuinely worth the cost of having it there. The standing set stays near-empty on purpose: each server is a permission grant (below), so the fewer always-on, the smaller the blast radius.

*MCP security caveat.* Each MCP server is effectively a permission grant, not a benign plugin. The MCP specification itself warns that MCP enables arbitrary data access and code-execution paths, and requires consent, data-privacy controls, and tool-safety review. Treat each server you install with the same scrutiny as any other tool that touches your data: if it can read project files, query a database, or call an external API, consider what happens if a prompt-injection attack convinces the agent to use it for something you didn't intend.

*MCP server credentials.* Any MCP server that needs credentials (a Postgres MCP for a project database, a GitHub MCP for repository operations, a calendar MCP for scheduling) should pull those credentials from the same §2b + §2c pipeline as the agent itself. Don't put database URLs, API keys, or service tokens directly in MCP config files: those files often live in the project repository or in `~/.config/`, neither of which should hold plaintext credentials.

*ACP, the editor side.* `Zed` drove the Agent Client Protocol and lists `Claude Code`, `Codex`, `Gemini CLI`, `Goose`, and `opencode` as ACP integrations (§9a); `Jupyter AI` uses it to wire mainstream coding agents into the notebook (§9a). The payoff is portability: an agent that speaks ACP natively plugs into any ACP-aware editor, where a vendor-flavored IDE extension only works inside its own host.

Today this stays a watch item rather than a pick. Editor↔agent integration in my stack is still the official `Claude Code` and `Codex` extensions (§9b), vendor-specific by design. If ACP becomes the lingua franca for editor↔agent integration, the calculus shifts toward choosing agents on protocol fit rather than vendor — the axis I'd re-evaluate §9b and §10b on. For now it is the durable-looking interoperability layer worth tracking, not something I run.

## Memory systems

Memory is the cross-session leg of context. Vendors have shipped competing approaches: `Claude Code`'s auto-memory system (a file-based memory written to disk and loaded across conversations), `ChatGPT`'s memory feature, `Cursor`'s memory. There are also open-source frameworks (`mem0`, `Letta`, `Honcho`) that try to provide portable memory that's not vendor-locked. The landscape isn't settled, which is why the table entry stays general rather than naming a specific tool.

The pragmatic move today: use `Claude Code`'s auto-memory for personal preferences and accumulated context with that agent, treat AGENTS.md as the source of truth for *project-scoped* context (because file-based context is portable across agents while vendor memory isn't), and revisit the open-source memory frameworks when the field consolidates.

Two habits keep memory honest. Prune entries that have gone stale — a renamed file, a reversed decision — because the agent acts on them without flagging that they are memories, which is worse than no memory at all. And never let memory become the source of truth for a project fact: when memory and a project file disagree, the file wins, and a rule you find yourself relying on memory to keep belongs in `AGENTS.md` instead.

# 13. Permissions and Sandboxing

Limiting what an agent can do. The framing is "what can this agent touch if it goes wrong" rather than "is this agent malicious": agents make mistakes, and this section is what keeps a mistake from being unrecoverable. Three subsections: the agent's own permission settings (§13a), the lightweight OS sandbox its commands can run inside (§13b), and the heavyweight container for the cases that warrant it (§13c).

Across those three mechanisms sit four distinct layers of control, and the clearest way to keep them apart is by the guarantee each one adds. Deny rules (layer 1, *guardrails*) stop routine mistakes and drift at the rule. Approval prompts (layer 2, *attended review*) put a human in front of plausible-but-wrong changes before they land. The kernel sandbox (layer 3, *hard isolation*) bounds what a command can touch and where its network traffic can go. The container (layer 4, *containment*) is the floor for the cases the other layers don't reach. The first two layers both live in the agent's permission system, so §13a carries layers 1 and 2, §13b is layer 3, and §13c is layer 4.

![](figures/security-layers-guarantee.svg){#fig-security-layers-guarantee fig-alt="The four security layers and the guarantee each adds: deny rules and approval prompts bind a cooperating agent; the kernel sandbox and the container hold regardless. Captioned: each layer covers a failure mode the others don't, and none substitutes for another." above="18pt" below="16pt"}

The split that matters most is between the first two layers and the last two. Rules and review bind a *cooperating* agent: a deny rule matches the command as the agent wrote it, and a prompt depends on a human reading it. Both are excellent against accidents, but neither is a wall. Two facts make the distinction live. First, an approval prompt gates an action before the content arrives: approving "run the scraper" happens before the page exists, so whatever protection holds afterward cannot depend on asking again. Second, once a session has read content you wouldn't fully trust (a scraped page, a third-party README, an issue thread), interactive approval becomes the least dependable control, because every subsequent request looks plausible; the failure mode is the click-fest described in §13a. What stays dependable at that point are the content-independent bounds: what the session can read at all, where its traffic can go, which writes fail outright. Those are the lower two layers, enforced by the kernel or the container boundary rather than by rule-matching or attention. The corollary I keep coming back to: anything that must never happen should not be promptable.

Seen by reach instead of by guarantee, the same mechanisms nest as concentric containment around the agent: the permission layer gates individual commands, the OS sandbox restricts the running process's view of the filesystem and network, and the container isolates the whole environment. "When to use which" at the end of the section says which combination to run. Two cross-cutting supports sit alongside: secrets kept out of scope so a mistake can't leak them (§2b/c), and version control plus deterministic pipelines so a mistake stays reversible and inspectable (§1b, §14, §15).

![](figures/security-layers-reach.svg){#fig-security-layers-reach fig-alt="The same layers seen by reach: permission settings, OS sandbox and container as concentric containment around an agent action. Captioned: cross-cutting, secrets are kept out of scope and a mistake stays reversible and inspectable." above="18pt" below="16pt"}

## Agent permission settings

### Role

In the intro's layer terms, this subsection carries layers 1 and 2: the deny rules that stop known-bad actions at the rule, and the approval prompts that put the remaining judgment calls in front of a human. The OS sandbox (per §13b) and the container (per §13c) are walls around whatever these two layers let through; neither replaces them. The tension this layer manages: an agent that asks before every action turns approval prompts into a click-fest, and you stop reading. An agent with no restrictions can do real damage. The permission system is how you keep routine work flowing without friction, while dangerous actions still demand explicit confirmation and the worst actions are forbidden outright. This subsection is a record of the choices I made and why, so future-me (or someone starting fresh) doesn't have to re-derive them — and because the settings files themselves are a poor place to keep that reasoning, I also keep it in a companion `SANDBOX.md` (described below).

### Different defaults across vendors

The starting defaults differ between the two agents, and have shifted across versions of each — check current docs if a specific default matters to your setup. The current state:

`Claude Code`: the sandbox is currently *off by default*. Opt in by setting `sandbox.enabled` to `true` in `~/.claude/settings.json`. Without that, the agent has full filesystem and network access (limited only by per-tool approval prompts).

`Codex`: the sandbox is currently *on by default* in its `workspace-write` mode — the project directory is writable, nothing else is, and there's no network. You loosen those restrictions via named profiles.

Practical consequence: as installed, `Codex` starts locked down; `Claude Code` starts open. After configuration, both can land in similar postures, but the starting point differs and the configuration files are different shapes.

### Configuration surfaces

`Claude Code`: one file at `~/.claude/settings.json`. It covers the permission rules (`allow` / `ask` / `deny`, reaching both shell commands and the file-editing tools) and the `sandbox` block: filesystem write bounds, the `allowedDomains` network allowlist, and the short `excludedCommands` exemption list.

`Codex`: two files. `~/.codex/config.toml` covers sandbox modes, filesystem permissions per profile, network domains, environment-variable exclusions. `~/.codex/rules/default.rules` covers command-level `forbidden` / `allow` policies with justifications attached to each rule.

### Three tiers of command policy

The useful distinction isn't binary "allow / deny." It's three tiers — recorded below as the posture I run after several years of tuning; a newcomer starts tighter, prompt-heavy, and relaxes one rule at a time as trust in the boundaries grows:

- *Routine pass-through* — daily-use tools that run without prompts. With the sandbox on, this tier mostly needs no list: anything that stays inside the kernel bounds runs promptless, so the tools I use constantly (`Rscript`, `R`, `python`, `pip`, `pandoc`, `xelatex`, `make`, `bash *.sh`, local `git`) pass through *because they are sandboxed*, not because they are exempt. What remains on Claude's `excludedCommands` list is the short set that cannot run inside the sandbox at all: `git push*` / `git pull*` / `git fetch*` and `gh *` (GitHub authentication reads the macOS keychain, which the sandbox blocks), `op *` (talks to the 1Password app), and `pueue *` / `pueued *` (talk to the §7 daemon). The forbidden list (last tier) still carves out destructive subcommands like `git push --force`. `Codex` reaches the same posture by *not* listing routine tools in any rule and letting its sandbox bound them. Each exemption runs outside the kernel bounds entirely, so entries have to earn their place; how the list got this short is taken up in §13b.
- *Prompt before running.* The middle tier, and where the two agents' shapes converge. `Codex` supports standing `decision = "prompt"` rules for commands you want to consciously approve (deploys, DB-state changes); I don't keep standing prompt-rules on either agent. The middle tier I actually use is *escalation*: a sandboxed command that needs more than the bounds allow fails, the agent asks, and I approve that one invocation. Package managers I touch a few times a month (`npm`, `yarn`, `brew`) live there deliberately — at that frequency, reading one prompt beats holding a standing exemption open. `Codex`'s `on-request` approval policy is the same mechanism, so the postures stay aligned without standing prompt-rules on either side.
- *Forbidden* — commands too destructive to delegate. Both agents agree on the set, grouped by category. Git: `git push --force`, `git reset --hard`, `git clean -fd`, `git branch -D`, `git rm -rf`, `git checkout --`. Filesystem: `rm -rf`, `sudo`. Tooling: `gh repo delete`, `gh release delete`, `pip uninstall`, `npm uninstall`, `brew uninstall`, `npm publish`.

A representative `Codex` `prefix_rule` entry from `default.rules`:

```
prefix_rule(
    pattern = ["git", "reset", "--hard"],
    decision = "forbidden",
    justification = "Never destructively reset a worktree from an agent
session. Use patch review, commits, or manual reset instead.",
    match = ["git reset --hard", "git reset --hard HEAD~1"],
)

prefix_rule(
    pattern = ["git", "push"],
    decision = "allow",
    justification = "Routine remote push. Destructive variants
(--force, etc.) are covered by separate forbidden rules.",
    match = ["git push", "git push origin main"],
)
```

The `justification` field is what matters for future-me: the rule and the reason for it travel together, so when I come back to a rule six months later I don't have to rediscover why it's there.

The Claude side of the same posture lives in `~/.claude/settings.json`. The `permissions` rules cover the destructive blocks and the file-editing channel (deny and ask). The `sandbox` block carries the kernel-enforced bounds (filesystem writes, outbound network) plus the short exemption list. And `failIfUnavailable` makes a missing sandbox a hard failure rather than a silent unsandboxed fallback:

```
{
  "permissions": {
    "deny": [
      "Read(~/private/**)",
      "Edit(~/.local/share/chezmoi/dot_config/agents/codex-rules/**)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Bash(rm -rf*)",
      "Bash(sudo*)"
    ],
    "ask": [
      "Edit(~/.config/agents/claude-settings.json)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "failIfUnavailable": true,
    "network": {
      "allowedDomains": [
        "github.com", "api.github.com", "pypi.org",
        "files.pythonhosted.org", "cran.r-project.org"
      ]
    },
    "filesystem": {
      "allowWrite": [
        "~/.cache/uv", "~/.local/share/uv",
        "~/.local/share/chezmoi",
        "~/Library/Application Support/pueue"
      ],
      "denyWrite": [
        "~/.config/agents/claude-settings.json",
        "~/.config/agents/codex-rules"
      ]
    },
    "excludedCommands": [
      "git push*", "git pull*", "git fetch*",
      "gh *", "op *", "pueue *", "pueued *"
    ]
  }
}
```

### Filesystem boundaries

A `Read` deny keeps a chosen directory off-limits — point it at whatever should never be pulled into context, such as a private-files tree or confidential client data, so the agent can't read it even by accident. `Codex` adds wildcard denies for secret-shaped filenames: `**/.env*`, `**/*secret*`, `**/*Secret*`, `**/*credential*`, `**/*.pem`, `**/*.key`, `**/*.p12`, `**/*.pfx`. Write access is scoped to `<workspace-root>/` and project-specific directories; everything else is read-only or denied.

### Two write channels, two gatekeepers

A subtlety that is easy to miss: `Claude Code` sends its two ways of writing files through different layers. Shell commands pass through the kernel sandbox (layer 3, per §13b): a write outside the allowed directories fails at the kernel, with no prompt and no way for the agent to talk its way past. The built-in file-editing tools never touch the shell, so the kernel never sees them; their gate is layers 1 and 2 — the deny rules you've written for the editing tools, plus a per-edit approval prompt showing the diff.

This is not a loophole; it is a deliberate split between an unattended control and an attended one. Shell commands run without prompts precisely *because* the kernel bounds what they can touch. File edits can reach further, but each one outside the standing allow rules is reviewed by a human before it lands. Each channel covers the other's weakness: the sandbox keeps promptless work contained (layer 3), the edit prompt keeps wider-reaching writes visible (layer 2).

Two practical consequences follow:

- *A hard "never touch this file" must cover both channels.* A filesystem deny in the sandbox configuration stops shell writes; only a deny rule on the file-editing tools (`Edit(path)` / `Write(path)` in `permissions.deny`) stops the other channel. A path covered on one channel but not the other degrades from "blocked" to "blocked unless I approve a prompt" — fine for some files, not for credentials or the agent's own policy files. Whenever I protect a file, I now check both lists.
- *Keep the sandbox write-allowlist narrow, and let occasional edits flow through the prompted channel.* Widening the allowlist to spare yourself an approval prompt trades a reviewed write for an unreviewed one. My dotfiles illustrate the division of labor. The `chezmoi` source tree (per §2a) is on the sandbox allowlist, so the capture-commit-push cycle runs without prompts. The applied files under `~/.config/` are not, so edits there arrive through the file-editing tools instead, and those rules grade by sensitivity: a standing allow for the ordinary metadata files, a per-edit `ask` (prompt with diff) for the agent policy files, and a hard deny on those files' `chezmoi` sources. The deny covers both channels.

`Codex` does not have this split: its filesystem permission profile applies to every write the same way, whichever internal tool performs it. One `Codex` value covers what `Claude Code` needs two settings for — worth remembering when mirroring a policy across both agents (per the cross-agent alignment below).

### Network allowlist

Package registries (PyPI, CRAN). GitHub (`github.com`, `api.github.com`, `codeload.github.com`, and the `raw`/`objects` `githubusercontent.com` hosts). Model API endpoints that project code calls. Project databases when a project needs them (`api.supabase.com`, `*.supabase.co` for Supabase-backed projects). The two agents' lists are maintained separately and need not match; after the §13b narrowing, Claude's is the leaner one — a registry I rarely install from (npm) now takes a per-session approval instead of a standing entry. Anything else needs explicit approval per session.

### Environment-variable exclusions (Codex)

Even if a secret is set in your login shell, you can prevent the agent's child processes from seeing it. The `shell_environment_policy.exclude` list strips named variables from the environment `Codex` hands to commands it runs: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GITHUB_TOKEN`, `SUPABASE_*`, `AWS_*`, `AZURE_*`, `GOOGLE_APPLICATION_CREDENTIALS`, `DATABASE_URL`. A second line of defense against accidental leaks.

### Codex profiles (per-task posture)

`Codex` lets you define multiple named profiles and pick one when you start a session:

- `auto` — no approval prompts, project directory writable, no network. For unattended local work where I trust the task scope.
- `guarded` — project directory writable, but untrusted commands prompt. For local automation that should ask before running unfamiliar commands.
- `networked` — adds allowlisted network access. For dependency installs, web scraping, or GitHub work.
- `readonly` — read-only filesystem, no writes. For audits and codebase questions.

The pattern is to pick the most-restricted profile that still lets the task complete, rather than running one permissive profile for everything. A read-only audit shouldn't have write permissions; an unattended overnight run shouldn't have network access unless it needs it.

### Cross-agent alignment

The destructive-command policy is intentionally mirrored between `claude-settings.json` and `codex-rules/default.rules`. The top comment in `default.rules` makes this explicit:

> These rules intentionally mirror the destructive-command denials in `claude-settings.json` where `Codex` has an equivalent command-policy surface.

When you run multiple CLI agents (per §10's recommendation to run both), aligning the worst-case policy across them keeps the security posture coherent. Without alignment, a less-trusted agent could end up with permissions a more-trusted agent doesn't have.

### Keeping the rationale in one place

The settings files hold the *values*; they're a poor place for the *reasoning*. `settings.json` on the Claude side is strict JSON, which has no comment syntax at all, so there's nowhere to write a *why* beside a deny rule. `Codex`'s TOML does take comments, and I use them for local notes, but the reasoning that matters most is cross-cutting: it is about the *relationship* between the two agents' policies — the mirrored destructive-command set, the shared filesystem denies, the threat model they jointly defend against — and that doesn't live naturally inside either single file.

So I keep a `SANDBOX.md` next to the settings that records the *why*, not the values: the design priorities, the principles behind the rules, the layered model that opens §13, a `Claude Code` ↔ `Codex` equivalence table that maps one agent's knobs onto the other's, and the operational gotchas (which changes need a restart, which config values are deprecated aliases for which). Keeping it there means the reasoning travels with the configuration instead of living only in my head.

The test of whether such a file is worth keeping: when I change a permission a year from now, does it tell me why the setting was the way it was? It is the same split as the per-rule `justification` field above, lifted from the single rule to the whole policy — settings answer *what*, `SANDBOX.md` answers *why*.

### Data permissions

A different angle on the same permission layer: not what *commands* the agent can run, but what *data* the agent is allowed to read even when it has the credentials to do so. For statistical consulting and research work, the bigger risk is often an agent sending client material, unpublished results, or human-subject data to a cloud model or MCP server that the project's data-handling rules don't allow.

Two questions to answer for each project explicitly:

- *What can the agent read?* Some projects allow agents to operate on de-identified data; others can't allow agents to touch raw data at all. The default for sensitive material is *no agent access* unless the project's data-handling rules explicitly approve it.
- *Can project data be sent to external model providers?* Cloud models receive whatever context the agent passes them. For client material, IRB-sensitive data, or unpublished results, the answer is often "no": meaning either the agent runs on a local model only, or the agent works on de-identified extracts, or the agent doesn't touch the data at all.

The rule belongs in the project `AGENTS.md` (per §17b), where the agent reads it on entry. A concrete example to adapt:

> Agents may edit code and documentation, but may not open raw human-subject data unless the session explicitly says the data are de-identified and approved for cloud-model use.

The mechanism for enforcement lives in the permission layer this subsection has been describing: filesystem denies on data directories, network denies on cloud model APIs when the project's data shouldn't leave the machine. The rule states the policy; the permission file encodes it.

*Auth, privacy, and billing path.* A separate concern from "can the agent see this data" is whether the *vendor* may see and train on it — and that depends on which auth surface the agent is using. The pattern is stable even as the terms shift: consumer-plan sign-ins train by default unless an opt-out is set, while API, gateway, and workspace-tier paths exclude training by their terms and add audit and residency controls, so API or enterprise auth is the clean posture for sensitive work. Vendor terms have shifted multiple times; for consulting engagements or any project covered by NDA, IRB review, or client confidentiality, *verify the opt-out state at the start of the project* and document it, along with which auth path is in use, in the project `AGENTS.md`.

### Cross-references

- §2b secrets and credentials: the credential half of the picture this subsection covers the data-permission half of.
- §12 MCP security: MCP servers fall under the same scrutiny: installing one is a permission grant, and credentials should flow through the §2b + §2c pipeline.

## Sandboxing (lightweight): OS-native process sandbox

### Role

Lightweight sandboxing is an OS-level safety net that the agent CLI can wrap around its own execution. When active, the agent runs with a restricted view of the filesystem (typically only its working directory, not your `~/.ssh/` or other sensitive folders) and the network (typically only the model API, not your local services). Two important caveats. First, what is actually restricted varies by product, platform, and the agent's approval-mode setting. `Claude Code`, `Codex` and `Gemini CLI` do not all enforce the same boundaries, and an agent's "auto" mode allows more than its "ask first" mode. Second, even with the sandbox active the agent can still touch any sensitive data that sits *inside* the allowed area, so the project data boundary in `AGENTS.md` (per §13a's data-permissions framing) matters as much as the OS sandbox itself. Check each agent's actual permission model rather than assuming the restrictions are the same.

In the intro's layer terms this is layer 3, and what it adds over §13a is the kind of guarantee. A deny rule binds the command as the agent wrote it. A prompt binds whatever a human catches. The kernel binds what the process can actually do. This is the one layer whose protection doesn't depend on the session behaving as expected: the bounds hold no matter what the agent has read, which is why the layer matters most for work that ingests content you don't control (scraping, third-party repositories and their issue threads, documents from outside your team). One residual stays open even here. A domain the session may read from can also receive data inside the requests sent to it, so the network allowlist cannot stop information flowing out to the same place it flows in from. For ingestion-heavy work the load-bearing control is read scope: run the work in a project that can read nothing else, so the worst case is bounded by that project's own contents.

### What the pass-through list costs

The guarantee above has a scope question attached: which commands actually run inside the sandbox? For `Claude Code` the answer is everything *not* on the `excludedCommands` list. An excluded command runs outside the kernel sandbox entirely: no filesystem bounds, no network allowlist. The deny rules still apply, but they match the command text as written and nothing more. Every exemption therefore trades the bound for convenience, and a list that grows casually hollows the layer out: exclude the general-purpose interpreters (`python`, `Rscript`, `bash *.sh`) and most of what an agent runs in a working session never meets the kernel bound at all — layers 1 and 2 carry the whole load. My own configuration started exactly there, with broad `tool *` wildcards for every daily tool; I have since reversed it.

Exemptions are convenient, not required. A sandboxed command that needs more than the sandbox allows fails loudly with an "operation not permitted" error, and the agent can then request a one-off attended run — a prompt per invocation rather than a standing hole. So the question for each tool is whether it actually fails in-sandbox, and testing my daily workloads showed that most don't: `R` and `Rscript` (script writes, CRAN installs, `Stan` model compiles), `python` and `pip` (environment setup, package installs), the full `pandoc` → `xelatex` document build, `make`, `bash` scripts, and local `git` all run clean inside the bounds, and all came off the exemption list. Two narrow write grants stopped the frequent cases prompting: `uv`'s interpreter store, and `chezmoi`'s state file so the §2a capture loop runs fully sandboxed. The rarely-used package managers (`npm`, `yarn`, `brew`) came off as well; per-invocation approval is the right channel at their frequency. What remains exempt is §13a's short list, the tools that genuinely cannot run sandboxed: the authenticated GitHub commands (`git push` / `git pull` / `git fetch`, `gh`) whose credential helper reads the macOS keychain the sandbox blocks, `op` (talks to the 1Password app), and `pueue` (talks to its daemon). That closes the asymmetry with `Codex`, whose sandbox has always bound every command: layer 3 now covers the bulk of both agents' command traffic.

### macOS: Seatbelt (sandbox-exec)

`Seatbelt` is Apple's built-in sandbox (the underlying command is `sandbox-exec`). `Claude Code` and `Codex` invoke it internally on macOS when you've enabled sandboxing in the agent's config (per §13a). You're not configuring `sandbox-exec` directly (the agent is), but knowing the layer is there helps when something the agent tried to do gets blocked unexpectedly.

### Ubuntu / Windows (WSL2): the agent's Linux sandbox

There's no single OS-native sandbox every agent CLI uses the way `Seatbelt` does on macOS. Instead each agent applies its own Linux sandbox when you enable sandboxing in its config (§13a), the same way it invokes `Seatbelt` on macOS. On bare-metal Linux that's the whole story. On Windows, running the agent inside `WSL2` adds an outer wall — a Linux subsystem isolated from your main Windows environment — and the agent's own restrictions apply inside it. As on macOS you don't drive this layer directly: the agent picks it. How much it restricts varies by product, so treat `WSL2` isolation as a practical containment pattern and verify the agent's actual behavior if a project's data-handling rules require a hard guarantee.

### Alternatives and why not

There aren't realistic alternatives at this layer for agentic CLI use today: this section is essentially "whatever sandbox the agent has chosen to use internally." A handful of OS-level tools exist (`AppContainer` on Windows, `firejail` and `bubblewrap` on Linux, low-level kernel mechanisms like `seccomp`), but none of the major agent CLIs use them. You don't pick the lightweight sandbox; the agent picks it for you. Your §10 agent choice and your §13a permission settings determine what's actually running here.

### When I'd reconsider

If the agent vendors stopped offering sandboxing, I'd start scripting `sandbox-exec` invocations by hand. That hasn't happened and probably won't, so this section is more about knowing the layer exists than actively configuring it. The configuration that you actually drive happens at §13a.

## Sandboxing (heavyweight): container runtime

### Role

For most consulting analyses, you don't need a container runtime in the loop. You need reproducible R/Python environments (per §8) and a renderable report (per §3a). Heavyweight sandboxing applies in narrower cases: running untrusted code (building from a fresh dependency tree, executing third-party code, running a destructive migration) or §11c computer-use (the agent should drive a desktop in a container, not your actual desktop). Containers are a real tool, just not a daily one for most analyses.

What you pick at this layer is the *runtime*: the engine that builds and runs containers. The containers themselves serve two functions in this stack — walled-off execution when blast radius warrants it (this subsection), and frozen project environments for reproducibility (§15d's project containers, defined by a `Dockerfile` and brought up on the same engine). One runtime, installed once, reached two ways: a throwaway `docker run` when the job is containment, the project's `Dockerfile` built and entered when the job is reproducibility.

### macOS: Colima

`Colima` is an open-source (MIT) command-line container runtime for macOS. One Homebrew install (`colima`, plus the separate `docker` command-line client), one `colima start`, and the standard Docker socket is available to everything that expects one: `docker run`, `docker compose`, and §15d's project containers. There is no GUI, which suits this stack: setup and debugging are shell commands, so agents can do both (per §10), and after `colima start` the layer is invisible — you interact with `docker`, not with `Colima`. It manages a lightweight Linux virtual machine through `Lima`, an open-source virtual-machine manager, and runs the real Docker engine inside it, so compatibility is the engine's own rather than an emulation. It is free for any use, professional included: no paid seats, no license terms to clear with an employer.

### Ubuntu / Windows (WSL2): Docker Engine

On Linux the open-source Docker Engine runs *natively*, with no VM layer at all: you install it with `apt` and run it as a normal `systemd` service. On Windows the managed Linux VM already exists in the form of `WSL2`, which removes the need for a `Colima`-style VM manager: install the same Docker Engine inside the `WSL2` distribution and the Docker socket lives in the same shell where the terminal stack (§5) and the agents (§10) already operate. Either way the licensing distinction is the point: Docker *Engine* is Apache-2.0 and free at any organization size: it is Docker *Desktop*, the GUI wrapper, that requires a paid subscription beyond 250 employees or \$10M in revenue. The engine-only path gives up the GUI and its managed updates: no loss in a terminal-first, agent-managed setup. (macOS needs a VM manager of its own, which is why `Colima` is its pick.)

### Alternatives and why not

`OrbStack` is the commercial macOS option: a closed-source GUI product with a bundled Docker-compatible engine, marketed on speed (fast file sharing into containers, low battery drain). I haven't used it, and two facts keep it out of the pick: the GUI and desktop integration it charges for buy nothing in a workflow where agents handle setup and debugging from a shell, and its license requires a paid seat for professional use, including at non-profit and government employers.

`Docker Desktop` is the incumbent GUI on both platforms and the lowest-friction path if you want a managed installer and automatic updates. The same license caveat applies in stronger form: free only below 250 employees and \$10M in revenue, government entities pay regardless, and the education exemption targets instructional use — verify before assuming it covers research or administrative work. On Windows it wraps the same `WSL2`-hosted engine you can install directly.

`Rancher Desktop` is the free, open-source GUI alternative (Apache 2.0, from SUSE), with built-in `Kubernetes`. On macOS it manages a `Lima` virtual machine — the same substrate `Colima` uses — so the choice between them is mostly a GUI versus the command line. Right pick if you want a graphical container view without license terms.

`Podman` (the `podman machine` command-line tool, with `Podman Desktop` as an optional GUI) is the security-differentiated alternative: no root-level engine process, containers run under your own user account. The trade is Docker-API compatibility through a shim socket, which is where the edge cases live for `docker compose` and §15d workflows. Right pick if that security model matters more than drop-in compatibility.

`Apple container` is Apple's first-party entry: open-source, Apple-silicon-only, one lightweight virtual machine per container. As of v0.11 it is not a Docker replacement — Docker-socket compatibility needs an experimental shim, and §15d-style workflows hit gaps — but a first-party tool is the likeliest future default on the platform. One to watch rather than adopt.

### When I'd reconsider

If `Apple container` reaches Docker-socket and §15d-class compatibility, the first-party tool probably becomes the macOS pick, and I'd re-evaluate then. If container work shifted from occasional (this section's framing) to daily — heavy §15d use, where file-sharing speed into the container starts to be felt — the performance-oriented commercial options would earn a benchmark and possibly a paid seat. On Windows, a teammate who wants a managed installer and clears the license terms can run `Docker Desktop` over the same `WSL2` engine; nothing else in the stack changes.

## When to use which

Three mechanisms, four layers, used together:

- *Agent permission settings* (§13a; layers 1 and 2) — configured once per machine, tuned over time. This is the daily-use surface that determines what each agent can do.
- *Lightweight OS sandbox* (§13b; layer 3) — runs around the agent automatically when configured. You check that it's enabled, and check what's excluded from it, rather than drive it day-to-day.
- *Heavyweight container* (§13c; layer 4) — reach for it when blast radius warrants: untrusted code from the internet, destructive operations, fresh dependency trees from sources you don't know. Edge-case for routine analysis, first-line for §11c computer-use.

You can also run all three at once. They serve different purposes and each one closes a different failure mode. For *project isolation* (the project `Dockerfile` — the reproducibility side of the container story), see §15d.


# 14. Agent Telemetry

What is the agent actually doing, and what is it costing me? The layer between "the agent ran" and "I understand what it ran." Once agents are running in the background or in parallel (per §16), instrumentation becomes necessary to track them.

Telemetry answers two questions for each agent: *what did the agent do* (which prompts, which tools, which responses, in what order) and *what did the agent cost* (tokens in, tokens out, by model, over what time window). The two halves use separate tools. Because §10 recommends running both `Claude Code` and `Codex` and the tooling isn't identical for the two, this section splits accordingly: §14a covers Claude, §14b covers Codex.

*Cost tracking* matters continuously for any paid usage. A single agent session can range from a few cents to tens of dollars depending on how much context the agent loads and how many tool calls it makes, and the price tag isn't visible inside the session itself. Without a running view of spend, you can't tell whether the way you use the agent matters: being deliberate about prompts might save almost nothing, or it might be the difference between an affordable workflow and a runaway monthly bill. A live cost view reduces that uncertainty.

For subscription-billed use (`Claude Pro`/`Max`, `Codex` via a `ChatGPT` plan), cost arrives as *usage windows* rather than dollars — a rolling five-hour window plus a weekly cap, shared across that vendor's surfaces — and both CLIs expose where a session stands in-session (`/usage` in `Claude Code`, `/status` in `Codex`). API-billed use has no such windows; it meters per token, with spend limits instead. The tools below add what the built-ins don't: history, per-project breakdowns, and full traces.

*Trace capture* (recording the full sequence of prompts, tool calls, and responses to a local log file) is more situational. Turn it on when debugging surprising agent behavior, when running parallel agents (per §16) and needing to reconstruct what each one did, or when a session went sideways and you want to understand how.

## Telemetry for Claude

### macOS / Ubuntu: ccusage + claude-trace

*`ccusage`* is the cost-tracking half. It reads the session logs `Claude Code` already writes locally and reports token spend through a family of subcommands: `daily` / `weekly` / `monthly` / `session` breakdowns, a `blocks` view that tracks usage against Claude's five-hour billing windows (`blocks --live` for an active monitor), a per-model cost breakdown (`--breakdown`), and a `statusline` mode that feeds usage into `Claude Code`'s status bar. It is a shell tool, not an in-session command. `npx ccusage@latest` runs it with nothing installed for a quick look, but it's worth installing (an npm package, per §1a's installer table) once you're checking spend regularly, so the subcommands are one word away rather than prefixed with `npx` each time. Either way it works retroactively on every past session. One reading note for subscription plans: the dollar column is *API-equivalent* pricing, what the same tokens would have cost at metered API rates — not a bill. On `Pro`/`Max` the marginal cost of a session is zero; the column is still the number that tells you whether the subscription beats API billing for your usage (per §13a's billing table).

*`claude-trace`* is the trace-capture half: it records full agent invocations (prompts sent, tool calls made, responses received) to a local log you can review later. It wraps the session from launch — install the npm package (`@mariozechner/claude-trace`; the scoped name matters, since several tools share the short name) and start sessions with `claude-trace` instead of `claude`. Artifacts land in the project's `.claude-trace/` directory as a browsable HTML transcript. When something went sideways in a session, the trace shows what actually happened versus what you remember happening.

*Privacy caveat on trace capture.* Trace logs can record prompts, file paths, code, tool calls, analysis details, and possibly secrets if guardrails fail. They should be treated as confidential project artifacts, not ordinary application logs. Don't ship them to a shared logging service without thinking about what's in them, don't commit them to a repository, and don't leave them on a shared filesystem. Cross-references §13a's data-permissions framing: the same boundary that decides whether project data can leave the machine applies to the trace logs *of* that data.

### Alternatives and why not

*Anthropic Console* is the authoritative billing source for `Claude Code` but is not actionable for "what did the agent actually do this session." Use it as the truth source for what you're being charged; use `ccusage` / `claude-trace` for the moment-to-moment story.

*`Claude Code` hooks* are the DIY-minimalist option: pre- and post-tool-call shell hooks that record every agent invocation to a file. Simple, transparent, roll-your-own. Right pick if you want full control and you don't mind writing the analysis tooling yourself.

## Telemetry for Codex

### macOS / Ubuntu: ccusage (codex mode) + OpenAI Platform dashboard

The cost-tracking half is the same tool as §14a: `ccusage` also reads `Codex`'s local session logs (`npx ccusage@latest codex`, parsing `~/.codex` the way it parses `~/.claude`), so one local cost view covers both agents — by day, month, and session, with the same API-equivalent-pricing reading note. One coverage caveat: `Codex` only began writing token counts into its session logs in late 2025, so older sessions report nothing.

*OpenAI Platform usage dashboard* (`platform.openai.com/usage`) is the authoritative billing view for API-billed use: token spend by model and time window, one URL away. Use the dashboard as the truth source for what you're charged and `ccusage` for the moment-to-moment, per-session story.

*OpenTelemetry export from Codex* is the trace-capture half: `Codex`'s CLI ships official OpenTelemetry support. Configure an OTLP endpoint in `~/.codex/config.toml`, point it at a local OTel collector (e.g., `otelcol-contrib` writing spans to a file), and you get a per-call trace log analogous to what `claude-trace` produces. A lighter alternative when you just want a quick record: `Codex`'s structured log files (check the current path under `~/.codex/`), which capture invocation metadata without setting up a collector.

The same privacy caveat from §14a applies: traces can contain secrets, file contents, and identifying data. Don't ship them off the machine without auditing what's in them.

### Alternatives and why not

*Hook-based logging* at the shell level (intercepting `codex` invocations via a wrapper script) works the same way it does for Claude: roll-your-own but full control over format.

### When I'd reconsider

`Codex` telemetry is currently lighter-touch in my setup than the Claude side because `Codex` is the lower-volume agent. If I started running multiple parallel `Codex` agents across worktrees and needed to reconstruct what each one did, I'd wire up the OTel export above as a standing capture rather than an occasional one, or write a wrapper script that tags each invocation with project and session metadata.


# 15. Reproducible pipelines and human QA

Two adjacent concerns the agentic workflow makes more important, not less: making sure the work runs end-to-end without an agent in the loop, and giving yourself a place to verify what the agent actually did. Both rest on the same idea: the agent helps you build the pipeline, but the pipeline runs deterministically without the agent. That separation lets you re-run, audit, and ship the work whether or not any agent is currently running.

The boundary with §8: §8 covers tooling *within* a language — how you manage one Python project's environment or one R project's packages. §15 covers orchestration *across* steps that may span multiple languages, shell commands, or hand-offs between environments. A `targets` pipeline (§15b) still lives inside a single R project (§8b); a `just` recipe (§15a) can stitch together a Python script (§8a), an R script (§8b), and a `Pandoc` call. The split is "within one language" vs. "across the project's whole execution surface."

For data-science work specifically this matters. Agents hallucinate variable names, silently modify data files, write code that uses the wrong column. None of that is malice; all of it is a routine failure mode of LLM-driven editing. A deterministic pipeline is your quality-control mechanism: if you can run the project's build command from scratch and get the same outputs each time, you have evidence the agent's changes don't break the work. If it doesn't, you have a concrete failure to debug against. The rest of this section walks through the tools and patterns that make this possible.

## General pipeline runner: just

### Role

Every non-trivial project ends up with several ways to invoke things: a command to render the report, a command to refit the models, a command to clean intermediate outputs, a command to run the tests. Without a canonical command surface, those invocations live in scattered shell-history, in README snippets, in your head, or in build scripts whose conventions nobody can remember.

A *general pipeline runner* solves this by giving every project the same named entry points (`build`, `check`, `clean`, `render`, etc.), defined in one file at the project root. Nobody has to remember which script to run: an agent walking into the project finds the same canonical commands a human would, and a new collaborator has one file to read to see how the project builds.

The general runner is the *front door*. It doesn't do the data work itself; for that, finer-grained pipeline runners specialized to each language (introduced in §15b/c) track which intermediate outputs are current and re-run only what's stale. The general runner wraps those calls (one named entry point per stable workflow) so that the same project-wide command works whether the underlying step is a Quarto render, an R pipeline run, or a Python script. §15b and §15c show what this composition looks like in practice for `targets` and `Snakemake` respectively.

### macOS / Ubuntu: just

`just` is a modern command runner with a friendly syntax. Single Rust binary (install via `Homebrew`), declarative recipes in a `justfile`, parameter passing that doesn't fight you, and clear error messages when something goes wrong. The case for `just` over `make`: you probably don't have decades of `make` muscle memory; what you'd gain from `make`'s universality you lose to its syntax fussiness (the tab-vs-space gotcha, quoting rules, esoteric phony-target conventions).

### Alternatives and why not

`make` is the universal baseline. Ships with macOS Command Line Tools, every Linux distro, and `WSL2`. If you already know `make` well, the muscle memory is worth more than `just`'s friendlier syntax. For someone new to this category, `just` is easier to learn; the trade-off is universality.

`task` (taskfile.dev) is similar in spirit to `just`: YAML-based, modern, cross-platform. Right pick if you prefer YAML over `just`'s custom syntax.

`Quarto` overlaps with this section when your *output* is a document. It's more than a pipeline runner, but the doc-build workflow uses `Quarto` in pipeline-runner shape. Cross-references §3a.

### When I'd reconsider

If a project's pipeline grows past ~10 stages with conditional dependencies and parallel branches, I'd switch to a real pipeline runner: `targets` (per §15b) for R-only work, `Snakemake` (per §15c) for `Python` or multi-language pipelines.

## Data-pipeline runner (R): targets

### Role

A data-pipeline runner does what §15a's general runner does but at a finer-grained level. Instead of "I'll run the whole `build` recipe end to end," it tracks which intermediate outputs are still current and re-runs only the affected steps when something upstream changes. The classic example: a six-step pipeline (load → clean → fit model A → fit model B → render report → compose figures) where a change in step 3 should re-run steps 3–6 but skip steps 1–2 that haven't changed. The runner reasons about that dependency graph for you.

For R data-analysis specifically, the question is *what counts as a change*. The easy answer is to watch the project at the *file* level: has any source file been touched since the last run? Easy to implement, language-agnostic, but it over-rebuilds. If you tweak a prior inside a model script, the file changed and the runner refits: fair enough. But if you only changed a comment in that file, the runner *still* refits, because the file's contents are different. For Bayesian workflows where each fit takes multi-hour Stan runs, that's real waste. The R-native answer is to track the actual *content* of the R objects and functions a step uses, so a comment change is a no-op and a prior change refits exactly the affected branch. That tool is `targets`.

### macOS / Ubuntu: targets

`targets` (formerly `drake`) is the R-native pipeline runner. You declare a manifest in `_targets.R` listing each step as an R function call; `targets` builds a dependency graph, hashes the content of each R object so a step only re-runs if its inputs actually changed, and parallelizes independent steps via R's parallel-execution backends (`future` for general parallelization, `crew` for cluster execution). For Bayesian work where you want to run the same model across a grid of priors, likelihoods, or sample restrictions, the `tar_map_rep()` helper generates one target per combination from an R tibble of parameter rows. Other built-ins: resume-on-interrupt (a fit that crashed mid-way can pick up where it left off), dependency-graph visualization (`tar_visnetwork()` opens an interactive graph showing which steps are current and which are stale), and inspection of individual targets in your interactive R session (`tar_load("my_model")` pulls a saved fit back into the workspace so you can poke at it).

The migration cost is real: `targets` wants your pipeline expressed as functions called from a manifest, not as top-to-bottom imperative scripts. For a fresh project, write it that way from the start. For an existing script-based codebase, you can adopt `targets` incrementally by wrapping each script as a single target (`tar_target(model_4a, source("4a-model.R"))`); you get the dependency graph, parallelism, and resume-on-interrupt without any refactor. Then refactor scripts into functions one at a time as you touch them, gaining finer-grained dependency tracking on those steps.

### Alternatives and why not

`Make` works for R but tracks file mtime, not R object content. Every comment edit and whitespace tweak invalidates the fit. For Bayesian models where a re-run costs hours, this is real waste. Right pick only for trivially small R pipelines where the simplicity outweighs the over-rebuild cost.

`Snakemake` (per §15c) is the cross-language alternative. Right pick if your pipeline mixes R with `Python` or shell stages.

`Quarto` overlaps when your *output* is a document with embedded R chunks. Right pick when the pipeline IS the document.

### When `just` is enough

Before adopting `targets`, check whether stage cost justifies the manifest refactor. `targets`'s value is four things: skip-if-up-to-date with content-level dependency tracking, resume-on-interrupt for crashed fits, parallel scheduling of independent steps, and interactive inspection of saved targets via `tar_load()`. The cost is rewriting scripts as functions called from a manifest (the incremental "one target per script" path softens this but doesn't eliminate it). For a fast-running frequentist pipeline — load CSVs, run a few regressions, render plots, each stage finishing in seconds — none of those features are load-bearing. Re-running end-to-end is cheap. For Bayesian work the calculus inverts: a single Stan fit takes hours, a sweep across priors or likelihoods can take days, and every `targets` feature pays for itself many times over. Skip-if-up-to-date saves real compute, resume-on-interrupt rescues a crashed multi-hour run from starting over, and `tar_load()` lets you compare fits without re-running them. Without expensive stages, `just` plus plain R scripts does the same work with less overhead.

### Combining `just` + `targets` in practice

When the calculus tips toward `targets`, `just` doesn't go away — it sits in front of `targets` as the project's canonical command surface. Recipes in the `justfile` wrap `targets` invocations, so the project-level commands (`just build`, `just status`, `just clean`) stay uniform regardless of what's underneath. The shape:

```
# justfile
build:
    Rscript -e 'targets::tar_make()'

status:
    Rscript -e 'targets::tar_visnetwork()'

clean:
    Rscript -e 'targets::tar_destroy()'
```

Project-specific recipes follow the same pattern. A new collaborator running `just build` doesn't need to know R or `targets`; an agent walking into the project finds a canonical entry point that survives whatever engine sits beneath it. The Python equivalent — `just` over `Snakemake` — follows the same pattern (§15c).

### Surviving agent sessions (with `pueue`)

`tar_make()` runs as a foreground R session, and the `crew` workers it spawns for parallel work live inside that session — kill the parent process and the whole pipeline dies. For runs that need to outlive the terminal, the agent session, or an SSH connection (multi-hour Stan fits, overnight simulation sweeps), wrap the `tar_make()` invocation in `pueue` (§7):

```
# .run-pipeline.sh is a one-line wrapper: Rscript -e 'targets::tar_make()'
pueue add -- bash .run-pipeline.sh
```

`pueue` keeps the R session alive across terminal exits, Claude Code restarts, and SSH disconnects. Status (`pueue status`), logs (`pueue log <id>`), and waits (`pueue wait <id>`) all work normally. For a `crew`-parallelized pipeline, the worker pool stays inside the wrapped R process — `pueue` is keeping the foreman alive, not the workers individually.

One macOS gotcha when an agent drives the pipeline rather than a human: R busy-spins one core at 100% with no output when its `stdout`/`stderr` are wired to `/dev/null` or a pipe, which is what an agent harness does. (A human's terminal, and `just` or `quarto`, always has a *tty* — the terminal device an interactive session attaches to — so a person never sees it.) Running through `pueue` sidesteps this for a plain `Rscript` call, since the daemon writes each task's output to a real log file rather than a pipe. `tar_make()` needs one more flag. By default it runs the pipeline inside a `callr` orchestrator subprocess whose output is a pipe, so that subprocess spins even under `pueue`. Passing `callr_function = NULL` runs the orchestrator in the `pueue` task's own process, where that log-file sink applies. That fixes the spin while keeping `crew` parallelism intact: `tar_make(callr_function = NULL, use_crew = TRUE)` still runs the workers in parallel.

The assembled call chain, top to bottom:

![](figures/detachable-pipeline.svg){#fig-detachable-pipeline fig-alt="The detachable pipeline: a just front door over a targets or Snakemake runner, submitted through pueue so the job outlives the session." above="18pt" below="16pt"}

### When I'd reconsider

If a project starts mixing R with `Python` or shell stages, I'd switch to `Snakemake` (per §15c). The cross-language model is what `Snakemake` is for.

## Data-pipeline runner (Python): Snakemake

### Role

Same category as §15b (a runner that tracks which intermediate outputs are current and re-runs only the affected steps), but for pipelines whose code isn't pure R — Python data prep, shell pre-processing, mixed-language steps where the answer "use `targets`" doesn't apply. The trade-off is the granularity of dependency tracking: §15b's `targets` reasons about R-object content, which is precise but R-only; this section's `Snakemake` reasons about input and output *files*, which is universal across languages but coarser (a re-saved file with identical content but different timestamps can still trigger a rebuild).

`Python` doesn't have a clear `targets` equivalent at scale: `Snakemake` is the closest standard, with `Dagster` and `Hamilton` as the asset-graph alternatives if file-level dependency tracking isn't enough.

### macOS / Ubuntu: Snakemake

`Snakemake` is the data-science-flavored pipeline orchestrator. Python-integrated (rules can call inline `Python`), declarative (you declare what each step produces: its inputs, its outputs, and the command that turns one into the other, and `Snakemake` builds a *directed acyclic graph* of step-to-step dependencies and figures out which order to run them in), file-based dependency tracking (only re-run what's changed), and good support for parallelism and resource limits. `Snakemake`'s `expand()` helper gives you combinatorial sweeps across parameter grids: fitting one model across N specifications becomes a single rule with wildcards instead of N near-identical rules. Heavily used in bioinformatics but applies cleanly to any structured data workflow.

### Alternatives and why not

`Nextflow` is the cluster/cloud-deployment alternative: a different paradigm (channel-based dataflow rather than rule-based) designed for HPC and multi-cloud distribution (`SLURM`, `AWS Batch`, `Kubernetes`). Right pick only when you're actually deploying to one of those targets. For paper-scale work that lives on a single machine, the channel-wiring overhead buys nothing.

`Dagster` is the closest `Python` equivalent to `targets` in semantics: "software-defined assets" are content-versioned, and materialization caches on code version plus dependencies, so the dependency tracker understands `Python` objects and functions rather than just files. The cost is that it's a production-data-engineering framework (UI, scheduling, sensors), heavier than `Snakemake` and oriented at data-platform teams rather than solo analysts. Right pick when you want targets-shaped semantics in `Python` and you're willing to learn a bigger framework.

`Hamilton` is the lightweight version of the same idea: a `Python` library where you write functions and the parameter names define the DAG. Function-graph dependency tracking inferred from signatures rather than declared. Newer and less proven than the others, but in design the closest match to `targets` for analysts who want function-graph semantics without `Dagster`'s framework weight.

`dvc` (data version control) overlaps from a different angle: pipeline runner plus versioning of data and model artifacts. Right pick if data-versioning is the bigger problem and pipelines are the way you get there.

### When `just` is enough

Before adopting `Snakemake`, check whether the dependency-graph layer actually buys you anything. `Snakemake`'s value is two things: skip-if-up-to-date and automatic parallel scheduling of independent rules. The cost is declaring every step's inputs and outputs, learning the rule syntax, and maintaining the `Snakefile` as the project evolves. If your pipeline checkpoints internally and you re-run from checkpoints rather than from scratch, skip-if-up-to-date is wasted — you've already encoded "what needs redoing" in the checkpoint format. If your stages are strictly sequential, parallel scheduling is wasted too. The threshold for adopting `Snakemake` is the graph itself: fan-out across many inputs, fan-in to a merge step, expensive intermediate outputs you don't want to rebuild every run. Without those, `just` plus numbered scripts plus your existing checkpoint discipline does the same work with less overhead.

### Combining `just` + `Snakemake` in practice

The same composition applies on the Python side: `Snakemake` is the engine, `just` is the front door, and `just` recipes wrap `Snakemake` invocations so the project's command surface — `just build`, `just status`, `just clean` — looks identical to its R-side counterpart. The shape:

```
# justfile
build:
    snakemake --cores 4

status:
    snakemake --summary

clean:
    snakemake --delete-all-output --cores 1
```

The benefit is uniformity across projects: an R project and a Python project that both expose `just build` give the same operator experience and the same agent-discoverable entry point, even though the engine and the language underneath differ.

### Surviving agent sessions (with `pueue`)

`Snakemake` also runs as a foreground process until the pipeline completes. For long runs (overnight scrapes, large parameter sweeps), wrap the `snakemake` invocation in `pueue` (§7):

```
pueue add -- snakemake --cores 4
```

`pueue` keeps the Snakemake process alive across terminal exits and agent-session resets; Snakemake's own job parallelism (`--cores N`) continues to work inside the wrapper.

### When I'd reconsider

If a project actually deploys to a cluster or cloud (`SLURM`, `AWS Batch`, `Kubernetes`), `Nextflow` is the right paradigm. If targets-shaped object-level dependency tracking becomes essential in a `Python` project, `Dagster` or `Hamilton` are the asset-graph routes. 

## Project isolation

### Role

The pipeline runner (§15a/b/c) is the deterministic recipe. Project isolation is the deterministic *environment* the recipe runs in: the exact language runtimes, system libraries, and OS-level dependencies your work needs, packaged so they can be recreated months or years later. This matters most for data-science work where a paper, a model, or a long-running analysis needs to rebuild identically far in the future. The mechanism is the same container that §13c's runtime builds and runs (`Colima` on macOS, the `WSL2`-hosted Docker Engine on Windows). The goal differs — reproducibility, not security. The runtime gets picked once, in §13c; what this subsection picks is the format the environment is defined in.

### macOS / Ubuntu: Dockerfile

A `Dockerfile` at the project root is the environment specification: a pinned base image (`rocker/r-ver` for `R` projects, `python:3.12-slim` for `Python`), the system libraries the project needs, then the language-level restore from the repository's lockfile (`renv::restore()` or `uv sync`, per §8). `docker build` once, `docker run` with the project directory mounted to work inside it, and both wired into the §15a `justfile` (`just build-image`, `just shell`) so the commands stay uniform across projects. Nothing new gets installed: the engine is §13c's pick, the format is a text file in the repository, and agents can write, build, and debug it entirely from the shell — describe the environment ("`R 4.6`, the packages in `renv.lock`, the system libraries `Stan` needs") and have the agent draft the file. Papers can ship with theirs, so a reviewer years later rebuilds the analysis environment exactly as it was.

When a project needs services beside the code (a database, a queue), `compose.yaml` declares the set; for single-container analysis work the `Dockerfile` alone is enough.

The same file, byte for byte, builds and runs against §13c's engine wherever you are — natively on Linux, in WSL2 on Windows — so there's one project repository, one environment definition, and no platform-specific isolation story for a mixed team.

### Alternatives and why not

`Devcontainers` are this same pick wrapped in a standardized specification: `devcontainer.json` references (or contains) the `Dockerfile` and adds lifecycle hooks, composable feature installs, and — the main payoff — IDE integration, so `VS Code`-family editors and cloud platforms (GitHub Codespaces, Gitpod) can open *inside* the container. The spec is open (containers.dev, donated out of the `VS Code` ecosystem in 2022) and has a command-line implementation that needs no IDE. `Claude Code` also documents a reference devcontainer for running an agent with relaxed permissions inside a container wall (per §13). Reach for it *on top of* the project's `Dockerfile` when someone wants an IDE inside the environment (the §9a `VS Code`-on-Windows path) or cloud development environments; skip the extra layer when the terminal is the interface, which is this stack's working model.

`conda` environments are the data-science-specific reproducibility tool. They isolate package sets but not system dependencies (BLAS libraries, compilers, OS-level dependencies). Right pick for `Python` + `R` workflows that don't need full OS isolation, and for teams already deep in the `conda` ecosystem.

`pixi` (per §8a) is the lighter alternative for projects that need conda-forge native dependencies without full container overhead. When the friction is "this `Python` project has compiled scientific dependencies that don't resolve cleanly under plain `uv`," `pixi` is more often the right answer than going to a full container.

`uv` with `pyproject.toml` + `uv.lock` is the lightest option, already in §8a. Right pick for pure-`Python` projects without complex system dependencies. Less reproducible than a container (no OS-level guarantees) but trivial to set up and zero overhead.

`Nix` flakes are the most reproducible option: declarative environments down to the package versions, with bit-for-bit reproducibility guarantees. Tied into §1's `Nix` alternative, with the same cognitive cost. Right pick for someone already in Nix-land or for archival-grade reproducibility.

`Apptainer` (formerly `Singularity`) is the container format of academic HPC clusters, where a root-level Docker engine is typically not allowed: single-file images, rootless by design, and able to convert Docker images, so the project `Dockerfile` remains the source of truth. Right pick only when the work runs on a university cluster; on a laptop, the Docker path above is simpler.

### When I'd reconsider

Containers are the easy path: well-documented, with pre-built base images for almost any stack. They're good for onboarding and medium-term reproducibility, but they aren't archival magic on their own: Docker image tags drift, apt repositories move, CRAN/PyPI versions become unavailable, system mirrors change, CPU/GPU assumptions shift. For genuine long-term reproducibility you need additional layers: pinned image *digests* (not tags), language-specific lockfiles (`renv.lock`, `uv.lock`, etc.), and ideally archived artifact caches or a preserved container registry.

The threshold is the time axis: a `Dockerfile` handles the typical "rebuild this paper's environment a year or two from now" case well when paired with proper lockfiles. `Nix` is worth its complexity for archival-grade reproducibility (work that needs to rebuild in 2040), regulatory provenance contexts, or for someone who's already invested in `Nix` for other reasons. For everything in between, a container with pinned digests and lockfiles is the practical answer; for everything below, plain `uv` / `renv` is enough.


## Data and artifact boundary

A separate concern from pipeline structure: in any data-science project, the agent needs to know what it may edit and what it must treat as inviolable input. Pipelines (§15b, §15c) describe *how* things get rebuilt; this subsection describes *what counts as source* and what counts as derived output, so the agent doesn't overwrite raw data or commit large derived artifacts. The rule belongs in the project `AGENTS.md` (per §17b) and is enforced by the permission layer (§13) plus the storage choices below.

A workable default boundary for a data-shaped project:

- *Raw data is read-only and never edited in place.* It lives in `data/raw/` or equivalent, with filesystem permissions or a permission-layer rule that prevents the agent from writing to it. The pipeline reads it, never modifies it. Re-acquiring raw data is a separate, deliberate act (a download script, a fresh extract from a system of record), not something an agent does as part of normal work.
- *Intermediate artifacts are derived and rebuildable.* Whatever the project's pipeline writes: `data/processed/`, `data/intermediate/`, and the like. The agent can edit the *code* that produces these and rerun the pipeline; it should not hand-edit the derived files themselves, because the next pipeline run will overwrite the change without record. Gitignore them.
- *Final outputs are committed and reviewable.* Rendered reports, figures, tables, and the canonical analysis-ready dataset that downstream consumers read. Committed to `git` so changes show up in PR diffs and so old states are recoverable. Kept small enough that committing them isn't painful — see the large-file note below.
- *Configuration and metadata are committed.* Pipeline definitions (`_targets.R`, `Snakefile`), `pyproject.toml`/`pixi.lock`/`renv.lock`, `AGENTS.md`, `STATUS.md`, `TASKS.md`, `METHODOLOGY.md`, `PLAN.md`, the project `Dockerfile`. The reproducibility contract.

When raw data or final outputs are too large for `git`, the working pattern is `Git LFS` for binary artifacts that fit the LFS model (occasional updates, single large blobs — figures, PDFs, model weights) and `DVC` for datasets and intermediate artifacts that are versioned alongside the pipeline (DVC tracks data dependencies the same way `targets` and `Snakemake` track code dependencies, and uses cloud storage rather than the git server as the backend). The pick depends on what you're versioning: LFS for "git but with big files," DVC for "data versioning with pipeline awareness."

The reason this boundary deserves a named subsection rather than being implicit: an agent without an explicit boundary will treat raw data as just another file to edit. The damage shows up as a corrupted source file the pipeline silently uses for the next ten runs, or as a 200MB derived file accidentally committed and now permanently in the repository's history. Both are recoverable, both are tedious, and both are avoidable by stating the boundary up front.

## Validation, unit tests, and model checks

### Role

A pipeline tells you the analysis ran. It doesn't tell you the analysis is correct. Statistical QA needs explicit checks the pipeline can't make on its own: data dimensions, missingness assumptions, factor levels, model formulas, contrast coding, prior choices, convergence diagnostics, posterior predictive checks, sensitivity analyses, and rendered-output sanity checks. These aren't tests for code-that-might-be-buggy. They're checks for analysis assumptions that would silently change the result if they shifted.

### macOS / Ubuntu: testthat + project assertions (R), pytest + pandera (Python)

There are two layers worth running. The *unit-test* layer is automated code that calls one function at a time with known inputs and checks that the output matches what you expect: programmer's way of asserting "this small piece of code does what I claim it does." A separate test runner invokes the tests and reports which pass and which fail. The *statistical-guardrail* layer is the assertions that catch analysis assumptions silently shifting (an upstream data change that drops a factor level, an unexpected missingness pattern, a model formula that no longer parses what you think it parses). Different shape from a unit test, but the same protective intent.

For R-heavy projects, `testthat` is the unit-test runner. Plain project assertions cover the statistical-guardrail layer: `stopifnot()` calls at the top of each script, simple checking helpers, or a small `assertions.R` helper sourced where needed. You don't need every analysis to become an R package; you do want tests for reusable code and explicit checks for assumptions that would silently change the result.

For Python-heavy projects, `pytest` is the unit-test runner and `pandera` is the data-contract tool: it lets you express schema constraints on dataframes (column types, nullability, value ranges, uniqueness, dependencies between columns) and validate them before the analysis runs.

For both, a *lint-and-format gate* runs alongside the test layer. *Linting* is automated checking for style violations (overlong lines, unused imports), likely typos (undefined variables, mistyped names), and common code-smell patterns: programmer's spell-check for code. *Formatting* is automated rewriting of whitespace and layout to a consistent style (indentation, spacing around operators, line wrapping), so the same code edited in two different editors produces the same diff. Together they keep noise out of code review and catch a class of typo-bugs early.

The tooling: `ruff` for `Python` (linting + formatting in one Rust binary, replaces older `flake8` / `black` / `isort` setups), `lintr` + `styler` for R. The umbrella that runs them on every commit is `pre-commit`: a *tool-agnostic* framework (installed via Python but doesn't dictate the project's language) that runs whatever hooks you declare in `.pre-commit-config.yaml`. It works equally well for an R-only project, a Python-only project, or a mixed-language project. None of these tools catch statistical errors, but they catch the kind of stylistic noise that masks real issues during review.

These checks should run from the project entrypoint (`just check`, etc., per §15a), not from one person's IDE state, so that anyone (collaborator, agent, or future-you on a different machine) runs the same checks with the same command. Whether they run on every commit, on every push, or only before sharing work is a workflow choice; what matters is that the canonical command exists.

### Alternatives and why not

`Great Expectations` is the heavier alternative for broader data-quality suites. Useful when data quality is itself a production concern (multi-source ingestion pipelines, data products with SLAs); usually overkill for paper-scale work where `pandera` schemas plus a few `stopifnot()` calls cover the same ground at a fraction of the setup cost.

Statistical-modeling-specific diagnostics (`bayesplot` for posterior predictive checks, `performance` for model diagnostics in R, etc.) aren't a separate concern: they're tools you call inside `testthat` or project-assertion blocks. They sit inside the validation layer rather than competing with it.

### When I'd reconsider

If a project's data quality becomes a primary concern (multi-source data ingest with conflicting schemas, regulatory provenance requirements, data products with stated quality SLAs), I'd consider `Great Expectations`. For everyday consulting analyses, `testthat` + `pandera` + `pre-commit` is enough.

## Cross-implementation verification

The pipeline tools earlier in this section make the analysis *reproducible*: the same code, re-run, gives the same result. That cannot catch an error baked into the implementation itself — if the agent misread the design and built the wrong model, the pipeline reproduces that wrong answer perfectly on every run. The strongest check on whether a result is *correct*, not merely reproducible, is to re-implement the analysis independently in a different software stack and compare, keeping the two implementations genuinely independent: I drive the two sides with *different* agents, ideally different vendors — `Claude Code` on one, `Codex` on the other (§10) — each working from the written design in `METHODOLOGY.md` and `PLAN.md` (§17b) rather than from each other's code, with §16's worktrees and panes as the natural harness, one pane per implementation and a different agent in each. Deterministic results should match to numerical precision; sampling-based results agree within Monte Carlo error, with the tolerance stated before comparing so a near-miss isn't quietly rationalized into a pass. Agreement rules out implementation error, not specification error, and a second implementation roughly doubles the cost of the analysis — so I save it for the results that carry a claim.

## Reviewing what the agent changed

The pipeline rerun above is the primary check on an agent's work: it's deterministic, covers the whole project, and doesn't depend on my attention. Reading the diff is the secondary check, and I reserve it for the pieces where a passing build wouldn't catch a problem — model code, data handling, contrast coding, the runner files themselves. I don't read every line an agent writes; I read the parts where a silent, plausible-looking change would do real damage, and I let the rerun catch the rest.

When I do read a diff, I lean on two tools. `delta` is the everyday one. It's a *pager* — the program that shows long output a screen at a time, with scrolling and search, that `git diff` and `git log` pipe their output into — with syntax highlighting and a side-by-side layout that make an ordinary diff easier to read. It's a drop-in replacement for the default pager, so it applies to every `git diff` without my asking.

For the harder question — whether a change altered behavior or just moved code around — a line diff is the wrong lens. `difftastic` is the right one: it parses the code and compares the structure rather than the text, so it sees through the reformatting, re-indentation, and moved blocks agents produce constantly and surfaces what actually changed in meaning. That is precisely what I want to know about an agent's edit to a model or a data step. It covers R and Python (among ~20 languages), and I keep it on an on-demand alias (`git dft`) rather than the default `git diff`, since the structural view is more than everyday reading needs and it falls back to a line diff on very large or unparseable files.

Going through a set of changes interactively is a different job, and `lazygit` is the tool: a visual interface over the same `git` operations that lets me review and commit a *hunk* at a time (a hunk being one contiguous block of changed lines, the unit `git` itself works in), so I can keep the parts of an agent's work I want and drop the rest. Two more review surfaces sit outside the terminal. When an agent opens a pull request — the cloud-spawned case in §10 — the review moves to `gh pr diff` or the GitHub web UI with inline comments. Working IDE-first (§9), the editor's own diff view and the agent extension's per-edit accept/reject prompt are the review surface instead.

| Tool | What it is | Reach for it when |
|:-------------|:----------------------------------------------|:-----------------------------------------------------|
| `delta` | syntax-highlighting pager | everyday reading of any `git diff` |
| `difftastic` | structural diff (compares the parsed code, not the text) | spot-checking whether a critical change altered behavior |
| `lazygit` | visual `git` interface in the terminal | reviewing and committing changes a hunk at a time |

## Running checks remotely

Once a project is shared (multiple collaborators on the same repository) or once an agent has permission to open PRs, the local `just check` and `just build` commands should also run on a remote runner so that the same checks the author runs locally also gate every PR. A short `.github/workflows/ci.yml` that runs `just check` on `push` and `pull_request` is enough: same command, same environment (via the project's `Dockerfile` or pixi lockfile), different machine. This is not a section about continuous-integration discipline, just a note that the §15a `just` entry point earns extra value once it also runs in GitHub Actions — and that *not* running it remotely turns shared review into an honor system where reviewers are expected to pull every branch and run checks themselves, which they will not do reliably. The same logic applies to other forges (GitLab CI, etc.) where applicable; GitHub Actions is the default given §1b's GitHub pick.

## The agent-detachment pattern

A few practices worth being explicit about:

- *Treat the pipeline runner file as the contract, and let the agent edit source.* Your `justfile` / `_targets.R` / `Snakefile` declares what "the build" means. Agents may *propose* edits to those files, but those changes warrant explicit human review because they alter the verification contract. The agent's routine work happens on the source files the runner calls; runner-file edits cross a different boundary.
- *`just build` (or `tar_make()`, or `snakemake all`) as the acceptance check.* Before considering an agent's work done, the full pipeline must run clean from a fresh checkout. The check isn't just "the code runs" — it's "the report renders, the expected tables and figures update, model diagnostics are inspectable, and the decision log (per `METHODOLOGY.md` and `PLAN.md`, §17b) still explains why the current model is the current model." If any of those are broken, the work isn't ready to ship.
- *Scheduled rebuilds via `cron` / `launchd` / Task Scheduler.* When the pipeline should run on its own (overnight, weekly, on a fixed cadence), schedule it directly with the OS-native scheduler (per §10's "Long-running and scheduled tasks" subsection). The agent helped you build the pipeline; the pipeline runs on its own clock from then on.
- *Separate agent-touched code from agent-untouched data.* Source code lives in version control. Raw data does not (or is managed by a tool like `dvc` that handles large or binary artifacts outside ordinary git). Agents edit code, and data is read-only from the agent's perspective. This rules out a whole class of "the agent rewrote my CSV" failure modes. The general rule: raw data are read-only, processed data are reproducible from raw, and shared outputs are committed or archived deliberately. `DVC` and `Git LFS` matter when data or model artifacts are too large or too binary for ordinary `git`; for many consulting projects, the simpler rule above is enough.
- *Pipeline as audit trail.* When an agent's session ends, the pipeline you can rerun — not the chat history — is the durable evidence of what the work actually does.

## When this matters most

Data-science papers, models that make decisions, reports stakeholders rely on: anything where "the agent helped me write this" should be invisible to the consumer of the work. The test: if a reviewer in 2030 can rerun your pipeline and reproduce the result, the work is agent-independent.

The flip side: when *not* to bother. A near-final project with a handful of remaining fits and no expected iteration is below the threshold where a runner pays off. Plain shell scripts (or running the scripts by hand) are fine when the work is one-shot and the migration cost would land on a paper that's already in review. The runner pays off on the *next* project, where you can choose the shape at the start.


# 16. Multi-Agent Orchestration

Running more than one agent at a time without them stepping on each other. The moment you have two agents trying to edit the same file or push to the same branch, you have a coordination problem. The trick is to give each agent its own bounded space (its own working tree, its own pane, ideally its own branch) so they can work in parallel without conflicts.

## Role

Multi-agent orchestration becomes useful once you find yourself starting an agent task and waiting on it before doing anything else. Two agents in parallel double your throughput on independent work; four parallel agents change the project shape (parallel feature development, simultaneous test runs, exploration plus build). The constraint is coordination (they need to not conflict), and the practical solution is `git` worktrees plus a multiplexer.

The scale to optimize for is *a handful of agents, not a hundred*. The entry-level pattern is one agent plus a review or check loop: you focus on the work, the agent drafts changes, and before merging you rerun the pipeline (§15) and read the diff on the parts that matter. That's the place to start, and it pays off well before any orchestration layer enters the picture. The advanced plateau, after you've internalized the review loop and have stable per-project guardrails (per §17b and §13), is four to six parallel agents on different parts of the pipeline: one main session driving the work, another reviewing or drafting tests, two or three subagents handling scoped pieces. That plateau is real but it is not where to begin. Running hundreds of agents is the production-data-engineering / agent-platform shape, and that's a different problem with different tools (the third-party orchestrators in this section gesture at it). The right size is "small enough that a `Zellij` layout still works, large enough that hand-rolled coordination starts to creak" — once you've grown into it.

Three layers, escalating in heaviness:

- *In-session subagents* (per §10's `Claude Code` extension points): one CLI agent session spawning subagents for scoped work. Handles a layer of orchestration before you reach for any external tooling.
- *Manual worktrees + `Zellij` panes* (this section's pick): cross-session parallelism, one agent per worktree per pane.
- *Purpose-built orchestrators* (`Container Use`): managed orchestration for when the manual approach starts to feel like more pane-juggling than the throughput justifies.

## Manual approach: git worktrees + Zellij panes

The manual approach is what I primarily use: I have run it the longest, it depends on the fewest extra tools, and it works alongside the rest of the stack rather than replacing parts of it. The pattern: each agent gets its own `git` worktree (created with `git worktree add`), each worktree runs in its own `Zellij` pane, and the agents coordinate through `git` rather than directly. When one finishes, you review its branch, merge it, and reuse the worktree for the next task.

This is "manual" only in the sense that you're operating the moving parts yourself. With `Zellij` layouts (per §6), you can declare a standard "three-agent worktree layout" that scaffolds the panes and worktrees with one command. The result is a workspace where switching between parallel agents is just switching panes, and shipping their work is normal git.

## Purpose-built orchestrators

The orchestrator landscape is still maturing. One contender worth naming as an alternative:

`Container Use` is the agent-per-container orchestration approach: each agent runs in its own container, with its own bounded view of the filesystem and its own resource limits. It's an MCP server / CLI underneath (an extension of the §12 protocol pattern rather than a standalone app), which makes it cross-platform tooling. It overlaps with §13c heavyweight sandboxing in spirit, but differs in giving each agent its own container. Right pick when you want each agent isolated from the host by default, accepting the overhead of containerization.

## macOS vs Ubuntu / Windows

On Ubuntu — including inside `WSL2` on Windows — the manual approach runs identically: `Zellij`, worktrees, and the agent CLIs behave exactly as on macOS. `Container Use` is cross-platform via MCP. The coordination problem is the same everywhere; nothing essential is lost on the second column.

## Coordination and conflict avoidance

How prescriptive the coordination pattern needs to be depends on how many agents you're running in parallel, how heavily they overlap on the same files, and how much review friction you want. The patterns below are recommendations, not strict requirements. I've worked productively for weeks with multiple agents on a single branch when their tasks didn't overlap and I was reviewing inline; I've also used the full one-branch-per-agent + review-before-merge pattern when several agents were touching shared modules at the same time. Scale the structure to the actual conflict surface, not to a hypothetical worst case.

Recommended patterns when running multiple parallel agents on overlapping work:

- *One agent owns one branch.* If two agents are committing to the same branch concurrently, they will conflict and the resolution is painful. Per-branch isolation also makes review-by-diff straightforward.
- *One agent owns one file set when possible.* Even within a branch, if two agents are writing to overlapping files, you'll hit conflicts in review. Scope the task brief to a directory or a file group.
- *Every agent gets a short task brief that states the goal, not just the code change.* "Refactor the data-loading function in `02-clean.R` to handle multi-file inputs, preserving the existing column types" is a brief; "edit `02-clean.R`" is a request. The brief is what keeps the agent from drifting onto adjacent code that shouldn't change.
- *No agent merges its own work.* A different session — or you — does the merge. Low cost, meaningful safety floor when several branches are landing in close succession.
- *Model-output changes require human inspection.* Anything that touches model fits, diagnostics, or rendered output needs human review before it's accepted, not just a passing test suite.
- *Read-only access to shared resources.* Multiple agents can read the same database, the same config, the same docs. Only one should write at a time, and writes should land via deliberate review rather than directly.
- *Cleanup between sessions.* Worktrees and branches pile up. A weekly `git worktree list` review and cleanup keeps the orchestration model sustainable.

Lighter workflows that work when there are fewer agents, less overlap, or tighter review:

- A single working branch with sequential agent sessions, each one reviewed inline before the next starts.
- One agent per branch but no formal merge gate — review the work yourself, merge directly when satisfied.
- Direct commits to `master` for a solo project where you're reviewing changes as they land anyway.

Pick the structure your conflict surface actually warrants. The list above isn't a checklist that must be followed; it's the kit you reach into when you start hitting the problems each item is designed to prevent.

## When I'd reconsider

When I'm regularly running enough parallel agents that the manual coordination overhead starts to dominate, I'd revisit the purpose-built orchestrator landscape. The field is moving fast — if a tool starts solving the coordination problem more cleanly than worktrees + panes, I'd switch. Re-evaluate every six months until the category settles.


# 17. Task Management

Two adjacent niches that are easy to confuse. The *human-native* task manager is a personal productivity tool you drive day to day, that an agent can also read and append to. The *agent-native* task planner is the inverse: a structured task surface designed for an agent to consume, with you reading and editing it. The human-native manager carries your *operational* layer — the non-code, often deadline-driven obligations (correspondence, memos, follow-ups, errands) that span your ongoing concerns — while `TASKS.md` (§17b) carries one project's build tasks. They track different objects, which is why both earn a subsection: `TASKS.md` is per-project and lives in the repo; the human-native manager is cross-concern and lives in its own store.

The distinction matters because the right tool for "what's on my plate this week" isn't the right tool for "decompose this PRD (Product Requirements Document, a written project spec) into a task tree the agent can work through." Both are tracked work; the workflows around them are different.

## Task manager (human-native)

### Role

A human-native task manager is a personal productivity tool: you create tasks, organize them by project and tag, work through them, mark them complete. The agentic angle is that the task DB should be readable and writable by an agent too, so the agent can read what's on your list this week, append new tasks discovered during a session, or mark items complete as it finishes them.

### macOS / Ubuntu: dstask

`dstask` is my pick for the operational layer: each task is a markdown file with YAML frontmatter, stored in a `git` repository. The practical consequences of that design: each task is plain text and agent-readable without invoking the CLI, the `git` repository holds the task history, sync between machines is `git push` and `git pull`, and backup is whatever you do for git. The CLI follows a `dstask add` / `dstask edit` / `dstask done` shape.

What makes it carry the operational layer cleanly is that a `dstask` store *is* a git repository, selected by the `DSTASK_GIT_REPO` environment variable (default `~/.dstask`). That turns separation between concerns into git access control: a separate store per ongoing concern, each its own repository with its own access (store = repository = access unit). I wire the switch through `direnv` (§2c): `cd` into a concern's project and its `.envrc` exports `DSTASK_GIT_REPO`, so `dstask` transparently operates on that concern's store; step out and it reverts to the personal default. That matters when concerns differ in confidentiality or in who else needs access: a confidential program's store lives in its own repository (kept off shared sync, pushed to a restricted remote), structurally separate from the personal one — a separation that tags inside a single shared store can't give you.

Two knobs, two jobs. Separate *stores* (`DSTASK_GIT_REPO`) give hard separation across confidentiality or access boundaries. *Contexts* and tags (`dstask context +x`, also `direnv`-settable via `DSTASK_CONTEXT`) give soft focus *within* a store. Reach for stores when the question is who may see what; tags when it's only filtering your own view. And mind the boundary with code: this operational layer is for non-code obligations. Code work items and cross-repo tracking belong in GitHub issues, not here. (Cross-project *content* search — "which projects touched X" — is a third thing again, and it's just `rg` across the workspace.)

### Alternatives and why not

`TaskWarrior` is the obvious alternative. It's more featureful (recurrences, urgency calculations, complex dependencies, deep tagging) and has a longer history than `dstask`. It can export machine-readable JSON via `task export`, and extensions use that surface routinely, so agents can read `TaskWarrior`. The honest case for `dstask` over `TaskWarrior` is the file-native shape: a markdown task file is something an agent can read directly without invoking the CLI, which is one less indirection. Right pick for `TaskWarrior` if you need its depth and don't mind invoking `task export` from the agent path.

`Linear` and `GitHub Issues` aren't a direct replacement for personal task tracking: they're issue trackers and project-management tools, in a different category. But they become relevant in an agentic context when agents are picking up work from issue or PR comments (cross-references §10 and §16). Worth knowing where the boundary is rather than skipping them entirely.

### When I'd reconsider

If the operational layer started to want recurrences, urgency calculations, or complex dependencies that `dstask` doesn't have, I'd switch to `TaskWarrior` — accepting the `task export` indirection on the agent path in exchange for the depth. For now `dstask`'s file-native simplicity, and the git-repo-per-concern story above, win.

## Task planner (agent-native)

### Role

An agent-native task planner is a structured task surface designed primarily for the agent to consume, while a human reviews and edits. The shape: you (or the agent) write down what needs to happen at varying levels of detail. The agent reads the structure to plan its work and updates state as it makes progress. You check in periodically to redirect or clean up.

### macOS / Ubuntu: AGENTS.md + TASKS.md

`TASKS.md` is the persistent task-tracking file at the project root, alongside `AGENTS.md`. The two compose naturally: one convention, two uses. `AGENTS.md` briefs the agent on the project, `TASKS.md` tracks the work. No extra tool to learn or maintain. Plain markdown, human and agent-readable, version-controlled with the rest of the project.

They are two of the five meta-files every project carries, whatever its shape: `AGENTS.md` (rules and pointers), `CLAUDE.md` (a symlink to it, for agents that read that name), `README.md` (the human-facing description), `STATUS.md`, and `TASKS.md`. `STATUS.md` is the current-state snapshot. It answers one question, where does this project stand right now, in one screen (40–50 lines): the stage and a last-updated date, the main result so far, what's in motion, what's blocked and on whom, the standing facts an agent would otherwise hunt for (current N, the spec in force, the version number, the production branch), and the watch items. Rewritten in place as the state changes, never appended: it describes where the project is, not how it got here. The agent reads it first in any session, before `TASKS.md`.

The structure is deliberately simple: *To Do*, *In Progress*, *Done*, with completion dates on done items. The agent reads it at the start of a session, after `STATUS.md`, to see what's open, and updates it as work happens. You read it at session start to remember context. For most iterative workflows (academic publishing, research projects, the kind of work this doc itself was produced under), `TASKS.md` is sufficient.

Four files, four roles. `STATUS.md` carries the current state: where the project stands right now, in one screen, rewritten as it changes. `TASKS.md` carries operational state: what's open, what's mid-flight, what's done and when. `PLAN.md` carries the analysis sequence: what's planned, in what order, what the milestones are. `METHODOLOGY.md` carries the methodological reasoning: why this model, why this prior, what alternatives were rejected. Don't mix them: `TASKS.md` shouldn't carry model rationale, `METHODOLOGY.md` shouldn't carry routine to-dos, `PLAN.md` shouldn't track in-progress task state, and `STATUS.md` shouldn't accumulate a history. Four files keeps each one readable and keeps the agent reading the right file for the right question.

### Alternatives and why not

`Task Master AI` is the structured, PRD-driven (Product Requirements Document) alternative. You point it at a written specification document, it generates a decomposed task tree, and it exposes a `tasks.json` that agents can consume programmatically. The tasks have explicit dependencies, statuses, and structured metadata. It fits PRD-shaped software projects, where a multi-page specification gets decomposed into a deep dependency tree the agent works through. Most statistical consulting projects aren't PRD-shaped: they're question-shaped, data-shaped, model-shaped, and the structure that matters lives in `PLAN.md` and `METHODOLOGY.md`, not in a `tasks.json` schema. For statistical work, `AGENTS.md` + `TASKS.md` + `PLAN.md` + `METHODOLOGY.md` covers the ground; reach for `Task Master AI` only on PRD-driven projects.

### When I'd reconsider

If I started a project from a real PRD-style spec and the manual `TASKS.md` scaffold started to feel like it was hiding the structure, I'd try `Task Master AI` for that project. At the moment, `AGENTS.md` + `TASKS.md` continues to be sufficient.

# 18. Personal AI Assistant

This section covers the chat-based entry point named in the introduction's four-entry-points framing: an agent that lives behind your messaging surfaces (Telegram, Slack, email, calendar, voice) and takes actions across them. The defining shape is *act* rather than *ask*: schedule a thing, send a reply, watch a topic and ping me when it changes, run a daily cron against an external API. It takes actions against live systems rather than answering questions about static content.

A personal AI assistant that does what the name implies is designed to *reach into* the surfaces you use. Sandboxing it the way §13 sandboxes a coding agent defeats the purpose — the agent's job is to act across those surfaces, not to be isolated from them. So the security model in this category has no equivalent of §13's local-data-permissions story to fall back on: the agent has whatever credentials and reach you wire up. For a data-scientist workload that handles client material, IRB-restricted data, or unpublished research, the blast radius doesn't fit the work. The candidates below are real and the category is improving, but the section is presented as watch-this-space rather than a daily-rotation pick.

### macOS / Ubuntu: Hermes

`Hermes` (from Nous Research) is the most ambitious entry in this niche: a single agent that lives behind your messaging surfaces (Telegram, Discord, Slack, WhatsApp, Signal, Email, plus a TUI), with a self-curating skill library, MCP integration, cron-driven scheduled actions, and serverless deployment options (Daytona, Modal) that let the agent hibernate when idle. Cross-platform; the surface is the messaging client, not a macOS-specific app.

### Alternatives and why not

`Vellum` (from `vellum-ai`) sits in the same niche with two architectural differences worth noting: a native macOS app surface alongside Telegram and Slack, and a credential-isolation architecture where secrets live in a separate process the model never sees. MIT-licensed. The most credible peer to `Hermes` if credential isolation matters for your use case.

`OpenClaw` is the older incumbent in this niche. Broader adoption, similar shape. `Hermes` ships a migration command from `OpenClaw`, which suggests the category is consolidating.

`Google Assistant`, `Siri`, and `Cortana` are the canonical "what this category is replacing" — voice-first OS-native assistants with limited extensibility and no real agent capabilities. The category that `Hermes` / `Vellum` / `OpenClaw` occupy is what those tools always wanted to be but couldn't, before LLMs.

### The hard line

A few rules that travel with this whole section:

- Don't connect any of these to client email, private research data, IRB-sensitive material, or financial systems. The blast radius is too high and the security model in this category is too young. Cross-references §13a agent permission settings (including its data-permissions subsection).
- Heavy sandboxing isn't really an option. Containerizing a personal AI assistant the way you'd containerize a coding agent (per §13c) defeats the purpose: it's supposed to reach into the things you use. The pragmatic posture if you do adopt one is awareness rather than isolation — minimize plugin scope, audit before installing, treat the agent's reach as if a hostile message could exploit it, rotate exposed credentials.
- Predictability matters more than capability when the cost of an unintended action is high. This argues for keeping the agent's surface narrow until the category's security model catches up to what's already standard for coding agents in §13.

### When I'd reconsider

What I am waiting for is the category's security model to mature. Concretely: a permission model with the same shape as §13a (per-tool allow / prompt / deny, with a deny-by-default posture) applied to the agent's outbound actions (sends, posts, schedules, API calls), plus a prompt-injection defense that's been tested against attacks on the messaging surfaces themselves. When that exists, one of `Hermes` / `Vellum` / `OpenClaw` becomes a serious candidate. Re-evaluate every six months; this is the youngest area in the document and the most likely to shift.
