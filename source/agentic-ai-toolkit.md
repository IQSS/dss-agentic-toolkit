---
title: "Extending Your Agent's Toolkit"
subtitle: "A Guide for Researchers"
version: "2.3 draft"
---

<!-- ===================== PART I — FOUNDATIONS ===================== -->

# 1. Choose tools for a research need {#choose-tools}

This guide shows you how to get an AI agent to use tools that support your research. You choose what you want to accomplish and what access to allow; the agent installs, configures, and runs the tools. You do not need to learn to operate each tool yourself.

Additional tools are useful when they remove a specific obstacle to research: a fit that stops when a session closes, a figure revision that reruns every model, or a collaborator who cannot restore your software. Begin with that problem. Keep an existing tool when it already provides the required behavior and evidence.

The companion research guide follows a [synthetic study of heat exposure and birthweight](https://dss-agentic-research.pages.dev/chapters/example-project.html). Suppose you need 100 simulation runs for that study. You want a few running at once, the rest waiting, and a record of failures to inspect later. A queue addresses that need. It does not choose the simulation design, decide whether the estimates are valid, or make a sleeping laptop compute. Understanding that division of work is more useful than installing a large collection of tools.

The companion [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/) explains delegation and research judgment. This book explains tools that help carry out those decisions. You can ask the agent to install and operate them from the app. Most chapters do not require you to use a terminal. Sign-ins, passwords, and decisions about access remain yours.

Use this book as a reference. After this overview and the boundaries chapter, choose the capability your research needs. Each tool chapter can be used independently; follow its links when you need a supporting setup or explanation.

## Find the problem you need to solve

::: {.toolkit-lookup}

| Research need | Start here |
|:--|:--|
| **Foundations** | |
| Check what a new tool can read, change, or send | §2: Control what added tools can access |
| **Essential tools** | |
| Install tools through a maintained package manager | §3: Install and manage tools with [Homebrew](https://brew.sh/) |
| Record changes and recover a working state | §4: Recover earlier work: [git](https://git-scm.com/) and [gh](https://cli.github.com/) |
| Repeat research tasks with saved commands | §5: Give research tasks reliable commands: [just](https://just.systems/) |
| Keep a batch moving unattended | §6: Keep unattended jobs moving: [pueue](https://github.com/Nukesor/pueue) |
| Find research files or inspect a saved service response | §7: Find research files efficiently: [ripgrep](https://github.com/BurntSushi/ripgrep), [fd](https://github.com/sharkdp/fd), [jq](https://jqlang.org/), [yq](https://mikefarah.gitbook.io/yq/), [bat](https://github.com/sharkdp/bat) |
| **Reproducible research workflows** | |
| Restore the language and packages used for an analysis | §8: Preserve a software environment: [rig](https://rig.r-lib.org/), [renv](https://rstudio.github.io/renv/), and [uv](https://docs.astral.sh/uv/) |
| Rerun only steps affected by a change | §9: Rerun only affected steps: [targets](https://docs.ropensci.org/targets/) and [Snakemake](https://snakemake.readthedocs.io/) |
| Run work in a separately configured environment | §10: Run work in a separate environment: containers |
| Rebuild documents from saved research outputs | §11: Generate documents from research outputs: [Quarto](https://quarto.org/) and [Pandoc](https://pandoc.org/) |
| **Connect to data and services** | |
| Supply credentials without storing them in research code | §12: Keep credentials out of research files: [1Password](https://1password.com/) and [direnv](https://direnv.net/) |
| Reach an approved library or service | §13: Connect to research data and services: [MCP](https://modelcontextprotocol.io/) |
| Inspect or interact with a website | §14: Inspect and interact with a browser |
| **Run and coordinate agents** | |
| Coordinate agents in one project or separate working copies | §15: Divide work between agents: shared projects and git worktrees |
| Run an agent from recorded requests with controlled inputs | §16: Run agents from saved requests |
| Run a model on your own computer | §17: Run a model on your own computer |
| **Work from the terminal** | |
| Work with an agent and run saved commands in a terminal | §18: Use an agent from the terminal: [Claude Code](https://code.claude.com/docs/en/overview) |
| **Reference** | |
| Choose terminal, shell, session, or editor conveniences | Appendix A: Optional working environment |
| Keep a recoverable record of personal tool settings | Appendix B: Keep records of shared settings: [chezmoi](https://www.chezmoi.io/) |
| Check account usage and investigate past sessions | Appendix C: Account-usage tools |
| Diagnose recorded execution and document-build problems | Appendix D: Troubleshooting |
| Understand terminal history and terminology | Appendix E: Terminal vocabulary |

:::

## Add only what the project needs

Installed programs extend what the agent can do through its command tool. Connections expose functions supplied by another service. Instructions tell the agent when and how to use either. Installation alone does not teach a reliable procedure: a queue needs resource limits and an outcome check; an environment manager needs a maintained version record.

Each chapter begins with the research problem and an example, then explains what to ask the agent to set up, run, and check. Examples connect the tools to research tasks; smoke tests use a small portion of the actual workflow before a large batch. Where a procedure comes from a recorded run or has not yet had a clean-installation trial, the text says so. We are Data Science Services at Harvard's Institute for Quantitative Social Science; the examples draw on our research-support work.

## Tell the agent how to use installed tools

A newly installed tool can go unused, or be used incorrectly, unless the agent has instructions for it. This chapter shows how to record when to use a tool, what limits apply, and which results to report. The research guide's [project-context](https://dss-agentic-research.pages.dev/chapters/project-context.html), [shared-conventions](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html), and [reusable-procedures](https://dss-agentic-research.pages.dev/chapters/reusable-procedures.html) chapters explain the instruction files and skills that hold those procedures.

### Start with short, specific instructions

A machine-wide convention can live in your personal `CLAUDE.md`. A project's commands, resource limits, and data-access rules belong with that project. Keep an established instruction layout rather than creating a second one for this guide.

For example:

- Submit long jobs through pueue, record the task identifier, and verify both completion status and expected outputs.
- Fetch required credentials from the approved vault for the command that needs them. Never print or commit their values.
- Use the project's recorded environment. Report proposed dependency changes before applying them.

Each line names an action and a check. “Use pueue” alone leaves the agent to guess how to establish that a job succeeded. Keep a short inventory of installed tools and their purpose alongside these instructions.

### Package procedures only when they recur

A skill can hold a recurring procedure such as submitting a job, inspecting its status, and reporting failure. Start with a standing instruction; add the longer procedure if you repeatedly need the same correction. Hooks can run checks at specified events, but are executable configuration that needs review. Neither instructions nor hooks replace a data-access boundary (§2).

### Check that the instruction is used

When the agent next performs the relevant project task, have it follow the recorded procedure and report the commands, outputs, and any failures. If it overlooks a tool or convention, correct the maintained instructions so the next session has the same guidance.

## Use the environment you have

The main routes are macOS and Ubuntu Linux; Windows readers can use Ubuntu through WSL2. [R](https://www.r-project.org/), [Python](https://www.python.org/), and [Stata](https://www.stata.com/) users can keep their research language. A master do-file may already provide the workflow you need, and Stata's language and community-command versions still need recording.

An app, terminal, remote session, and [WSL](https://learn.microsoft.com/windows/wsl/) session may have different tools and credentials. Check the actual session in which research will run. For Windows, consult the [desktop WSL documentation](https://code.claude.com/docs/en/desktop-wsl) before assuming that a locally installed tool or connector is available there. Platform-specific clean-installation trials are recorded separately from tests on the author's configured Mac.

Product interfaces and access controls change faster than the purposes of these tools. Consult the linked primary documentation for the installed version, and have the agent check the actual workflow before scaling it up. This November draft is prepared for author review; publication and remaining account-dependent trials follow that review.

# 2. Control what added tools can access {#tool-access}

An agent may need your project's code and approved inputs without needing access to other studies, personal files, or every account you use. Adding a tool can give it another way to reach those resources. Decide what the work requires, then have the agent configure the corresponding file, command, and network controls. The research guide's [data-governance chapter](https://dss-agentic-research.pages.dev/chapters/research-limits.html) explains which data may be processed where.

For example, an agent developing analysis code could read simulated inputs and write figures, while the original participant records remain inaccessible. If it later submits a job through [pueue](https://github.com/Nukesor/pueue), that job runs under a separate queue service. The service's access must also fit the task; restrictions on the command that submits a job do not automatically restrict the job itself.

![](figures/tool-access-routes.svg){#fig-tool-access-routes fig-alt="Ordinary commands and queued jobs can run under different processes and permissions. Check the files, network, and credentials available to each route."}

## Decide which files and services the task needs

Give the agent concrete locations and allowed actions: read these inputs, write to these output folders, contact these services, and leave these other resources inaccessible. Include browser sessions and connected accounts as well as local files. A read-only connection can still send its contents to a hosted model.

Written project instructions explain your intentions. In [Claude Code](https://code.claude.com/docs/en/overview), permission rules determine whether matching tool calls are allowed, refused, or require approval. A sandbox uses operating-system controls to restrict the programs running inside it. [Containers](#containers) can provide a separately configured environment. Each has a different job; an instruction to avoid a folder is not an operating-system restriction on reading it.

## Have the agent configure and check the controls

The following example belongs in a project's `.claude/settings.json`. It keeps approved raw inputs readable but blocks changes to them, denies access to a restricted-data folder, and protects the project settings. Adapt it to the actual paths and managed policy using the current [permissions](https://code.claude.com/docs/en/permissions) and [sandbox](https://code.claude.com/docs/en/sandboxing) documentation.

```json
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
    "network": {"allowedDomains": []}
  }
}
```

The file-tool rules and sandbox paths use different path conventions. This example is project-scoped; it does not list every sensitive location on your computer. Settings from other scopes may also contribute permissions. Have the agent inspect the effective configuration rather than assuming this file replaces every existing setting.

> Configure access for this task: [approved inputs, writable outputs, permitted services, excluded resources]. Inspect the existing project and managed settings first. Explain which controls cover file tools, shell commands, queued jobs, and connected services. Propose the necessary changes, then test allowed and denied operations with harmless substitute files. Report actual outcomes and any routes that remain untested.

You decide permitted access and handle any personal or institutional authorization. The agent performs the configuration checks. Using harmless files here tests whether restrictions work before protected material is involved; it is not a separate practice exercise. These tests can reveal mistakes but cannot certify every possible execution route.

## Handle a blocked operation deliberately

A blocked command may need a queue socket, a system installation, an application connection, or a pseudo-terminal for the [observed R-on-macOS issue](#r-on-macos). Have the agent identify the required access and explain a specific solution. Avoid blanket exemptions for entire categories of commands.

If approved work runs outside the sandbox, record what protects that execution instead. A queued job uses the queue service's permissions. A browser may use a signed-in account. A command supplied with a credential can read that credential. For restricted analysis, use an environment that meets the data requirements rather than widening access until a command works.

Keep the resulting configuration with the project and repeat relevant checks when the execution route changes. Protect both active settings and any managed source copies that can overwrite them; [Appendix B](#shared-settings) explains that distinction. On Linux or [WSL2](https://learn.microsoft.com/windows/wsl/), ask the agent to check platform-specific sandbox requirements. Native Windows is outside this guide's setup route.

<!-- ===================== PART II — ESSENTIAL TOOLS ===================== -->

# 3. Install and manage tools with Homebrew {#adding-tools}

A package manager installs software, obtains the supporting software it needs, and provides a consistent way to update or remove it. [Homebrew](https://brew.sh/) does this for many of the tools in this guide. Once it is available, you can ask the agent to add a tool by name instead of working through a different download and installer for each one.

Suppose you want the agent to run a batch of model fits unattended. It needs [pueue](https://github.com/Nukesor/pueue), the queue described in [chapter 6](#job-queues). Homebrew can install pueue; the agent then configures the queue and uses it for your project. Installation makes the program available, while your instructions tell the agent when to use it.

## Establish the installation route once

Ask the agent to check whether Homebrew and the required tool are already installed. Keep an institution's working package-management arrangement where it meets the need. On a Mac, the agent should identify the machine architecture and current prerequisites before following [Homebrew's installation instructions](https://docs.brew.sh/Installation). Those instructions include a package installer for supported Apple Silicon Macs and a command-line route.

The agent can prepare the installation and explain any action you must take. You handle password prompts, installer dialogs, and institutional authorization; never paste a password into the conversation. If you need to enter a command yourself, the [terminal chapter](#terminal-agents) explains the interface. The package route is documented, but this edition has not tested it as a complete installation on a new Mac.

> Check whether Homebrew and pueue are already available in this session. If Homebrew is missing, identify the supported installation route and any step I must complete. Install pueue if needed, check that the agent can invoke it, and configure it for this project's unattended jobs. Record the installation and how future sessions should use it.

For an installed Homebrew, the tool-installation command in this example is `brew install pueue`. The agent runs it and handles ordinary installation diagnosis. Homebrew's noninteractive options do not remove operating-system password requirements.

## Keep installation records useful

The agent should report what it installed and the version available to the session doing the work. A program may be installed but missing from that session's `PATH`, the directories searched for commands. Have the agent diagnose that before reinstalling it; a newly opened app session may inherit updated settings.

A `Brewfile` records a set of Homebrew packages, which helps rebuild a machine. It does not lock every dependency of a research analysis. Keep the project's language and package records separately, using the [environment tools](#environments). Updates to machine tools and changes to an analysis environment should be deliberate, especially when existing results depend on particular versions.

Add a standing instruction: use the established package manager, check for an existing installation, record new tools, and use them in the relevant project workflow. There is no need to install every tool in this book.

## Windows and Linux

This guide's Windows route uses Ubuntu through [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/windows/wsl/install). Keep the project and Linux tools in the same distribution. A Windows installation is not automatically available as a Linux program.

Homebrew also supports Linux under its documented requirements. If an institution already supplies suitable packages through Ubuntu or a managed environment, use those. The agent should record any important differences in command names or configuration. Follow the platform's own installation instructions rather than copying the Mac setup.

# 4. Recover earlier work: git and gh {#version-control}

Research projects change continually: exclusions are revised, models are replaced, and manuscripts are rewritten. [Git](https://git-scm.com/) records selected versions of project files so the agent can explain those changes or recover earlier work. It gives a project a history that survives the conversation in which the work happened.

Suppose a revised sample rule unexpectedly removes half the observations. Ask the agent to identify the change, preserve its explanation, and restore the relevant rule from the last working version while keeping unrelated manuscript edits. You judge whether the sample rule is appropriate; the agent uses the history to find and recover the code.

## Git, GitHub, and gh have different roles

A git *repository* holds the project history locally. A *commit* records a chosen set of changes with a description; a *diff* shows how file contents differ. The agent can create meaningful checkpoints as work progresses without requiring you to inspect every code diff.

[GitHub](https://github.com/) hosts repositories for sharing and collaboration. Its command-line tool, [GitHub CLI (`gh`)](https://cli.github.com/), lets the agent work with issues, proposed changes called pull requests, and automated checks. You can use git without GitHub. Publishing or pushing to any remote host sends files there, including when the repository is private, so decide what may be shared first.

## Ask the agent to maintain the history

> Inspect this project's existing repository and preserve uncommitted work. If it has no repository, set one up for code, documentation, and appropriate configuration, excluding protected data, secrets, generated libraries, and large caches. Record meaningful checkpoints as you complete tasks. Summarize changes that affect the analysis or reported results. Ask before publishing files or rewriting shared history.

The agent should check existing author settings and ask for your identity only if it is missing. It should stage intended files rather than indiscriminately include every changed file. A project instruction can make this the default for future sessions.

For recovery, name the outcome you want: “Restore the model specification before yesterday's sensitivity analysis, keeping the new figures and manuscript edits.” The agent should determine which files and commits are relevant and check the recovered workflow. It should preserve unrelated work and explain anything it cannot recover. Git does not recover untracked files or undo an external upload or database change; backups and access controls still have their own roles.

## Connect to collaborators when needed

Use your lab's existing repository host and authentication. For GitHub, have the agent configure `gh` using its [documented sign-in route](https://cli.github.com/manual/gh_auth_login). You complete the browser sign-in. The agent checks authentication without displaying secrets and reports whether credentials use a system store or a fallback file. Keep working institutional or SSH authentication if it already meets the need.

Once sharing is authorized, the agent can prepare a pull request, summarize what changed, and report the project's checks. Your attention belongs on research decisions and outputs. A diff remains available when you want to investigate a particular change; routine manual code inspection is not required to maintain useful history.

## Keep repository storage separate from synced documents

Git's internal `.git` directory changes frequently. On the author's Mac, a new repository under [Dropbox](https://www.dropbox.com/) is excluded from synchronization before its first commit. The agent runs and checks these steps separately:

```
git init
xattr -w com.dropbox.ignored 1 .git
xattr -p com.dropbox.ignored .git
```

The last command must report `1` before the history is populated. This is a Dropbox-specific procedure. The same before-population principle applies to generated libraries and caches. If Dropbox has already indexed a populated directory, adding the attribute does not reliably remove the existing contents from synchronization. Have the agent preserve the files and migrate generated storage outside the synced tree; do not delete a repository's history to fix synchronization.

In [WSL2](https://learn.microsoft.com/windows/wsl/), keep the repository and its git operations in the Linux environment. Mixing Windows and Linux tools over one working directory requires care with filesystem and configuration differences.

# 5. Give research tasks reliable commands: just {#project-commands}

<!-- aliases: runnable-checks -->

A *command runner* gives names to the operations your project needs: fit a model, rebuild figures, check inputs, or regenerate the paper. [Just](https://just.systems/) stores those commands in a small text file called a `justfile`. The agent can use the same commands repeatedly, and you or a collaborator can run them without another conversation with a model.

In the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html), changing a figure label should not require refitting every model. A command such as `just figures` can redraw plots from saved estimates, while `just fit` runs the model. The benefit comes from both a modular analysis and dependable commands for selecting the work to run.

## Give the commands independently runnable work

Installing just does not make a monolithic analysis selective. Have the agent identify coherent steps with explicit inputs and saved outputs: prepare the analysis data, fit a specified model, generate a figure. Put shared functions in reusable code. A step may be a script or a function; there is no target number of files.

The agent then records commands for those steps and useful combinations. The research guide's [modular-workflow chapter](https://dss-agentic-research.pages.dev/chapters/research-workflows.html) explains the research benefits. Here the task is to make that structure easy to execute consistently, preserving the analysis's intended behavior.

> Inspect the current analysis and identify which steps can run independently. Preserve a working baseline, then organize the code so we can refit a selected model, regenerate figures from saved estimates, and rebuild the complete analysis. Reuse shared functions. Add just recipes with clear inputs and outputs, and record when future agents should use each one. Run a smoke test before a full batch and report any changed results.

Keep an existing master do-file, [Make](https://www.gnu.org/software/make/) setup, or other working command system when it already provides the needed execution. Avoid creating a second list of commands that drifts from the first.

## How just fits with other runners

| Tool | What it does for the project |
|:--|:--|
| just | Saves named commands for individual tasks and useful combinations. |
| Make | Uses declared file dependencies and timestamps to decide which outputs need rebuilding; also commonly exposes named project commands. |
| [targets](https://docs.ropensci.org/targets/) | Tracks dependencies in an [R](https://www.r-project.org/) workflow and reuses results that remain current. |
| [Snakemake](https://snakemake.readthedocs.io/) | Coordinates rules that produce files from inputs, often across languages and computing environments. |

Just and a dependency-aware runner work well together. A `just build` recipe can invoke targets or Snakemake; that runner decides which analysis steps need updating. Other just recipes can open a preview, check the project, or render a document. [Chapter 9](#pipeline-dependencies) develops this combination.

## Make the recipes part of normal agent work

Ask the agent to install just through [Homebrew](https://brew.sh/) or the project's established tool manager, then create and maintain the recipes. Each recipe should name an outcome rather than a long implementation detail. `just --list` lists the available tasks.

A concise project instruction might read: “Use the justfile for analysis and document commands. After a figure-only change, rebuild the affected figure from saved results. After changing a model, rerun the affected fit and downstream outputs. Report the commands used and whether their expected outputs were produced.”

The full reproduction command should still exist. Selective execution makes development efficient; the complete command gives collaborators a documented route through the project.

## Run a smoke test before the main batch {#smoke-tests}

A *smoke test* is a small, representative run through the actual workflow to catch execution problems before committing substantial time or computation. Have the agent run one model specification, a few simulation repetitions, or a small document batch through all the relevant stages. It should confirm that inputs are found, required software runs, and expected outputs are saved in the right form and location.

Use the same code and environment as the main batch, with a smaller workload selected by a recorded option. Keep smoke-test outputs separate so they cannot be mistaken for final results. A pipeline that runs successfully may still implement the wrong method; scientific checks have a different purpose.

> Add a smoke-test command that runs a representative case through this workflow using its existing code. Keep its outputs separate from the full analysis. Run it, diagnose any failure, and confirm the expected artifacts before launching the batch. Save the command so future agents can repeat it after relevant changes.

## Keep substantive checks runnable {#runnable-checks}

Expose useful checks through the same command system. If a join must preserve the number of observations, have the agent add a check that fails when duplicate keys would expand the data. Checks should reflect the specification and use independently established expected behavior, rather than repeat the implementation's own calculation.

Keep quick execution checks separate from expensive validation. The research guide explains [simulation against known truth](https://dss-agentic-research.pages.dev/chapters/simulation.html) and [independent implementations](https://dss-agentic-research.pages.dev/chapters/checking-analysis.html). The recipes make those procedures easy to run; they do not decide whether the methods or conclusions are appropriate. For the observed R-on-macOS execution problem, have the agent route relevant recipes through the [documented wrapper](#r-on-macos).

# 6. Keep unattended jobs moving: pueue {#job-queues}

Research computations often need less attention than they need time. A queue lets prepared jobs continue while you are away, automatically starting the next job when capacity becomes available. Its record of outcomes lets you identify what finished and what needs investigation when you return.

Suppose the [heat-and-birthweight sensitivity analysis](https://dss-agentic-research.pages.dev/chapters/example-project.html) needs 100 independent fits, but the computer can comfortably run four at once. You submit the batch before leaving. As each fit finishes, the queue starts another without waiting for you or an agent to intervene. The next morning, ask the agent to summarize completed results and diagnose failed jobs. This is an illustrative workload, not a promise that all 100 fits finish overnight.

![](figures/job-queues.svg){#fig-job-queues fig-alt="Many waiting jobs feed four available execution slots. Whenever a running job finishes, pueue automatically starts the next waiting job. Completed jobs retain outputs and success or failure status." above="8pt" below="8pt"}

## Separate submission from execution

[Pueue](https://github.com/Nukesor/pueue) runs a background service that manages commands submitted to it. The service records the command, working directory, output, and status, and limits simultaneous jobs. Closing the conversation that submitted a job need not stop its computation.

The computer must remain awake and the service available. A reboot can interrupt work. After an interruption, inspect the queue and outputs before restarting: the queue's record does not itself let a model fit resume halfway through. That requires checkpoints saved by the fitting program.

Use a queue for recurring long fits, simulations, or batches of independent work. Run short commands directly when their outcome can be checked immediately. Keep an institutional scheduler for work already running on a cluster.

## Choose a limit from the jobs' resource needs

Have the agent run a representative job through the actual queue as a [smoke test](#smoke-tests), checking its outputs, memory use, and internal threads. Then choose a concurrency limit that leaves room for the rest of the machine's work. Four queued fits using four threads each can demand sixteen threads; four available slots do not mean the fits each use one core.

Ask the agent to inspect the command and environment before submitting a large batch. A queued command runs with the queue service's access, which can differ from the agent command tool's sandbox (§2). Configure the intended route and test it with harmless inputs. The queue controls when a job runs; it does not automatically inherit the agent's access restrictions.

> Set up pueue if needed and use it for this project's sensitivity fits. Run a representative fit through the queue first, confirm its saved output, and use its memory and thread requirements to choose a concurrency limit. Then submit the batch with task IDs, working directories, logs, and final results recorded. Preserve the project environment and report failed jobs without silently resubmitting them.

## Check the outcome, including failures

Have the agent retain each task ID. Submission confirms that the service accepted the command; it does not establish that the command ran successfully.

| State | Evidence to inspect |
|---|---|
| Waiting | The recorded command, inputs, working directory, and place in the queue |
| Running | Actual process status plus an advancing log or expected intermediate output |
| Succeeded | Successful stored result and the expected output artifact |
| Failed | Failure status and log explaining what stopped; no silent resubmission |

For a project with the `fit` recipe from §5, the agent can submit `just fit`:

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

This JSON check follows pueue 4.0.4's stored-result shape. `pueue wait` returns after waiting even when the job failed; its own successful exit does not prove job success. Have the agent also check the fit artifact. A successful command that wrote to the wrong folder has not completed the research task.

Common setup failures include an absent service, a blocked service socket, and the wrong working directory or environment. Distinguish these from model errors. For the observed macOS [R](https://www.r-project.org/) problem, follow the [R troubleshooting procedure](#r-on-macos) for both direct and queued execution until the actual route is verified.

## Combine a queue with a pipeline when useful

[Targets](https://docs.ropensci.org/targets/) and [Snakemake](https://snakemake.readthedocs.io/) (§9) decide which dependent steps need to run. Pueue can submit the outer command and retain its outcome after the submitting session closes. A saved command (§5), a dependency runner (§9), and a queue solve different problems; use the ones the project needs.

On [WSL2](https://learn.microsoft.com/windows/wsl/), run the service in the project's environment and test its lifetime. Microsoft's [systemd guidance](https://learn.microsoft.com/windows/wsl/systemd) says that systemd services do not keep a WSL instance alive. Do not assume work survives shutting down the distribution or Windows.

# 7. Find research files efficiently: ripgrep, fd, jq, yq, bat {#finding-files}

Your computer already has ways to find files, search their contents, and read text. The tools here give an agent faster searches, convenient filters, or structured queries for those familiar tasks. They help it locate relevant evidence without loading whole directories or long service responses into the conversation.

Suppose a reviewer questions how `hot_days` enters the analysis. The agent needs to find where that variable is created, used in a model, and labeled in figures. [Ripgrep (`rg`)](https://github.com/BurntSushi/ripgrep) searches the project text and reports matching files and line numbers. “Ripgrep” is the tool's name; `rg` is the command the agent runs.

## What each tool improves

| Familiar task | Tool | What it adds |
|:--|:--|:--|
| Search text across files | ripgrep (`rg`) | Fast recursive searches, file-type filters, and useful defaults for ignoring irrelevant files. |
| Find files by name | [fd](https://github.com/sharkdp/fd) | Concise filtering by name, extension, or file type. |
| Inspect a JSON response | [jq](https://jqlang.org/) | Queries fields and transforms structured data without fragile text matching. |
| Inspect YAML configuration | [yq](https://mikefarah.gitbook.io/yq/) | Queries or edits the document's structure rather than treating it as unstructured lines. |
| Read a source file | [bat](https://github.com/sharkdp/bat) | Readable output with syntax highlighting and line numbers. |

Text search and file listing usually have preinstalled alternatives. JSON and YAML querying may require an additional tool. Keep adequate existing tools, especially on a managed server; the point is to improve the agent's work rather than standardize every machine unnecessarily.

## Ask the agent to use them in the project

> Find where hot_days is constructed, used in model formulas, and labeled in figures. Use ripgrep for text search, report the relevant paths and lines, and explain the search scope. If a saved JSON or YAML response is relevant, query the required fields rather than printing the whole file. Install a missing tool through the established package manager only when needed. Record these tool choices in the project instructions.

Ripgrep normally respects ignore files and skips hidden files. That reduces noise, but a missing match can mean a file was excluded. Have the agent check its [search scope](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) before concluding that a variable is unused. Ignore rules do not grant or restrict permission to read files.

For structured data, the agent should distinguish an absent field from a field containing an explicit null. It should report relevant values and their source without filling missing values from its expectations. Unrelated tools share the name `yq`; the Mike Farah implementation linked above is the one used here. The agent should confirm the installed implementation before constructing a query.

On some Linux installations, the commands are named `fdfind` or `batcat`. Record the names available in the working environment rather than installing another copy merely to match an example. The agent should perform the lookup and check its interpretation; you should receive an answer tied to the project's actual files.

<!-- ===================== PART III — REPRODUCIBLE RESEARCH WORKFLOWS ===================== -->

# 8. Preserve a software environment: rig, renv, and uv {#environments}

An analysis depends on both the research language and the packages loaded into it. Recording their versions helps a collaborator reproduce the work and lets you investigate a software update without losing the earlier environment. These are two separate jobs even when one tool handles both.

Suppose a collaborator reruns the [synthetic heat-and-birthweight analysis](https://dss-agentic-research.pages.dev/chapters/example-project.html) and obtains different intervals. The agent should be able to restore the recorded [R](https://www.r-project.org/) or [Python](https://www.python.org/) version and the recorded packages before investigating the discrepancy. “Install the latest version” cannot reconstruct the software used for the original result.

## Record the language and the packages

The *runtime* is the installed language interpreter, such as a particular R or Python release. Project packages are the additional libraries used by the code. A *lockfile* records resolved package versions and their dependencies so they can be restored together.

| Responsibility | R | Python |
|:--|:--|:--|
| Install/select the language version | [rig](https://rig.r-lib.org/) manages R installations. | [uv](https://docs.astral.sh/uv/) can install and select Python; `.python-version` records the project's selection. |
| Record/restore project packages | [renv](https://rstudio.github.io/renv/) uses `renv.lock`. | uv uses `pyproject.toml` and `uv.lock`. |

Renv records the R version but does not install or switch R itself. Rig supplies that separate capability. Uv covers both responsibilities, but selecting Python and locking packages still produce distinct records. Preserve an existing adequate environment manager. [Stata](https://www.stata.com/) users should record Stata and community-command versions and their sources; no second language is required.

## Capture working versions before changing them

> Inventory this project's language, packages, system dependencies, and existing environment records. Preserve the versions and a baseline output before making changes. Use rig plus renv for the required R setup, or uv for Python, unless the existing manager already does the job. Capture the complete dependency record without upgrading the working environment. Restore it separately and run the project's relevant checks; report discrepancies.

For a new project, give the agent the intended language and required packages. It should establish the version records as part of setup. For an existing project, avoid a migration that quietly upgrades software just to make installation easier.

A package addition may bring dependencies with it. Have the agent report actual additions, removals, and changed versions, and run the affected checks. You decide whether a change that could alter results is appropriate; the agent performs the environment comparison and restoration.

## Check restoration, not just the presence of a lockfile

Have the agent verify the selected runtime and restore packages into a separate environment. For R it can inspect `renv::status()` and restore the recorded library. For Python, a [locked sync](https://docs.astral.sh/uv/concepts/projects/sync/) such as `uv sync --locked` refuses to silently update a stale lockfile. Keep the working environment intact while checking restoration.

Ask it to execute the project's smoke test or selected baseline analysis and report whether the expected outputs agree. Missing system libraries, unavailable package versions, or platform differences may prevent restoration; those are findings to record and resolve. A lockfile does not preserve the operating system or guarantee identical numerical results across all hardware.

![](figures/research-environments.svg){#fig-research-environments fig-alt="The language and packages are recorded in a version record, then restored in a separate environment and checked against a baseline output."}

## Include system requirements when needed

Compilers and spatial libraries may need separate installation. Have the agent document those requirements and use [containers](#containers) when packaging the system software would help. Keep a working [conda](https://docs.conda.io/) environment, or consider [pixi](https://pixi.sh/) for a conda-based scientific stack, rather than forcing an unnecessary migration.

Keep generated libraries out of [git](https://git-scm.com/) and cloud synchronization before populating them; [chapter 4](#version-control) explains the local Dropbox procedure. On the author's affected Mac, R environment commands use the [pseudo-terminal wrapper](#r-on-macos). In [WSL2](https://learn.microsoft.com/windows/wsl/), create the environment inside the Linux distribution where it will run. Ask the agent to check the target platform before promising a collaborator that the environment is portable.

# 9. Rerun only affected steps: targets and Snakemake {#pipeline-dependencies}

A named command makes a workflow easy to invoke. A dependency-aware pipeline runner adds a decision: which results need rebuilding after something changes? Use [just](https://just.systems/) to expose the project's commands and [targets](https://docs.ropensci.org/targets/) or [Snakemake](https://snakemake.readthedocs.io/) to track the analysis steps underneath. They can work together: `just build` starts the pipeline, which reuses results that remain current.

In the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html), changing specification B should rerun fit B and its downstream figure while reusing fit A. Changing the shared cleaning rule should affect both fits. Recording those relationships saves computation and helps prevent a manuscript from using outputs that no longer match the analysis.

## Declare what each step depends on

| Step | Depends on | Produces |
|:--|:--|:--|
| Clean | Approved input file and cleaning rules | Analysis data |
| Fit A | Analysis data and specification A | Saved fit A |
| Fit B | Analysis data and specification B | Saved fit B |
| Figure | Both saved fits and plotting code | Figure and plotting values |

Targets tracks declared [R](https://www.r-project.org/) objects, functions, and file inputs. Snakemake describes rules for producing files and considers declared inputs, code, parameters, and environments when deciding what to rerun. Both need the agent to declare external dependencies explicitly. A changing API response or script cannot be tracked correctly if the workflow never records it as an input. See the [targets manual](https://books.ropensci.org/targets/) and [Snakemake's execution documentation](https://snakemake.readthedocs.io/en/stable/executing/cli.html).

After an interruption, the runner can reuse completed results that remain valid. Resuming halfway through an individual fit requires checkpoints from the fitting program itself.

## Have the agent connect the existing analysis

> Preserve the current environment and baseline results. Build a targets pipeline for this R analysis, declaring data, script files, functions, and outputs as dependencies. Keep the justfile as the project's command interface: its build recipe should invoke the pipeline, while separate recipes expose quick checks and document rendering. Show the dependency graph and expected reruns, run a representative smoke test, and check that unchanged results are reused.

For a mixed-language or file-based project, request Snakemake with a `Snakefile` instead. Have the agent install the runner through the project's recorded environment. Existing scripts can become pipeline steps; more modular code gives the runner finer-grained work to select. The [command-runner chapter](#project-commands) explains that structural change.

## Verify selective execution before scaling up

Have the agent inspect planned work with `tar_outdated()` for targets or a Snakemake dry run. Then run a [smoke test](#smoke-tests) through representative real project steps. Ask it to check the expected responses to a figure-only change, one model change, and a shared-input change. It should compare predicted and actual reruns and keep those checks separate from the full expensive analysis.

![](figures/research-dependencies.svg){#fig-research-dependencies fig-alt="Analysis data feed fits A and B. Both feed a figure. A change to fit B reruns that branch and the figure while fit A is reused."}

Set memory and thread limits for the workload. Targets can use [crew](https://wlandau.github.io/crew/) for parallel workers; on the author's affected Mac, the [R troubleshooting procedure](#r-on-macos) starts without separately launched workers until that execution route has been checked. A [pueue](https://github.com/Nukesor/pueue) job can manage the outer pipeline command when it will run unattended. The pipeline determines what needs computing; the queue manages when the submitted job runs.

Keep caches out of [git](https://git-scm.com/) and configure cloud-sync exclusions before populating them. Keep the pipeline definitions, checks, and environment records with the project. Preserve a framework that already supplies these capabilities rather than replacing it solely to follow this example.

# 10. Run work in a separate environment: containers {#containers}

A container runs programs in a separately configured environment with its own packaged software and selected access to your machine. It can help reproduce system dependencies, restrict the files a task can reach, or give an agent a deliberately limited place to work. Which benefit you get depends on how the container is configured.

For example, a spatial analysis may depend on a particular system library as well as [R](https://www.r-project.org/) packages. Packaging that software in a container gives collaborators a more complete environment to restore. A different container might run an agent and local model with access only to one approved document collection. These are distinct reasons to use the same technology.

## Three research uses

*Work with restricted inputs.* A project may require processing on an approved machine with limited access and outputs. A container can expose only the required input folder and a writable output location, with network access configured for that work. It does not itself authorize processing under a DUA or IRB protocol. Start with the research guide's [data-governance decisions](https://dss-agentic-research.pages.dev/chapters/research-limits.html) and the institution's requirements.

*Preserve system software.* The language and package records in [chapter 8](#environments) do not capture every operating-system library or command-line program. A container can package these alongside the analysis environment, reducing differences between machines. Record the platform too; a container is not a promise of identical results across every processor or operating system.

*Give a local agent a limited workspace.* An open-weight model, its runtime, and an agent can be configured with a particular set of tools and inputs. This is useful for document analysis where you want deliberate control over what each run can access. Show where model computation actually happens: putting an agent's commands inside a container does not move a hosted model there. The [local-model chapter](#local-models) covers that setup choice.

## What the agent needs to configure

With [Docker](https://www.docker.com/), a `Dockerfile` describes how to build an *image*, the packaged software used to start a container. A *mount* makes a folder from the host computer available inside it. Read-only input mounts and separate writable outputs can express the intended access. Credentials, network connections, and runtime privileges also matter. Broad mounts or access to Docker's control socket can undermine the intended separation; see the [security](https://docs.docker.com/engine/security/) and [mount](https://docs.docker.com/engine/storage/bind-mounts/) documentation.

> Configure a container for [the research task and its purpose]. Preserve the project's language/package records and identify any system dependencies. List the model's execution location, permitted tools, mounted folders, read/write access, network destinations, and supplied credentials. Use that configuration to run a representative project case, check the expected outputs, and verify relevant access restrictions with harmless substitute files. Record the build and run commands for future agents.

The agent performs setup and checks; you supply the research and access decisions and complete any required authorization. A successful analysis run and an access-control test answer different questions. Retain both when both claims matter.

## Make the environment recoverable

On a Mac, [Colima](https://github.com/abiosoft/colima) with the Docker CLI is the command-line route used here. Keep an existing approved [Docker Desktop](https://www.docker.com/products/docker-desktop/) setup when suitable. Use the supported Docker Engine route on Linux or [WSL2](https://learn.microsoft.com/windows/wsl/); on an institutional cluster, follow its supported runtime, often [Apptainer](https://apptainer.org/).

For reproducible builds, have the agent record the base image's digest, restore pinned dependencies, and document the platform and required files. A digest identifies image content. A Dockerfile alone does not preserve external repositories or future downloads, so archive the built image through an approved route when long-term recovery matters.

Do not mount the whole home directory merely to fix a missing file. Have the agent identify the required input and add the specific access the task needs. Keep separate configurations for workloads with different data or tool permissions. The [access-control chapter](#tool-access) explains how this relates to the agent's other execution routes.

# 11. Generate documents from research outputs: Quarto and Pandoc {#research-documents}

Building a manuscript from maintained text and saved results helps keep tables, figures, and reported numbers consistent as an analysis changes. [Quarto](https://quarto.org/) and [Pandoc](https://pandoc.org/) give the agent a repeatable way to produce those documents in the format you need.

In the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html), an updated estimate should reach both the results table and the sentence describing it. The agent can connect those locations to saved analysis output, then regenerate the manuscript. Coauthors can still receive a Word document; they do not need to adopt your source format to read it.

## Choose the output your collaborators need

| Output | Typical use | Build requirements |
|:--|:--|:--|
| Markdown | Maintain readable text, citations, and links in a project. | A text source and the selected Markdown output format. |
| Word (`.docx`) | Exchange editable drafts with coauthors. | Quarto or Pandoc; a Word reference document can supply styles. |
| PDF through [LaTeX](https://www.latex-project.org/) | Produce a typeset manuscript with controlled equations, citations, and layout. | Quarto or Pandoc plus a TeX distribution and required fonts. |
| HTML | Publish a report or website with links and interactive material. | The selected HTML renderer and any required assets. |

Quarto combines prose, code execution, and publishing configuration, using Pandoc for document conversion. Pandoc can also be used directly when the source already contains the required text and results. Neither needs to replace a functioning writing workflow merely for uniformity.

## Explain the PDF software before installing it

[LaTeX](https://www.latex-project.org/) is a typesetting system that turns text and formatting instructions into a document. A *TeX distribution* supplies the programs and packages needed to run it. This matters for the PDF-via-LaTeX route; Markdown and Word output do not require a TeX installation.

Have the agent check for an existing working distribution first. For Quarto, its [PDF setup instructions](https://quarto.org/docs/output-formats/pdf-basics.html) provide a [TinyTeX](https://yihui.org/tinytex/) route using `quarto install tinytex`. Keep an adequate [MacTeX](https://tug.org/mactex/) or [TeX Live](https://tug.org/texlive/) installation. If a recipe invokes Pandoc separately, the agent must also check that it can find the selected engine, such as XeLaTeX, and the template's fonts. Other PDF routes exist; this chapter describes the LaTeX route used for these guides.

## Have the agent build the project's document

> Inspect this project's manuscript source, saved results, references, and required output formats. Configure Quarto or Pandoc to generate the actual document, reusing the existing workflow where practical. Link reported values, tables, and figures to saved analysis outputs. Install missing rendering software through the appropriate route, and add a [just](https://just.systems/) recipe for the build. Explain what the command recomputes and what it reuses. Render the document and check its contents and layout.

Keep the [just](https://just.systems/) recipe and rendering configuration with the project. A document build need not refit every model: it can read maintained results. Quarto's [execution settings](https://quarto.org/docs/projects/code-execution.html) govern caching and frozen outputs. Have the agent document how final results are refreshed so that a successful render is not mistaken for a rerun of the analysis.

## Check the saved document

The agent should inspect the actual Word, PDF, or HTML output, check representative reported values against their sources, and flag missing citations, broken tables, or clipped figures. You review the research interpretation and prose. The research guide's [manuscript chapter](https://dss-agentic-research.pages.dev/chapters/research-writing.html) explains how to track whether the right numbers reach the paper.

Record rendering dependencies and preserve source references and templates for handoff. A Word conversion still needs inspection of equations and tables. For an [R](https://www.r-project.org/) render that stalls on the author's Mac, use [Appendix D](#r-on-macos). That appendix also records the specific TeX Live captionless-table error encountered in these guides; missing fonts or packages need their own diagnosis.

<!-- ===================== PART IV — CONNECT TO DATA AND SERVICES ===================== -->

# 12. Keep credentials out of research files: 1Password and direnv {#credentials}

A credential, such as an API key, lets a program act under an account's permissions. If it ends up in shared code or logs, someone else may be able to use that access. For a paid model service or cloud account, that can mean substantial unauthorized charges; broader permissions may also expose stored data. [AWS's security guidance](https://docs.aws.amazon.com/awssupport/latest/user/security-checks.html) identifies excessive charges as a consequence of exposed access keys.

Suppose an agent builds a batch that sends approved documents to a paid model API. The script needs a credential each time it runs, but the manuscript repository and conversation do not need its value. [1Password](https://1password.com/), through its command-line tool `op`, can supply it to the command that needs it. [Direnv](https://direnv.net/) is useful when several commands in the project need the same environment settings.

## Supply the value at execution

The source code can refer to an environment variable: a named value passed to a running program. A vault reference identifies where to obtain the credential without storing the secret itself. The [1Password scripts guide](https://developer.1password.com/docs/cli/secrets-scripts/) explains how `op run` starts a command with secrets resolved into its environment.

Have the agent set this up using the approved vault and authentication route. You create or authorize the relevant vault item and complete personal sign-in. The agent should report the variable name, access scope, and command receiving it, without printing the value.

> Configure credentials for this project's document-analysis command using the approved 1Password item. Supply the key only to the command that needs it, without saving the value in source, logs, or conversation. Check the authorized request and report its status. Search for accidental exposure in project files using checks that report locations without reproducing secrets. Record how future agents should invoke the command.

Use a credential with the necessary permissions and no more. Keep existing institutional secret management when it already supplies this function. Follow [1Password's platform setup](https://developer.1password.com/docs/cli/get-started/) rather than assuming that an unlocked desktop app also authorizes a CLI in a different environment such as WSL2.

## Use direnv when settings recur across commands

Direnv loads project environment settings from `.envrc`. That file can contain vault references rather than secret values. For example, an API-backed research pipeline might use a reference shaped like `op://Research/model-service-api/credential`; the agent adapts it to the actual vault item.

An `.envrc` is executable code. Have the agent explain what it will load before you authorize it with `direnv allow`. The agent's noninteractive shell may not run the same startup hooks as your terminal; `direnv exec .` can load the approved environment explicitly for a command. This is a configuration issue to diagnose, not a reason to print the entire environment.

## Know what the vault does and does not protect

Once a process receives a credential, it can read, copy, or transmit it. The vault reduces accidental storage and publication; it does not conceal a secret from arbitrary code running with that secret. [Chapter 2](#tool-access) explains access controls for the receiving tools.

If a credential is exposed, revoke it and issue a replacement. Removing it from the latest file does not remove copies from repository history or elsewhere. Set a standing instruction to avoid secret values in chat and logs, retain only needed access, and report suspected exposure. Supplying a provider API key may also select API billing rather than a subscription, so use that route only when intended.

# 13. Connect to research data and services: MCP {#service-connections}

An agent may need to work with records held in an application rather than ordinary project files. A connection can expose useful operations such as searching a reference library, retrieving a document, or querying a database. The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) provides a common way for an agent application to discover and call those operations. A suitable existing connection can save repeated exports or custom integration code.

For the [synthetic heat-and-birthweight study](https://dss-agentic-research.pages.dev/chapters/example-project.html), imagine keeping the relevant literature in a [Zotero](https://www.zotero.org/) collection. You want the agent to retrieve records and available papers or notes, then update the project's evidence table and bibliography. Direct library access makes that a repeatable project task instead of a series of manual attachments.

## Decide whether a connection adds something useful

An MCP *server* is the program exposing the operations. It can run on your own computer or remotely; MCP does not mean that the service is necessarily hosted elsewhere. The [architecture documentation](https://modelcontextprotocol.io/docs/learn/architecture) explains those arrangements.

Compare the connection with the access the agent already has. A local file export may be sufficient for a fixed set of references. A maintained command-line tool or direct API may be simpler for an agent with shell access. MCP is helpful when an appropriate server already exposes the operations you need in the app you use; it is not inherently better than every local tool.

The community [Zotero MCP project](https://github.com/54yyyu/zotero-mcp) illustrates this choice: it documents library search and reading through MCP, and also supplies a CLI route. It is a candidate integration, not an official Zotero service or evidence of institutional approval. Have the agent check the current supported operations and choose a route that fits the actual client and task.

## Connect the literature task

> Identify a suitable permitted connection to my Zotero collection for this review. Check existing app connections and command-line access before adding another integration. Retrieve relevant records and available papers or notes, then update the project's evidence table and bibliography. Record source identifiers and unresolved records. Follow our literature-search procedure for DOI and claim verification. Do not modify the library unless that is part of the assigned task.

The agent handles configuration and verifies that the real task returns the expected records. You complete necessary authentication and decide the permitted account and operations. Keep credentials out of shared configuration using the [credential workflow](#credentials). At Harvard, consult the current [HUIT Claude guidance](https://www.huit.harvard.edu/claude) for connector requirements before enabling one; availability in a catalogue is not institutional approval.

Successful retrieval does not certify a citation or a claim. The research guide's [literature chapter](https://dss-agentic-research.pages.dev/chapters/literature.html) owns the search, verification, and evidence procedure. A skill can hold that procedure; the connection supplies access to the library. Keep abstracts, full texts actually read, and unresolved references distinguishable in the saved outputs.

## Record the access you enabled

Have the agent record the server, operations, account, and data destinations, using the client's [MCP setup documentation](https://code.claude.com/docs/en/mcp). Keep project-specific configuration with the relevant project where supported. A read-only connection can still send retrieved content to the model, and a local shell sandbox does not automatically constrain a remote service.

Treat retrieved documents as material to analyze, not instructions that can change the agent's task or permissions. Keep detailed access decisions in [chapter 2](#tool-access). If a service offers persistent memory, use it only for a defined need and document what it stores and how to correct or delete it; it need not duplicate project instruction files.

# 14. Inspect and interact with a browser {#browser-work}

Browser access lets an agent see and interact with a website as a user would. That is useful both when building a research website and when acquiring data from an existing one. The agent can follow links, use filters, inspect rendered content, and turn what it learns into code or saved data.

Suppose the agent builds a dashboard for a study. It should open the dashboard, change a filter, inspect the resulting plot, and fix a clipped label or broken control. In a data-acquisition task, it might navigate a public portal, choose a release, and retrieve the required records. These are concrete reasons to give it a browser; ordinary local Word or PDF production does not require website access.

## Give the agent access to the relevant site

[Playwright MCP](https://github.com/microsoft/playwright-mcp) supplies browser operations through an [MCP connection](https://modelcontextprotocol.io/). An existing app browser integration may already do what the task needs. Have the agent check the available route before installing another one, then configure the required site access using current documentation.

> Use browser access to inspect this project's website while building it. Open the locally served version, exercise the important navigation and controls, and check the pages at desktop and phone widths. Fix problems you find and report the pages and actions checked. Use screenshots or page locations to explain anything that still needs my decision.

A website can be served locally during development; it does not need to be public. Source-code inspection alone cannot establish whether a control works or whether a figure is readable at its displayed size. Have the agent inspect the rendered result as part of the actual development workflow.

## Use the browser to understand a data source

For collection, start with the research guide's [acquisition ladder](https://dss-agentic-research.pages.dev/chapters/data-acquisition.html#acquisition-ladder): an appropriate API or structured download, then static HTML parsing, then scripted browsing, then interactive agent browsing when that is needed. An agent can use a browser to discover a better structured route; not every scrape should become a long sequence of clicks.

> Inspect this data source and find a permitted way to obtain [the required records]. Prefer an API or export when available. Use browser interaction where the content or controls require it. Save the original responses or downloads and their provenance. For recurring collection, create a reusable script with explicit inputs, saved outputs, request limits, and failure reporting.

Have the agent smoke-test a representative portion of the actual collection before scaling up. A conversation describing clicks is not enough to reproduce a large extraction. Preserve the useful exploration as a repeatable procedure and retain failed requests for diagnosis.

## Choose the browser profile and account deliberately

A separate browser profile can keep a task from inheriting your usual logins. Some work needs an authenticated service; the agent should explain which account and actions it needs before you sign in. [Claude's Chrome integration](https://code.claude.com/docs/en/chrome) is one documented route for supported signed-in browsing.

The model may receive whatever the browser reads. Your ability to open a participant portal does not establish permission to send its contents to a hosted model. Keep access and consequential actions, such as submitting forms or changing records, within the assigned task. [Chapter 2](#tool-access) covers these decisions.

Computer use extends interaction beyond browser pages to desktop applications. Keep it for a task that requires that access, in an appropriately configured environment. It is not required to follow the core workflows here.

<!-- ===================== PART V — RUN AND COORDINATE AGENTS ===================== -->

# 15. Divide work between agents: shared projects and git worktrees {#parallel-work}

Several agents can make progress at once when their tasks are clearly divided. Give each a defined responsibility and specify how its output connects to the others. Separate working copies are one option; agents working on different files can often share the same project directory.

For example, one agent can develop modeling code while another develops visualization code. Agree on the saved results the plotting code will read, including column names and units. The agents can work concurrently on their own files, then run the model-to-figure workflow together. This is a common arrangement without [git worktrees](https://git-scm.com/docs/git-worktree).

## Give each agent ownership of its files

> Divide this task between a modeling agent and a visualization agent. Agree on the model-output format first. Assign each agent the files it may edit, keep shared configuration changes coordinated, and have a lead agent run the combined workflow and resolve mismatches. Preserve existing edits and report what each agent completed.

Distinct file ownership avoids many collisions, but the tasks may still share a dependency file, pipeline definition, output directory, or repository state. Have the lead agent coordinate those changes and git operations. Do not let one agent clean or reset files another is using. Shared helper functions should have an assigned editor rather than become a place where everyone makes unannounced changes.

The interface between tasks matters as much as the file list. If the model agent changes an output column, the visualization agent needs to know. Record those decisions in project files so they survive individual conversations.

## Use worktrees when tasks need separate working versions

A git worktree gives an agent another working directory attached to the same repository, usually on a separate branch. It is useful when agents need to edit overlapping files, explore alternative changes, or test against a stable version while other work continues. Each edits its own copy; overlapping changes can still conflict when combined.

> Prepare separate worktrees for these overlapping tasks, preserving current uncommitted work. Identify the inputs and environment each needs, assign separate output locations, and keep shared resources coordinated. Integrate the completed changes and run the combined checks before removing any working copy.

Worktrees share repository history and may still reach shared data, caches, credentials, or services. They do not provide a security sandbox. A new working copy also may not contain ignored data, installed libraries, or saved fits. Have the agent supply approved inputs and restore the recorded environment deliberately instead of improvising replacements or repeating expensive fits.

## Bring the results together

The coordinating agent should check that the pieces work together, whether they were developed in one directory or several. Two individually successful tasks can disagree about file formats or assumptions. A representative end-to-end run can reveal that before the full analysis.

For worktrees, the agent handles branch integration and preserves needed work before cleanup. It should report conflicts or research choices requiring your judgment. You need not manually inspect every diff or run git commands to coordinate the work.

Parallel development differs from the research guide's [independent-implementation check](https://dss-agentic-research.pages.dev/chapters/checking-analysis.html). That check requires fresh agents to receive the same specification without seeing each other's implementations. A worktree alone does not provide that informational separation, especially when the first implementation remains in shared history.

# 16. Run agents from saved requests {#headless-agents}

Some research workflows need a language model to make a judgment for each item in a collection. A *headless* agent runs programmatically without an interactive conversation, so a saved workflow can supply each request, collect its response, and record failures. You can ask an agent in the app to prepare and launch that workflow; you do not have to operate a terminal yourself.

The research guide's [peer-review example](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html) compares AI and human reviews. Each AI reviewer receives its assigned paper and instructions; a separate judge receives the material specified for judging. Fresh per-case runs make repeated work manageable. Deliberately controlling the inputs also helps prevent one case's content from influencing the next, provided the configuration actually enforces that separation.

## Separate the launcher from the run

[Claude Code](https://code.claude.com/docs/en/overview) supports noninteractive calls through `claude -p` and programmatic use through [Python](https://www.python.org/) or TypeScript SDKs. The [headless documentation](https://code.claude.com/docs/en/headless) describes these routes. An app with suitable command access can invoke the installed CLI or a script using the SDK. Authentication, permissions, and process support must be available in that execution environment.

Have the agent check its installation and intended account route before configuring the workflow. You complete personal sign-in or API authorization. A headless run should not wait for a person to answer a prompt; the agent must configure the operations it may perform and record any refused action. The CLI's `dontAsk` mode denies operations that require approval rather than granting unlimited access.

Ordinary model fits and document builds should run their saved code directly. Add an LLM step when the task needs its interpretation or judgment, rather than using an agent to babysit computation.

## Save the request and the result for every case

Ask the agent to build a run record containing the case identifier, role, prompt, assigned inputs, model/settings, available tools, loaded configuration, output location, and retry policy. Save the raw response separately from parsed measurements, together with process status and diagnostic output. A successful process exit is not enough if the returned judgment cannot be parsed.

> Build the reviewer/judge workflow from our specification. Give each case a fresh run with the assigned inputs and permitted tools. Save the exact requests, raw responses, parsed results, and run status. Run two representative documents through the complete workflow as a smoke test, diagnose failures, and confirm the expected artifacts before starting the main batch. Keep test outputs separate from the study results.

The [smoke test](#smoke-tests) checks execution and output handling. Assess the quality of the judgments against the research rubric separately. A [pueue](https://github.com/Nukesor/pueue) queue can manage the outer jobs and concurrency; have the agent verify the queue's execution environment as well.

## Control what each run can receive

Starting a new process does not by itself exclude personal instructions, memory, plugins, connected services, or other files. Normal print mode can discover configuration just as an interactive session does. If the study depends on each reviewer seeing only assigned material, have the agent identify and configure every relevant source of context. Do not resume another case's conversation.

[Claude](https://claude.ai/)'s `--bare` option skips much of the normal configuration discovery, as described in the linked documentation. It also changes authentication: it does not use subscription OAuth credentials and needs an API or supported provider route. Have the agent check the installed version and intended billing before choosing it. Explicit inputs, tool lists, settings, and session-persistence controls still need attention. For a text-only judgment with no tools, a direct model API call may be simpler than an agent.

When isolation is part of the research design, ask for targeted checks using harmless markers. One run should read its assigned marker while attempts to read another case's marker fail through the configured routes. Check unintended instruction or memory loading as well as direct file and service access. Record observed outcomes; a model claiming not to remember something is not equivalent to a denied read. These checks address context restrictions, not scientific validity, and cover only the routes actually exercised.

The historical peer-review project motivates this design. It does not establish that an arbitrary current app/account configuration is isolated. Keep the configuration, checks, and any unresolved access questions with the study, and link the scientific evaluation to the research guide's [LLM-analysis procedure](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html).

# 17. Run a model on your own computer {#local-models}

A local model can run on approved hardware and preserve access to a chosen set of weights. Here, *inference* means running a trained model on an input to produce an output, such as a response to a prompt. It is distinct from statistical inference about a population or process. *Local inference* means that the model computation happens on the local machine. It can also be substantially less capable than the hosted model you normally use. The research guide's [Run and adapt models for your research](https://dss-agentic-research.pages.dev/chapters/research-models.html#local-models) explains that choice, its connection to data governance, and when fine-tuning may help. This section establishes a small trial before adding a model to a research pipeline.

For example, first ask a small downloaded model to return a category for an invented input, then test whether an agent using that model can read an assigned harmless file. These trials check the setup before you consider a research task.

## Install and start a local runtime

Use an existing approved model service if your institution supplies one. For a Mac trial, [Ollama](https://docs.ollama.com/quickstart) supplies a local model runtime. Check for an existing installation first. With [Homebrew](https://brew.sh/) already configured (§3), the command-line installation is:

```
brew install ollama
```

For Linux or [WSL2](https://learn.microsoft.com/windows/wsl/), follow Ollama’s platform instructions and check the actual GPU and memory available. Keep downloaded weights outside a cloud-synchronized research folder. The default Mac model directory is in your home folder under `.ollama/models`.

Ollama also supports cloud models and web search. Its [local-only setting](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features) disables those features. For a temporary foreground server, the agent can run:

```
OLLAMA_NO_CLOUD=1 OLLAMA_HOST=127.0.0.1:11434 OLLAMA_CONTEXT_LENGTH=65536 ollama serve
```

Check for an existing server before starting another. Confirm the startup log says cloud features are disabled and the server is listening on localhost. This command does not set up a login service. Configuring a persistent service is a separate step; apply the same local-only setting to the process that actually serves requests. These settings govern Ollama, not every network-capable tool an agent might use.

## Download a small model and test inference

A modest trial model is [Qwen3 4B](https://ollama.com/library/qwen3:4b), distributed here as about 2.5 GB of quantized weights. This is a setup example, not a recommendation for a particular research measurement. Once the server is available, the agent downloads and invokes the model with:

```
ollama pull qwen3:4b
ollama list
ollama run qwen3:4b
```

Have the agent check a representative request and retain its result; `/bye` exits the interactive model session. Have the agent record the runtime version and exact model digest, not just the tag: a tag can later refer to different bytes. The [local model-list API](https://docs.ollama.com/api/tags) exposes the digest and quantization. Memory needed during inference exceeds the download size and grows with context and concurrency; `ollama ps` shows the active allocation.

For an extraction or classification step, require a structured response and validate it. A small trial on this Mac illustrates why: the unrestricted request for one category produced explanatory text and hit the output limit. Supplying a JSON schema produced the required category object. That establishes behavior on the invented test input, not accuracy on research data. Keep malformed responses and retries in the record.

## Connect the model to an agent

This trial also requires the [`claude`](https://claude.ai/) command. Ask the agent to check its installation before starting; §18 covers setup and interactive use, and §16 explains controlled headless runs.

[Ollama’s Claude Code integration](https://docs.ollama.com/integrations/claude-code) connects compatible models through an Anthropic-compatible endpoint. Its launcher can configure the integration; inspect proposed configuration changes before replacing an existing hosted-model setup. A process-scoped trial can instead supply the local endpoint and model explicitly.

> In a fresh folder containing only an invented marker file, configure one headless Claude Code run against the local Ollama endpoint. Use the downloaded model, explicit local authentication placeholder, bare mode, no saved session, no [MCP](https://modelcontextprotocol.io/) servers, and only the Read tool. Permit that tool without enabling arbitrary command execution. Save the request, tool-call trace, raw result, and exit status. Confirm an actual read of the assigned file and the expected response. Do not modify my normal hosted-agent configuration or use research data.

The tested configuration used `ANTHROPIC_BASE_URL=http://127.0.0.1:11434`, an `ANTHROPIC_API_KEY` placeholder of `ollama`, and `--model qwen3:4b`. The placeholder is not a provider credential. The run used `--bare`, `--no-session-persistence`, `--strict-mcp-config` with an empty server list, and explicit Read-tool permissions. Use the installed CLI help to construct the complete invocation; do not copy only the endpoint and assume the remaining context is controlled.

The harmless local trial completed a two-turn file-reading task and returned the marker. It did not test all containment routes or establish that this model can perform research analysis reliably. CLI estimates of context limits or monetary cost for an unrecognized local model are not evidence of the actual runtime limits or a provider charge. Record the server configuration and observed run instead.

For restricted work, enforce the required file and network boundaries (§2), review the full chain of custody, and evaluate task quality before scaling up. Small distilled DeepSeek releases, large Kimi models, and Apple’s built-in model have different deployment and access routes; do not assume that every local model is an interchangeable backend for this launcher.

## Apple’s on-device model {#apple-on-device}

Apple supplies an alternative that uses the system model. On macOS 27, the built-in [`fm` command](https://developer.apple.com/videos/play/wwdc2026/334/) supports interactive use, saved scripting steps, and structured responses. Check `fm --help` and `fm respond --help` on the intended Mac before constructing a trial. The documented default is on-device inference; selecting Private Cloud Compute changes where the request is processed.

For [Python](https://www.python.org/) workflows, Apple’s [Foundation Models SDK](https://github.com/apple/python-apple-fm-sdk) requires macOS 26 or later, Xcode 26 or later, Python 3.10 or later, and Apple Intelligence enabled on a compatible Mac. Add the SDK to the project’s recorded environment (§8), check model availability, and start with an invented input and a fixed output schema. Keep the package version and system information with the results. These Apple routes were checked against documentation on November 3, 2026; they have not been run in this guide’s local trial.

<!-- ===================== PART VI — WORK FROM THE TERMINAL ===================== -->

# 18. Use an agent from the terminal: Claude Code {#terminal-agents}

<!-- aliases: terminal-commands -->

A terminal gives you another way to work with an agent in a project folder. It is useful when your project commands and job logs are already open there, or when you are working on a remote machine. You can give the same natural-language requests you would use in the app, then run the project's saved commands directly when that is convenient.

For example, ask the agent to revise a figure using the saved analysis results. After it has finished, you can run `just figures` yourself to regenerate the plot. The project files and commands stay the same whichever interface you use.

## The terminal is the window; the shell reads commands

A *terminal* displays typed input and program output. A *shell* is the program that interprets commands entered there. On a Mac, open Terminal through Spotlight. For this guide's Windows route, open Ubuntu through [WSL2](https://learn.microsoft.com/windows/wsl/) in [Windows Terminal](https://learn.microsoft.com/windows/terminal/). These examples use a Unix shell, not PowerShell.

Every shell has a working directory. Use `cd` to enter your project folder; replace this path with your actual path and retain quotes if it contains spaces:

```
cd "/Users/your-name/Research/my-project"
```

`pwd` displays the current folder. [Appendix A](#working-environment) covers optional terminal conveniences; [Appendix E](#terminal-history) explains the history behind terms such as terminal, shell, and TTY.

## Start Claude in the project

Have the agent check whether the [Claude Code](https://code.claude.com/docs/en/overview) CLI is installed; having the desktop app does not establish that the [`claude`](https://claude.ai/) command is available. Follow the current [installation and sign-in instructions](https://code.claude.com/docs/en/quickstart) for your platform and intended account. Once installed, type this at the shell prompt:

```
claude
```

Complete any initial sign-in and folder-trust step. Once Claude is running, type a research request in ordinary language, such as “Regenerate the main figure from the saved estimates and explain which files you used.” You are now speaking to the agent rather than entering a shell command. It can read the project instructions, use its permitted tools, and report the result.

Use `/exit` to leave the agent and return to the shell. The selected project directory supplies ordinary relative paths; it does not by itself restrict everything the agent can access. The [access configuration](#tool-access) still applies.

## Run saved project commands directly

If the project uses [just](https://just.systems/), these shell commands list its recipes and run the figure task:

```
just --list
just figures
```

The recipes must already exist in the project's justfile. Ask the agent to create or explain them using [chapter 5](#project-commands). This lets you repeat a saved workflow without needing the LLM to reconstruct the execution steps.

If a tool is missing, you can ask the agent to install it. With [Homebrew](https://brew.sh/) already available, the equivalent shell command for just is `brew install just`. [Chapter 3](#adding-tools) owns the package-manager setup. A “command not found” message may mean either that the tool is absent or that the shell cannot find it; have the agent diagnose that before reinstalling anything.

## Use the session controls you need

The [interactive-mode documentation](https://code.claude.com/docs/en/interactive-mode) and installed help describe the current controls. Common examples include:

| Control | Purpose |
|:--|:--|
| `/model` | Choose an available model and inspect its options. |
| `/effort` | Set reasoning effort where supported. |
| `/permissions` | Inspect or change permission rules. |
| `/sandbox` | Inspect sandbox configuration. |
| `/context` | Inspect context use. |
| `/compact` | Summarize the conversation to reduce context. |
| `/usage` | Inspect account usage information. |
| `/exit` | Leave the agent and return to the shell. |

Permission modes and shortcuts vary with the installed version and account. Check the displayed mode. The research guide's [settings chapter](https://dss-agentic-research.pages.dev/chapters/directing-work.html) explains when to plan and how much autonomy to give the agent. Have it save important decisions and next steps to project files before ending a session.

For unattended jobs, use the [queue workflow](#job-queues); closing a window is not a job-management strategy. For noninteractive agent calls, use the [headless chapter](#headless-agents). A terminal interface does not change where a hosted model processes the context it receives.

<!-- ===================== REFERENCE ===================== -->

# Appendix A. Optional working environment {#working-environment}

Your existing terminal and editor may already be sufficient. Additional conveniences are useful when they solve an everyday problem: seeing job status beside an agent session, returning to a working layout, or inspecting code and plots in one place. None is a prerequisite for agent work.

For example, you might keep an agent conversation in one pane and its project's job status in another. Ask the agent to configure that layout using your existing tools, then add a replacement only if it supplies something you need. [Appendix E](#terminal-history) explains where the terminal terminology comes from.

## Terminal applications

[iTerm2](https://iterm2.com/) on a Mac and [Windows Terminal](https://learn.microsoft.com/windows/terminal/) with Ubuntu [WSL2](https://learn.microsoft.com/windows/wsl/) provide panes, searchable output, and reusable profiles. Have the agent help configure a layout for the real project, such as a conversation beside a read-only queue view. Keep your current terminal if it already works well.

Use legible fonts and colors. Special fonts are only needed for prompt symbols you choose to use; a theme is not required to run an agent or a saved project command. In Windows Terminal, a PowerShell tab and an Ubuntu tab are different environments.

## Shell and prompt

The shell interprets commands; its prompt shows where the next command will be entered. A prompt displaying the directory, [git](https://git-scm.com/) branch, and previous command's status can help you recognize the project and state you are working in. [Oh My Posh](https://ohmyposh.dev/) can add that information to an existing shell. There is no need to replace the shell or install a larger framework just to change the prompt.

> Preserve my existing shell settings. Configure a readable prompt showing the project directory, git branch, and failed-command status. Explain the changes, verify a fresh session, and record how to restore the old setup. Keep unrelated aliases, credentials, and research environments unchanged.

Shell startup files execute code. The agent should check both an interactive shell and its own execution environment, since they may load different settings. Personal authorization remains yours; routine configuration diagnosis belongs with the agent.

## Persistent terminal sessions

[Zellij](https://zellij.dev/) groups panes into a named session that you can leave and rejoin from another terminal window. This helps preserve a working layout and processes when a window closes or a connection drops, while the host and session remain available. Have the agent set up the project's layout and explain the on-screen detach and reattach controls. Keep an existing multiplexer if it meets the need.

A persistent session and a queue do different jobs. [Pueue](https://github.com/Nukesor/pueue) records and manages submitted jobs; Zellij gives you a place to view those jobs and their logs. Neither makes computation continue through a sleeping or shut-down host. Reopening a layout after a restart is not the same as resuming the programs that previously occupied it. Use the institutional scheduler for cluster work.

## An editor beside the agent

[Positron](https://positron.posit.co/) combines code, data, and plots for [R](https://www.r-project.org/) and Python. Keep [RStudio](https://posit.co/products/open-source/rstudio/), [Stata](https://www.stata.com/), or another editor when it already supports your work. Ask the agent to help open the actual project in its [recorded environment](#environments) and identify the interpreter it will use.

You can inspect the substantive results in the editor while the agent works on the same files. Avoid conflicting simultaneous edits. Temporary sorting or filtering in a data viewer helps inspection but does not replace saved cleaning code. An AI extension or database connection is a separate addition with its own account and access requirements; neither is necessary just to read the agent's code and outputs.

# Appendix B. Keep records of shared settings: chezmoi {#shared-settings}

Personal tool settings often live in several folders. A maintained record makes them easier to restore after a mistake or on a new computer. [Chezmoi](https://www.chezmoi.io/) manages selected configuration files and puts them in the locations where programs expect to find them. The agent can maintain that record for you.

For example, you revise your shared coding conventions on one laptop. You want the new version preserved and available on another machine, without an older managed copy overwriting it later. Chezmoi supplies that source-to-installed-file relationship; a private [git](https://git-scm.com/) repository can record the source's history.

## Understand the two copies

The *source* is the copy managed by chezmoi. The *applied file* is the copy read by the program. Applying the source updates the installed location. If the agent changes the applied file directly, it must capture the change back into the source before a later apply restores the older version.

![](figures/research-shared-settings.svg){#fig-chezmoi-source-and-applied fig-alt="Chezmoi keeps source versions in a settings repository and applies them to the paths programs read. Both locations need review and protection." above="16pt" below="14pt"}

> Inspect how my personal settings are managed. Use the existing chezmoi setup if present, or configure it for the selected settings that need recovery across machines. Preserve current files, exclude credentials and account state, and record source and applied locations. When changing an applied file, capture the change back into the managed source, check that the copies agree, and commit the intended update. Do not publish the settings repository.

The agent follows the [quick-start documentation](https://www.chezmoi.io/quick-start/), checks proposed differences, and verifies that the target program reads the expected configuration. You decide which settings should be shared. Project-only configuration already tracked in the project's repository may need no additional manager.

## Preserve machine differences and access controls

Chezmoi templates can express differences between machines, such as executable paths. Have the agent check the result on each target environment before relying on it. A shell startup file referencing a missing program can break the next session; Windows settings and a [WSL](https://learn.microsoft.com/windows/wsl/) Linux home are not interchangeable.

Protect both copies when a file controls agent permissions. An editable source can later overwrite a protected applied file. The [access-control chapter](#tool-access) explains that risk. Do not import entire settings directories without checking for tokens and account data. Keep an institutional configuration manager if it already does this job; two managers repeatedly overwriting each other make recovery harder.

# Appendix C. Account-usage tools {#usage-tools}

Start with the usage display in the app you already use. For most researchers, it is the quickest way to check the account's current allowance or limits. An extra reporting tool is useful only when you have a question the built-in display does not answer.

For example, after several large research sessions you may want to know which sessions accounted for most of the recorded usage. [Ccusage](https://ccusage.com/) can summarize compatible retained local logs by period and session. That can help identify costly patterns, but its coverage and estimates are different from an account's official allowance or invoice.

## Check the app first

Use [Claude's usage guidance](https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits) and the information for your actual institutional plan. In a terminal session, `/usage` supplies a built-in route. Limits and controls change, so this guide does not reproduce a fixed allowance.

Large inputs, long conversations, output length, model choice, and reasoning effort can affect usage. A model fit running on your laptop does not consume LLM tokens merely because time passes. Repeated requests for updates or large log reads can create additional model calls.

## Ask the agent for a historical report when useful

> Check the built-in usage information first. If compatible retained logs can answer my question, use ccusage to identify this week's largest recorded sessions. Report covered dates and missing sources, and distinguish measured token totals from explanations you infer about the cause. Keep log contents local and avoid reproducing confidential text.

The agent should check the current [tool documentation](https://ccusage.com/guide/), version, and available logs before running it. Deleted logs, another machine's sessions, or unsupported interfaces can leave gaps. A missing session does not mean zero use. Monetary estimates depend on pricing assumptions and are not a subscription balance or bill.

Use the report to decide whether a habit should change: reading whole data files into context, repeatedly sending large logs, or extending a conversation long after its task is complete. Have the agent retrieve relevant log excerpts and use the [queue workflow](#job-queues) for long computation. Keep the logs themselves under the project's access and retention rules.

# Appendix D. Troubleshooting {#troubleshooting}

## R launched by an agent on macOS {#r-on-macos}

On the author's Mac, [R](https://www.r-project.org/) has sometimes stalled when an agent launches it with output sent to another program or discarded, rather than connected to a terminal. The process keeps using a processor core but produces no output. This is an observed local problem, not a general property of R or every agent. Giving the process a *pseudo-terminal*, a software-created terminal connection, has been the dependable workaround in this environment.

The project should put the workaround in one executable file, `bin/rscript-pty`, rather than relying on the agent to remember it at each call:

```
#!/bin/sh
command -v script >/dev/null 2>&1 || {
  echo "No script command; cannot allocate a pseudo-terminal" >&2
  exit 127
}
exec script -q /dev/null Rscript "$@" < /dev/null
```

Have the agent route every R recipe through this helper, including checks and environment commands. For [targets](https://docs.ropensci.org/targets/), run the pipeline in that same process with `callr_function = NULL` and disable [crew](https://wlandau.github.io/crew/) for the initial test. Separately launched workers may not inherit the terminal connection. Verify a small run and its output before scaling up.

Earlier local tests succeeded with [pueue](https://github.com/Nukesor/pueue)'s file-based logging and with crew. They do not establish that every queued or worker configuration is safe. The consistent baseline here retains the wrapper for queued R jobs too. Enable parallel workers only after testing the actual execution route and recording the evidence.

If the agent sandbox blocks pseudo-terminal allocation, the strict settings in §2 will refuse the call. Use a separately reviewed execution route or run the saved script in your own application; do not silently disable the sandbox. For [Quarto](https://quarto.org/) that executes R, the equivalent macOS wrapper surrounds the whole render:

```
script -q /dev/null quarto render paper.qmd < /dev/null
```

Check the process and artifact as well as the returned status. If a process appears stuck, establish its identity and progress before stopping it; do not launch several replacements. Linux has a different `script` interface, so the macOS wrapper should not be copied unchanged there.

## Captionless tables with TeX Live 2026 {#tex-table-counter}

One PDF-build error encountered in these guides is “No counter 'none' defined” for a captionless table. [Pandoc](https://pandoc.org/) can emit `\LTcaptype{none}`, while the installed [LaTeX](https://www.latex-project.org/) table packages expect that counter to exist. Have the agent add this compatibility block to the template preamble, before `\begin{document}`:

```
\makeatletter
\@ifundefined{c@none}{\newcounter{none}}{}
\makeatother
```

The guard leaves an existing counter alone. This is a fix for that observed error, not a general response to a failed render. The agent should inspect the actual build log for other missing fonts, packages, or source errors.

# Appendix E. Terminal vocabulary {#terminal-history}

Terminal vocabulary becomes easier to understand once you know that many of the names describe physical equipment. The modern window kept the interaction pattern after the equipment changed. This short history explains the terms used in the [terminal chapter](#terminal-agents); [Appendix A](#working-environment) covers today's optional tools.

## A terminal was a device at the end of a connection

Before a personal computer routinely had its own keyboard and screen, people could communicate with a computer through a separate terminal. A teletype combined a keyboard with a printer: typed characters went to the connected machine, and its responses appeared on paper. Museum collections preserve examples of [teletypes used as computer terminals](https://collections.museumsvictoria.com.au/items/407696).

The abbreviation *TTY*, from teletype, stayed in computing vocabulary. Screen-based terminals displayed text instead of printing it. A modern *terminal emulator* is software that provides that style of interaction in a window, including the keyboard input and text display. The terminal is not the agent or the command interpreter; it is the interface through which you communicate with a running program.

## The shell interprets commands

A *shell* is a program that reads commands and starts other programs. It provides an interface to operating-system facilities and is also a programming language, so it can execute a saved script as well as a command you type. [Bash](https://www.gnu.org/software/bash/) and [zsh](https://www.zsh.org/) are examples. The [Bash manual](https://www.gnu.org/s/bash/manual/bash.html) describes this command-interpreter role.

The *prompt* indicates that the shell is waiting for input. When you enter `claude`, the shell starts [Claude Code](https://code.claude.com/docs/en/overview). Claude then displays its own interface for your requests. On exiting Claude, you return to the shell prompt. A text window can therefore contain quite different kinds of interaction; knowing which program is receiving your input is more useful than memorizing the window's appearance.

## Why a program asks whether it has a TTY

The operating system preserves a terminal interface even when no physical terminal is attached. A *pseudo-terminal* (PTY) is a software connection that behaves like a terminal for the program using it. Terminal emulators use this mechanism; see the [pseudo-terminal manual](https://man7.org/linux/man-pages/man7/pty.7.html).

A program can behave differently when attached to a terminal than when receiving input from a file or another process. It may display a prompt, use interactive controls, or buffer output differently. An agent's command tool may supply pipes instead of a terminal connection. This distinction helps explain the specifically observed [R-on-macOS problem](#r-on-macos), where a pseudo-terminal wrapper is used. It does not mean every unattended program needs one.

## A few related names

| Term | What it refers to |
|:--|:--|
| Command-line interface (CLI) | A program interface controlled with commands and arguments. |
| Working directory | The folder from which relative file paths are resolved. |
| `PATH` | The directories searched to locate an executable command. |
| Standard input/output/error | Separate channels through which a program receives input and returns ordinary output or diagnostics. |
| Pipe | A connection that passes one program's output to another's input. |
| Environment variable | A named value supplied to a running program and usually inherited by programs it starts. |

You can ask the agent to explain these in the context of a command it proposes. The useful aim is to recognize what the command will do and which program will receive it, rather than learn a shell language before beginning research work.
