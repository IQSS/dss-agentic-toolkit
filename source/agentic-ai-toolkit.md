---
title: "Extending Your Agent's Toolkit"
subtitle: "A Guide for Researchers"
version: "2.2 draft"
---

# Choose tools for a research need {#choose-tools}

Additional tools are useful when they remove a specific obstacle to research: a fit that stops when a session closes, a figure revision that reruns every model, or a collaborator who cannot restore your software. Begin with that problem. Keep an existing tool when it already provides the required behavior and evidence.

Suppose your heat-and-birthweight project now needs 100 simulation runs. You want a few running at once, the rest waiting, and a record of failures to inspect later. A queue addresses that need. It does not choose the simulation design, decide whether the estimates are valid, or make a sleeping laptop compute. Understanding that division of work is more useful than installing a large collection of tools.

The companion [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/) explains delegation and research judgment. This book explains tools that help carry out those decisions. You can ask the agent to install and operate them from the app; no terminal knowledge is required for chapters 1–16. Sign-ins, passwords, and decisions about access remain yours.

## Find the problem you need to solve

| Research need | Start here |
|:--|:--|
| **Set up and protect the work** | |
| Add one missing capability without upgrading everything | §1: Homebrew |
| Check what a new tool can read, change, or send | §2: access controls |
| Find a variable or inspect a saved service response | §3: rg, fd, jq, yq, bat |
| Recover a working state after an unsuccessful change | §4: git and gh |
| **Run and reproduce the work** | |
| Restore the language and packages used for an analysis | §5: rig, renv, uv |
| Repeat a research task with one saved command | §6: just |
| Catch consequential mistakes before fitting | §7: runnable checks |
| Rerun only steps affected by a change | §8: targets and Snakemake |
| Keep a batch moving unattended | §9: pueue |
| Rebuild a report from saved research outputs | §10: Quarto and pandoc |
| **Extend access and coordinate work** | |
| Supply a credential without storing it in research code | §11: 1Password and direnv |
| Reach an approved reference library or service | §12: MCP |
| Inspect a rendered page or interact with a website | §13: browser tools |
| Give parallel agents separate working copies | §14: git worktrees |
| Package or restrict a separate execution environment | §15: containers |
| Keep a recoverable record of personal tool settings | §16: chezmoi |
| **Work from a terminal, optionally** | |
| Run a saved command yourself | §17: terminal commands |
| Run an agent interactively or as a recorded batch step | §18: terminal agents |
| **Reference** | |
| Terminal, shell, editor, and R execution conveniences | Appendix A |
| Inspect historical account usage with an extra tool | Appendix B |

## Add only what the project needs

Installed programs extend what the agent can do through its command tool. Connections expose functions supplied by another service. Instructions tell the agent when and how to use either. Installation alone does not teach a reliable procedure: a queue needs resource limits and an outcome check; an environment manager needs a maintained version record.

Each chapter begins with the research problem and an example, then gives a setup request and evidence to inspect. Most examples are deliberately small and invented. Where a procedure comes from a recorded run or has not yet had a clean-installation trial, the text says so. We are Data Science Services at Harvard's Institute for Quantitative Social Science; the examples draw on our research-support work.

## Use the environment you have

The main routes are macOS and Ubuntu Linux; Windows readers can use Ubuntu through WSL2. R, Python, and Stata users can keep their research language. A master do-file may already provide the workflow you need, and Stata's language and community-command versions still need recording.

