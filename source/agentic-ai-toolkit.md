---
title: "Extending Your Agent's Toolkit"
subtitle: "A Guide for Researchers"
version: "2.3 draft"
---

<!-- ===================== PART I — FOUNDATIONS ===================== -->

# 1. Choose tools for a research need {#choose-tools}

Research involves tasks worth setting up once and repeating reliably: running a batch of analyses, rebuilding a manuscript, or restoring the software used in an analysis. This guide shows how to get an AI agent to set up and use tools for that work. You direct the research; the agent installs and configures the tools, runs them, and checks their output.

Suppose a study needs 100 simulation runs, but your computer can handle four at once. A job queue can keep four running and automatically start another whenever one finishes. Ask the agent to prepare the batch, choose a suitable limit, and report completed and failed jobs when you return. You can arrange this from the app without learning the queue's commands.

Use this guide as a reference. Read the next chapter on access, then turn to the tool your work needs. Each chapter explains its purpose and what to ask the agent to do. The companion [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/) covers research workflows and judgment; if you are new to the app, start with its [introduction to Claude](https://dss-agentic-research.pages.dev/chapters/first-session.html).

## Find the tool for your task

Start with the result you need. Keep tools that already serve the project, and add others when they supply a useful capability.


::: {.toolkit-lookup}

| Research need | Start here |
|:--|:--|
| **Foundations** | |
| Control what a new tool can read, change, or send | [2. Tool access](#tool-access) |
| **Essential tools** | |
| Install and maintain research tools | [3. Installation](#adding-tools): [Homebrew](https://brew.sh/) |
| Record changes and recover earlier work | [4. Version control](#version-control): [git](https://git-scm.com/) and [gh](https://cli.github.com/) |
| Repeat tasks using saved commands | [5. Project commands](#project-commands): [just](https://just.systems/) |
| Keep a batch moving unattended | [6. Job queues](#job-queues): [pueue](https://github.com/Nukesor/pueue) |
| Find files and inspect their contents | [7. Search and inspection](#finding-files): [ripgrep](https://github.com/BurntSushi/ripgrep), [fd](https://github.com/sharkdp/fd), [jq](https://jqlang.org/), [yq](https://mikefarah.gitbook.io/yq/), and [bat](https://github.com/sharkdp/bat) |
| **Reproducible research workflows** | |
| Restore the language and packages used for an analysis | [8. Software environments](#environments): [rig](https://rig.r-lib.org/), [renv](https://rstudio.github.io/renv/), and [uv](https://docs.astral.sh/uv/) |
| Rerun only steps affected by a change | [9. Dependencies](#pipeline-dependencies): [targets](https://docs.ropensci.org/targets/) and [Snakemake](https://snakemake.readthedocs.io/) |
| Package software and configure a separate place to run it | [10. Containers](#containers) |
| Rebuild a document from saved research outputs | [11. Document production](#research-documents): [Quarto](https://quarto.org/) and [Pandoc](https://pandoc.org/) |
| **Connect to data and services** | |
| Supply account credentials without putting them in research code | [12. Credentials](#credentials): [1Password](https://1password.com/) and [direnv](https://direnv.net/) |
| Give the agent access to an application or service | [13. Connections](#service-connections): [MCP](https://modelcontextprotocol.io/) |
| Build, inspect, or collect data from a website | [14. Browser access](#browser-work) |
| **Run and coordinate agents** | |
| Divide a project between several agents | [15. Agent coordination](#parallel-work) |
| Run a batch of agent tasks from saved requests | [16. Headless agents](#headless-agents) |
| Run or adapt a large language model (LLM) on your own hardware | [17. Local LLMs and adaptation](#local-models) |
| **Work from the terminal** | |
| Use a terminal interface to the agent | [18. Terminal agents](#terminal-agents): [Claude Code](https://code.claude.com/docs/en/overview) |
| **Reference** | |
| Choose optional terminal and editor conveniences | [A. Working environment](#working-environment) |
| Restore personal settings across computers | [B. Shared settings](#shared-settings): [chezmoi](https://www.chezmoi.io/) |
| Investigate account usage | [C. Usage tools](#usage-tools) |
| Diagnose execution and document-build problems | [D. Troubleshooting](#troubleshooting) |
| Understand terminal terminology | [E. Terminal vocabulary](#terminal-history) |

:::

## Make the tool part of the workflow

Some tools are programs the agent runs on the computer doing the work, such as a job queue. Others connect it to an application or service, such as a reference library. Once a tool is available, record when the agent should use it and what it should report.

![](figures/agent-toolkit.svg){#fig-agent-toolkit fig-alt="Saved instructions guide an agent using an installed job queue or a connection to a reference library."}

For the simulation batch, the project instructions should tell future agents to use the queue for long runs, retain the job identifiers, and check the saved results. Once the queue is configured, ask the agent:

> Record the queue command, the limit on simultaneous jobs, and where results and logs belong. Add instructions for future sessions to use this setup for the project's simulation runs and report which jobs succeeded or failed, checking their saved outputs.

Save project-specific commands and limits with the project. Put conventions that should apply across projects in your shared instructions. The research guide explains [project records](https://dss-agentic-research.pages.dev/chapters/project-context.html#project-records) and [shared conventions](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html#shared-instructions). A longer procedure that recurs can become a [skill](https://dss-agentic-research.pages.dev/chapters/reusable-procedures.html#what-skills-add).

## Use tools from the app

You can ask the agent to install and operate these tools from the app. You supply the research decisions and complete personal steps such as signing in or entering an administrator password. Give passwords to the sign-in or system dialog, rather than pasting them into the conversation.

The setup examples cover macOS and Linux. The Windows route uses [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/windows/wsl/), which provides a Linux environment on a Windows computer. Ask the agent to check the environment where the work will run before installing software there. You can keep using [R](https://www.r-project.org/), [Python](https://www.python.org/), or [Stata](https://www.stata.com/); adopting a queue or command runner does not require changing research language.

# 2. Control what added tools can access {#tool-access}

Adding tools lets an agent carry out more of a research task without stopping for help. Configure those tools to use the files and accounts the task needs while protecting original inputs and unrelated work. The agent can set up and test the controls from your instructions.

For a batch of model fits, the queue needs to read the analysis code and approved inputs, then save results and logs. It does not need to change the original data or read another study's files. A queue such as [pueue](https://github.com/Nukesor/pueue) runs work through a separate background service, so its access needs checking even if you have already restricted the agent's own commands.[^tk-pueue-process]

## Check where the work runs

In [Claude Code](https://code.claude.com/docs/en/overview), permission rules allow tool actions, require approval, or block them. A sandbox adds restrictions enforced by the operating system on programs running inside it. Written instructions explain how the agent should work, but do not enforce those restrictions.[^tk-access-controls]

![](figures/tool-access-routes.svg){#fig-tool-access-routes fig-alt="Direct commands run inside their sandbox; queued work runs through a separate service; connected operations use account access. Returned records can reach the agent. Built-in file tools have separate permission checks."}

The built-in sandbox covers commands run inside it and the programs they start. It does not enclose every tool available to the agent. Built-in file tools have their own permission checks; connected services and separately running queue services need their own access controls. Have the agent identify the programs and accounts involved in the actual task.[^tk-sandbox-scope]

A connection that only reads data can still return those data to the agent, which may send them to a hosted large language model (LLM). Decide which material may be sent before enabling the connection. The research guide explains [what reaches the LLM](https://dss-agentic-research.pages.dev/chapters/research-limits.html#what-reaches-the-llm) and [how to establish a chain of custody](https://dss-agentic-research.pages.dev/chapters/research-limits.html#data-chain-of-custody).

## Apply settings at the right scope

Use global settings for rules shared across your projects and project settings for the requirements of a particular study. Ask the agent to inspect the existing files and any institution-managed settings before proposing changes.

| Scope | Settings file | Use |
|:--|:--|:--|
| Global | `~/.claude/settings.json`[^tk-home-folder] | Personal settings across projects on this computer. |
| Project | `.claude/settings.json` inside the project | Settings that can be shared with project collaborators. |
| Personal project | `.claude/settings.local.json` inside the project | Your own settings for this project; keep this file out of version control. |

For many settings, the personal project file overrides the shared project file, which overrides global defaults. Permission rules combine across those files: a matching deny takes precedence over an allow. Your institution can also enforce managed settings. Ask the agent to report which settings actually apply, including any session-specific overrides.[^tk-settings-scope]

Keep secret values out of these files and saved command approvals. The [credential chapter](#credentials) explains how to supply them to the program that needs them.

## Ask the agent to configure and check access

Describe the files and services the work needs. For the batch of fits, you could ask:

> Set up access for these model fits. The approved inputs are in [folder]; results and logs belong in [folder]. Leave the inputs unchanged and block access to [excluded folder]. Check the current agent settings and the queue service's access. Explain where changes are needed before applying them. Test permitted and blocked actions with harmless substitute files, then report the settings changed, the outcomes, and anything you could not verify.

The agent should test the paths the work will actually use. A direct command succeeding or failing does not establish how a queued job behaves. Its report might include the following checks; the entries describe expected outcomes, not results already obtained.

| Check | Expected outcome |
|:--|:--|
| Run a representative queued fit on approved synthetic inputs | Saved result and log appear in the intended folders. |
| Try to change a substitute for a protected input | The configured restriction blocks the change. |
| Try to read an excluded substitute file through each relevant tool or process | Each attempted route is blocked; untested routes are identified. |

Keep the settings and a short record of observed results with the project. If a required restriction fails, have the agent diagnose it before using protected inputs. These checks can expose configuration mistakes; they do not establish protection against every possible action.

The downloadable example protects `data/raw` from changes and excludes `data/restricted`. Have the agent adapt it to the actual project and merge it with existing settings. File-tool paths beginning with `/` are project-relative here; sandbox paths beginning with `./` in project settings resolve from the project root. In global settings, relative sandbox paths resolve from that settings directory. These are different conventions, so the agent must resolve and check both before relying on them.

[Download the settings example](resources/project-settings-example.json){.download-button download="project-settings-example.json"}

<details class="guide-example">
<summary>Read the example project settings</summary>

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

The sandbox must start successfully, and the example disables unsandboxed retries. Existing excluded commands or broader settings still require inspection. This file does not configure a separately running queue, browser account, or remote service, and it is not a complete restriction on every file on the computer. The keys follow the linked documentation; the agent must test the required behavior in the intended environment.

</details>

## When a tool needs different access

If an operation is blocked, ask the agent to identify what it needs: a particular folder, a network destination, or access to the queue service. It should explain a specific change and its consequences. A command that runs outside the sandbox needs another arrangement that meets the project's access requirements.

Where stronger separation is required, the agent can help configure an approved separate environment. The [container chapter](#containers) explains one option. Use the institution's support route when the necessary controls cannot be established in the current environment.

Repeat relevant checks when you add a tool or change how work is run. If settings are maintained through another program, protect its source copy as well as the file the agent reads; [Appendix B](#understand-the-two-copies) explains the two locations.

[^tk-pueue-process]: [Pueue's documentation](https://github.com/Nukesor/pueue) describes its background service, working directories, and task environment. The conclusion about checking the service's access follows from that separate execution process; queue submission is not an access-control test.

[^tk-access-controls]: Anthropic's [permission documentation](https://code.claude.com/docs/en/permissions) describes tool rules and their precedence. The research guide's [access chapter](https://dss-agentic-research.pages.dev/chapters/agent-access.html#enforce-those-limits) introduces the controls and defines the related terms.

[^tk-sandbox-scope]: Anthropic lists [what runs outside the sandbox](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox). A command merely sending a request to an existing service does not move that service inside the command's sandbox.

[^tk-home-folder]: The tilde (`~`) means your home folder. The other two paths start inside the project folder. See Anthropic's [settings-file reference](https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect).

[^tk-settings-scope]: See Anthropic's [settings precedence](https://code.claude.com/docs/en/settings#settings-precedence) and [permission-rule precedence](https://code.claude.com/docs/en/permissions#settings-precedence). These explain file merging; the agent must still inspect the configuration used by the actual session and its extensions.

<!-- ===================== PART II — ESSENTIAL TOOLS ===================== -->

# 3. Install and manage tools with Homebrew {#adding-tools}

A package manager installs software and its supporting components, then provides a consistent way to update or remove it. [Homebrew](https://brew.sh/) supplies many tools in this guide. Once it is installed, an agent can add the program a research task needs without taking you through a different website and installer each time.

Suppose you want a batch of simulations to continue while you are away. The agent can install [pueue](https://github.com/Nukesor/pueue) with Homebrew, then configure the queue for the project. Installing the program makes it available; setting up the queue makes it useful for your work.

## Ask the agent to install the tool

Start from the app and describe the task. The agent should check whether the tool and Homebrew are already available in the environment where it will run. If Homebrew is missing, it can identify the supported installation route and explain any step you must complete personally.

> Check whether Homebrew and pueue are available where this project runs. Install what is missing through the appropriate route, keeping the existing installation where it works. Explain any password or sign-in step I must complete. Confirm that you can run pueue from this session, then configure it for the project's simulation jobs.

The installation command for pueue is `brew install pueue`; the agent runs it. You handle system password prompts and institutional authorization. Enter passwords in the system dialog or sign-in interface, not in the conversation. Homebrew's [installation documentation](https://docs.brew.sh/Installation) describes its supported routes, including a package installer for Apple Silicon Macs. If a personal step requires Terminal, [chapter 18](#terminal-agents) explains how to open it.

The useful completion report identifies the installed program, its version, and whether the agent can invoke it in the intended session. A program may already be installed but absent from that session's `PATH`, the directories searched for commands. Have the agent diagnose that before installing a second copy.

![](figures/tool-installation.svg){#fig-tool-installation fig-alt="The agent checks for an existing program. Available software can be used immediately; missing software and its dependencies are installed through the package manager, then checked in the actual session."}

## Keep a record of installed tools

A [Brewfile](https://docs.brew.sh/Brew-Bundle-and-Brewfile) lists software to install with Homebrew. Ask the agent to maintain it when a recoverable machine setup would help, and to record how the project uses its tools. A Brewfile does not pin the full software environment for an analysis; [chapter 8](#environments) covers language and package versions.

During ordinary work, have the agent check for an existing installation before adding software. When an update could affect a recorded analysis, it should preserve the working environment and explain the proposed change. Updates to a computer's tools and changes to a study's package versions serve different purposes.

## Use the installation route for your computer

Keep an institutional package manager when it already supplies the required tools. Homebrew also supports Linux under its documented requirements. The Windows route in this guide uses Ubuntu through [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/windows/wsl/install), so the agent must install and use the tools in the intended Linux environment. [Chapter 1](#choose-tools) explains the guide's platform scope.

# 4. Recover earlier work: git and gh {#version-control}

Research projects change as sample definitions, analyses, and manuscripts develop. [Git](https://git-scm.com/) records versions of selected files so an agent can explain what changed or recover earlier work. The history remains available after the conversation has ended.

Suppose a revised exclusion rule removes far more observations than expected. Ask the agent to find that change and recover the earlier rule while keeping the manuscript edits made since then. You decide which sample definition is appropriate; the agent finds and restores the relevant code.

## Give the project a useful history

A git *repository* stores the project's history. A *commit* records a set of changes with a description. The agent can create these checkpoints after meaningful pieces of work, such as a revised specification or a completed figure. The descriptions should explain the change well enough to find it later.

> Maintain version history for this project. Inspect any existing repository and preserve current edits. Track the code, manuscript, and appropriate configuration, excluding protected data, credentials, generated libraries, and caches. Record meaningful checkpoints as tasks are completed, and summarize changes affecting the analysis or reported results.

The agent handles file selection and commits. You do not need to inspect every code difference to benefit from the history. A *diff*, which shows changed lines, remains useful when investigating a particular decision or unexpected result. Git records only the files and changes included in its history; keep appropriate backups for the rest of the project.

If the project lives in Dropbox, have the agent configure storage for git's internal files before creating a populated repository. [Appendix D](#cloud-sync-storage) explains the specific local procedure and how to handle an already populated directory.

![](figures/version-recovery.svg){#fig-version-recovery fig-alt="Git checkpoints retain an earlier sample rule. The agent restores that rule into the current project while preserving later manuscript edits."}

## Recover the change you need

State the desired outcome rather than a git operation: “Restore the sample definition from before yesterday's sensitivity analysis, keeping the new figures and manuscript edits.” The agent should locate the relevant version, preserve unrelated work, and check the affected analysis after recovery.

A useful report names the recovered decision, identifies the changed files and source checkpoint, and explains which outputs were regenerated. If the earlier state was never recorded, the agent should say what it can recover and what must be reconstructed. It should not silently reset the entire project to an older version.

## Share work when intended

[GitHub](https://github.com/) hosts repositories for collaboration. [GitHub CLI (`gh`)](https://cli.github.com/) lets the agent use GitHub from commands, including preparing a pull request: a proposed change collaborators can discuss before it is incorporated. Git can maintain local history without GitHub.

Use the lab's existing host and account arrangements. You complete [personal sign-in](https://cli.github.com/manual/gh_auth_login); the agent configures the connection and checks it without displaying credentials. Once sharing is authorized, it can send the intended changes and summarize the project's checks. A private repository still sends its contents to the hosting service, so protected data and secrets must be excluded before sharing. The research guide's [handoff chapter](https://dss-agentic-research.pages.dev/chapters/research-handoff.html) covers deciding what belongs in a research deposit.

# 5. Give research tasks reliable commands: just {#project-commands}

<!-- aliases: runnable-checks -->

A command runner gives names to tasks a project repeats. [Just](https://just.systems/) saves those commands in a small text file called a `justfile`. The agent can use them while developing the analysis, and you or a collaborator can run them later without asking an LLM to reconstruct the steps.

In the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html), changing a figure label should not require fitting the statistical model again. A figure command can read the saved estimates and regenerate the plot. A separate command can refit a selected specification when the analysis changes.

## Give the commands useful work

The analysis needs independently runnable steps with explicit inputs and saved outputs. A step might fit one specification, produce a figure, or build the manuscript. Shared functions can support several steps. The research guide's [modular-workflow chapter](https://dss-agentic-research.pages.dev/chapters/research-workflows.html#modular-steps) explains how to organize that work.

Installing just does not create this structure. Have the agent inspect the current analysis and preserve its working results before reorganizing it. Each command should then select a coherent task without quietly repeating unrelated computation.

![](figures/project-commands.svg){#fig-project-commands fig-alt="Several modular analysis scripts and one small justfile provide commands for selected fits, figures, a manuscript, or a complete build."}

## Save the commands

> Preserve the current results, then give this project commands to fit a selected specification, rebuild figures from saved estimates, and run the complete workflow. Use just unless the existing command system already does this. Record each command's inputs and outputs, reuse shared code, and check that reorganizing execution has not changed the intended results.

The agent installs just if needed and maintains the recipes. A small project might expose the following menu; these commands are examples to create for the project, not commands available simply because just is installed.

| Example command | Project operation |
|---|---|
| `just fit age-spline` | Fit the named specification and save its results. |
| `just figures` | Rebuild figures from saved results. |
| `just paper` | Regenerate the manuscript from its source and outputs. |
| `just smoke` | Exercise a small representative workload. |
| `just build` | Run the project's complete documented workflow. |

Ask the agent to use these recipes in normal work and keep their descriptions current. `just --list` shows the available recipes. A completed figure task should report the command used, the saved estimates it read, and the figure it produced.

## Run a smoke test {#smoke-tests}

A *smoke test* runs a small representative workload through the actual workflow before a large batch. Ask the agent to run one specification or a few simulation repetitions through the relevant stages, checking that the software runs and expected outputs are saved. Use the same code and environment as the full run, with a smaller workload selected by an option.

> Add a smoke-test recipe using the actual workflow. Keep its outputs separate from the full analysis, run it after relevant changes, and confirm the expected files before starting an expensive batch.

[]{#runnable-checks}

Execution checks and scientific checks answer different questions. A working pipeline can still implement the wrong analysis. Keep checks derived from the research specification runnable too, such as a join that must preserve observation counts. The research guide covers [simulation against known truth](https://dss-agentic-research.pages.dev/chapters/simulation.html) and [independent implementations](https://dss-agentic-research.pages.dev/chapters/checking-analysis.html).

## Combine command and dependency runners

[Make](https://www.gnu.org/software/make/), [targets](https://docs.ropensci.org/targets/), and [Snakemake](https://snakemake.readthedocs.io/) can track dependencies and determine which work needs repeating. Just provides named commands; it does not perform that dependency analysis. A `just build` recipe can invoke targets or Snakemake, while other recipes open a preview or run quick checks.

[Chapter 9](#pipeline-dependencies) explains selective rebuilding. [Chapter 6](#job-queues) adds a queue when the saved command needs to run unattended. Keep an existing Make setup or master do-file if it already supplies the required behavior.

# 6. Keep unattended jobs moving: pueue {#job-queues}

A queue keeps prepared research jobs moving while you are away. It starts the next waiting job automatically when another finishes, so neither you nor an agent needs to supervise each launch. [Pueue](https://github.com/Nukesor/pueue) manages these jobs through a background service and keeps their status and logs.

Suppose the [heat-and-birthweight sensitivity analysis](https://dss-agentic-research.pages.dev/chapters/example-project.html) needs 100 independent fits. If the computer can comfortably run four at once, the remaining fits wait their turn. You can return later and ask the agent which results are ready and which jobs need attention.

![](figures/job-queues.svg){#fig-job-queues fig-alt="An illustrative queue of 100 jobs feeds four simultaneous running slots. Whenever a job finishes, the queue automatically starts the next. Finished jobs retain results, logs, and success or failure status."}

## Prepare the batch

Ask the agent to run a representative fit through the queue before submitting the full batch. This [smoke test](#smoke-tests) checks the command, working directory, project environment, and saved output. It also helps establish a sensible concurrency limit.

Four simultaneous jobs do not necessarily use four processor cores. Each fit may use several threads, and memory can limit concurrency before processor capacity does. Have the agent inspect those requirements and leave capacity for the rest of the computer's work.

> Prepare these sensitivity fits as queued jobs. Run a representative case first and check its saved result. Choose a concurrency limit from its memory and thread use, then submit the batch. Record job identifiers, specifications, logs, and output locations so we can identify and rerun individual failures.

The queue service's access must suit the work, as explained in [chapter 2](#tool-access). Use the project's recorded environment in the submitted commands rather than relying on whichever software the service happens to find.

## Let the queue manage execution

The background service starts and records the jobs. Closing the submitting conversation need not stop them, but the computer must remain awake and available. A reboot or shutdown can interrupt work. A queue's record does not let an interrupted fit resume midway; that requires checkpoints saved by the fitting program.

For short tasks, direct execution may be sufficient. For work on a cluster, retain its institutional scheduler. On Windows through [WSL2](https://learn.microsoft.com/windows/wsl/systemd), have the agent verify the service's lifetime before relying on unattended execution. A systemd service does not itself keep a WSL instance alive.

## Review results and recover failures

Ask for completed artifacts as well as process status. A command can exit successfully while writing its result to an unexpected location. Keep failed attempts and their logs so the agent can explain what happened.

An illustrative report might say:

> Of 100 jobs, 98 completed with the expected results files. Two failed before saving estimates because their requested memory exceeded the available allocation. Their specifications and logs are retained; the completed fits do not need rerunning.

You can then ask the agent to diagnose the failures, propose any change affecting the analysis or resource use, and rerun the affected jobs. Each retry should retain its relationship to the original attempt. Avoid duplicating completed fits or overwriting an earlier failed run's evidence.

Pueue distinguishes waiting, running, and finished jobs. The agent should retain task IDs, inspect the stored success/failure result, and verify expected outputs. `pueue wait` indicates that waiting has ended; its own exit status is not the job's outcome.

<details class="guide-example">
<summary>Example: submit a saved command and inspect its outcome</summary>

For a project with a `fit` recipe, the agent can submit `just fit`. The recipe must already exist.

```text
pueue add --print-task-id -- just fit
pueue status
```

Use the returned task ID. If it were 42, the following query checks the stored result using [jq](https://jqlang.org/):

```text
pueue log 42
pueue wait 42
pueue status --json | jq -e '.tasks["42"].status.Done.result == "Success"'
```

This result shape was checked with pueue 4.0.4. The agent must check the installed version and the expected result file as well as the stored status. For the observed macOS [R](https://www.r-project.org/) problem, retain the [pseudo-terminal helper](#r-on-macos) for queued execution too.

</details>

## Combine with a dependency pipeline

A [just](https://just.systems/) recipe can invoke a complete analysis, and [targets](https://docs.ropensci.org/targets/) or [Snakemake](https://snakemake.readthedocs.io/) can decide which dependent steps need rebuilding. Pueue can queue that outer command. Choose resource limits for both levels so the pipeline's internal workers do not overwhelm the machine. [Chapter 9](#pipeline-dependencies) explains the dependency runner's role.

# 7. Find and inspect project files {#finding-files}

Agents often need to locate a small piece of information in a large project: where an exposure is defined, which script writes a table, or what a saved service response contains. Computers already provide search and file-reading tools. The programs here give the agent faster searches, useful filters, and ways to query structured data without reading everything into the conversation.

Suppose a reviewer asks how `hot_days` enters the analysis. The agent needs its construction, the statistical model that uses it, and the figure label describing it. [Ripgrep (`rg`)](https://github.com/BurntSushi/ripgrep) searches text across files and reports matching paths and lines. Ripgrep is the program's name; `rg` is its command.

## Choose the appropriate search

| Task | Tool | Useful result |
|---|---|---|
| Search text within project files | ripgrep (`rg`) | Matching passages with file paths and line numbers. |
| Locate files by name or type | [fd](https://github.com/sharkdp/fd) | A focused list of candidate files. |
| Query JSON | [jq](https://jqlang.org/) | Selected fields from a structured response. |
| Query or edit YAML | [yq](https://mikefarah.gitbook.io/yq/) | Relevant configuration values, preserving their structure. |
| Inspect source text | [bat](https://github.com/sharkdp/bat) | Readable excerpts with line numbers and syntax highlighting. |

The agent can install a missing program through the established package manager. Keep an available alternative when it already does the job. JSON and YAML queries use the document's structure, which is more dependable than searching for a word and assuming the adjacent text has the intended meaning.

## Ask for findings tied to files

> Find where hot_days is constructed, used in statistical models, and labeled in figures. Report the relevant paths and lines and explain how the definitions relate. Use focused searches and excerpts. If a saved JSON or YAML response is involved, query the relevant fields rather than printing the entire response.

![](figures/project-search.svg){#fig-project-search fig-alt="Focused searches connect the exposure definition, statistical model formula, and figure label through file paths and line references."}

An illustrative answer could identify `code/exposure.R` as the construction step, `code/fit.R` as the model formula, and `code/figure.R` as the label source, with the actual line numbers attached. The agent should explain any disagreement between those locations. The filenames here illustrate the form of a report; the agent must use the files that exist in your project.

## Investigate a missing match

Ripgrep ordinarily skips ignored and hidden files. If no match appears, have the agent check the [search scope](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) before concluding that the definition is absent. A name assembled by code or stored in a binary file may need a different investigation. Search exclusions reduce noise; they are not file-access restrictions.

For a structured response, distinguish a missing field from an explicit null value. The linked yq is Mike Farah's implementation; other programs use that name. Some Linux distributions also name fd and bat differently. Have the agent identify the available program and its behavior, then record useful tool conventions for future sessions.

<!-- ===================== PART III — REPRODUCIBLE RESEARCH WORKFLOWS ===================== -->

# 8. Preserve a software environment: rig, renv, and uv {#environments}

An analysis can change when its software changes. Recording the language and package versions lets the agent restore the earlier environment before investigating a different result or handing the project to a collaborator.

Suppose a collaborator reruns the [synthetic heat-and-birthweight analysis](https://dss-agentic-research.pages.dev/chapters/example-project.html) and obtains different intervals. The agent needs the original software records to determine whether the discrepancy follows from an environment change. Installing the latest releases would give it a different comparison.

## Record the language and packages

The *runtime* is the installed language interpreter, such as a particular release of R or Python. Packages provide additional functions used by the analysis. A *lockfile* records resolved package versions and their dependencies so they can be restored together.

| Responsibility | R | Python |
|---|---|---|
| Install and select the language | [rig](https://rig.r-lib.org/) manages [R](https://www.r-project.org/) installations. | [uv](https://docs.astral.sh/uv/) manages [Python](https://www.python.org/) installations; `.python-version` records a selection. |
| Record and restore packages | [renv](https://rstudio.github.io/renv/) maintains `renv.lock`. | uv maintains `pyproject.toml` and `uv.lock`. |

Renv records the R version but does not install or switch R itself. Rig supplies that capability. Uv handles both language and package management, but the records still serve different purposes.

![](figures/research-environments.svg){#fig-research-environments fig-alt="Language version and package dependencies have separate records. Rig and renv support R; uv supports Python. Restore both records and check a baseline output."}

## Capture the working environment

For a new project, have the agent establish version records alongside the analysis. For an existing project, preserve the working versions before adding packages or changing managers.

> Inspect this project's software and existing environment records. Capture the language version and complete package dependencies without upgrading them. Keep the current environment intact, restore the recorded versions separately, and rerun the selected baseline checks. Report missing software and any changed results.

Keep a functioning environment manager. [Conda](https://docs.conda.io/) environments can include language packages and other compiled software. [Micromamba](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html) is a small command-line manager for conda environments; the agent can use it when that matches the project's scientific software. A project already using [pixi](https://pixi.sh/) need not migrate to uv. Ask for exact package/build records appropriate to that manager and target platform; a loose list of package names does not reproduce an earlier resolution.

[Stata](https://www.stata.com/) projects also need their Stata release and community-command versions recorded. These tools do not require researchers to change language.

## Restore and check it

Have the agent restore into a separate environment and run the project's [smoke test](#smoke-tests) or selected baseline analysis. For R, it can check the restored library against `renv.lock`; for uv, [locked synchronization](https://docs.astral.sh/uv/concepts/projects/sync/) can refuse an inconsistent lockfile instead of updating it silently.

The completion report should identify the runtime actually used, whether packages restored, and which baseline outputs were compared. Missing packages or platform-specific failures are findings to resolve, not reasons to replace versions without recording the change. When adding a package later, retain the updated dependency record and check the affected analysis.

## Include system requirements

Some packages depend on system libraries, compilers, or external programs. Record those requirements too. [Containers](#containers) can help package system software when language/package records are insufficient. Neither approach promises identical numerical results on all hardware.

Store environment records with the project, while keeping generated libraries out of git and unnecessary cloud synchronization. [Appendix D](#cloud-sync-storage) describes the Dropbox procedure and the separate [R/macOS execution issue](#r-on-macos).

# 9. Rerun only affected steps: targets and Snakemake {#pipeline-dependencies}

When an analysis changes, some results need rebuilding and others remain usable. A dependency-aware runner records those relationships and selects the work to repeat. [Targets](https://docs.ropensci.org/targets/) provides this for R workflows; [Snakemake](https://snakemake.readthedocs.io/) organizes file-producing steps that can use different languages. [Just](https://just.systems/) can remain the project's command interface: `just build` invokes the runner underneath.

In the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html), a figure-label change should reuse the saved fits. Changing specification B should rerun fit B and the combined figure, while reusing fit A. Changing the shared analysis data affects both fits. The runner needs those dependencies recorded to make the distinction.

## Show the dependencies

![](figures/research-dependencies.svg){#fig-research-dependencies fig-alt="The same dependency graph shows three changes: a figure edit reruns the figure and document, a specification-B edit also reruns fit B, and a shared-data change reruns both fits. Unaffected results are reused."}

Have the agent identify each step's inputs, code, parameters, and outputs. External inputs count too: a script that reads an unrecorded file or an API response can produce a result the runner does not know is out of date. Save and declare those inputs according to the project's acquisition procedure.

The [targets manual](https://books.ropensci.org/targets/) explains tracking objects, functions, and files. [Snakemake rules](https://snakemake.readthedocs.io/en/stable/snakefiles/rules.html) describe how inputs produce outputs. The agent writes and maintains the definitions; you check that the proposed relationships match the intended research workflow.

## Connect the analysis

> Preserve the current results and environment. Connect the analysis through targets for this R workflow, declaring its inputs, functions, files, and outputs. Keep just as the command interface. Show the dependency graph, identify which steps should rerun after different changes, and compare the resulting outputs with the baseline.

For a workflow organized around files and multiple languages, request Snakemake instead. The agent should install it in the recorded project environment. Existing scripts can become steps, with finer selection where the code already separates coherent operations. There is no requirement to divide every function into a new file.

## Check what reruns

The agent can inspect planned work with targets' `tar_outdated()` or a Snakemake dry run, then test the expected behavior on a representative workload. It should report which steps actually ran, which results were reused, and whether the outputs agree with the intended change.

A successful setup report might show that a label edit rebuilt only the figure and document, while changing specification B rebuilt that fit and its downstream outputs. Those are illustrative expectations, not findings from the example project. Full analysis runs and scientific checks remain separate from this execution check.

## Run the pipeline unattended when useful

The runner can reuse completed results after an interruption when they remain current. Restarting halfway through an unfinished fit requires checkpoints from that fitting program. Keep the definitions, environment records, and needed inputs with the project; large rebuildable caches need separate storage management.

[Pueue](https://github.com/Nukesor/pueue) can queue the outer pipeline command, while the pipeline runner decides which steps need computation. Coordinate memory and threads across both. Targets can use [crew](https://wlandau.github.io/crew/) for parallel workers; the documented [R/macOS issue](#r-on-macos) requires checking the actual worker route before enabling it in an affected environment.

# 10. Run work in a separate environment: containers {#containers}

A container runs software in a separately configured environment. It can include system libraries that a language lockfile does not capture, and its access can be limited to selected files and services. The configuration determines which of those benefits the project receives.

For example, a spatial analysis may depend on a particular geospatial library as well as R packages. Packaging those components helps a collaborator establish the same software. A different project may need an agent and local LLM to process only an approved document collection. Both can use containers, but they need different access and software arrangements.

## Decide why the task needs a container

| Research need | What the agent configures |
|---|---|
| Reproduce system dependencies | Language/packages, system libraries, command-line programs, and the supported platform. |
| Run approved work with restricted inputs | Required input access, separate output storage, permitted network connections, and credentials. |
| Give a local agent a limited workspace | The LLM runtime and agent, their tools, and the files/accounts available to them. |

A container does not itself authorize processing under a data agreement. Establish the permitted environment through the research guide's [data-governance chapter](https://dss-agentic-research.pages.dev/chapters/research-limits.html#data-chain-of-custody), then configure and check it for that purpose.

## Specify software and access

With [Docker](https://www.docker.com/), an *image* is the packaged software from which a container starts. A `Dockerfile` records how to build the image. A *mount* makes a folder on the host computer available inside the container, for example as read-only inputs or writable output storage. Docker's [container introduction](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/) and [mount documentation](https://docs.docker.com/engine/storage/bind-mounts/) explain those distinctions.

![](figures/research-containers.svg){#fig-research-containers fig-alt="A configured container includes language, packages, and system software. It reads selected inputs, writes designated outputs, and uses explicitly configured network access. An optional local-agent setup also includes an LLM runtime and harness."}

State where the LLM will run. Putting commands inside a container does not move a hosted LLM onto your computer. A local-agent arrangement must configure the LLM runtime too, as described in [chapter 17](#local-models).

## Build and check the environment

> Configure a container for [task and purpose]. Preserve the project's language/package records and include required system software. Give it only the approved input/output locations and connections. Record where the LLM runs if one is involved. Run a representative case, check the saved outputs, and test any required access restrictions with harmless substitute files.

The agent can use [Colima](https://github.com/abiosoft/colima) with Docker's command-line tools on a Mac, or retain an existing approved [Docker Desktop](https://www.docker.com/products/docker-desktop/) setup. On institutional infrastructure, follow the supported runtime, which may be [Apptainer](https://apptainer.org/). The researcher completes required authorization; the agent builds and checks the environment.

A useful report identifies the software, exposed folders, network access, and tested outputs. It distinguishes an analysis that ran from access restrictions that were tested. Broad home-directory mounts, unnecessary privileges, or access to Docker's control socket can defeat intended separation; configure only the access the task needs.

## Preserve what is needed to run it again

Save the build/run configuration and environment records with the project. A base-image digest identifies particular image content, while a moving tag can later identify a different image. Pin the relevant dependencies and record the platform. A Dockerfile that downloads software from changing repositories is not a permanent copy of that software; when long-term recovery matters, arrange approved storage for the built image too.

Keep different access arrangements explicit rather than changing one container silently between tasks. [Chapter 2](#tool-access) explains how these controls relate to the agent's other tools.

# 11. Generate documents from research outputs: Quarto and Pandoc {#research-documents}

A manuscript often reports the same result in a table, a figure, and a sentence. Building those locations from saved analysis outputs makes updates easier to carry through consistently. [Quarto](https://quarto.org/) and [Pandoc](https://pandoc.org/) let an agent maintain the source and regenerate the document in the required format.

In the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html), a revised estimate should reach both the results table and the text describing it. The agent can connect those locations to the saved result and rebuild the manuscript. Collaborators can still receive Word files or PDFs.

## Connect the document to saved results

Keep the manuscript text, references, figures, and numerical results in known project locations. The document build should read the intended outputs and make clear whether it also runs analysis code. A figure or text revision need not trigger a new fit.

Quarto combines authoring, code execution, and publishing configuration, using Pandoc for conversion. Pandoc can also convert maintained source directly. Ask the agent to use the route that fits the existing document and the required output, rather than replacing a working writing system solely to match this example.

![](figures/document-production.svg){#fig-document-production fig-alt="Manuscript text, references, and saved results feed a Quarto or Pandoc build. Outputs include Word, HTML, and PDF through LaTeX. Accepted coauthor edits return to maintained source before another build."}

## Choose the deliverable

| Format | Typical purpose | Additional requirement |
|---|---|---|
| Markdown | Readable text source or a simple text deliverable. | Appropriate formatting and links. |
| Word (`.docx`) | Editable drafts for coauthors. | Styles, optionally supplied by a reference document. |
| PDF through LaTeX | Typeset manuscripts with equations and controlled layout. | A TeX distribution and required fonts. |
| HTML | Reports, websites, and interactive material. | Web assets and inspection in a browser. |

[LaTeX](https://www.latex-project.org/) is a typesetting system. A *TeX distribution* supplies the programs and packages needed to use it. For Quarto's PDF route, the agent can follow its [PDF setup](https://quarto.org/docs/output-formats/pdf-basics.html), which includes [TinyTeX](https://yihui.org/tinytex/). If no suitable distribution is installed, the agent can use `quarto install tinytex` and verify the chosen PDF engine. Keep a working [MacTeX](https://tug.org/mactex/) or [TeX Live](https://tug.org/texlive/) installation. Word and Markdown output do not require this PDF software.

## Configure and inspect the build

> Configure this manuscript to build from its maintained text, references, and saved results. Produce [required formats] and add a [just](https://just.systems/) command. Explain which analysis outputs it reads and what it recomputes. Render the document, inspect its pages, and check representative numbers against their source files.

The agent should check the actual document for missing citations, misplaced tables, clipped figures, and broken equations. You review interpretation and prose. A successful conversion alone does not show that a reader can use the result. The research guide's [manuscript chapter](https://dss-agentic-research.pages.dev/chapters/research-writing.html#trace-manuscript) explains the full check that the right numbers reach the paper.

Keep build settings and dependencies with the project. Quarto's [execution settings](https://quarto.org/docs/projects/code-execution.html) control reuse of previous outputs; the agent should document how the final analysis results are refreshed. Specific R and TeX failures belong in [Appendix D](#troubleshooting).

## Bring coauthor edits back into the source

If a collaborator edits the generated Word file, preserve that returned file before rebuilding. Ask the agent to compare it with the version sent, identify the edits, and incorporate accepted changes into the maintained source. Resolve conflicting scientific revisions before generating a replacement draft.

> Preserve this coauthor's returned document. Compare it with the draft sent, transfer the accepted edits into the source, and flag unresolved changes to claims or results. Rebuild a new draft without overwriting the returned copy, then check that the accepted edits survived.

Conversion cannot be assumed to preserve every comment or tracked change automatically. Establish which document is authoritative for the current editing stage and retain the source/reference files needed for the next build.

<!-- ===================== PART IV — CONNECT TO DATA AND SERVICES ===================== -->

# 12. Keep credentials out of research files: 1Password and direnv {#credentials}

An API key can let a program spend money or access data under your account. If an agent saves that key in a script, anyone who receives the script may receive the same access. The project needs a reliable way to authenticate without putting credentials in its research files.

Suppose an agent builds a workflow that sends approved documents to a paid large language model (LLM) service. Each run needs the key; the bibliography, analysis code, and shared repository do not. [1Password](https://1password.com/) can hold the credential and supply it when the command runs. If your institution already provides this function, use that service instead. The same separation applies to cloud storage and other authenticated research services.

## Supply a credential to a command

An *environment variable* is a named value made available to a running program. The script can ask for a variable such as `MODEL_API_KEY` without containing the key itself. A *secret reference* identifies the vault item from which to obtain the value, keeping the credential in the vault until needed.

The 1Password command-line tool, `op`, can resolve those references when it starts a command through `op run`. Ask the agent to configure the intended command and account using the [documented setup](https://developer.1password.com/docs/cli/secrets-scripts/). You complete personal sign-in or authorize access to the appropriate vault item. Use credentials limited to the operations the project needs.

> Configure authentication for this project's document-analysis command using the approved vault item. Supply the key when the command runs, without saving its value in source files, logs, or conversation. Make an authorized request and report whether it succeeds. Record the account, variable name, and invocation for future runs; do not include the secret.

![](figures/credential-delivery.svg){#fig-credential-delivery fig-alt="A script refers to an environment variable. The vault supplies its secret value to the running command, which authenticates to a service and saves research results without saving the credential in source."}

The agent should check the actual execution environment. A command launched by a queue or on another computer may not have the authentication available in an interactive session. Keep the necessary setup with the project's run instructions, including whether an API key selects separate usage billing. The researcher chooses that account and spending arrangement.

A vault prevents unnecessary copies in project files; the process receiving a credential can still read or transmit it. Apply the [access controls](#tool-access) to that process and its tools. Never ask the agent to print all environment variables to diagnose an authentication failure.

## Reuse project settings

[Direnv](https://direnv.net/) loads environment settings associated with a project directory. It is useful when several project commands need the same configuration, such as a service address, a project identifier, or a reference to a credential. It does not replace the vault.

The settings live in `.envrc`, which contains executable instructions. Ask the agent to explain those instructions before authorizing the file with `direnv allow`. Keep secret values out of it. If an agent or queue does not load your usual terminal settings, `direnv exec .` can apply the approved environment to a particular command. The [direnv manual](https://direnv.net/man/direnv.1.html) documents both routes.

Choose the narrower arrangement that meets the need: one command can receive a credential through `op run`; several commands can share nonsecret project settings through direnv. Have the agent record which arrangement the workflow uses so later sessions invoke it consistently.

## Respond to an exposed credential

If a key has been exposed, revoke it and replace it through the service that issued it. Deleting it from the latest script does not remove copies from repository history or other systems. The agent can help locate affected files without reproducing the secret and update the workflow to use the replacement. You retain control of account access and any investigation of unauthorized use.

# 13. Connect to research data and services: MCP {#service-connections}

A reference library contains more than the PDFs saved in a project folder. It may also hold collections, notes, tags, and records for papers you have not downloaded. Giving an agent access to that library can make a literature task repeatable without exporting and attaching the same material each time.

For the [synthetic heat-and-birthweight study](https://dss-agentic-research.pages.dev/chapters/example-project.html), suppose the relevant papers and notes are organized in a [Zotero](https://www.zotero.org/) collection. The agent needs to retrieve records, read available material, and update the project's evidence table. The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) provides a common way for an agent application to discover and use operations such as searching that collection.

## Choose an access route

An MCP *server* is the program that exposes those operations to the agent application. It can run on your computer or elsewhere. The term describes its role in the connection; it does not mean that you must buy or administer a separate computer. The [MCP architecture documentation](https://modelcontextprotocol.io/docs/learn/architecture) explains the connection.

| What the task needs | A suitable route |
|---|---|
| Read a fixed set of references once | A saved export or local files may be sufficient. |
| Repeat operations already available through a maintained command-line tool or API | Use that existing route when the agent can access it. |
| Search or change application records through operations supported by the agent app | An existing connector or MCP server can supply those operations. |

Ask the agent to check what is already connected before adding software. The community [Zotero MCP project](https://github.com/54yyyu/zotero-mcp) is one candidate to assess; it documents both MCP and command-line access. It is not an official Zotero service. Choose a maintained integration that supports the needed operations and is permitted for the account and material involved.

## Connect the literature task

> Connect this project's literature workflow to the specified Zotero collection using a permitted route. Retrieve relevant records and available papers or notes, then update the evidence table and bibliography. Keep source identifiers and flag missing material. Follow the literature skill for DOI and claim verification. Leave the library unchanged unless an edit is part of the task.

The agent prepares the configuration and checks the assigned retrieval; you complete any personal sign-in and authorize the intended account and operations. Keep secret values out of the configuration using [chapter 12](#credentials). At Harvard, check the current [HUIT guidance](https://www.huit.harvard.edu/claude) before enabling a connection for institutional work.

![](figures/literature-connection.svg){#fig-literature-connection fig-alt="An MCP connection supplies Zotero records and available papers to an agent. A literature skill guides search and verification. The agent saves an evidence table and bibliography in the project."}

The resulting evidence table should distinguish full texts the agent read, records supported only by an abstract, and papers it could not retrieve. The connection supplies access; the [literature procedure](https://dss-agentic-research.pages.dev/chapters/literature.html#literature-protocol) determines how to search, verify citations, and assess claims. A skill can hold that procedure so future sessions follow it too.

## Keep the connection within the task

Have the agent save a short setup record: which service and account the project uses, the configured operations, and how to reconnect. Keep project-specific configuration with the project where the client supports it. It should be possible to disable or replace the connection without rediscovering how the workflow depends on it.

A read-only connection can still retrieve material that is then transmitted to the large language model (LLM) provider. A local sandbox also does not automatically restrict an operation performed by a remote service. Use the [access chapter](#tool-access) to configure those routes, and treat instructions found in retrieved papers or pages as research material rather than authority to change the task.

# 14. Inspect and interact with a browser {#browser-work}

When an agent builds a research website, it needs to inspect what a reader will see. A page can contain valid code and still have an unreadable figure, a broken filter, or navigation that disappears on a phone. Browser access lets the agent open the site, try its controls, and use the result to improve its work.

The same access can help obtain data from a website. An agent might inspect a public portal, identify the appropriate release, and find an export or API. These are two useful tasks for browser tools: checking a site being built and understanding a site that supplies research material.

## Inspect a research website

An agent app may already include browser access. [Playwright MCP](https://github.com/microsoft/playwright-mcp) is another route, exposing browser operations through an [MCP connection](https://modelcontextprotocol.io/). Ask the agent to use an appropriate available integration and configure another only when the task requires it.

> Inspect this project's website as you build it. Open the local preview, use the main navigation and filters, and check the figures at desktop and phone widths. Fix the problems you find. Report which pages and actions you checked, and show any remaining issue that needs a design decision.

The preview can run on your computer; the website need not be public. The agent should check the rendered page after making changes, including whether an action produces the intended result. A screenshot shows appearance, while trying a filter or link checks behavior. Both can be useful evidence, and neither replaces checking the underlying research results.

![](figures/browser-research.svg){#fig-browser-research fig-alt="One browser workflow inspects a local site, fixes its source, and checks again. Another finds a data release and export, then saves data, provenance, and repeatable collection code."}

## Collect data through a website

Interactive browsing is often useful for finding the right source, even when the eventual collection should use a simpler route. Follow the research guide's [acquisition ladder](https://dss-agentic-research.pages.dev/chapters/data-acquisition.html#acquisition-ladder): use a suitable API or structured download, then static page extraction, then scripted browser interaction, with interactive agent browsing where those routes do not meet the need.

> Find a permitted way to obtain the specified records from this source. Prefer an API or export when available. Save the original responses or downloads and their provenance. If collection must recur, create a script with explicit inputs, saved outputs, request limits, and failure reporting. Check representative records before running the full collection.

The agent's first exploration may involve clicking through filters and download options. Preserve what it learns in a repeatable collection procedure, with the release, date, query, and relevant selection settings. A transcript of clicks alone is a poor record of a large extraction. The [data-provenance section](https://dss-agentic-research.pages.dev/chapters/data-acquisition.html#data-provenance) explains what to retain for later research use.

## Choose the browser account

A browser profile holds session information such as logins. A separate profile can avoid giving a task access to your everyday signed-in services. If the task needs an authenticated portal, use the intended account and complete personal sign-in yourself; let the agent explain which actions it needs to perform.

Being able to open a page does not establish permission to transmit its contents to a hosted large language model (LLM). Apply the [data rules](https://dss-agentic-research.pages.dev/chapters/research-limits.html) and [tool-access settings](#tool-access) to the actual account and content. Submitting a form or changing a record should follow the authorization for that task.

Some tools can also operate desktop applications through computer use. That broader access can help with a task a browser cannot perform, but it is optional here. Configure it for the specific application and work rather than making it a prerequisite for website inspection or collection.

<!-- ===================== PART V — RUN AND COORDINATE AGENTS ===================== -->

# 15. Divide work between agents: shared projects and git worktrees {#parallel-work}

Several agents can develop different parts of a research project at the same time. The benefit depends on whether those tasks can proceed independently. Clear responsibilities and an agreed format for exchanged results prevent parallel work from becoming repeated repair.

For example, one agent can develop modeling code while another develops figures. Before they start, agree on the saved estimates the plotting code will read, including column names, units, and uncertainty intervals. The agents can then work on their own files and check the complete model-to-figure workflow when the pieces are ready.

## Assign tasks and interfaces

An agent application may be able to delegate work to subagents, or you can open separate sessions with distinct assignments. [Claude Code's subagents](https://code.claude.com/docs/en/sub-agents) provide one documented delegation route. Ask the coordinating agent to use the capabilities available in the current application; a particular terminal layout is not required.

> Divide this work between a modeling agent and a visualization agent. Agree on the saved-results format first. Assign the files each may edit, coordinate changes to shared configuration, and have a lead agent run the combined workflow. Preserve existing edits and report unresolved research decisions.

Each assignment should name its inputs, expected outputs, and files it may change. A shared helper, dependency file, or pipeline definition needs an assigned editor. The lead agent also coordinates repository operations so that one agent does not reset or remove work another is using. Record agreed interfaces in project files where later sessions can find them.

## Choose shared or separate working copies

Agents editing different files can often share one project directory. [Git worktrees](https://git-scm.com/docs/git-worktree) provide separate working directories attached to the same repository, usually on different branches. They help when agents need overlapping files, alternative versions, or a stable copy for testing while other work continues.

| Arrangement | Useful when | What still needs coordination |
|---|---|---|
| One project directory | Tasks own different files and can share current results | Shared files, output names, repository operations, and interfaces |
| Separate worktrees | Tasks need different versions or overlapping edits | Inputs and environments in each copy, shared resources, and integration of changes |

![](figures/agent-coordination.svg){#fig-agent-coordination fig-alt="Modeling and visualization agents can own different files in one project or use separate git worktrees. Both arrangements require an agreed results format and a combined workflow check."}

A new worktree may not contain ignored data, installed packages, or saved model fits. Have the agent supply the approved inputs and restore the recorded environment before starting work. Separate output locations prevent one run from replacing another's results. Worktrees share repository history and can still reach other files and services; they are not security sandboxes.

## Integrate the work

The coordinating agent should run a representative path through the combined workflow. Code that works separately can still disagree about a result column, a file location, or a modeling assumption. Resolve those mismatches before the full run. Preserve needed work before removing a worktree, and leave research choices that cannot be inferred from the specification for your decision.

Parallel development is different from an [independent-implementation check](https://dss-agentic-research.pages.dev/chapters/checking-analysis.html). For that check, fresh agents receive the same specification and permitted inputs without seeing the other implementation or results. A worktree alone does not achieve this separation, especially when the earlier code remains in shared history.

# 16. Run agents from saved requests {#headless-agents}

Some studies need a large language model (LLM) to perform the same specified task on many items: classify a passage, extract a reported outcome, or assess a review against a rubric. A *headless* agent runs from a program without an interactive conversation. A saved workflow can give it the next case, collect its response, and record a failure without waiting for a person to type another request.

Consider the research guide's [reviewer-and-judge example](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html#headless-agents). Each reviewer receives an assigned paper and instructions; each judge receives the material required by the judging protocol. Separate runs make this repeated work manageable. When the study also requires reviewers to know nothing about other cases, the workflow must control those inputs explicitly.

## Turn the task into a saved workflow

[Claude Code](https://code.claude.com/docs/en/headless) supports noninteractive calls through `claude -p`, as well as an Agent SDK for Python and TypeScript. An agent in the desktop app can prepare and launch a script using one of these routes if its tools have the required access. Headless describes how the run proceeds, not where you must sit or which window you must use.

Ask the agent to turn the written protocol into a repeatable command. It should check the intended account, available tools, and output format, and handle failures without waiting indefinitely for an approval prompt. Personal sign-in and any decision to use separately billed API access remain yours.

> Build the reviewer-and-judge workflow from this specification. Give each case its assigned inputs and permitted tools. Save the requests, raw responses, parsed results, and run status. Run two representative cases through the full workflow, diagnose failures, and confirm the expected artifacts before the main batch. Keep the preliminary outputs separate from study results.

If the task only requires a judgment on supplied text, a direct LLM API call may be sufficient. Use an agent when the task needs tools or a sequence of actions. Ordinary model fitting and document production should use their saved research code directly.

## Record each case

![](figures/headless-research.svg){#fig-headless-research fig-alt="Saved instructions and assigned inputs feed fresh reviewer runs. Each retains its response and attempt status. A judge receives only the protocol-defined inputs. Parsing produces a measurement table while preserving failed attempts."}

| Record | Why retain it |
|---|---|
| Case, role, exact request, and assigned inputs | Establish what the reviewer or judge was asked to assess |
| Model version/settings, tools, and loaded configuration | Establish the execution conditions and sources of context |
| Raw response and separately parsed result | Preserve what the LLM returned, including material discarded by parsing |
| Run status, diagnostics, and attempt identifiers | Distinguish a valid result from a refused action, interruption, or failed parse |

A process can finish successfully while returning a response the analysis cannot use. The workflow should check the expected output structure and keep malformed responses. Specify retry rules before the batch so repeated attempts do not silently replace inconvenient results. The [smoke test](#smoke-tests) checks that this machinery works; the [LLM-evaluation procedure](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html#evaluate-llm-labeling) checks the quality of the judgments.

For a long batch, [pueue](https://github.com/Nukesor/pueue) can manage outer jobs and concurrency. Configure the queue's authentication and environment as well as its commands, and use the [job report](#job-queues) to establish what completed.

## Control what each run receives

A fresh conversation can still load project instructions, memory, plugins, or connections. It may also have tools capable of reading other cases. If cross-case separation matters to the study, have the agent identify these routes and configure the inputs and access for each run. Do not resume another case's conversation.

Use a targeted check of the actual configuration. A run should read a harmless marker in its assigned input while an attempted read of another case's marker is denied through the configured routes. Check unexpected instruction and memory loading too. Save the observed outcomes; an LLM saying it remembers nothing is not evidence that it cannot retrieve another case.

For stronger restrictions, use the [access controls](#tool-access) and, where appropriate, a [separate execution environment](#containers). The research guide explains [which information reviewers and judges should receive](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html#control-what-each-reviewer-or-judge-receives). These are separate decisions from whether the resulting judgments are scientifically useful.

<details class="guide-example">
<summary>Claude Code configuration for controlled runs</summary>

The [`--bare` option](https://code.claude.com/docs/en/cli-reference) skips much automatic discovery of instructions and extensions. It is not a sandbox and does not remove tool access by itself. It also uses a different authentication route from ordinary subscription sign-in; check the installed version and intended provider before selecting it. Explicit tool, input, session-persistence, and settings choices remain necessary. The `dontAsk` permission mode denies calls that would otherwise prompt, but currently documented extensions can affect approvals, and normally permitted actions still run. Configure and check the complete run rather than treating a flag as proof of isolation.

</details>

# 17. Run and adapt an LLM on your own hardware {#local-models}

Running a large language model (LLM) on hardware you control can keep its computation within an approved environment and let a project retain a chosen version of its weights. That hardware may be your main computer or a server provided by your institution. A separate server is not required when the model and task fit the computer's available memory and processing capacity.

Suppose a study uses an LLM to extract outcomes from documents that must remain in an approved environment. The workflow needs a suitable model, software to run it, and a record of the requests and outputs. Here, *inference* means running a trained LLM to generate a response; it does not mean statistical inference about a population. The researcher guide explains [when local models are useful](https://dss-agentic-research.pages.dev/chapters/research-models.html#local-models) and how to evaluate them for the study.

## Choose hardware and a runtime

A *runtime* loads the model's weights and processes requests. [Ollama](https://docs.ollama.com/quickstart) is one option for compatible downloaded models; use an existing approved institutional service if it already meets the need. Ask the agent to check the operating system, available memory, accelerator support, and storage before choosing a model or installing software.

The download size is not the memory needed during use. Longer inputs and more simultaneous requests can substantially increase that requirement. A quantized model stores its weights at reduced precision, often reducing memory use, but its behavior must still be assessed on the task. Record the exact release and quantization instead of treating models with the same family name as interchangeable.

![](figures/local-llm-execution.svg){#fig-local-llm-execution fig-alt="On approved hardware, a script can request inference from an LLM runtime with local weights. An optional agent harness connects the runtime to tools. Hardware can be the main computer or an institutional server."}

For Ollama, the agent should configure the process that actually serves requests. Its [local-only setting](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features) disables Ollama's cloud features; the service can listen on the local loopback address, `127.0.0.1`, rather than accept network connections. Keep model files outside cloud-synchronized project folders. These settings govern the runtime, not other network-capable tools used by an agent.

> Prepare this computer for the approved local-model task. Check its resources and existing installations, select a compatible runtime and model version, and configure local execution. Keep my usual hosted-agent settings intact. Record the model, runtime, storage, context limit, and concurrent-request limit, then run representative permitted inputs and report failures and resource use.

Have the agent report whether the requested configuration fits the available hardware. If it does not, choose a smaller candidate for evaluation or use an approved server. Do not quietly shorten study documents or change the model to make a run finish.

## Run the research task

Use a saved command with explicit inputs and outputs. For extraction or classification, request a defined response structure and validate each result before it enters the analysis table. Save raw responses, malformed outputs, and retries. A completed request establishes execution; comparison with the study's reference judgments establishes whether the output is useful.

Keep the runtime version, exact model identifier or digest, generation settings, request template, and input identifiers with the run. A model tag can point to different weights later. [Ollama's model-list API](https://docs.ollama.com/api/tags) exposes identifying information; preserve the relevant record rather than relying on a remembered download name.

A small setup trial for this guide used Qwen3 4B and demonstrated structured output and a file-reading tool call. It did not establish research accuracy or comprehensive containment. The [setup-trial record](resources/local-model-setup-trial.md) gives the configuration and observed limitations. Choose and evaluate the research model using the [study's evaluation procedure](https://dss-agentic-research.pages.dev/chapters/research-models.html#evaluate-adapted-model), then use the [batch workflow](#headless-agents) when many requests must run consistently.

## Connect the LLM to an agent

An LLM runtime does not itself provide the complete agent environment. A software harness gives the LLM tools and carries out its tool calls. [Ollama's Claude Code integration](https://docs.ollama.com/integrations/claude-code) offers an Anthropic-compatible endpoint for supported models. Have the agent configure a separate invocation and check an actual tool call before relying on it for project work.

Record both sides: which runtime processes the LLM requests and which harness controls the tools. Retain the tool-call trace for the check. A model that returns fluent text may still fail to produce usable tool calls. Apply [file and network restrictions](#tool-access) independently of the choice to run the LLM locally; a local LLM can still ask a tool to contact a remote service.

## Adapt a model when the study calls for it

Fine-tuning changes model parameters using training examples. LoRA is a method that trains a relatively small set of added parameters, often saved as an *adapter*, alongside a specified base model. The researcher guide explains [when training may help](https://dss-agentic-research.pages.dev/chapters/research-models.html#context-or-training), [LoRA](https://dss-agentic-research.pages.dev/chapters/research-models.html#lora), and the evidence needed to compare adaptation with a strong unadapted model.

| Environment | Candidate tool | What the agent should check |
|---|---|---|
| Apple silicon Mac | [MLX-LM](https://github.com/ml-explore/mlx-lm) | Supported model, available memory, data format, and training/inference compatibility |
| A supported PyTorch environment, commonly with a suitable GPU | [Hugging Face PEFT](https://huggingface.co/docs/peft/main/en/quicktour) | Base-model support, accelerator configuration, adapter method, and required training libraries |
| An established institutional training service | Its approved training tools | Data access, resource allocation, artifact retention, and how the resulting model is evaluated |

The agent should install the selected tools in a [recorded project environment](#environments). Keep the training, development, and held-out evaluation data separate, following the study design. Use development data to make training choices; do not repeatedly tune against the held-out evaluation results.

> Set up the agreed adaptation study using the approved data splits and base model. Preserve the unadapted baseline, record the full configuration, and check that a short training run can save and reload an adapter before launching the planned run. Save checkpoints, logs, and evaluation outputs. Compare the baseline and adapted versions using the prespecified evaluation; do not change the data splits or success criteria to improve the result.

![](figures/llm-adaptation.svg){#fig-llm-adaptation fig-alt="The base LLM supplies a baseline and an adaptation run. Training and development inputs support adaptation; a held-out evaluation compares baseline and adapted versions. The adapter and run records are saved."}

The retained artifacts should identify the base weights and tokenizer, training data version, adapter configuration, software environment, run settings, checkpoints, and evaluation results. An adapter must be loaded with a compatible base model. If it is converted or merged for another runtime, check that exported version on the task too; a successful file conversion does not establish unchanged behavior.

Training may require different resources and software from inference. Use a short execution check before a long run, then arrange job management and checkpointing appropriate to the machine. Protect training data, logs, and resulting weights under the study's requirements; fine-tuning is not a way to anonymize sensitive examples. The [data chain-of-custody discussion](https://dss-agentic-research.pages.dev/chapters/research-limits.html#data-chain-of-custody) applies to these artifacts too.

## Apple's on-device model {#apple-on-device}

On a compatible Mac, Apple's system model provides another route for bounded tasks such as extracting structured information. Its [Foundation Models Python SDK](https://github.com/apple/python-apple-fm-sdk) and, on supported macOS versions, the [`fm` command](https://developer.apple.com/videos/play/wwdc2026/334/) provide programmatic access. Ask the agent to check system requirements, model availability, and the selected execution mode before using either.

This route differs from downloading arbitrary open weights and running them through Ollama. Keep the system and SDK versions with the results, and evaluate the actual task. Selecting an offered cloud-processing mode changes where the request runs. These Apple routes have been checked against documentation for this guide, but have not been included in its local execution trial.

<!-- ===================== PART VI — WORK FROM THE TERMINAL ===================== -->

# 18. Use an agent from the terminal: Claude Code {#terminal-agents}

<!-- aliases: terminal-commands -->

A terminal is another place to work with an agent. It can be convenient when a project's commands and job logs are already open there, or when the work runs on a remote computer. You can give ordinary-language requests to the agent, then run the saved project commands directly when you want to repeat a task.

For example, ask the agent to revise a figure using saved estimates. Once it has made the change, a saved [just](https://just.systems/) recipe, `just figures`, regenerates the figure without asking the large language model (LLM) to reconstruct the steps. The code and results remain in the project whichever interface you use.

## Open the project in a terminal

A *terminal* is the window that displays typed input and program output. A *shell* is the program that interprets commands entered there. On a Mac, open Terminal through Spotlight. For this guide's Windows route, open Ubuntu in [WSL2](https://learn.microsoft.com/windows/wsl/) through [Windows Terminal](https://learn.microsoft.com/windows/terminal/). An Ubuntu shell and a PowerShell tab are different environments; these examples use the former.

The shell has a *working directory*: the folder used to resolve paths that do not start from the top of the filesystem. Type `cd`, followed by your project's path, to change to it. Replace the example path below with the actual location and keep the quotes if it contains spaces:

```text
cd "/Users/your-name/Research/my-project"
```

The command `pwd` displays the current directory. You can ask the agent in the app for the exact `cd` command if you do not know the path. [Terminal vocabulary](#terminal-history) explains these terms further; no additional terminal setup is needed to continue.

## Start a conversation with the agent

Have the agent check whether the [Claude Code](https://code.claude.com/docs/en/overview) command-line interface is installed. The desktop app and the `claude` command are separate entry points; installing one does not establish that the other is available. The agent can prepare the installation using the current [platform instructions](https://code.claude.com/docs/en/quickstart), with any personal sign-in or authorization completed by you.

At the shell prompt, enter:

```text
claude
```

Once Claude is running, type a research request in ordinary language: “Regenerate the main figure from the saved estimates and explain which files you used.” You are now speaking to the agent. It can read project instructions and use its permitted tools, just as it can through another interface. Use `/exit` to end that conversation and return to the shell prompt.

![](figures/terminal-agent.svg){#fig-terminal-agent fig-alt="Start Claude from the shell to enter ordinary-language requests. Exit to return to the shell, where just figures runs saved code without an LLM."}

The project directory tells the agent where the work starts; it does not itself restrict every file the agent can reach. The [access settings](#tool-access) still apply. If the selected LLM is hosted, information supplied to it is still sent to the provider even though you are using a local terminal.

## Run a saved command

If the project has a [just](https://just.systems/) command menu, these commands list its available recipes and run the figure recipe:

```text
just --list
just figures
```

Enter these at the shell prompt, after leaving the agent. The figure recipe must already exist; ask the agent to create or explain it using [chapter 5](#project-commands). You do not need to remember the underlying analysis commands because the project has saved them.

You can also ask the agent to install a missing tool. With [Homebrew](https://brew.sh/) available, `brew install just` is the corresponding installation command. The [package-manager chapter](#adding-tools) explains setup. A “command not found” message can mean that the program is absent or that this shell cannot locate it; have the agent distinguish those causes before reinstalling anything.

## Find session controls

While the agent is running, slash commands control the session. The [interactive reference](https://code.claude.com/docs/en/interactive-mode) and installed help show the controls available in your version and account.

| Control | What it does |
|---|---|
| `/model`, `/effort` | Select an available LLM and supported reasoning effort |
| `/context` | Show context use for the session |
| `/compact` | Summarize the conversation to reduce the context it occupies |
| `/usage` | Show account-usage information |
| `/exit` | Return to the shell |

The research guide explains [usage and context](https://dss-agentic-research.pages.dev/chapters/directing-work.html#usage-and-context). For access configuration, `/permissions` and `/sandbox` expose relevant controls; use them with the [tool-access chapter](#tool-access), since they govern different mechanisms. Before ending a session, have the agent save important decisions and next steps in the project records.

Use the [queue workflow](#job-queues) for unattended computation and [saved agent requests](#headless-agents) for programmatic LLM work. An open terminal is an interface to those tasks, not a record of whether they completed. Optional layouts for watching them appear in [Appendix A](#working-environment).

<!-- ===================== REFERENCE ===================== -->

# Appendix A. Optional working environment {#working-environment}

An agent conversation, a job log, and a figure can all belong to the same research task. Keeping them easy to find can make the work more comfortable. Your existing terminal and editor may already provide what you need; add a tool when it solves a recurring inconvenience.

For example, you might want the agent conversation beside a view of the project's queue, with the latest figure open in an editor. Ask the agent to arrange that using the tools already installed. The layout should help you follow the research, without requiring you to learn a collection of new applications.

| Need | Possible addition | What to ask the agent to configure |
|---|---|---|
| See a conversation and a log together | [iTerm2](https://iterm2.com/) on macOS; [Windows Terminal](https://learn.microsoft.com/windows/terminal/) with [WSL2](https://learn.microsoft.com/windows/wsl/) | Readable panes or tabs in the intended project environment |
| Recognize the current project and branch | [Oh My Posh](https://ohmyposh.dev/) | A simple prompt in the existing shell |
| Return to a named terminal workspace | [Zellij](https://zellij.dev/) | A session and layout for the project |
| Inspect code, data, and plots together | [Positron](https://positron.posit.co/) or an existing research editor | The actual project and its recorded language environment |

![](figures/research-workspace.svg){#fig-research-workspace fig-alt="An illustrative workspace places an agent conversation, queue status, and a saved figure together. The queue service runs separately from the window displaying its status."}

## Make the current work visible

Use legible text and a small number of panes. A prompt showing the project directory, git branch, and failed-command status can help distinguish projects without changing the shell itself. Decorative symbols and special fonts are optional. Have the agent preserve existing settings and check a new session after making changes.

On Windows, an Ubuntu tab and a PowerShell tab use different environments. The agent should configure the intended one rather than assume that settings in one apply to the other. Shell startup files also run instructions, so a visual customization should not silently replace unrelated setup.

## Return to a working session

Zellij can keep a named session available when you detach from it and later reattach, while the host and session continue running. That can preserve a useful layout or survive a dropped connection. Ask the agent to configure the layout and explain the relevant on-screen controls.

Session management does not replace [pueue](https://github.com/Nukesor/pueue), which manages submitted jobs and their records. Nor does a restored layout establish that computation continued through sleep or shutdown. Use the [queue chapter](#job-queues) for unattended work and the institution's scheduler on a cluster.

## Inspect results in the editor you use

Positron supports work with [R](https://www.r-project.org/) and [Python](https://www.python.org/); [RStudio](https://posit.co/products/open-source/rstudio/), [Stata](https://www.stata.com/), or another familiar editor may already serve the project well. Have the agent open the project in its [recorded environment](#environments) and identify the interpreter being used.

You can inspect substantive results while the agent works on the files. Coordinate any simultaneous edits, and keep transformations used in the analysis in saved code rather than only in a data viewer. An extra AI extension or database connection is a separate choice, not a prerequisite for inspecting the work.

# Appendix B. Keep records of shared settings: chezmoi {#shared-settings}

Personal tool settings often live in several folders. A saved, maintained copy makes it easier to recover after a mistake or prepare another computer. [Chezmoi](https://www.chezmoi.io/) manages selected configuration files and places them where the relevant programs expect to read them.

Suppose you revise the coding instructions shared by your research projects. The change should survive a later settings update and be available on another machine. That requires knowing which copy is maintained and which copy the agent reads. A [git](https://git-scm.com/) repository can record the maintained copy's history.

## Understand the two copies {#understand-the-two-copies}

The *source* is the copy managed by chezmoi. The *applied file* is the copy installed where a program reads it. Applying the source updates the installed copy. If the agent edits the applied file directly, it must capture that change back into the source before a later apply restores the older version. Chezmoi documents [editing and applying changes](https://www.chezmoi.io/user-guide/daily-operations/) and [capturing changed files](https://www.chezmoi.io/reference/commands/re-add/).

![](figures/research-shared-settings.svg){#fig-chezmoi-source-and-applied fig-alt="Chezmoi applies maintained source settings to files read on two computers. An edit to an applied file must be captured back into source before a later apply. Git can record source history."}

Ask the agent to identify any existing settings manager before introducing another. Have it preserve current files, record the source and applied locations, and verify that the target program reads the intended settings. Choose which personal settings belong in this record. Project-only configuration already tracked with its project usually needs no additional manager.

## Preserve differences between machines

Some settings can be identical across computers; others need different paths or installed programs. Chezmoi templates can express those differences. Have the agent check the resulting files in each intended environment instead of copying one machine's entire setup unchanged.

Keep credentials and account state out of an ordinary settings repository. A private repository controls who can access it; it does not make a stored password harmless. Use the [credential workflow](#credentials) for secret values and the [shared-instructions guidance](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html#shared-instructions) for the content of reusable research instructions.

If a managed file controls agent permissions, protect both the source and applied locations. Changing the source can change the permissions on the next apply. The [access chapter](#tool-access) explains that relationship. The agent should check the resulting behavior as well as whether the files were copied successfully.

# Appendix C. Account-usage tools {#usage-tools}

Start with the usage display in the app you already use. It is usually the quickest way to see the account's reported limits and reset information. An additional tool becomes useful when you want a history the app does not show, such as which recorded sessions accounted for most of the week's usage.

[Ccusage](https://ccusage.com/) summarizes compatible retained local logs. Its reports can help investigate patterns, but they do not replace the account's official usage display or bill. Ask the agent to identify what the available records can actually answer before installing another reporting tool.

| Question | Appropriate source | Limitation |
|---|---|---|
| How much of the account allowance remains, and when does it reset? | The app or provider's account display | Depends on the plan and what the provider reports |
| Which recorded sessions used the most tokens? | Compatible local logs and a tool such as ccusage | Missing or unsupported logs leave gaps |
| What was charged, or what would token use cost at specified prices? | Provider billing for actual charges; a log-based calculation for an estimate | Estimated API cost is not a subscription balance or an invoice |

## Ask for a report that answers a question

> Use the available records to identify the largest sessions this week. State which dates, machines, and interfaces the report covers. Distinguish recorded token totals from explanations inferred about their causes. Keep confidential transcript content out of the report.

The agent should check the [current tool documentation](https://ccusage.com/guide/) and available log formats. A session absent from the report may have been deleted, stored elsewhere, or recorded in an unsupported format. State those gaps rather than interpreting absence as zero use.

A long statistical-model fit on your computer does not consume LLM tokens simply because time passes. Asking an agent for repeated updates or sending it large logs can generate additional LLM calls. If the report identifies that pattern, use saved job records and the [queue workflow](#job-queues) to retrieve useful summaries. The research guide explains [context and usage choices](https://dss-agentic-research.pages.dev/chapters/directing-work.html#usage-and-context).

# Appendix D. Troubleshooting {#troubleshooting}

Give the agent the error message, the command that failed, and the expected output. Ask it to identify the cause before changing the environment or starting another copy of the job. The entries below distinguish common routing problems from the specific failures observed while developing these guides.

| Symptom | Where to investigate |
|---|---|
| A command cannot be found | [Installation and command availability](#adding-tools) |
| A queued job waits, fails, or leaves no expected output | [Queue status and outcomes](#job-queues) |
| A restored environment differs from the original | [Language and package versions](#environments) |
| A pipeline reruns too much or misses a changed input | [Declared dependencies](#pipeline-dependencies) |
| Authentication fails | [Credential delivery in the actual execution environment](#credentials) |
| A connection cannot retrieve the expected records | [MCP configuration and access](#service-connections) |
| A browser task uses the wrong session or cannot see a page | [Browser profile and account](#browser-work) |
| A programmatic agent run cannot authenticate or use a required tool | [Headless-run configuration](#headless-agents) |
| A local LLM exhausts memory or returns unusable output | [Runtime resources and response checking](#local-models) |
| R uses a core without producing output when launched by an agent on macOS | [The observed R issue](#r-on-macos) |
| A PDF build reports “No counter 'none' defined” | [The specific table fix](#tex-table-counter) |
| A project stalls while cloud storage processes many generated files | [Cloud-synchronized storage](#cloud-sync-storage) |

## R launched by an agent on macOS {#r-on-macos}

In the environment used to develop these guides, [R](https://www.r-project.org/) has sometimes stalled when an agent starts it without a terminal connection. The process uses a processor core but produces no output. This is an observed macOS issue, not a claim about every R installation or operating system. A *pseudo-terminal*, a software-created terminal connection, has provided a dependable workaround in that environment.

Have the agent put the workaround in one executable helper, `bin/rscript-pty`, and route the project's R commands through it. Keep the helper's standard-input handling intact. For [targets](https://docs.ropensci.org/targets/), use `callr_function = NULL` and disable [crew](https://wlandau.github.io/crew/) for the initial check so the work stays in the process with the terminal connection. Separately launched workers need their own verification.

[Download the macOS R helper](resources/rscript-pty){.download-button download="rscript-pty"}

<details class="guide-example">
<summary>Read the complete macOS R helper</summary>

```sh
#!/bin/sh
command -v script >/dev/null 2>&1 || {
  echo "No script command; cannot allocate a pseudo-terminal" >&2
  exit 127
}
exec script -q /dev/null Rscript "$@" < /dev/null
```

Have the agent save it as `bin/rscript-pty`, make it executable, and verify it through the intended execution route.

</details>

Retain the helper for queued R jobs too. Earlier success with a particular queue or worker configuration does not establish that another configuration will behave the same way. Check the actual execution route, the expected artifact, and whether the process finishes before scaling up. If a process stalls, identify it and examine progress before stopping it; do not launch replacements that leave the old jobs consuming resources.

If the agent's sandbox prevents pseudo-terminal allocation, use an explicitly approved execution route or run the saved command from your own application. Do not silently turn off the restrictions. For [Quarto](https://quarto.org/) that executes R, the macOS workaround wraps the complete render:

```text
script -q /dev/null quarto render paper.qmd < /dev/null
```

Linux uses a different `script` interface, so this command should not be copied unchanged there. [Terminal vocabulary](#terminal-history) explains the connection without requiring a shell-programming lesson.

## Captionless tables with TeX Live 2026 {#tex-table-counter}

A PDF build in these guides encountered “No counter 'none' defined” for a captionless table. [Pandoc](https://pandoc.org/) emitted a table setting that the installed [LaTeX](https://www.latex-project.org/) packages expected to name an existing counter. For that specific error, have the agent add this guarded definition in the template preamble, before the document begins:

```tex
\makeatletter
\@ifundefined{c@none}{\newcounter{none}}{}
\makeatother
```

The guard preserves a counter if it already exists. Have the agent rebuild and inspect the affected table. A different error may need a missing font, package, or source correction; this block is not a general repair for failed PDF builds.

## Cloud-synchronized project storage {#cloud-sync-storage}

Software environments, caches, logs, and repository internals can contain many rapidly changing files. Synchronizing them through a cloud folder can create substantial churn and, in the Dropbox/macOS environment used for these guides, has sometimes blocked file operations. A git ignore rule controls what git records; it does not control what Dropbox synchronizes.

Ask the agent to distinguish authored material from files that can be rebuilt. Keep dependency records and source files with the project, while placing large rebuildable environments and caches outside the synchronized tree where practical. If a provider-specific exclusion is used, configure and verify it on an empty directory before filling that directory. Check the provider and platform: [Dropbox documents different mechanisms](https://help.dropbox.com/sync/ignored-files), and these settings are not interchangeable across systems.

For an already populated or stalled directory, preserve the work and diagnose its synchronization state before changing exclusions. Retrospectively applying an exclusion is not the recovery procedure used here. Rebuild a disposable environment outside the synchronized location from its recorded dependencies, then reconnect the project to it. Preserve source, uncommitted work, and repository history when planning any move; do not treat a repository as a disposable cache.

The agent should verify the project's commands after changing locations and explain which material is still backed up. Excluding generated files from synchronization does not itself create a backup or a reproducible environment. [Chapter 8](#environments) covers the records needed to restore software.

# Appendix E. Terminal vocabulary {#terminal-history}

Many terminal terms describe physical equipment that software has replaced. Knowing that history makes the names less arbitrary. This appendix explains the terms used in the [terminal chapter](#terminal-agents) and in tool diagnostics; you do not need to memorize them before working with an agent.

## From a device to a window

A terminal was a device through which a person communicated with a computer. A teletype combined a keyboard and printer: typed characters went to the connected machine, and responses appeared on paper. [Museum collections preserve examples](https://collections.museumsvictoria.com.au/items/407696) used for computer access. Later terminals displayed text on a screen.

The abbreviation *TTY*, from teletype, remained in computing. A modern *terminal emulator* provides a similar text interface in a software window. The program inside that interface may be a shell, an editor, or an agent. Its appearance alone does not tell you which program is receiving your input.

![](figures/terminal-vocabulary.svg){#fig-terminal-vocabulary fig-alt="A keyboard and printer terminal, a screen terminal, and a modern terminal window illustrate the history of TTY. A shell or an agent is the program inside the modern interface."}

## The program receiving your commands

A *shell* [reads commands](https://www.gnu.org/software/bash/manual/bash.html) and starts programs. [Bash](https://www.gnu.org/software/bash/) and [zsh](https://www.zsh.org/) are examples. The shell can interpret a saved script as well as something you type. Its *prompt* indicates that it is ready for input; another program started from the shell may display its own interface until you exit it.

A [*pseudo-terminal*, or PTY](https://man7.org/linux/man-pages/man7/pty.7.html), is a software connection that behaves like a terminal for the program using it. Programs can behave differently when connected to a terminal than when reading from a file or another process. That distinction matters for the specifically observed [R-on-macOS problem](#r-on-macos), but does not mean every unattended command needs a PTY.

| Term | Meaning in this guide |
|---|---|
| Command-line interface, CLI | A program interface controlled through commands and arguments |
| Argument | A value or option supplied with a command |
| Working directory | The folder used to resolve relative file paths |
| Absolute / relative path | A location starting from the filesystem root / a location interpreted from a working directory |
| `PATH` | The list of directories searched to locate an executable command |
| Environment variable | A named value supplied to a program, often inherited by programs it starts |
| Standard input, `stdin` | The input channel a program can read |
| Standard output, `stdout` | The channel for ordinary program output |
| Standard error, `stderr` | A separate channel commonly used for diagnostics |
| Pipe | A connection passing one program's output to another program's input |
| Exit status | A code returned when a program finishes; its interpretation depends on the program |

Ask the agent to explain an unfamiliar term in the command or error where it occurs. The useful question is what the program will do and what result to expect. A vocabulary reference supports that understanding without requiring a course in shell programming.