An app, terminal, remote session, and WSL session may have different tools and credentials. Check the actual session in which research will run. For Windows, consult the [desktop WSL documentation](https://code.claude.com/docs/en/desktop-wsl) before assuming that a locally installed tool or connector is available there. Platform-specific clean-installation trials are recorded separately from tests on the author's configured Mac.

Product interfaces and access controls change faster than the purposes of these tools. Consult the linked primary documentation for the installed version, and test the small example before trusting the tool with consequential work. This November draft is prepared for author review; publication and remaining account-dependent trials follow that review.

<!-- ===================== PART I — SET UP AND PROTECT THE WORK ===================== -->

# 1. Add a tool without disrupting a project: Homebrew {#adding-tools}

Adding a tool should give the project a missing capability without disturbing an analysis that already works. Inventory the existing installation first, then make the smallest useful addition. Homebrew manages many of the command-line programs used in this book.

For example, the agent repeatedly writes small programs just to select fields from saved JSON responses. Installing `jq` gives it a maintained tool for that job. Verify it on one harmless response while leaving the project's R or Python environment unchanged.

## What you need first

On a Mac, ask the agent to check the installed tools, machine architecture, and Homebrew's current prerequisites. The research guide's first exercise does not require git or Apple's Command Line Tools; adding tools here may require them. Keep an existing institutional package-management arrangement if it meets the need; do not build a competing setup without a reason.

The current [Homebrew installation instructions](https://docs.brew.sh/Installation) provide both the supported command-line route and a macOS package installer. Use those instructions rather than a copied installer command from an old guide. A password or installer dialog is a step for you, not a credential to paste into the conversation. If a terminal step is required, §17 explains how to open Terminal and paste one command. The macOS package route is documented here, but has not been tested as a complete new-user walkthrough for this edition.

## Ask for a small installation

> Inventory the tools this project already has and how they are managed. If Homebrew is needed, identify the supported installation route for this machine and explain any step I must perform myself. Then install ripgrep and jq if absent. Show their versions and use them on harmless example files. Do not upgrade the project's research language or package environment.

Once Homebrew works, the agent can install further tools as you reach the relevant section. You do not need the whole toolkit at once. For noninteractive installs, Homebrew documents the `HOMEBREW_NO_ASK` setting; it does not remove operating-system authorization requirements. Record installed tools and why the project needs them.

A personal `Brewfile` can record a growing installation set. It is useful for rebuilding a machine, but is not a substitute for the project's pinned research environment (§5). This guide uses section-by-section installation, so no separate bundle is needed to start.

## Check that it works

Ask the agent to show `brew --version`, the installed tool versions, and the small example's output. A `brew doctor` warning needs interpretation; it does not necessarily mean an installation failed. A command that cannot be found may be absent or may be outside the agent process's search path. After installation, a fresh app session may be needed to inherit that path.

Keep installation review separate from research work. An installer may request network access or write outside the project. Approving that operation does not authorize later commands to use the same access without review (§2).

## Windows through WSL2, and Linux

This guide's Windows route is Ubuntu inside WSL2, not native Windows tools. Follow Microsoft's [WSL installation instructions](https://learn.microsoft.com/windows/wsl/install), including any administrator step and restart. Keep the project and its Linux tools inside the same distribution; a Windows installation of a program is not automatically a Linux installation.

Homebrew supports Linux under its documented requirements. Follow its Linux instructions rather than copying the macOS installer. If your institution already supplies packages through Ubuntu or a managed environment, use those when adequate and record any differences in command names. The tools' platform notes identify consequential differences rather than promising identical operation everywhere.

A newly installed tool can go unused, or be used incorrectly, unless the agent has instructions for it. This chapter shows how to record when to use a tool, what limits apply, and which results to report. The research guide's *The files the agent reads* and *Repeatable workflows* chapters explain the instruction files and skills that hold those procedures.

## Start with short, specific instructions

A machine-wide convention can live in your personal `CLAUDE.md`. A project's commands, resource limits, and data-access rules belong with that project. Keep an established instruction layout rather than creating a second one for this guide.

For example:

- Submit long jobs through pueue, record the task identifier, and verify both completion status and expected outputs.
- Fetch required credentials from the approved vault for the command that needs them. Never print or commit their values.
- Use the project's recorded environment. Report proposed dependency changes before applying them.

Each line names an action and a check. “Use pueue” alone leaves the agent to guess how to establish that a job succeeded. Keep a short inventory of installed tools and their purpose alongside these instructions.

## Package procedures only when they recur

A skill can hold a recurring procedure such as submitting a job, inspecting its status, and reporting failure. Start with a standing instruction; add the longer procedure if you repeatedly need the same correction. Hooks can run checks at specified events, but are executable configuration that needs review. Neither instructions nor hooks replace a data-access boundary (§2).

## Check that the instruction is used

In a fresh session, ask which project instructions apply and how the agent would run a long job. Have it identify the file it read, then demonstrate the procedure on a harmless task. A confident summary alone does not prove the file was loaded or the procedure works.

# 2. Control what added tools can access {#tool-access}

A new execution route can change what research material the agent reaches. Check the route before relying on restrictions configured for a different tool. The research guide's chapter 3 owns the decision about permitted data; this chapter helps enforce it.

For example, an ordinary agent command may run inside a sandbox, while a job submitted to pueue runs under a separate queue service. Restricting the submission command does not establish that the queued job has the same limits. Test both routes with harmless files.

![](figures/tool-access-routes.svg){#fig-tool-access-routes fig-alt="Ordinary commands and queued jobs can run under different processes and permissions. Check the files, network, and credentials available to each route."}

## Combine the controls

Written instructions tell the language model what you want it to do. Permission rules let Claude Code allow, refuse, or ask about matching tool calls. Approval prompts let you review those proposed actions. A sandbox restricts file and network access for programs running inside it, using operating-system controls. Containers (§15) can provide an additional separate environment, depending on their configuration.

None covers every route automatically. A file permission rule can block a direct read without blocking an arbitrary unsandboxed script that opens the file. A connector or browser may reach data through credentials rather than local paths. Git can recover tracked edits but cannot reverse disclosure.


## One maintained configuration example

This is the example shared with the research guide. It belongs in the project's `.claude/settings.json`; the path forms below are chosen for that location. The syntax was checked against the September 2026 documentation. This is a starting example, not a tested certification of a restricted-data environment. Adapt it to the actual paths and institutional policy, then test with harmless files. Current syntax is documented in [Claude permissions](https://code.claude.com/docs/en/permissions) and [sandbox configuration](https://code.claude.com/docs/en/sandboxing).

```
{
  "permissions": {
    "deny": [
      "Read(/data/restricted/**)",
      "Edit(/data/restricted/**)",
      "Edit(/data/raw/**)",
      "Edit(/.claude/**)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)",
      "Bash(sudo*)"
    ],
    "ask": ["Bash(git push*)"]
  },
  "sandbox": {
    "enabled": true,
    "failIfUnavailable": true,
    "allowUnsandboxedCommands": false,
    "filesystem": {
      "denyRead": ["./data/restricted"],
      "denyWrite": ["./data/restricted", "./data/raw", "./.claude"]
    },
    "network": {
      "allowedDomains": []
    }
  }
}
```

Here, restricted files are denied to both file tools and sandboxed processes. Approved raw inputs remain readable but cannot be edited. The example blocks writes to project settings as well. It does not enumerate every sensitive folder on your machine or constrain all connected tools. Keep material that must be inaccessible outside the process's effective access, not merely outside the selected folder.

This example adds no network destinations or command exemptions. Settings from other scopes can contribute entries, so inspect the effective configuration rather than assuming this file clears existing permissions. Add a destination only for a known need; a permitted destination can receive information as well as return it. Broad registry and GitHub allowlists are therefore not a data-loss guarantee.

> Inspect the effective project and managed settings. Propose changes based on this example, using the actual approved paths. Explain which tools each rule covers and list any remaining access routes. Show the proposed configuration before it is applied. Test direct reads, scripted reads, and writes using harmless allowed and denied test files; do not use confidential data for the tests or bypass a failed restriction.

**What only you can do.** Decide the permitted access and review any proposed widening. Your institution's managed policy may prevent a change. If a control refuses an action, establish why it was refused before deciding how to proceed; do not have the agent try another tool simply to evade the restriction.

## Exceptions change the boundary

The example refuses unsandboxed fallback. Some tools may need access it does not provide: a queue socket, an application integration, system installation, or a pseudo-terminal for the locally observed R issue (Appendix A). Diagnose the particular failure before deciding how to handle it. Do not add broad exemptions for every `gh`, `op`, or queue command as part of the baseline.

If an authorized workflow needs a reviewed unsandboxed invocation, document its scope and protection separately. Do not describe that command as sandboxed. In particular, a job submitted to pueue runs under the queue service's account and permissions; the submission command's sandbox does not contain the resulting job. Credentials supplied to a process are available to that process even when a vault stored them safely.

For a protected analysis, use an execution environment with the required access controls instead of weakening them to accommodate a tool. A convenient local workaround may be inappropriate there.

## Check both execution and editing

Test direct file access and subprocess access separately, using disposable files. Confirm the expected failures and an allowed operation that still succeeds. Test again after changing path rules, command exemptions, or the tool used to run the work. These tests reveal configuration errors; they do not prove containment against every possible program.

Keep the effective settings and any exceptions documented outside the model's conversation. Review changes to both project and personal settings, including copies managed by chezmoi (§16). Protecting only the applied file can leave an editable source copy that later restores broader access.

## On Windows (WSL2) and Linux

The sandbox is supported on macOS, Linux, and WSL2, with platform-specific requirements in the linked documentation. Native Windows is outside this guide. Have the agent check the installed version's requirements and any managed-device restrictions before configuring it. A missing sandbox is not repaired by selecting a more cautious permission mode.

# 3. Find research files efficiently: rg, fd, jq, yq, bat {#finding-files}

Finding the right file quickly helps an agent use the project's actual evidence instead of guessing from an incomplete description. Search and structured-data tools also keep irrelevant output out of the conversation.

Suppose a reviewer questions how `hot_days` enters an analysis. A search should identify its construction, model formula, and figure labels, with paths and line numbers. A JSON query can then inspect the source field in a saved acquisition response. The task is to locate evidence you can follow, not to print the whole project.

## What they give the agent

| Tool | Useful task | Evidence to ask for |
|:--|:--|:--|
| `rg` | Find a variable or function in code | File names, line numbers, and search scope |
| `fd` | Find files by name or extension | Matching paths and any excluded directories |
| `jq` | Select fields from JSON | The selection expression and its output |
| `yq` | Read or change structured configuration | The installed implementation and a reviewed diff |
| `bat` | Read a short file with line numbers | The relevant lines, rather than the whole project |

Ripgrep normally respects ignore files and skips hidden files. That reduces noise, but means a search can miss generated output or hidden configuration. Ignore rules are search defaults, not security controls. Broadening a search still requires permission to read those files. The [ripgrep guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) explains the defaults.

## Ask for it, and tell the agent

> Install ripgrep and jq if they are absent. Find uses of income_adj in this project's code and report file names and line numbers. State which directories were searched and any relevant exclusions. Add a short instruction to use these tools for text searches and JSON inspection.

If the task also involves YAML, specify which `yq` is installed: unrelated programs share that name. The [Mike Farah implementation](https://mikefarah.gitbook.io/yq/) is the Homebrew choice used here. Do not assume syntax written for another implementation transfers unchanged.

## Check that it works

A search such as `rg -n income_adj code/` should return the locations you can inspect in the named files. In a practice file, add one known occurrence and confirm it is found. If a search returns nothing, ask the agent to report its scope before concluding that a variable is unused.

For JSON, ask for one named field from a small saved response and compare it with the original. A missing field and an explicit null value may need different handling; a short command still needs the right interpretation.

## Read a small result

An invented search might return `code/prepare.R:18: hot_days` and `code/model.R:31: hot_days`. Open those lines to distinguish construction from use. For a saved JSON object `{"county":"001","hot_days":7}`, the selection `.hot_days` should return `7`. These tiny examples establish what a successful lookup means before broadening the search.

## Keep adequate existing tools

On a server where installations are restricted, the standard search and file tools may be sufficient. A managed Ubuntu installation may use names such as `fdfind` or `batcat`; record the actual commands rather than installing a second copy merely to match this page.

# 4. Recover earlier work: git and gh {#version-control}

Research revisions should be recoverable. Git records selected versions so you can return to a working state when a change produces the wrong output, while retaining a record of why later work differs. The agent can maintain that record; learning every git command is unnecessary.

For example, a revised sample rule unexpectedly removes half the observations. Preserve the failed check and its explanation, then ask the agent to restore the relevant rule from the last accepted checkpoint without discarding unrelated manuscript edits. Add a remote host only when collaboration or approved backup requires it.

## What the tools give the agent

A git diff shows how tracked text changed. A commit records an inspectable version. Neither can undo an external upload, a database change, an overwritten untracked file, or exposure of confidential data. Keep backups and access controls appropriate to those risks.

The GitHub command-line tool, `gh`, lets the agent inspect issue reports, proposed changes called pull requests, and checks run by GitHub. It can also prepare changes for collaborators. Decide whether the files may be sent to the hosting service before creating or using a remote repository; private repositories still transfer their contents there.

## Set up access only when needed

Use your lab's existing host. For GitHub, we recommend `gh` with HTTPS authentication. The [authentication manual](https://cli.github.com/manual/gh_auth_login) explains its browser flow and credential storage: it uses the system credential store when available, but can fall back to a plain-text file. Check the reported storage location rather than assuming a keychain is in use.

> Install gh if needed and check this repository's existing remote and authentication configuration. Help me sign in through the browser without pasting a token into chat. Configure git's HTTPS credential integration if appropriate. Report authentication status and the credential storage method without showing a secret. Do not create a remote or push files yet.

You complete the browser sign-in. Have the agent inspect existing name and email settings before changing them. Keep functioning SSH or institutional-host authentication if there is no reason to replace it.

## Check a small change

Begin locally: have the agent check whether git exists, initialize it only if the project has no repository, and show the files proposed for tracking. Check the ignore rules and preserve any existing edits. Supply your own author identity if it is missing; the agent should not invent it. A local checkpoint requires no GitHub account.

After a practice edit, ask for restoration of that named file from the checkpoint. Open it and verify the old content, while checking that an unrelated file remains unchanged. This tests recovery rather than merely showing that a commit command succeeded.

Ask the agent to show the repository status, make an agreed edit to a practice file, and display its diff. After review, have it stage that file by name, selecting it for the commit, and inspect the proposed file list before committing. If the repository already contains uncommitted changes, identify and preserve them. Leave unrelated work untouched.

For GitHub, start with a read-only operation such as inspecting the approved repository. A blocked call may reflect network, credential-store, or sandbox restrictions. Review that route under §2 rather than exempting all git and GitHub operations from the sandbox.

Standing instructions: inspect status before editing; preserve unrelated changes; stage intended files; review the outgoing diff before a push; obtain approval before publishing or rewriting shared history.

## Keep repository internals out of cloud synchronization

Git's internal `.git` directory changes frequently and should not be treated as a cloud-synced working document. For a new repository under Dropbox on macOS, the local procedure used here is to initialize it, exclude `.git` before the first commit, and verify the exclusion:

```
git init
xattr -w com.dropbox.ignored 1 .git
xattr -p com.dropbox.ignored .git
```

Run and check these steps separately. The last command should report `1` before any commit populates the repository history. The same before-population rule applies to generated libraries and large caches. This is Dropbox-specific, not a command for other sync services.

If Dropbox has already indexed a populated directory, adding the attribute is not a reliable way to remove its existing contents from synchronization. Do not repeatedly rebuild that directory while trying to exclude it. Move the generated storage outside the synced tree, preserving needed files, and use an appropriate link or configuration path. An existing repository requires a checked migration, not deletion of its history.

In WSL2, keep the repository and its git operations inside the Linux environment. Do not alternate Windows and Linux tools over the same working directory without checking filesystem, credential, and line-ending behavior.

<!-- ===================== PART II — RUN AND REPRODUCE THE WORK ===================== -->

# 5. Preserve a software environment: rig, renv, and uv {#environments}

A working analysis depends on its software as well as its code. Recording the environment makes it possible to restore that combination after an update or on another machine, and to explain an unexpected change in results.

For example, a collaborator reruns the heat-and-birthweight scripts but obtains different intervals after installing newer package versions. A version record lets you first test the original environment, then investigate an upgrade as a deliberate change. Without that record, the earlier behavior is harder to recover.


## What it gives the agent

A lockfile records exact package versions and their dependencies. R projects using renv use `renv.lock`; uv projects use `pyproject.toml`, `uv.lock`, and a Python-version record. The installed library can be rebuilt from those records, subject to platform support and the continued availability of packages and system dependencies.

Rig manages R installations; renv manages project packages. Uv can manage both the Python interpreter and project environment. A lockfile does not preserve the operating system or guarantee identical numerical results on all hardware.

## Start from the existing project

Record the environment whenever results need to be repeated. For an existing project, preserve the working versions before any migration. Stata users should record Stata and community-command versions and their sources; retain the master do-file. A second programming language is not required.

## Choose a manageable setup

Use [renv](https://rstudio.github.io/renv/articles/renv.html) for R, and [uv projects](https://docs.astral.sh/uv/concepts/projects/) for Python. Keep an established environment manager if it already provides the needed record and restoration route. Add rig when you need to install or select a particular R version, not as a reason to upgrade every project.

A package addition should produce changes to the lockfile that you can account for. For example, adding one plotting package may also add packages it depends on. It should not silently replace most of the packages used for modeling. Have the agent explain the changed versions, run the affected checks, and test restoration in a separate environment before relying on the record.

## Ask for it, and tell the agent

For an existing analysis:

> Inventory the language, installed package versions, system dependencies, and current environment records. Preserve a baseline result. If a lockfile is missing, propose a way to capture the working environment without upgrading it. Show the resulting manifest and verify restoration in a separate environment. Do not change the original library or language version to make the migration easier.

For a new project:

> Set up a project environment for the agreed language version and packages: renv for R, or uv for Python. Record the complete dependency resolution, run a small import and analysis check, and show the lockfile. Keep generated libraries out of git and cloud synchronization before populating them.

**What only you can do.** Approve any system installation or password step. Installing a new R version may need administrator access. Credentials and package repositories also need the access decision in §2.

Standing instructions: use the project's environment manager, review lockfile changes alongside code changes, and keep the original working environment until a migration is verified.

## Check that it's working

For R, inspect `renv::status()`, the R version, and the lockfile diff. For Python, test the recorded environment with a locked restore, such as `uv sync --locked`, followed by the project's checks. A [locked sync](https://docs.astral.sh/uv/concepts/projects/sync/) refuses a stale lockfile instead of resolving an update silently. Test in a separate environment because syncing can remove packages not in the lockfile.

Common failures are unrecorded packages, missing system libraries, and a lockfile update that changes far more than intended. In renv, use the ordinary project snapshot after an approved change; selecting a single package for a snapshot can omit the rest of the environment. In either tool, inspect the complete dependency record rather than counting only direct imports.

A restore may need system libraries such as a compiler or spatial-data library. Record their installation requirements in the README. If the project depends on a conda-based scientific stack, consider pixi or retain its existing conda environment rather than repeatedly forcing those dependencies through a different manager. A single failed installation is a diagnosis to investigate, not an automatic reason to migrate.

On the author's affected Mac execution route, R environment commands use Appendix A's wrapper. Keep generated libraries outside synchronized folders, or apply the documented exclusion before creating their contents (§4).

## Read the version change

An illustrative lockfile review might show one plotting package added with two dependencies, while the model package remains at its recorded version. That is a different change from upgrading the model package. Have the agent list the actual additions, removals, and version changes, then run the checks affected by them.

![](figures/research-environments.svg){#fig-research-environments fig-alt="The language and packages are recorded in a version record, then restored in a separate environment and checked against a baseline output."}

## If the environment needs more

Use a container (§15) when system dependencies also need to be packaged. Keep an existing conda or other managed environment when it is adequate. Platform-specific binaries can differ, so test restoration on the collaborator's target platform before promising portability.

## On Windows (WSL2) and Linux

Create the environment where the tools run: inside Ubuntu for WSL2. Use [rig's platform instructions](https://rig.r-lib.org/install.html) if adding R versions; the macOS installer is not the Linux installer. Check system-library requirements on that platform and document them with the project.

# 6. Give research tasks reliable commands: just {#project-commands}

A saved command lets you repeat a research task without reconstructing its steps in another conversation. It also makes the scope visible: updating a figure should not unexpectedly launch every model fit.

For example, `just figures` can read saved heat-effect estimates and redraw the plots, while `just fit` refits the approved model. The small `justfile` names those tasks; the scripts contain the analysis. Keep an existing master do-file or Makefile when it already does this well.


## What it gives the agent

A `justfile` records named commands called *recipes*. Each recipe calls the scripts or tools that perform a project task, and `just --list` displays the available names. Just does not determine which results need updating or resume an interrupted fit. A recipe can call a pipeline runner (§8) when that dependency tracking is needed.

## Start from the existing project

Add just when remembering and repeating the commands has become a problem. For an existing paper, first document and test the current execution sequence. An adequate master script can provide a reproducible hand-off without adding another tool.

## Choose a manageable setup

Use a small set of recipes named for the tasks they perform. This R example assumes the named analysis scripts already exist. It calls them through `bin/rscript-pty`, a small helper script described in Appendix A; that helper must also be present and executable.

```
rscript := justfile_directory() + "/bin/rscript-pty"

# Fast known-answer checks; no model refits.
check:
    {{rscript}} code/check-inputs.R

# Fit the approved analysis.
fit:
    {{rscript}} code/model.R

# Recreate figures from saved results.
figures:
    {{rscript}} code/figures.R

# Full ordered reproduction.
build:
    {{rscript}} run-all.R
```

A figure-label change should usually run the quick checks and figure recipe. A changed estimator may require refitting and recalibration. The full release check should run the documented reproduction sequence. Choose validation from what changed, rather than running an hours-long build after every edit.

## Ask for it, and tell the agent

> Install just if needed. Inspect this project's existing execution sequence and propose a small justfile with quick checks, the main analysis, figures from saved results, and a full build. Keep the underlying analysis unchanged. Show the recipes and their expected outputs before running expensive work. Add the instruction to run checks appropriate to the change and report exactly which passed.

Review changes that alter what a recipe includes or checks. The agent should not remove a failing step merely to obtain a successful exit. Do not add a destructive cleanup recipe unless the project needs one and its scope is explicit.

## Check that it's working

Ask the agent to show `just --list`, then run one inexpensive recipe on a harmless input. Inspect the resulting file and the command's success or failure status. The [just manual](https://just.systems/man/en/listing-available-recipes.html) documents recipe listing; use the installed version's help for other options.

Try the complete sequence in a new local practice folder, using your existing research language:

1. Ask the agent to check whether just is installed and follow §1 if it is missing. Record the language and package environment (§5); this exercise needs no new analysis packages.
2. Have it create `practice.csv` with two columns, `id` and `value`, and exactly three rows: `(1, 10)`, `(2, 20)`, `(3, 30)`. These are invented data. The output should be a text report stating `rows: 3` and `sum: 60`.
3. Ask for a script that checks unique IDs and the expected columns, then writes the report. Add `check` and `build` recipes, plus a short project instruction naming their purpose.
4. Run `just --list`, then the check and build. Open the report and compare it with the expected count and sum above. Ask the agent to identify the input and script it actually used.
5. Duplicate ID 2 in the practice input and run the check again. It should fail with a duplicate-ID message. Restore the original three rows, rerun, and inspect the output. Save a checkpoint if this practice folder uses git.

A successful valid case and an intentional failure show more than a report saying the installation worked. This is a proposed teaching exercise, not a recorded execution in this edition.

## If you already have a build command

Keep a working Makefile, master do-file, or document render command. Just can provide a convenient front end without replacing it. Add targets or Snakemake only when dependency tracking is useful (§8).

# 7. Make consequential checks easy to rerun {#runnable-checks}

A quick check can catch an implementation mistake before it contaminates a costly analysis. Save checks for behavior that matters to the sample or reported result, and include a case that should fail.

For example, duplicating a county-month key in the heat table must stop the join before it duplicates birth records. A valid fixture must also pass. These two outcomes tell you more than a test that merely repeats the count produced by the agent's own code.

## Ask for evidence about behavior

A script can run successfully and still drop observations or compute the wrong contrast. A useful check has an expected result established independently of the implementation. Repeating the same calculation in a test can repeat the same error.

For a many-to-one join, use a tiny invented example with three observations and two lookup rows. Establish the expected matches and row count yourself. Then add a duplicate lookup key: the check should fail before the join expands the data. Include an unmatched observation and verify that the specified flag or exclusion rule is followed. These cases test the required behavior against known answers, without copying the cleaning function into its own test.

## Ask for it, and tell the agent

> Identify changes in this task that could alter the analytic sample or reported results. Add small known-answer checks for those behaviors using the project's existing test tools. Include a case that should fail. Expose the quick checks through the project command surface, and explain what they do not establish. Do not refit all models unless the change requires it.

Separate quick checks from expensive recalibration and the full reproduction run (§6). Required validation belongs in the maintained project, even if it began as an exploratory script. Follow Appendix A if R checks hang when launched through the agent.

## Inspect the changes that tests cannot settle

Use the app's diff view to inspect changed specifications, exclusions, dependencies, and execution rules. Difftastic is an optional structural diff tool that can reduce formatting noise in supported languages; it still does not interpret the scientific meaning of a change. Keep the ordinary diff available.

A formatter makes code layout consistent; a linter inspects code for specified style issues and some programming mistakes. Use them when they help the project, and review their adoption separately from an analysis correction. Reformatting a whole file during a small edit can make the substantive change harder to see.

## Check the checks

Ask the agent to run the deliberately failing example and the valid one, report outcomes, and restore the intended test inputs. Review changes to tests as carefully as changes to analysis code. A specification change can justify updating a test, but the reason must be explicit; deleting a failing check to finish the task is not a correction.

Tests establish only the properties they examine. The research guide's *Verification* chapter explains the complementary role of independent implementations, methodological review, and calibration. Passing tests alone establishes none of those broader conclusions.

# 8. Rerun only affected steps: targets and Snakemake {#pipeline-dependencies}

When a workflow has expensive steps, tracking dependencies saves repeated computation and reduces the chance of reporting stale results. A pipeline runner decides which declared steps need updating after a change.

In the heat-and-birthweight project, changing specification B should rerun fit B and the figure that uses it, while reusing fit A. Changing the common cleaning rule should affect both fits. Targets for R and Snakemake for file-based workflows can implement those relationships; a short project may need only its existing master script.

## What a pipeline runner does

If one model changes, the runner can refit that model and rebuild the figures that use it while retaining other completed results. After an interruption, it can also reuse valid completed steps. Resuming partway through an individual model fit requires support from the fitting program; the runner does not provide it automatically.

Targets tracks declared R objects, functions, and file inputs. Snakemake tracks declared files and also considers changes in rule code, parameters, inputs, and software environments. Neither sees a dependency you failed to declare. An API response, an external script, or a manually edited file may therefore need explicit tracking. See the [targets manual](https://books.ropensci.org/targets/) and [Snakemake's rerun controls](https://snakemake.readthedocs.io/en/stable/executing/cli.html).

## Start with a small dependency graph

Consider a cleaning step followed by two models and a figure made from both:

| Step | Depends on | Produces |
|:--|:--|:--|
| Clean | Approved input file and cleaning rules | Analysis data |
| Fit A | Analysis data and specification A | Saved fit A |
| Fit B | Analysis data and specification B | Saved fit B |
| Figure | Both saved fits and plotting code | Figure and plotting values |

Ask the agent to show a dependency graph, a diagram of which steps require the results of others, before running the pipeline. Changing only the figure label should rebuild the figure. Changing specification B should rebuild fit B and the figure. A change to the cleaning rules should affect both fits. Test whether the pipeline actually follows those expectations.

## Ask for it, and tell the agent

> Preserve this analysis's working environment and baseline results. Set up the smallest useful targets pipeline, first wrapping existing scripts if needed. Declare script files and external inputs explicitly. Show the graph and proposed resource limits before executing expensive work. Keep separate quick-check and full-build commands, and tell me which steps each runs.

For a mixed-language project, request a Snakefile instead. Its rules should name input files, output files, and the command or script that connects them. Have the agent install the runner within the appropriate recorded environment, not as an unrecorded global dependency.

A first pipeline can call your existing scripts. It may then treat a whole script as one step, whereas a pipeline built from smaller functions can track changes more precisely. Whether a comment edit triggers a rerun depends on how the script and its contents are tracked.

## Check the graph before scaling up

For targets, inspect `tar_outdated()` and the graph. For Snakemake, use `snakemake -n` for a dry run. Test the three changes in the table on a small invented dataset, compare the predicted and actual reruns, and confirm unchanged outputs are reused. Neither route has been tested as a complete new-installation walkthrough for this edition; verify it in the project's environment.

For parallel work, budget memory and threads as well as worker count. A model using several threads inside each of several workers can exhaust a laptop. Start with one representative job (§9). Targets can use crew for parallel workers, but the observed macOS R problem requires checking that execution route; Appendix A gives the conservative troubleshooting baseline without separate workers.

These tools do different parts of the work. A just recipe (§6) gives you a named command. The pipeline runner decides which analysis steps need rerunning. A queue (§9) manages submission and execution of the overall job.

![](figures/research-dependencies.svg){#fig-research-dependencies fig-alt="Analysis data feed fits A and B. Both feed a figure. A change to fit B reruns that branch and the figure while fit A is reused."}

Keep generated caches out of git and configure cloud-sync exclusions before populating them (§4). Required validation scripts and environment records remain part of the reproducible project, even when their generated results are cached. Keep an established pipeline framework if it already supplies the needed dependency tracking and execution record.

# 9. Keep unattended jobs moving: pueue {#job-queues}

Research computations often need less attention than they need time. A queue lets prepared jobs continue while you are away, automatically starting the next job when capacity becomes available. Its record of outcomes lets you identify what finished and what needs investigation when you return.

Suppose the heat-and-birthweight sensitivity analysis needs 100 independent fits, but the computer can comfortably run four at once. You submit the batch before leaving. As each fit finishes, the queue starts another without waiting for you or an agent to intervene. The next morning you inspect the saved results and failed jobs. This is an illustrative workload, not a promise that all 100 fits finish overnight.

![](figures/job-queues.svg){#fig-job-queues fig-alt="Many waiting jobs feed four available execution slots. Whenever a running job finishes, pueue automatically starts the next waiting job. Completed jobs retain outputs and success or failure status." above="8pt" below="8pt"}

## Separate submission from execution

[Pueue](https://github.com/Nukesor/pueue) runs a background service that manages commands submitted to it. The service records the command, working directory, output, and status, and limits simultaneous jobs. Closing the conversation that submitted a job need not stop its computation.

The computer must remain awake and the service available. A reboot can interrupt work. After an interruption, inspect the queue and outputs before restarting: the queue's record does not itself let a model fit resume halfway through. That requires checkpoints saved by the fitting program.

Use a queue for recurring long fits, simulations, or batches of independent work. Run short commands directly when their outcome can be checked immediately. Keep an institutional scheduler for work already running on a cluster.

## Choose a limit from the jobs' resource needs

Start with one representative job and inspect its memory use and internal threads. Then choose a concurrency limit that leaves room for the rest of the machine's work. Four queued fits using four threads each can demand sixteen threads; four available slots do not mean the fits each use one core.

Ask the agent to inspect the command and environment before submitting a large batch. A queued command runs with the queue service's access, which can differ from the agent command tool's sandbox (§2). Configure the intended route and test it with harmless inputs. The queue controls when a job runs; it does not automatically inherit the agent's access restrictions.

> Set up pueue for this machine if it is not already available. Demonstrate the queue using harmless short jobs and a concurrency limit of one, so I can see one job wait and then start automatically. Record the task IDs, working directories, logs, and final results. Before queuing the sensitivity fits, inspect a representative job's memory and threads and propose a suitable limit. Preserve the existing project environment and explain any required access exception.

## Check the outcome, including failures

Have the agent retain each task ID. Submission confirms that the service accepted the command; it does not establish that the command ran successfully.

| State | Evidence to inspect |
|---|---|
| Waiting | The recorded command, inputs, working directory, and place in the queue |
| Running | Actual process status plus an advancing log or expected intermediate output |
| Succeeded | Successful stored result and the expected output artifact |
| Failed | Failure status and log explaining what stopped; no silent resubmission |

For a project with the `fit` recipe from §6, the agent can submit `just fit`:

```
pueue add --print-task-id -- just fit
pueue status
```

Use the returned ID in subsequent commands. If the returned ID were 42, the checks would be:

```
pueue log 42
pueue wait 42
pueue status --json | jq -e '.tasks["42"].status.Done.result == "Success"'
```

This JSON check follows pueue 4.0.4's stored-result shape. `pueue wait` returns after waiting even when the job failed; its own successful exit does not prove job success. Also inspect the fit artifact. A successful command that wrote to the wrong folder has not completed the research task.

Common setup failures include an absent service, a blocked service socket, and the wrong working directory or environment. Distinguish these from model errors. For the observed macOS R problem, follow the [R troubleshooting procedure](#working-environment) for both direct and queued execution until the actual route is verified.

## Combine a queue with a pipeline when useful

Targets and Snakemake (§8) decide which dependent steps need to run. Pueue can submit the outer command and retain its outcome after the submitting session closes. A saved command (§6), a dependency runner (§8), and a queue solve different problems; use the ones the project needs.

On WSL2, run the service in the project's environment and test its lifetime. Microsoft's [systemd guidance](https://learn.microsoft.com/windows/wsl/systemd) says that systemd services do not keep a WSL instance alive. Do not assume work survives shutting down the distribution or Windows.

# 10. Generate documents from research outputs: Quarto and pandoc {#research-documents}

A report is easier to keep accurate when it is built from maintained text and saved results. Document tools can update tables, figures, references, and layout together instead of leaving numbers copied by hand in several places.

For example, a corrected estimate in the heat-and-birthweight project should reach Table 1 and the sentence that describes it. Quarto can combine prose, code, and results; pandoc can convert maintained text through a template. Keep a working Word or notebook collaboration route when it already meets the need.

## What the tools give the agent

A Quarto source file can hold prose, code, citations, and references to figures and tables. The agent edits that source and renders the result. This makes it easier to keep reported numbers connected to the analysis, provided the document executes the appropriate code or reads current result files.

A render does not always rerun the analysis. Quarto's [execution documentation](https://quarto.org/docs/projects/code-execution.html) explains caching, frozen results, and notebook execution. Record whether the build executes models, reuses saved fits, or only formats existing output. Include the required refresh in the release check.

Pandoc converts text sources into formats such as Word, HTML, and PDF. For a designed PDF, a LaTeX template can specify fonts and layout. The XeLaTeX route requires a TeX installation and the fonts named by the template.

## Ask for a small first document

> Inspect the project's existing writing workflow. If Quarto is appropriate, set up a one-page document in the recorded language environment, with one result computed from a tiny invented dataset and one plot. Add a build command that renders it to the required format. State what executes during that command and what is reused. Show me the rendered file before adapting the manuscript.

For a text-only PDF, request pandoc and a template instead. TinyTeX is a small TeX distribution supported by Quarto; an existing MacTeX or TeX Live installation can stay. Follow [Quarto's PDF setup](https://quarto.org/docs/output-formats/pdf-basics.html), and check that an independently invoked pandoc can find XeLaTeX. A larger TeX installation reduces missing-package problems but does not guarantee an identical build years later.

## Check the document, not just the command

Open the output and inspect the result, figure, citations, and layout. Change one value in the invented input, rebuild, and verify the corresponding reported result changes. For the manuscript, check a selected result against the saved analysis output. A recent modification time alone cannot establish that the right analysis ran.

Save the rendering command and its options as a project recipe (§6), and record the language packages, TeX dependencies, and fonts needed for hand-off. Preserve a Word route when coauthors need it; conversion still requires checking tables, equations, references, and tracked changes.

For an R process that hangs when launched by an agent on macOS, use the single troubleshooting procedure in §6. Queueing the render is not itself a guarantee that the problem disappears.

One specific template error encountered with TeX Live 2026 is “No counter 'none' defined” for a captionless table. The pandoc-to-XeLaTeX templates used here include this compatibility block in their preamble:

```
\makeatletter
\@ifundefined{c@none}{\newcounter{none}}{}
\makeatother
```

Other failures need their own diagnosis. Check missing fonts and packages in the render log rather than changing the document's statistical code to obtain a PDF.

<!-- ===================== PART III — EXTEND ACCESS AND COORDINATE WORK ===================== -->

# 11. Keep credentials out of research files: 1Password and direnv {#credentials}

A data-acquisition command may need a credential, but the research code and its published history should not contain the secret. Supply it only to the process that needs access and check what that process records.

For example, a Census download uses a key from an approved vault while the saved script contains only a variable name or vault reference. The log can record that the request succeeded without printing the key. 1Password's `op` command supports this route; direnv is optional when several project commands need the same environment.

## What this protects

A vault reference can identify a secret without writing its value into a script or repository. At execution, the approved command receives the value. That reduces accidental storage and publication, but a process receiving an environment variable can read, print, or send it. A vault does not make a credential invisible to an agent that can run arbitrary code in that process environment.

Give the command only the access it needs, such as a read-only token for the required service. Leaving a directory or ending a process does not revoke a credential already copied elsewhere. If a credential is exposed, revoke it and issue a replacement.

## Start with one command

1Password's [scripts guide](https://developer.1password.com/docs/cli/secrets-scripts/) describes `op run`, which starts a command with the credentials it needs available as environment variables. These are named values a running program can read. This is a useful starting point when only one acquisition command needs a key. Authenticate through the approved local mechanism and test access without printing the value.

Direnv is useful when several project commands need the same environment. It evaluates the project's `.envrc`, which can read vault items, for example:

```
export CENSUS_API_KEY="$(op read op://Research/census-api/credential)"
```

This file contains a reference, not a secret value. Its names can still disclose project or account information, so review them before sharing. Use generic references in a public example. An `.envrc` is executable shell code; inspect the whole file before approving it with `direnv allow`.

## Ask for it, and tell the agent

> Help me use the approved 1Password CLI for this project's API credential. Prefer passing it only to the command that needs it. Identify the vault item and variable name without reading the value into chat. If repeated project commands justify direnv, propose an .envrc and show me its contents before I approve it. Test the authorized request and report status without logging the credential.

You create the vault item and complete authentication. Keep existing institutional secret management when it supplies the same capability. Consult the current [1Password CLI setup](https://developer.1password.com/docs/cli/get-started/) for app integration on your platform; do not assume that a Windows desktop app unlocks a CLI process inside WSL2.

## Check the scope

Ask which command receives each credential and whether programs it starts receive the credential too. Inspect scripts and logs for accidental exposure using checks that report locations without printing matched secrets. Confirm authentication with a harmless authorized request, not by displaying an environment variable.

If direnv does not load in the agent's noninteractive shell, `direnv exec .` can explicitly load the approved project environment for a command. Do not fix an authentication or sandbox failure by granting general vault access. Review the particular access route under §2.

Standing instructions: never paste credentials into chat or source files; report variable names rather than values; avoid dumping the environment; use the narrowest credential scope and lifetime available. Do not introduce an AI-provider API key into the agent's environment unless API billing is intentional and approved.

# 12. Connect to research data and services: MCP {#service-connections}

A direct connection can reduce repeated export and import work while preserving a traceable route to the source. Add one when it gives the agent access the research task actually needs, under an approved account and scope.

For example, a reference-library connection could retrieve a paper's title and DOI for comparison with a manuscript citation. Test it with a record you know and read-only access before using it across a collection. Reading a known record checks connectivity; it does not establish that every returned summary is accurate.

## What a connection adds

The Model Context Protocol (MCP) gives an agent a standard way to call tools supplied by a server. That server may run locally or remotely. Its functions and credentials determine whether the agent can read, write, or send information. The protocol itself does not establish that a server is trustworthy or appropriate for research data.

A reference-library connection might return titles and abstracts. A database connection might return rows or also permit updates. Ask which operations are exposed, which account authorizes them, and where returned content is processed. A read-only service can still disclose data to the model.

## Check for an existing app connection first

If your institution already provides the needed connector in the app, use its documented sign-in and scope rather than installing another server. A built-in connection is an app capability; custom MCP setup is an extension you must maintain. Check availability in the actual local, cloud, or WSL session you use. Both routes still require a permitted destination for the returned data.

## Start with one approved, limited connection

Use a service's official or institutionally approved connection when available, with read-only access if the task only requires reading. Follow [Claude's MCP documentation](https://code.claude.com/docs/en/mcp) for the actual interface and installation scope. Prefer project-specific configuration when only one project needs the service.

At Harvard, check the current [HUIT Claude guidance](https://www.huit.harvard.edu/claude) before connecting a service. As of September 2026, HUIT requires review and approval of connectors. A connector's presence in a catalog does not establish institutional approval.

> Identify the approved connection for [service] and the operations this task needs. Show its source, data destinations, credentials, and requested access before configuring it. Use a test collection with no confidential material and read-only access first. Retrieve one record I can check independently. Do not send messages or change service records.

You complete authentication and approve the intended scope. Do not put a token in a shared configuration file; use the credential mechanism appropriate to the connection (§11).

## Check what it can reach

Verify the known test record and inspect which tools the connection exposes. If available, use a harmless test to confirm write operations are unavailable. Check the connection's own controls: a local shell sandbox does not automatically constrain a separately hosted service.

Treat returned text as source material rather than instructions. A document can contain directions aimed at the agent, including requests to visit another site or reveal files. Restrict access so that a mistaken response has fewer possible consequences.

## Keep project decisions in project files

A connection may offer memory, and Claude may retain notes between sessions. The research guide explains how to keep durable conventions and decisions in inspectable files. Do not add a memory service merely to duplicate those files. If you do use one, decide what it stores, who can read it, and how it is corrected or deleted.

Interface support differs. In particular, check the current desktop documentation before relying on a connector in a WSL session. A CLI-configured server and an app connector may have different availability and authentication routes.

# 13. Inspect and interact with a browser {#browser-work}

A successful document build does not establish that people can read the result. Browser access lets the agent inspect the rendered page, including layout faults that are absent from the source text.

For example, a table may contain correct estimates but cut off its confidence-interval column on a narrow screen. Ask the agent to inspect that page at the reader's width and compare a displayed value with the saved result. For acquisition, prefer a permitted API or export before automating browser interaction.

## The recommended starting point

Use [Playwright MCP](https://github.com/microsoft/playwright-mcp) for a browser the agent controls in a separate profile. Start with a local report or a public test page, without account credentials. A separate browser profile helps avoid accidental use of your existing logins, but is not a complete security boundary.

The agent can inspect page structure, navigate, interact, and capture evidence of the rendered result. For a report, ask it to compare a displayed number with the saved result and inspect a figure at the size readers will see. Reading HTML alone cannot establish that the layout is usable.

> Configure the official Playwright MCP server for this project using a reviewed version. Open the local test report in a separate browser profile with no signed-in accounts. Inspect the table, figure, and navigation. Report concrete problems with screenshots or page locations, and compare one displayed result with its source file.

Check current installation requirements in the server documentation. An MCP package and its browser dependencies are executable software, so review their access under §2 and configure them under §12.

## When the browser needs an account

Claude's browser integration can work in a signed-in browser when the account and interface support it. Follow the current [Chrome integration documentation](https://code.claude.com/docs/en/chrome) and institutional approval process. Grant the specific site access needed for the task, and review consequential actions such as submitting a form or changing a record.

Whatever the agent reads may become part of model processing. Do not expose participant portals, private correspondence, or other confidential systems merely because you can open them yourself. A web page can also carry malicious instructions; account access increases what following them could affect.

## Make recurring collection reproducible

An agent can help discover a permitted route and prototype the interaction. Once the collection steps are stable, save a script, inputs, outputs, and failure handling. Test it on a small sample before increasing volume. Browser-driven collection can be reproducible, but a conversational record of clicks alone is a weak reproduction package.

Computer use reaches beyond browser pages to a desktop's visible applications. Reserve it for a task the narrower tools cannot perform, in an approved isolated environment with appropriate mounts, network access, and credentials (§15). A container label alone does not establish that the desktop is isolated. This guide does not require computer use to follow any of its core paths.

# 14. Divide work between agents: git worktrees {#parallel-work}

Parallel work is useful when tasks can proceed separately and their results can be checked before integration. Separate working copies prevent two agents from overwriting the same files while you coordinate the combined result.

For example, one agent can revise figure labels while another adds a data check. Git worktrees give each a branch and folder in the same repository. Neither task is complete until its changes are integrated and the combined workflow passes the relevant checks.

## What a worktree separates

Separate working folders reduce the chance that agents overwrite each other's edits. They still share repository history and may share databases, caches, credentials, or outputs outside those folders. Worktrees do not restrict access for security purposes, and changes can still conflict when combined. See the [git worktree manual](https://git-scm.com/docs/git-worktree).

For example, one agent could add known-answer checks for a cleaning function while another prepares a figure from an already saved result. Give each a separate output directory. Review both changes, then test their combined state before accepting it.

## Ask for it, and tell the agent

> Prepare separate worktrees and branches for these two tasks: [task A] and [task B]. Identify shared inputs and resources before starting. Give each task a separate output location and the recorded environment it needs. Preserve existing uncommitted work. Do not merge or remove either worktree until its changes and outputs have been reviewed.

Use the app's supported worktree controls or have the agent prepare them with git. Terminal users can open a session in each worktree (§18). Confirm the actual folder and branch each session uses before either starts editing.

## Prepare the inputs deliberately

A new worktree contains the files tracked by git. Ignored data, package libraries, and saved model fits may be absent. Arrange approved access to those inputs and a way to restore the environment before either agent starts. Otherwise it may improvise a substitute for a missing file or repeat an expensive fit. Do not let both agents write to a shared cache without checking that the tool supports it.

Independent implementation for verification needs additional separation. Give fresh sessions the approved inputs and specification without exposing the first implementation or its intermediate results. Worktrees alone do not provide that independence, especially if the reference implementation is in shared history. The research guide's *Verification* chapter explains what to compare and how to interpret agreement.

## Review and integrate

Ask for `git worktree list`, each branch's changes, test results, and remaining uncommitted files. Resolve overlapping edits deliberately. Run checks on the combined result, since two individually passing changes can fail together.

Remove a worktree only after confirming its needed work is committed or preserved and its branch is no longer needed. Keep parallelism within the machine's memory and compute limits (§9). Extra agents are useful only when their outputs can be specified, checked, and integrated.

# 15. Run work in a separate environment: containers {#containers}

An unfamiliar replication package should not inherit every file and credential available on your laptop. A separate environment can limit that access and record the software needed to rerun the package.

For example, a container for a public replication example might receive only a copy of its approved inputs and an empty output directory, with no personal credentials. Test both the expected result and the intended access restrictions. Packaging software and containing access are different claims.

## What it gives the agent

A Dockerfile is a recipe for building the environment from a starting image, system packages, research-language dependencies, and project files. The resulting *image* is the packaged software used to start a container. Sharing it can help a collaborator run the same software. The Dockerfile alone does not preserve package repositories, external services, hardware behavior, or downloads whose versions were not fixed.

A folder shared from your computer into the container is called a *host mount*. If that mount is writable, code in the container can change the files in it. Supplied credentials are also available to that code. Broad system privileges or access to Docker's control socket can defeat much of the intended separation. Review [Docker's security model](https://docs.docker.com/engine/security/) and [bind mounts](https://docs.docker.com/engine/storage/bind-mounts/) when deciding what the container may access.

## The recommended route

On a Mac, Colima with the Docker CLI is the command-line setup used here. Follow [Colima's setup](https://github.com/abiosoft/colima) for the current supported route. On Ubuntu or WSL2, use a supported Docker Engine installation. Keep an institutionally managed Docker Desktop installation if it is already approved and suitable; there is no need to replace it to follow this chapter.

Containers are optional for an ordinary analysis with an adequate environment record. They become useful when system dependencies are difficult to reproduce, a collaborator needs a portable environment, or code needs a more restricted execution space.

## Ask for a limited first run

> Propose a container configuration for this reproduction package. List every host mount, its read/write status, network access, credentials, and runtime privileges. Start with a harmless test, no credentials, and only the required input mounted read-only plus a separate output directory. Show that allowed output works and that an unmounted practice file is inaccessible before running the package.

For a reproducible environment, specify the exact base image in the Dockerfile using its *digest*, a fingerprint of its contents, and restore recorded dependencies (§5). Record the platform architecture and build instructions. If future rebuilding matters, preserve the built image through an approved archive route as well as the recipe, and test restoration. None of this guarantees indefinite compatibility.

## Check both uses separately

A successful reproduction establishes that this build ran under this configuration. It does not show the container safely contains arbitrary untrusted code. Conversely, blocking access to a test file does not establish that numerical results match the original analysis.

Inspect mounts and privileges before each materially different workload. Do not mount the whole home directory for convenience. A container used to build a trusted project may reasonably have different access from one used to inspect an unknown replication package; label and review those configurations separately.

For institutional clusters, use the runtime the service supports, often Apptainer, with the research-computing team's instructions. Container installation and its daemon can require privileges outside the agent's ordinary sandbox (§2); approval for that setup is separate from permission to run every future container.

# 16. Keep records of shared settings: chezmoi {#shared-settings}

Personal tool settings can become hard to recover once they are scattered across several folders. Keeping a maintained source makes changes inspectable and helps restore a working setup on another machine.

For example, a correction to your shared coding conventions should survive a new laptop and should not be overwritten by an older managed copy. Chezmoi records source files and applies them to their expected locations. Project-only configuration already tracked by git may need nothing more.

## What it gives the agent

Chezmoi keeps source versions of selected settings and writes them to the locations each program reads. A private git repository can record changes to that source. This makes it possible to inspect a proposed update and recover a previous configuration.

![](figures/research-shared-settings.svg){#fig-chezmoi-source-and-applied fig-alt="Chezmoi keeps source versions in a settings repository and applies them to the paths programs read. Both locations need review and protection." above="16pt" below="14pt"}

There are two copies to consider: the source managed by chezmoi and the applied file used by the program. Protect both when a file defines the agent's permissions. If the source remains editable, the agent could change it and later have chezmoi overwrite the protected active setting (§2).

## Start with a harmless setting

> Inspect how my settings are already managed. If chezmoi would help, propose a small initial set and preserve backups before importing it. Exclude credentials and sensitive account details. Show the source and applied paths, the proposed diff, and a way to restore the previous version. Do not publish the settings repository.

Use the [chezmoi quick start](https://www.chezmoi.io/quick-start/) for the current workflow. Start with a harmless setting, inspect `chezmoi diff`, and apply it after review. Confirm the program sees the change, then rehearse restoring the previous setting before managing permission files.

## Keep the record and the active files aligned

If the agent edits an applied file directly, it must capture that change back to chezmoi's source before a later apply overwrites it. Review the resulting source diff and commit the intended change. Do not broadly capture a directory that might contain tokens or account state.

Templates can express differences between machines, but test them before applying to a working setup. A startup file that references a missing program can break the next shell session. On WSL2, manage the Linux home deliberately rather than assuming it is the same as the Windows user's settings.

Keep an existing institutional configuration manager when it already does this job. Adding chezmoi should make settings easier to inspect and restore, not create a second authority that continually overwrites the first.

<!-- ===================== PART IV — WORK FROM A TERMINAL, OPTIONALLY ===================== -->

# 17. Run saved research commands yourself {#terminal-commands}

The terminal is useful when you want to run a saved command yourself, work on a remote machine, or inspect a job log beside the agent. It is an optional interface to the same files and programs, not a prerequisite for the research workflow.

For example, you can open the project folder in Terminal and run `just figures` to rebuild a plot from saved estimates. This chapter explains the folder, command, and output so you can recognize what ran. Appendix A covers optional terminal and editor conveniences.

## The terminal and the shell

A terminal is a window for typed commands and their output. A shell is the program inside it that interprets the commands. On a Mac, open Terminal through Spotlight (Command-Space, then type Terminal). For this guide's Windows route, open the Ubuntu environment installed through WSL2 (§1), either directly or through Windows Terminal. The examples below use a Unix shell, not PowerShell.

A prompt marks where the shell is waiting for input. Type or paste a command after it and press Return. Do not copy a prompt character from a tutorial as part of the command. A command can read or change files immediately, so have the agent explain an unfamiliar one before you run it.

Every shell has a *working directory*: the folder it uses when a command names a file without giving its full location. To see that folder and its contents, try:

```
pwd
ls
```

`pwd` prints that folder's path; `ls` lists its contents. Use `cd` to move to the project. Replace the example path with your own, retaining quotes if it contains spaces:

```
cd "/Users/your-name/Research/heat-birthweight"
pwd
ls
```

A path beginning with `/` is *absolute*: it gives a location starting at the top of the filesystem. A *relative* path such as `code/model.R` starts from the working directory. `~` means your home directory, and `cd ..` moves up one level. Confirm the working directory before running a command that writes files.

## Run a saved command

If the project has a justfile (§6), `just --list` shows its named recipes. Run an inexpensive check first. A *command not found* message can mean the program is absent or that its directory is missing from `PATH`, the list of folders the shell searches for programs. Ask the agent to identify the cause before reinstalling anything.

Programs normally print ordinary output and errors to the terminal. To save both, an example is:

```
just check > check.log 2>&1
```

This overwrites `check.log`; use a new name when an earlier log matters. Saving a log does not put the job in a queue; use §9 for long work. Control-C requests interruption of the program currently running in the terminal. It does not undo files already written or guarantee that other processes started by that program have stopped.

An environment variable is a named value available to a running program and usually to programs it starts. Credentials are often supplied this way. Use the vault procedure in §11 rather than typing secret values into commands, shell history, or startup files. A program that receives the value can read it.

## What a terminal does and does not keep alive

A terminal window displays a process; a multiplexer can preserve its session when that window closes (§17). A queue records and manages submitted jobs (§9). A pipeline runner determines which analysis steps need rerunning (§8). None makes computation continue while a laptop is asleep or after a process has been terminated.

For a remote server, use the institution's approved access and scheduling procedures. Installing an agent on that server is a separate data-processing decision: being close to the files does not mean their contents stay away from the model provider.

# 18. Use an agent from the terminal: Claude Code {#terminal-agents}

A terminal agent can be used interactively or called as one recorded step in a larger workflow. The latter becomes useful when each item needs language-model judgment and you want a saved input, output, and failure status for every run.

For example, a batch of approved documents can be assessed one case at a time without an ongoing conversation. The research guide's peer-review example additionally controls what each reviewer and judge receives. Starting a headless process enables unattended work; controlling its context requires further configuration and tests.

## Install and start

Follow the current [Claude Code quickstart](https://code.claude.com/docs/en/quickstart) for the supported installation route on your platform. Having the desktop app does not by itself establish that the `claude` command is installed. Ask the agent to check first. Complete account sign-in yourself and select the institutional subscription route you intend to use.

In the practice folder from §17, run:

```
claude
```

Read the folder-trust prompt before accepting it. Ask Claude to identify the project instructions it loaded and summarize `notes.md` without changing anything. Then request one small edit and inspect the saved file. The research guide explains project instructions and evidence for accepting a task.

The project directory determines ordinary relative paths; it is not by itself a boundary on everything the process can read. The access configuration in §2 still matters.

## Controls you will use

[Research chapter 5](https://dss-agentic-research.pages.dev/chapters/directing-work.html) explains when to plan and how much autonomy to give an agent. As of September 2026, the terminal documentation describes these controls; check their availability against the installed version's help and [interactive-mode documentation](https://code.claude.com/docs/en/interactive-mode):

| Control | Purpose |
|:--|:--|
| `/model` | Choose an available model and inspect its options |
| `/effort` | Set reasoning effort where supported |
| `/permissions` | Inspect and change permission rules |
| `/sandbox` | Inspect sandbox configuration |
| `/context` | Inspect context use |
| `/compact` | Summarize the current conversation to reduce context |
| `/usage` | Inspect account usage information |
| `/exit` | Leave the interactive session |

Shift-Tab cycles the available permission modes. The cycle can depend on account and configuration; check the displayed mode rather than assuming a fixed sequence. Use Auto for ordinary work inside reviewed boundaries, Plan when you want to settle the approach first, and Manual when inspecting individual approvals is useful. Save important decisions and next steps to project files before compacting or ending a session.

## A command that finishes without a conversation

The [CLI reference](https://code.claude.com/docs/en/cli-reference) documents print mode, `claude -p`, and the `dontAsk` permission mode. A harmless example that needs no file access is:

```
claude -p --permission-mode dontAsk "Explain a git commit in one sentence."
```

Print mode returns output and exits. `dontAsk` denies actions that would require a permission prompt; it does not grant general unattended access. Before automating a real task, test its exact tools, credentials, limits, output, and failure handling. Do not solve a refused operation by globally bypassing permissions.

Most scheduled research computation should run the saved pipeline directly. Add an unattended agent only for a step that actually requires language-model judgment, with a recorded input and checkable output.

## Configure a controlled research run

For the reviewer/judge example in research chapter 16, define a run record before launching a batch. It should identify the case, role, exact prompt and assigned inputs, model and available settings, permitted tools, loaded configuration, output location, and retry policy. Save stdout, stderr, exit status, and the raw response separately from parsed measurements. A process exit alone does not establish that a usable judgment was produced.

Default print mode can discover instructions, memory, skills, plugins, and MCP connections just as an interactive session can. The [headless documentation](https://code.claude.com/docs/en/headless) describes `--bare` for skipping this discovery. It also states that bare mode does not use subscription OAuth credentials: it requires an API or provider authentication route. Do not add it to a subscription workflow assuming authentication and billing stay the same.

Use the installed version's [CLI reference](https://code.claude.com/docs/en/cli-reference) to configure explicit inputs, tool availability, settings sources, and session persistence. Do not resume a prior case. Remove unnecessary tools and service connections; for a text-only judgment, a direct model call with the supplied text may be simpler. If file or network tools remain, their effective access must enforce the case boundary (§2). A fresh working folder and a read-only sandbox are insufficient by themselves: they do not exclude personal instructions or prevent reading other accessible files.

> Prepare two harmless case fixtures and a separate reviewer and judge configuration. List every source of loaded context and every available tool or service. Limit each role to its assigned inputs. Save the configuration and a run manifest. Demonstrate both a successful assigned-input read and a failed attempt to recover another case's marker, through each configured route. Do not use research data or start the full batch until the evidence is reviewed.

## Test the actual routes

Put a unique invented marker in case A and a different one in case B. Give run B only B's authorized input. Test both before and after a run on A, so you can distinguish ordinary file access from remembered context. Use a separate marker in a test instruction file or memory store to detect unintended configuration loading. Never use a credential or confidential text as a marker.

| Route | Required observation |
|:--|:--|
| Assigned input | B reads its own marker and produces the expected output structure |
| Conversation or resume state | B is a fresh run; A's conversation is not supplied |
| Personal/project instructions and memory | Loaded sources are recorded; unintended marker sources are excluded |
| Direct files and subprocesses | Attempts to read A fail under the configured controls |
| Connected services | Other cases cannot be retrieved with the available account and operations |
| Failure handling | A refused or malformed result is saved as a failure, not a valid missing label |

Save the configuration and the actual evidence, including refusals. A model saying it cannot remember the marker is weaker evidence than an observed access denial. A test covers the routes and version exercised; it does not certify future tools or all possible attacks. If a route cannot be tested, name it as unverified rather than calling the entire setup isolated.

This is a teaching procedure, not a completed containment trial for the reader's installation. The historical peer-review wrappers motivated it; they are not a substitute for testing the current tool and account. After these checks, validate a small batch against the research rubric before scaling up. A queue (§9) can manage the outer jobs, but its execution permissions need their own check.

## Run a model locally {#local-models}

A local model can keep inference on approved hardware and preserve access to a chosen set of weights. It can also be substantially less capable than the hosted model you normally use. The research guide's [Run and adapt models for your research](https://dss-agentic-research.pages.dev/chapters/research-models.html#local-models) explains that choice, its connection to data governance, and when fine-tuning may help. This section establishes a small trial before adding a model to a research pipeline.

### Install and start a local runtime

Use an existing approved model service if your institution supplies one. For a Mac trial, [Ollama](https://docs.ollama.com/quickstart) supplies a local model runtime. Check for an existing installation first. With Homebrew already configured (§1), the command-line installation is:

```
brew install ollama
```

For Linux or WSL2, follow Ollama’s platform instructions and check the actual GPU and memory available. Keep downloaded weights outside a cloud-synchronized research folder. The default Mac model directory is in your home folder under `.ollama/models`.

Ollama also supports cloud models and web search. Its [local-only setting](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features) disables those features. For a temporary foreground server, use a separate terminal window:

```
OLLAMA_NO_CLOUD=1 OLLAMA_HOST=127.0.0.1:11434 OLLAMA_CONTEXT_LENGTH=65536 ollama serve
```

Check for an existing server before starting another. Confirm the startup log says cloud features are disabled and the server is listening on localhost. This command does not set up a login service. Configuring a persistent service is a separate step; apply the same local-only setting to the process that actually serves requests. These settings govern Ollama, not every network-capable tool an agent might use.

### Download a small model and test inference

A modest trial model is [Qwen3 4B](https://ollama.com/library/qwen3:4b), distributed here as about 2.5 GB of quantized weights. This is a setup example, not a recommendation for a particular research measurement. In another terminal:

```
ollama pull qwen3:4b
ollama list
ollama run qwen3:4b
```

Ask a harmless question, then exit the interactive session with `/bye`. Record the runtime version and exact model digest, not just the tag: a tag can later refer to different bytes. The [local model-list API](https://docs.ollama.com/api/tags) exposes the digest and quantization. Memory needed during inference exceeds the download size and grows with context and concurrency; `ollama ps` shows the active allocation.

For an extraction or classification step, require a structured response and validate it. A small trial on this Mac illustrates why: the unrestricted request for one category produced explanatory text and hit the output limit. Supplying a JSON schema produced the required category object. That establishes behavior on the invented test input, not accuracy on research data. Keep malformed responses and retries in the record.

### Connect the model to an agent

[Ollama’s Claude Code integration](https://docs.ollama.com/integrations/claude-code) connects compatible models through an Anthropic-compatible endpoint. Its launcher can configure the integration; inspect proposed configuration changes before replacing an existing hosted-model setup. A process-scoped trial can instead supply the local endpoint and model explicitly.

> In a fresh folder containing only an invented marker file, configure one headless Claude Code run against the local Ollama endpoint. Use the downloaded model, explicit local authentication placeholder, bare mode, no saved session, no MCP servers, and only the Read tool. Permit that tool without enabling arbitrary command execution. Save the request, tool-call trace, raw result, and exit status. Confirm an actual read of the assigned file and the expected response. Do not modify my normal hosted-agent configuration or use research data.

The tested configuration used `ANTHROPIC_BASE_URL=http://127.0.0.1:11434`, an `ANTHROPIC_API_KEY` placeholder of `ollama`, and `--model qwen3:4b`. The placeholder is not a provider credential. The run used `--bare`, `--no-session-persistence`, `--strict-mcp-config` with an empty server list, and explicit Read-tool permissions. Use the installed CLI help to construct the complete invocation; do not copy only the endpoint and assume the remaining context is controlled.

The harmless local trial completed a two-turn file-reading task and returned the marker. It did not test all containment routes or establish that this model can perform research analysis reliably. CLI estimates of context limits or monetary cost for an unrecognized local model are not evidence of the actual runtime limits or a provider charge. Record the server configuration and observed run instead.

For restricted work, enforce the required file and network boundaries (§2), review the full chain of custody, and evaluate task quality before scaling up. Small distilled DeepSeek releases, large Kimi models, and Apple’s built-in model have different deployment and access routes; do not assume that every local model is an interchangeable backend for this launcher.

### Apple’s on-device model {#apple-on-device}

Apple supplies an alternative that uses the system model. On macOS 27, the built-in [`fm` command](https://developer.apple.com/videos/play/wwdc2026/334/) supports interactive use, saved scripting steps, and structured responses. Check `fm --help` and `fm respond --help` on the intended Mac before constructing a trial. The documented default is on-device inference; selecting Private Cloud Compute changes where the request is processed.

For Python workflows, Apple’s [Foundation Models SDK](https://github.com/apple/python-apple-fm-sdk) requires macOS 26 or later, Xcode 26 or later, Python 3.10 or later, and Apple Intelligence enabled on a compatible Mac. Add the SDK to the project’s recorded environment (§5), check model availability, and start with an invented input and a fixed output schema. Keep the package version and system information with the results. These Apple routes were checked against documentation on November 3, 2026; they have not been run in this guide’s local trial.

<!-- ===================== REFERENCE ===================== -->

# Appendix A. Optional working environment {#working-environment}

Optional conveniences support an existing workflow; none is a prerequisite.

## Terminal applications

If you want commands and job output visible side by side, a terminal with split panes can help. This chapter shows a small layout to try in iTerm2 on a Mac or Windows Terminal with Ubuntu WSL2. These applications also offer searchable output and reusable profiles. Keep the terminal you already use if it meets your needs.

### Try one useful layout

On a Mac, ask the agent to help install [iTerm2](https://iterm2.com/documentation.html) without replacing existing shell settings. Open the project in one pane and a read-only queue status command in another. Search the output for a task identifier, copy its result, and close the extra pane. If that improves your work, save the layout or profile.

On Windows, use the Ubuntu profile in [Windows Terminal](https://learn.microsoft.com/windows/terminal/). Confirm the working directory and Linux environment with the commands from §17. A neighboring PowerShell tab is a different environment.

Use legible fonts and a restrained color scheme. Special fonts are only needed if your chosen prompt requires their symbols. No terminal replacement or theme is required to run Claude or any of the project's saved commands.

## Shell and prompt

A shell interprets commands, and its prompt marks where you enter the next one. This chapter shows how an optional Oh My Posh prompt can display the current directory, git branch, and failed-command status, helping you check where you are before acting. Keep the shell your machine already provides: usually zsh on a current Mac, and often bash in Ubuntu.

### Add information before decoration

The useful question is whether you can tell which project and branch a command will affect. First use `pwd` and `git status`. If you switch projects often, a prompt that displays that information can help prevent mistakes.

[Oh My Posh](https://ohmyposh.dev/docs/) is the configurable prompt used here. It can work with an existing shell; adopting it does not require replacing the shell or adding a framework such as Oh My Zsh. Keep a simple existing prompt if it already provides the information you need.

> Preserve my existing shell startup files and show the proposed diff. If a prompt change would help, configure Oh My Posh to show the directory, git branch, and failed-command status. Test a fresh shell and explain how to restore the previous prompt. Do not replace unrelated aliases or environment settings.

Shell startup files execute commands, so review changes before opening a fresh shell. A harmless prompt change should not add credentials, start services, or change which R or Python a project uses. Test both your interactive shell and the agent's actual execution environment; they may load different startup files.

Further interactive conveniences can wait until you have a repeated need. They are not prerequisites for agent work, and installing a collection of aliases can make copied commands harder to understand.

## Persistent terminal sessions

Zellij groups terminal panes into a named session that you can leave and return to from another terminal window. This chapter shows how to try that with a harmless session and explains what continues running while you are away. It is useful when closing a window or losing a remote connection would otherwise disrupt your working layout.

### Try a session without important work

After installing Zellij through the selected package manager, create a practice session:

```
zellij --session practice
```

Use the on-screen key hints to create a second pane and detach. In another terminal window, inspect and reattach:

```
zellij list-sessions
zellij attach practice
```

Check that both panes and their harmless contents remain. The [Zellij user guide](https://zellij.dev/documentation/) documents keybindings and configuration; use the installed version's hints if a custom configuration changes them.

### Separate the session from the job

Detaching leaves the session's processes running while the host and session remain available. It does not protect against shutdown, lost storage, or a program failure. Restoring a layout after a restart is different from resuming the processes that previously occupied it.

Use pueue for a local job's submission record and result (§9), or the institutional scheduler on a cluster. Zellij provides a convenient place to inspect those jobs and their logs. On a remote machine, the session lives there; reconnecting your laptop does not revive a remote process that has died.

Keep an established multiplexer if it already works for you. The useful check is being able to detach and recover a harmless session before relying on it during important work.

## An editor beside the agent

Positron is an optional editor for inspecting R or Python code, data, and plots in one window. This chapter shows how to open a project in its recorded environment and review changes made by an agent working in the app or terminal. Keep RStudio, Stata, or an existing editor when it already supports your work.

### Open an existing project

Install through [Positron's official site](https://positron.posit.co/) if you want to try it, then open a practice project folder. Select the R or Python interpreter that belongs to the recorded project environment (§5). Confirm the version and library path before executing code; an editor can discover several installations.

Run a small existing analysis, inspect a dataframe in the [Data Explorer](https://positron.posit.co/data-explorer), and view its saved plot. Filtering or sorting the displayed table is useful for inspection, but those temporary views do not replace reproducible cleaning code.

### Review the agent's work in the editor

Have the agent make a small agreed change through your existing app or terminal session. Inspect the changed file, its diff, and its output in Positron. Both programs are working on the same files, so avoid simultaneous conflicting edits.

An AI extension or database connection is a separate addition with its own access and account requirements. You do not need one for this workflow. Keep the initial trial focused on whether the editor makes code, data, and results easier for you to inspect.

## Troubleshooting R launched by an agent on macOS

On the author's Mac, R has sometimes stalled when an agent launches it with output sent to another program or discarded, rather than connected to a terminal. The process keeps using a processor core but produces no output. This is an observed local problem, not a general property of R or every agent. Giving the process a *pseudo-terminal*, a software-created terminal connection, has been the dependable workaround in this environment.

The project should put the workaround in one executable file, `bin/rscript-pty`, rather than relying on the agent to remember it at each call:

```
#!/bin/sh
command -v script >/dev/null 2>&1 || {
  echo "No script command; cannot allocate a pseudo-terminal" >&2
  exit 127
}
exec script -q /dev/null Rscript "$@" < /dev/null
```

Have the agent route every R recipe through this helper, including checks and environment commands. For targets, run the pipeline in that same process with `callr_function = NULL` and disable crew for the initial test. Separately launched workers may not inherit the terminal connection. Verify a small run and its output before scaling up.

Earlier local tests succeeded with pueue's file-based logging and with crew. They do not establish that every queued or worker configuration is safe. The consistent baseline here retains the wrapper for queued R jobs too. Enable parallel workers only after testing the actual execution route and recording the evidence.

If the agent sandbox blocks pseudo-terminal allocation, the strict settings in §2 will refuse the call. Use a separately reviewed execution route or run the saved script in your own application; do not silently disable the sandbox. For Quarto that executes R, the equivalent macOS wrapper surrounds the whole render:

```
script -q /dev/null quarto render paper.qmd < /dev/null
```

Check the process and artifact as well as the returned status. If a process appears stuck, establish its identity and progress before stopping it; do not launch several replacements. Linux has a different `script` interface, so the macOS wrapper should not be copied unchanged there.

# Appendix B. Account-usage tools {#usage-tools}

Use Claude's own usage display to check the allowance for your account. This chapter also explains how ccusage can summarize past sessions from saved local logs, helping you identify where usage accumulated. Its token counts and monetary estimates may differ from your subscription balance or bill.

## What to inspect first

Check the app's usage controls or the terminal's `/usage` command. Limits depend on the account and can change; use the current [Claude usage guidance](https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits) and your institutional plan rather than a fixed number in this guide.

Long conversations, large inputs and outputs, model choice, and reasoning effort can increase usage. A model fit computing on your laptop does not itself consume language-model tokens merely because time passes. Repeatedly asking the agent for progress updates or having it read large logs can create additional calls to the language model.

## What ccusage adds

[ccusage](https://ccusage.com/guide/) summarizes compatible local logs by periods and sessions. Its coverage depends on which sessions were logged, retained, and available on this machine. Deleted logs, work on other machines, and unsupported interfaces can leave gaps. Cost estimates depend on the tool's pricing assumptions and are not an invoice.

> Check Claude's built-in usage information first. If the retained logs can answer my question, use a reviewed version of ccusage to summarize this week's largest sessions. Report the covered dates and missing sources. Separate measured token totals from hypotheses about why a session was expensive. Do not upload the logs or quote confidential contents.

Review and record the package version before running it. A package executed through npx is still downloaded code, even if it is not installed permanently.

## Use the result to change a habit

Compare the report with sessions you remember, and look for an actionable pattern: whole data files read into context, repeated full builds, or a long conversation that should have ended after its task. Read selected log lines instead of streaming everything. Queue long computations and inspect their status and outputs (§9).

A missing session is a coverage problem to investigate, not evidence of zero use. Retained logs may themselves contain confidential material; apply the project's access and retention rules to them.
