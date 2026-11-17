---
title: "Extending Your Agent's Toolkit"
subtitle: "A Guide for Researchers"
version: "2.3 draft"
---

<!-- ===================== PART I — FOUNDATIONS ===================== -->

# 1. Choose tools for a research need {#choose-tools}

Research involves tasks worth setting up once and repeating reliably: running a batch of analyses, rebuilding a manuscript, or restoring the software used in an analysis. This guide shows how to get an AI agent to set up and use tools for that work.[^tk-overview-agent] A tool is software the agent can use to perform an action, such as searching files, running an analysis, or retrieving records from a database. Examples in this guide use [`Claude Code`](https://code.claude.com/docs/en/overview) in the `Claude` desktop app. You direct the research through conversation; the agent sets up and operates the tools and checks their output, so you do not need to learn their commands.

Suppose a study needs 100 simulation runs, but your computer can handle four at once. A job queue can keep four running and automatically start another whenever one finishes. Ask the agent to prepare the batch, choose a suitable limit, and report completed and failed jobs when you return.

Use this guide as a reference. Read the next chapter on access, then turn to the tool your work needs. Each chapter explains its purpose and what to ask the agent to do. The companion [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/) covers research workflows and judgment; if you are new to the app, start with its [Chapter 2: Get started with the app](https://dss-agentic-research.pages.dev/chapters/first-session.html).

![](figures/agent-toolkit.svg){#fig-agent-toolkit fig-alt="Saved instructions guide an agent using an installed job queue or a connection to a reference library."}

## Find the tool for your task

The table below is a menu of capabilities, not a list to install in order. Keep tools that already serve the project, and add others when they supply a useful capability.


::: {.toolkit-lookup}

| Research need | Start here |
|:--|:--|
| **Foundations** | |
| Control what a new tool can read, change, or send | [Chapter 2: Control what added tools can access](#tool-access) |
| **Install tools and manage project files** | |
| Install and maintain research tools | [Chapter 3: Install and manage tools with Homebrew](#adding-tools) |
| Record changes and recover earlier work | [Chapter 4: Recover earlier work: git and gh](#version-control) |
| Find files and inspect their contents | [Chapter 5: Find and inspect project files](#finding-files) |
| **Run and reproduce research** | |
| Restore the language and package versions used for an analysis | [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) |
| Rerun analyses or rebuild figures with saved commands | [Chapter 7: Give research tasks reliable commands: just](#project-commands) |
| Rerun only steps affected by a change | [Chapter 8: Rerun only affected steps: targets and Snakemake](#pipeline-dependencies) |
| Keep a batch of analyses running unattended | [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) |
| Package software and configure a separate place to run it | [Chapter 10: Run work in a separate environment: containers](#containers) |
| Build a document from saved research outputs | [Chapter 11: Generate documents from research outputs: Quarto and Pandoc](#research-documents) |
| **Connect to data and services** | |
| Supply account credentials without putting them in research code | [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) |
| Give the agent access to an application or service | [Chapter 13: Connect to research data and services: MCP](#service-connections) |
| Build, inspect, or collect data from a website | [Chapter 14: Inspect and interact with a browser](#browser-work) |
| **Run and coordinate agents** | |
| Divide a project between several agents | [Chapter 15: Divide work between agents: shared projects and git worktrees](#parallel-work) |
| Automate repeated agent tasks, such as checking whether an analysis can be reproduced | [Chapter 16: Run agents from saved prompts](#headless-agents) |
| Run or adapt a large language model (LLM) on your own hardware | [Chapter 17: Run and adapt an LLM on your own hardware](#local-models) |
| **Work from the terminal** | |
| Use a terminal interface to the agent | [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents) |
| **Reference** | |
| Choose optional terminal and editor conveniences | [Appendix A: Optional working environment](#working-environment) |
| Restore personal settings across computers | [Appendix B: Keep records of shared settings: chezmoi](#shared-settings) |
| Investigate account usage | [Appendix C: Account-usage tools](#usage-tools) |
| Diagnose execution and document-build problems | [Appendix D: Troubleshooting](#troubleshooting) |
| Understand terminal terminology | [Appendix E: Terminal vocabulary](#terminal-history) |

:::

## Tell the agent when to use each tool {#make-the-tool-part-of-the-workflow}

Tell the agent when you want it to use each tool and what it should report, or ask it for suggestions if you are unsure. Ask it to save that guidance in `TOOLCHAIN.md`.[^tk-toolchain] Your [global user instructions](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html#shared-instructions) should tell the agent when to consult that file. Keep requirements specific to one study in its [project context files](https://dss-agentic-research.pages.dev/chapters/project-context.html#project-records). A longer recurring procedure can become a [skill](https://dss-agentic-research.pages.dev/chapters/reusable-procedures.html#what-skills-add): saved instructions that guide the agent through a task and its checks.

## Use tools from the app

You can ask the agent to install and operate these tools from the app. You supply the research decisions and complete personal steps such as signing in or entering an administrator password.

The setup examples cover macOS and Linux. On Windows, the examples assume the tools run in [`Windows Subsystem for Linux` (`WSL2`)](https://learn.microsoft.com/windows/wsl/), which provides a Linux environment on a Windows computer. Ask the agent to check the environment where the work will run before installing software there. You can keep using [`R`](https://www.r-project.org/), [`Python`](https://www.python.org/), [`Stata`](https://www.stata.com/), or other analysis software; adopting new tools does not require changing research language.

[^tk-overview-agent]: An agent combines a large language model (LLM), which processes supplied information and generates responses or tool requests, with tools and software that runs them and returns their results.

[^tk-toolchain]: See [Chapter 8: Apply your conventions across projects](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents* for guidance on organizing these files and telling the agent when to read them.

# 2. Control what added tools can access {#tool-access}

Adding a tool can change which files, applications, or online services an agent can access. The agent can identify what access the research task requires, explain the choices, and configure and test the controls. You decide which files and accounts it may use.

Suppose a study needs many statistical model fits, but the computer can run only a few at once. A queue is a list of runs waiting to start. A tool such as [`pueue`](https://github.com/Nukesor/pueue) manages that queue and starts another fit when one finishes. Running those fits requires access to the analysis code and approved inputs, plus somewhere to save results and logs. It should not require permission to change the original data or read another study's files.

## Check where the work runs

In [`Claude Code`](https://code.claude.com/docs/en/overview), permission rules[^tk-access-controls] allow tool actions, require approval, or block them. A sandbox[^tk-access-sandbox] adds restrictions enforced by the operating system on programs running inside it.[^tk-access-os] Written instructions explain how the agent should work, but do not enforce those restrictions.

Some tools send work to a background service: a program that runs separately from the agent and carries out submitted tasks. For example, `pueue` uses one to start queued jobs. Ask the agent to check what the service and the programs it starts can access.[^tk-pueue-process]

![](figures/tool-access-routes.svg){#fig-tool-access-routes fig-alt="The agent can run a command inside a configured sandbox, submit work to a separate queue service, or use a connected service. Each route needs its own access checks. Returned information reaches the agent; built-in file tools have separate permission checks."}

`Claude Code`'s built-in sandbox is off by default. When enabled, it covers commands run inside it and the programs they start. It does not enclose every tool available to the agent. Built-in file tools have their own permission checks; connected services and separately running services need their own access controls.[^tk-sandbox-scope]

Ask the agent to check whether the sandbox is enabled and explain which files and services each tool needs to access. Once you agree on the permitted access, have the agent enable and configure the necessary controls, test them with harmless files, and report any restrictions it could not verify.

Suppose you give the agent read-only access to a research database. It can retrieve records without changing them, but the retrieved information may still be sent to the large language model (LLM) it uses. If the LLM runs on a provider's computers, such as Anthropic's, that provider receives the information. Decide which material may be sent before giving the agent access. The companion guide [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/) explains [what reaches the LLM](https://dss-agentic-research.pages.dev/chapters/research-limits.html#what-reaches-the-llm) and [how to establish a chain of custody](https://dss-agentic-research.pages.dev/chapters/research-limits.html#data-chain-of-custody).

## Choose where the settings apply {#apply-settings-at-the-right-scope}

Use global settings for rules shared across your projects and project settings for the requirements of a particular study. Ask the agent to inspect the existing files and any institution-managed settings before proposing changes.

| Scope | Settings file | Use |
|:--|:--|:--|
| Global | `~/.claude/settings.json`[^tk-home-folder] | Personal settings across projects on this computer. |
| Project | `.claude/settings.json` inside the project | Settings that can be shared with project collaborators. |
| Personal project | `.claude/settings.local.json` inside the project | Your own settings for this project; keep this file out of version control. |

For many settings, the personal project file takes priority over the shared project file, which takes priority over global defaults. Permission rules combine across those files: a project allowance does not remove a matching global deny. Your institution can also enforce managed settings. Ask the agent to report which settings actually apply, including changes supplied when the session starts.[^tk-settings-scope]

Keep secret values out of these files and saved command approvals. [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) explains how to supply them to the program that needs them.

## Ask the agent to configure and check access

Describe the files and services the work needs. For the batch of fits, you could ask:

::: {.prompt}
> Set up access for these statistical model fits. The approved inputs are in [folder]; results and logs belong in [folder]. Leave the inputs unchanged and block access to [excluded folder]. Check the current agent settings and the queue service's access. Explain where changes are needed before applying them. Test permitted and blocked actions with harmless substitute files, then report the settings changed, the outcomes, and anything you could not verify.
:::

::: {.needspace height="6cm"}
:::

The agent should test the paths the work will actually use with harmless substitute files. A direct command succeeding or failing does not establish how a queued job behaves. Its report might include the following checks.

| Check | Expected outcome |
|:--|:--|
| Run a representative queued fit on approved synthetic inputs | Saved result and log appear in the intended folders. |
| Try to change a substitute for a protected input | The configured restriction blocks the change. |
| Try to read an excluded substitute file through each relevant tool or process | Each attempted route is blocked; untested routes are identified. |

Have the agent record which settings it changed, where they are stored, and the test results in the [project context files](https://dss-agentic-research.pages.dev/chapters/project-context.html#project-records). If a required restriction fails, have the agent diagnose and fix the problem, then confirm that the check passes before using protected inputs. These checks can expose configuration mistakes; they do not establish protection against every possible action.

The optional example below is intended to protect `data/raw` from changes and exclude `data/restricted`. Have the agent adapt it to the actual project, merge it with existing settings, and perform the relevant checks above. JSON is a text format that stores settings under named fields; you do not need to edit it yourself.

[Download the settings example](resources/project-settings-example.json){.download-button download="project-settings-example.json"}

<details class="guide-example">
<summary>Read the example project settings</summary>

File-tool paths beginning with `/` are project-relative here; sandbox paths beginning with `./` in project settings resolve from the project root. In global settings, relative sandbox paths resolve from that settings directory. These are different conventions, so the agent must resolve and check both before relying on them.

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

Where stronger separation is required, the agent can help configure an approved separate environment. [Chapter 10: Run work in a separate environment: containers](#containers) explains one option. Use the institution's support route when the necessary controls cannot be established in the current environment.

When you add a tool or change how work runs, ask the agent to repeat the access tests using harmless substitute files. It should confirm that the required work succeeds and that attempts to change protected inputs or read excluded files are blocked.

[^tk-access-os]: The operating system is the core software managing a computer's hardware, files, and running programs. macOS, Windows, and Linux are examples.

[^tk-pueue-process]: Programs started inside the sandbox remain restricted when they run in the background. Sending work to a service outside the sandbox does not extend those restrictions to it. See Anthropic's [sandbox scope](https://code.claude.com/docs/en/sandboxing#what-the-sandbox-restricts) and [`pueue`'s separate client and service](https://github.com/Nukesor/pueue).

[^tk-access-controls]: These settings can permit routine edits, require approval before publishing files, and block changes to protected inputs. See [Chapter 4: Control what the agent can do](https://dss-agentic-research.pages.dev/chapters/agent-access.html#enforce-those-limits) in *Doing Research with AI Agents* for examples. Anthropic's [permission documentation](https://code.claude.com/docs/en/permissions) describes the rules and their precedence.

[^tk-access-sandbox]: A restricted environment for running programs. It can limit which files those programs read or change and which online services they contact. See [Chapter 4: Control what the agent can do](https://dss-agentic-research.pages.dev/chapters/agent-access.html#enforce-those-limits) in *Doing Research with AI Agents* for an explanation of how sandboxing works alongside permission rules.

[^tk-sandbox-scope]: Anthropic documents that the [sandbox is off by default](https://code.claude.com/docs/en/sandboxing#what-the-sandbox-restricts) and lists [what runs outside it](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox).

[^tk-home-folder]: The tilde (`~`) means your home folder. The other two paths start inside the project folder. See Anthropic's [settings-file reference](https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect).

[^tk-settings-scope]: See Anthropic's [settings precedence](https://code.claude.com/docs/en/settings#settings-precedence) and [permission-rule precedence](https://code.claude.com/docs/en/permissions#settings-precedence). These explain file merging; the agent must still inspect the configuration used by the actual session and its extensions.

<!-- ===================== PART II — INSTALL TOOLS AND MANAGE PROJECT FILES ===================== -->

# 3. Install and manage tools with Homebrew {#adding-tools}

The agent may need a program that is not yet installed, such as a tool that starts a new simulation when the previous one finishes. A package manager installs the program and its supporting software, and provides a consistent way to update or remove it. [`Homebrew`](https://brew.sh/) supplies many of the tools in this guide.

For example, [`pueue`](https://github.com/Nukesor/pueue) is a tool that manages a job queue, starting waiting simulation runs as others finish. The agent checks whether it is installed on the computer that will run the simulations, installs it if needed, and configures the queue for the project.

![](figures/tool-installation.svg){#fig-tool-installation fig-alt="The agent retains an available program or installs the missing program and its supporting software. Both routes end by running the program in the intended session and reporting its version."}

## Ask the agent to install the tool

Describe the task to the agent and name the tool if you have one in mind. Otherwise, ask it to recommend a suitable tool or consult [Chapter 1: Choose tools for a research need](#choose-tools).

`Homebrew` is the package manager we recommend in this guide. It works on macOS and Linux, including Windows through [`Windows Subsystem for Linux` (`WSL2`)](https://learn.microsoft.com/windows/wsl/install). Before adding software, have the agent check what is already installed. On a computing cluster or another institution-managed system, it should also check for established installation methods and use those where appropriate. Otherwise, ask it to install `Homebrew` if needed, explaining any steps you must complete yourself.

::: {.prompt}
> Set up a job queue for this project's simulations, using `pueue` unless a suitable tool is already available. Check existing installations and how software is managed on the computer that will run the jobs. Use `Homebrew` unless an established institutional method is more appropriate, particularly on a computing cluster. Install `Homebrew` if needed, and explain any steps I must complete myself. Configure the queue and confirm that you can submit and monitor jobs from this session.
:::

The installation command for `pueue` is `brew install pueue`; the agent runs it. You handle system password prompts and institutional authorization. Enter passwords only when prompted by the installer or system, not in the conversation.

The agent can install `Homebrew` using its [official installation script](https://brew.sh/). If a step needs your input, such as an administrator password, it should explain exactly what to do in the [`Claude`](https://claude.com/download) app's built-in terminal[^tk-install-terminal] or the relevant system dialog.

After setup, ask the agent to confirm that it can use the tool for the project and tell you which version is installed. If it cannot find a program that is already installed, have it investigate why before installing another copy.

## Keep a record of installed tools

A [`Brewfile`](https://docs.brew.sh/Brew-Bundle-and-Brewfile) lists software to install with `Homebrew`, helping the agent set up the same tools on another computer. Your global `TOOLCHAIN.md`[^tk-install-toolchain] records what each tool does and when the agent should use it. Ask the agent to maintain both as tools are added, removed, or changed.

The exact language and package versions used by an analysis need their own records; [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) explains these.

Before updating software used by an analysis, ask the agent to explain the proposed change and preserve the software versions needed to rerun that analysis.

[^tk-install-terminal]: A terminal is a panel where you can enter commands and see their output. See [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents).

[^tk-install-toolchain]: See [Chapter 8: Apply your conventions across projects](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents* for guidance on organizing these files and telling the agent when to read them.

# 4. Recover earlier work: git and gh {#version-control}

Research projects change as sample definitions, analyses, and manuscripts develop. [`Git`](https://git-scm.com/)[^tk-git-command] records versions of selected files so an agent can explain what changed or recover earlier work. The history remains available after your conversation with the agent has ended.

Suppose a revised exclusion rule removes far more observations than expected. You decide which sample definition is appropriate; the agent finds the relevant change and can recover the earlier rule while preserving unrelated manuscript edits. A restored rule can change the results, so affected figures and manuscript values must be regenerated too.

![](figures/version-recovery.svg){#fig-version-recovery fig-alt="Git retains an earlier sample rule. The agent restores that rule while keeping unrelated later text and styling edits, then regenerates affected results."}

## Give the project a useful history

A `Git` *repository* (often shortened to “repo”) stores the project's history. A *commit* records a version of selected files with a message describing the change. The agent can create these checkpoints after meaningful pieces of work, such as an approved sample rule or a completed figure. The descriptions should explain the change well enough to find it later.

`Git` preserves versions of the project's files, but the study's requirements and the reasons for research decisions still need to be written down. For a paper, keep the current scientific requirements in `SPECIFICATION.md` and dated decisions with their reasons in `METHODOLOGY.md`.[^tk-git-project-context] When you make or revise a research decision, have the agent keep `SPECIFICATION.md` current and record the decision and its reason at the top of `METHODOLOGY.md`, preserving earlier entries.

::: {.prompt}
> Maintain version history for this project using `Git`. Inspect any existing repository and preserve current edits. Track the code, manuscript, and appropriate configuration, excluding protected data, credentials, generated libraries, and caches. Record meaningful checkpoints as tasks are completed, and summarize changes affecting the analysis or reported results.
:::

The agent handles file selection and commits. You do not need to inspect every code difference to benefit from the history. A *diff*, which shows changed lines, remains useful when investigating a particular decision or unexpected result. A `.gitignore` file tells `Git` which untracked files to leave out; it does not erase files already in history. [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) explains how to keep secret values out of research files. Keep appropriate backups for files that `Git` does not track.

A `Git` repository can contain thousands of small internal files that record changes. Cloud storage services such as `Dropbox`, `Google Drive`, and `OneDrive` may try to sync these files as they change, creating heavy sync activity that can slow the computer or temporarily block access to files. Have the agent check the storage setup before creating a repository in a synced folder. [Appendix D: Troubleshooting](#cloud-sync-storage) explains the precautions and how to handle an existing repository.

## Recover the change you need

State the desired outcome rather than a `Git` operation:

::: {.prompt}
> Restore the earlier sample-selection rule while preserving unrelated manuscript wording and figure-formatting edits. Update the approved analysis requirements and record why the rule changed. Rerun the affected analysis, regenerate its figures, and identify manuscript values that need updating.
:::

After restoring earlier work, the agent should explain what it restored, which saved version it used, which files it changed, and which outputs it regenerated. If the earlier state was never recorded, the agent should say what it can recover and what must be reconstructed. It should not silently reset the entire project to an older version.

## Share your project online {#share-work-when-intended}

[`GitHub`](https://github.com/) hosts `Git` repositories for collaboration. `GitHub`'s command line interface tool (called [`gh`](https://cli.github.com/)) lets the agent use `GitHub` directly from the [`Claude`](https://claude.com/download) app, including preparing a *pull request*: a proposed change collaborators can discuss before it is incorporated. `Git` can maintain local history without `GitHub`.

If you want to share your project online, ask the agent to use `GitHub` or a repository service you already use. You handle any [personal sign-in](https://cli.github.com/manual/gh_auth_login); the agent configures the connection and uploads the changes you authorize. Before uploading, have it check that protected data and credentials are excluded from both current files and their recorded history. A repository can be public, so anyone can view it, or private, with access limited to you and authorized collaborators. A private repository still stores its contents on the service's computers.

For guidance on sharing a completed study so others can reproduce it, see [Chapter 19: Reproduce and hand off the research](https://dss-agentic-research.pages.dev/chapters/research-handoff.html) in *Doing Research with AI Agents*.

[^tk-git-command]: `Git` is the software's name; `git` is the command the agent uses to operate it.

[^tk-git-project-context]: These are project context files: saved instructions and records that the agent can consult in later sessions. See [Chapter 7: Give the agent context for your project](https://dss-agentic-research.pages.dev/chapters/project-context.html#project-records) in *Doing Research with AI Agents*.

# 5. Find and inspect project files {#finding-files}

Agents often need to locate a small piece of information in a large project: where an exposure is defined, which script writes a table, or what information a downloaded data file contains. Computers already provide search and file-reading tools. The programs here give the agent faster searches, useful filters, and ways to query structured data without reading everything into the conversation.

Suppose a journal reviewer asks how `hot_days`, a variable counting days of heat exposure, enters an analysis like the [synthetic heat-and-birthweight study](https://dss-agentic-research.pages.dev/chapters/example-project.html) in *Doing Research with AI Agents*. To answer that question, the agent needs to find the code that calculates `hot_days`, see how the statistical model uses it, and check how it is labeled in figures. The tool [`ripgrep` (`rg`)](https://github.com/BurntSushi/ripgrep) searches text across files and reports matching paths and lines. `ripgrep` is the program's name; `rg` is its command.

The agent must report the file paths and line numbers of matching text, then explain any inconsistencies in how `hot_days` is calculated, used in the statistical model, and labeled in figures.

![](figures/project-search.svg){#fig-project-search fig-alt="Focused searches connect the exposure definition, statistical model formula, and figure label through file paths and line references."}

## Choose the right type of search {#choose-the-appropriate-search}

Some files arrange information under named fields, such as a record identifier or an output folder. JSON and YAML[^tk-search-formats] are text formats for storing information this way, including fields grouped inside other fields. The agent can select the value it needs instead of printing the whole file or guessing which nearby words belong together.

The agent can install any missing programs through [`Homebrew`](https://brew.sh/) or your preferred package manager.

| Task | Tool[^tk-search-programs] | Useful result |
|---|---|---|
| Search text within project files | `ripgrep` (`rg`) | Matching passages with file paths and line numbers. |
| Locate files by name or type | [`fd`](https://github.com/sharkdp/fd) | A focused list of candidate files. |
| Find values in a JSON response | [`jq`](https://jqlang.org/) | Selected fields from the response. |
| Read or update YAML settings | [`yq`](https://mikefarah.gitbook.io/yq/) | Relevant configuration values, preserving their structure. |
| Inspect source text | [`bat`](https://github.com/sharkdp/bat) | Readable excerpts with line numbers. |

::: {.needspace height="7cm"}
:::

## Ask for findings tied to files

::: {.prompt}
> Find where hot_days is constructed, used in statistical models, and labeled in figures. Report the relevant file paths and line numbers. Use focused searches and excerpts. If a saved JSON or YAML response is involved, select the relevant fields rather than printing the entire response. Explain whether the construction, statistical-model use, and figure label describe the same exposure and units.
:::

## Investigate a missing match

`ripgrep` ordinarily skips hidden files, whose names begin with a dot, and files covered by ignore rules. If no match appears, have the agent check [which files were searched](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) and whether any relevant files were excluded.

A text search can miss information even when it includes the right files. The agent may need a suitable tool to read a PDF, image, or saved dataset. If code builds a variable name or filename from several pieces of text, the agent should follow the code to identify it.

When inspecting a JSON or YAML file, the agent should distinguish between an absent field, empty text, and `null`, a marker for no value. These can mean different things. The agent should check their meaning in the source data before treating a value as missing data or replacing it.

[^tk-search-formats]: JSON stands for *JavaScript Object Notation*; YAML stands for *YAML Ain’t Markup Language*. See these examples of [JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON#json_structure) and [YAML](https://yaml.org/spec/1.2.2/#chapter-2-language-overview) to see how information is arranged in each format.

[^tk-search-programs]: The linked `yq` is [Mike Farah's implementation](https://github.com/mikefarah/yq); other programs use that name. Some Linux distributions name `fd` and `bat` differently. Ask the agent to identify the installed program and record any naming convention needed for later sessions.

<!-- ===================== PART III — RUN AND REPRODUCE RESEARCH ===================== -->

# 6. Preserve a software environment: rig, renv, and uv {#environments}

Suppose a collaborator reruns the synthetic heat-and-birthweight analysis ([Chapter 10: The example research project](https://dss-agentic-research.pages.dev/chapters/example-project.html) in the companion guide *Doing Research with AI Agents*) and obtains different intervals. The agent needs to know which software versions were used for the original analysis to check whether a software change explains the discrepancy. Installing the latest releases would give it a different comparison.

Recording the software versions prepares the project for repeatable commands, selective reruns, and unattended jobs. It also lets the agent recreate the earlier software setup without changing the current one, for example when investigating a result or preparing to share the project.

## Record the language and package versions {#record-the-language-and-packages}

A *software environment* includes the language, packages, and other programs used by the analysis. The language interpreter, also called its *runtime*, executes the code. A *package* adds functions and may require other packages or programs; those requirements are its *dependencies*. A *lockfile* records the particular package versions selected to work together, so the agent can restore that set rather than install whatever is newest.

| Responsibility | `R` | `Python` |
|---|---|---|
| Install and select the language | [`rig`](https://rig.r-lib.org/) manages [`R`](https://www.r-project.org/) installations. | [`uv`](https://docs.astral.sh/uv/) manages [`Python`](https://www.python.org/) installations; `.python-version` records a selection. |
| Record and restore packages | [`renv`](https://rstudio.github.io/renv/) maintains `renv.lock`. | `uv` maintains `pyproject.toml` and `uv.lock`. |

The `R` package `renv` records the `R` version and package versions in `renv.lock`, but does not install or switch `R` itself. The standalone tool `rig` supplies that capability. For `Python`, the standalone tool `uv` handles both language and package management. The agent can install [`rig`](https://formulae.brew.sh/formula/r-rig) and [`uv`](https://docs.astral.sh/uv/getting-started/installation/#homebrew) through [`Homebrew`](https://brew.sh/); it installs `renv` from within `R`.

[`Stata`](https://www.stata.com/) projects also need their `Stata` release and community-command versions recorded.

![](figures/research-environments.svg){#fig-research-environments fig-alt="The agent records a working R or Python environment, restores the recorded software separately, and compares a selected output with a saved reference result. Both language routes require the restore-and-check step."}

## When other environment tools are useful

An *environment manager* creates and maintains a separate software setup for a project. `renv` manages `R` packages this way; `uv` manages `Python` and its packages.

[`Conda`](https://docs.conda.io/projects/conda/en/stable/user-guide/concepts/environments.html), [`Micromamba`](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html), and [`pixi`](https://pixi.prefix.dev/latest/) can also manage other languages and supporting programs. They can be useful when an analysis combines several kinds of software, such as `Python` packages and separate programs for processing genetic data. They may also be the practical choice when collaborators already provide a working setup. Otherwise, `rig` with `renv` for `R`, or `uv` for `Python`, remain the recommended starting points.

These tools can coexist on the same computer, with different projects using different setups. If the agent combines tools within one project, it should explain what each manages and record how to restore the complete setup. It should avoid having two tools independently update the same packages, which can [leave their records inconsistent](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html#using-pip-in-an-environment).

## Capture the working environment

Have the agent use the appropriate tools to record the project's language and package versions. For an existing project, it should capture the versions already in use without upgrading them. To check that the setup can be recreated, the agent should save the output from a small part of the analysis, restore the recorded software versions, and rerun that part to compare the results.

::: {.prompt}
> Inspect this project's software and record the language version and all required package versions without upgrading them. Choose a small, representative part of the analysis, run it with the current setup, and save the output. Recreate the recorded software setup in a separate environment, leaving the current one unchanged. Rerun the same part of the analysis and compare the outputs. Report anything that could not be restored and any differences in the results. Keep the setup files with the project and update README.md with any additional software requirements, restoration instructions, and the outcome of the check.
:::

When adding or updating a package later, have the agent update the lockfile and rerun the affected part of the analysis.

## Check the restored environment {#restore-and-check-it}

The agent should confirm that the analysis runs with the recorded language and package versions.[^tk-environment-restore] This matters when the computer has several versions installed: installing the intended version does not ensure that the analysis uses it.

It should then rerun the small part of the analysis chosen before restoration, using the same code, data, and analysis settings. The agent should report whether the software versions match, whether the analysis completed, and whether its output differs from the saved result.

The agent should diagnose and fix installation problems, and investigate any differences in results. It should explain any need to change the recorded software versions before making that change.

## Save the setup files and instructions {#include-system-requirements}

Some packages depend on system libraries, compilers, or external programs.[^tk-environment-system-software] For example, a Bayesian analysis may require a working C++ compiler and supporting build tools. Have the agent identify the required software and record its versions and installation instructions. Where compilation is required, it should check that it can compile and run a small representative model.

Ask the agent to keep the setup files with the project, in the locations expected by the tools. These include `renv.lock` and its supporting files for `R`, or `pyproject.toml`, `uv.lock`, and `.python-version` for `Python`.[^tk-environment-setup-files] The agent should maintain these through the relevant tools.

Have it add a “Software setup” section to `README.md`, the project's Markdown overview. This should explain any additional software requirements, including the versions used and how to install them. It should also identify the operating system and processor type used for the restoration check, give the commands for restoring the environment and rerunning the check, and summarize the outcome. Where requirements are already recorded in a setup file, the instructions should point to that file.

If supporting software remains difficult to reproduce, ask the agent whether a container would help; see [Chapter 10: Run work in a separate environment: containers](#containers).

[^tk-environment-restore]: For `R`, the agent can compare installed package versions with `renv.lock`. With `uv`, [locked synchronization](https://docs.astral.sh/uv/concepts/projects/sync/) stops if the lockfile needs updating, rather than changing it during restoration. A list of package names alone cannot restore the earlier setup; the agent also needs exact versions available for the intended operating system and hardware.

[^tk-environment-system-software]: A system library provides functions used by other software, such as reading map files. A compiler translates source code into a form the computer can run.

[^tk-environment-setup-files]: The lockfiles belong in the project's top-level folder. For `R`, also retain `.Rprofile`, `renv/activate.R`, and `renv/settings.json`; see the [`renv` collaboration guidance](https://rstudio.github.io/renv/articles/renv.html#collaboration). For `Python`, keep `pyproject.toml` and `.python-version` alongside `uv.lock`; see the [`uv` project files](https://docs.astral.sh/uv/concepts/projects/layout/).

# 7. Give research tasks reliable commands: just {#project-commands}

<!-- aliases: runnable-checks -->

In the synthetic heat-and-birthweight project ([Chapter 10: The example research project](https://dss-agentic-research.pages.dev/chapters/example-project.html) in the companion guide *Doing Research with AI Agents*), changing a figure label should not require fitting the statistical model again. A figure command can read the saved estimates and regenerate the plot. A separate command can refit a selected specification when the analysis changes.

A *command* tells the computer which program or saved task to run. [`just`](https://just.systems/) is a command runner that gives recurring tasks short names. Each definition, called a *recipe*, is saved in the project's `justfile` and can run one script or several commands. The agent can use these recipes during development, and you or a collaborator can run them later without reconstructing the steps.

## Give the commands useful work

Each selected step must run from its declared inputs and saved outputs, without relying on objects left in an interactive session. Installing `just` does not create that structure. Have the agent preserve the working results before reorganizing the code, reusing shared functions where appropriate. [Chapter 13: Build a modular analysis workflow](https://dss-agentic-research.pages.dev/chapters/research-workflows.html#modular-steps) in the research guide explains the full process.

![](figures/project-commands.svg){#fig-project-commands fig-alt="The agent runs a saved figure recipe that reads existing estimates and plotting code to produce a revised plot. The statistical fit is reused."}

::: {.needspace height="7cm"}
:::

## Save the commands

::: {.prompt}
> Preserve the current results, then give this project commands to fit a selected specification, rebuild figures from saved estimates, and run the complete workflow. Use just unless the existing command system already does this. Record each command's inputs and outputs, reuse shared code, and check that reorganizing execution has not changed the intended results.
:::

The agent installs `just` if needed and maintains the recipes. A small project might offer the following menu. These are examples to create for the project; installing `just` alone does not provide them.

| Example command | Project operation |
|---|---|
| `just fit age-spline` | Fit the named specification and save its results. |
| `just figures` | Rebuild figures from saved results. |
| `just paper` | Regenerate the manuscript from its source and outputs. |
| `just smoke` | Exercise a small representative workload. |
| `just build` | Run the project's complete documented workflow. |

Ask the agent to use these recipes in normal work and keep their descriptions current. `just --list` shows the available recipes. A completed figure task should report the command used, the saved estimates it read, and the figure it produced.

## Run a smoke test {#smoke-tests}

A *smoke test* runs a small representative workload through the actual workflow before a large batch. For example, one fit should also produce its required contrast table and figure, so the agent checks that the steps work together. Use the same code and environment as the full run, with a smaller workload selected by an option and outputs kept apart from the main study's results.

::: {.prompt}
> Add a smoke-test recipe using the actual workflow. Keep its outputs separate from the full analysis, run it after relevant changes, and confirm the expected files before starting an expensive batch.
:::

[]{#runnable-checks}

Successful execution does not establish that the analysis is appropriate. Save automatic checks of the project's requirements too, such as stopping when a join unexpectedly changes the observation count. These requirements come from `SPECIFICATION.md`, which holds the approved scientific specification. A simulation evaluating interval coverage asks a different question about statistical performance. Both checks can have saved commands; the command runner does not decide whether their research criteria are suitable. See the research guide’s [Chapter 14: Test the analysis against known truth](https://dss-agentic-research.pages.dev/chapters/simulation.html) and [Chapter 15: Check the agent with independent implementations](https://dss-agentic-research.pages.dev/chapters/checking-analysis.html).

## Combine command and dependency runners

A figure depends on the estimates it reads. [`Make`](https://www.gnu.org/software/make/), [`targets`](https://docs.ropensci.org/targets/), and [`Snakemake`](https://snakemake.readthedocs.io/) can track dependencies like this and determine which work needs repeating. `just` provides named commands; it does not perform that analysis. A `just build` recipe can invoke `targets` or `Snakemake`, while other recipes open a preview or run quick checks.

[Chapter 8: Rerun only affected steps: targets and Snakemake](#pipeline-dependencies) explains selective rebuilding. [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) adds a queue when the saved command needs to run unattended. Keep an existing `Make` setup or master do-file if it already supplies the required behavior.

# 8. Rerun only affected steps: targets and Snakemake {#pipeline-dependencies}

A figure depends on the estimates it reads. If only its label changes, those estimates can be reused. A *dependency* is a step's reliance on a particular input or earlier result. A dependency runner records these relationships and selects the steps affected by a change.

[`targets`](https://docs.ropensci.org/targets/) provides this for [`R`](https://www.r-project.org/) workflows; [`Snakemake`](https://snakemake.readthedocs.io/) organizes steps that produce files and can use different languages. [`just`](https://just.systems/), a command runner that gives project tasks familiar names, can call either tool. The agent can keep `just build` as the command while the dependency runner decides which calculations to repeat.

## Show the dependencies

The diagram illustrates a possible workflow with two fitted specifications, based on the [synthetic heat-and-birthweight project](https://dss-agentic-research.pages.dev/chapters/example-project.html) in *Doing Research with AI Agents*. Its reruns are expected behavior to check, not findings from a trial of the downloadable project.

![](figures/research-dependencies.svg){#fig-research-dependencies fig-alt="The same dependency graph shows three changes: a figure edit reruns the figure and document, a specification-B edit also reruns fit B, and a shared-data change reruns both fits. Unaffected results are reused."}

Have the agent identify each step's inputs, code, parameters, and outputs. External inputs count too: a script that reads an unrecorded file or a response from a data service can produce a result the runner does not know is out of date. Save and declare those inputs according to the project's acquisition procedure.

The [targets manual](https://books.ropensci.org/targets/) explains tracking objects, functions, and files. [`Snakemake` rules](https://snakemake.readthedocs.io/en/stable/snakefiles/rules.html) describe how inputs produce outputs. The agent writes and maintains the definitions; you check that the proposed relationships match the intended research workflow.

::: {.needspace height="7cm"}
:::

## Connect the analysis

::: {.prompt}
> Preserve the current results and environment. Connect the analysis through targets for this R workflow, declaring its inputs, functions, files, and outputs. Keep just as the command runner. Show the dependency graph, identify which steps should rerun after different changes, and compare the resulting outputs with the previously checked results saved for this comparison.
:::

For a workflow organized around files and multiple languages, request `Snakemake` instead. The agent should install it in the recorded project environment. Existing scripts can become steps, with finer selection where the code already separates coherent operations. There is no requirement to divide every function into a new file.

## Check what reruns

Ask the agent to preview planned work without executing it, using `targets`' `tar_outdated()` or a `Snakemake` *dry run*. It should then run a small representative workload and compare the actual reruns with the expected graph. The report should identify steps performed, results reused, and any unexpected output changes. This checks execution; a full analysis and its scientific evaluation still have their own requirements.

## Run the pipeline unattended when useful

The runner can reuse completed results after an interruption when they remain current. Continuing an unfinished fit midway requires a *checkpoint*: saved intermediate state that the fitting program can reload. Keep the workflow definitions, environment records, and needed inputs with the project; large stores of reusable results, often called caches, need separate storage management.

[`pueue`](https://github.com/Nukesor/pueue) can queue `just build`, which starts the dependency runner. The queue controls when that command starts; the runner selects the calculations. One queued job may start several *workers*, separate processes doing calculations concurrently, and each worker may itself use several processor cores. `targets` can use [`crew`](https://wlandau.github.io/crew/) for workers. Have the agent coordinate memory and processor use across both levels; [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) explains those limits. In an environment affected by the [R/macOS issue](#r-on-macos), check the actual worker route before enabling it.

# 9. Keep unattended jobs moving: pueue {#job-queues}

A queue keeps prepared research jobs moving while you are away. A *job* is one submitted command or task; a *batch* is a set of jobs to run. [`pueue`](https://github.com/Nukesor/pueue) starts waiting jobs automatically as others finish. Its background service runs separately from the conversation and keeps each job's status and logs, the recorded messages from its execution.

Suppose the heat-and-birthweight sensitivity analysis ([Chapter 10: The example research project](https://dss-agentic-research.pages.dev/chapters/example-project.html) in the companion guide *Doing Research with AI Agents*) needs 100 independent fits. If the computer can comfortably run four at once, the remaining fits wait their turn. You can return later and ask the agent which results are ready and which jobs need attention.

![](figures/job-queues.svg){#fig-job-queues fig-alt="An illustrative queue of 100 jobs allows four jobs to run at once. Whenever a job finishes, the queue automatically starts the next. Finished jobs retain results, logs, and success or failure status."}

## Prepare the batch

Ask the agent to run a representative fit through the queue before submitting the full batch. This [smoke test](#smoke-tests) is a small run through the actual workflow, checking the command, starting folder, software environment, and saved output. It also helps choose the *concurrency limit*, the maximum number of jobs running at once.

Four jobs do not necessarily use four processor cores. A core can perform computation, and one fit may divide its work across several cores.[^tk-queue-resources] Several fits may also exhaust memory while cores remain available. Have the agent measure a representative run and choose a limit that leaves the computer usable for other work.

::: {.prompt}
> Prepare these sensitivity fits as queued jobs. Run a representative case first and check its saved result. Choose the maximum number of jobs running at once from its memory and processor use, then submit the batch. Confirm that the submitted jobs start and produce the expected logs or outputs. Record job identifiers, specifications, logs, and output locations so individual failures can be identified and rerun.
:::

The queue service's access must suit the work, as explained in [Chapter 2: Control what added tools can access](#tool-access). Use the project's recorded environment in the submitted commands rather than relying on whichever software the service happens to find.

## Let the queue manage execution

After submission, have the agent confirm early progress in the actual batch: a job should be running and its expected log or output should have appeared. A successful small test does not establish that the later batch was launched correctly.

Closing the submitting conversation need not stop the background service, but the computer must remain awake and available. A reboot or shutdown can interrupt work. A queue's record does not let an interrupted fit resume midway; that requires the fitting program to save and reload intermediate state, often called checkpoints.

For short tasks, direct execution may be sufficient. For work on a cluster, retain its institutional scheduler. On Windows through [`WSL2`](https://learn.microsoft.com/windows/wsl/systemd), the Linux environment used by this guide, have the agent verify how long both the environment and its background service remain available. Starting the service does not itself keep the WSL environment alive.

## Review results and recover failures

Ask for the expected results files as well as process status. A command can exit successfully while writing its result to an unexpected location. Keep failed attempts and their logs so the agent can explain what happened.

::: {.needspace height="3cm"}
:::

An illustrative report might say:

::: {.example-output}
Of 100 jobs, 98 completed with the expected results files. Two failed before saving estimates because their requested memory exceeded the available allocation. Their specifications and logs are retained; the completed fits do not need rerunning.
:::

You can then ask the agent to diagnose the failures, propose any change affecting the analysis or resource use, and rerun the affected jobs. Each retry should retain its relationship to the original attempt. Avoid duplicating completed fits or overwriting an earlier failed run's evidence.

`pueue` distinguishes waiting, running, and finished jobs. The agent should retain task IDs, inspect the stored success/failure result, and verify expected outputs. `pueue wait` indicates that waiting has ended; its own exit status is not the job's outcome.

<details class="guide-example">
<summary>Example: submit a saved command and inspect its outcome</summary>

For a project with a `fit` recipe, the agent can submit `just fit`. The recipe must already exist.

```text
pueue add --print-task-id -- just fit
pueue status
```

Use the returned task ID. If it were 42, the following query uses [`jq`](https://jqlang.org/) to select and check the success/failure value in the saved status report:

```text
pueue log 42
pueue wait 42
pueue status --json | jq -e '.tasks["42"].status.Done.result == "Success"'
```

This structure of the status report was checked with `pueue` 4.0.4. The agent must check the installed version and the expected result file as well as the stored status. For the observed macOS [`R`](https://www.r-project.org/) problem, retain the [pseudo-terminal helper](#r-on-macos) for queued execution too.

</details>

## Combine with a dependency pipeline

A [`just`](https://just.systems/) recipe, a named saved command, can invoke a complete analysis. [`targets`](https://docs.ropensci.org/targets/) or [`Snakemake`](https://snakemake.readthedocs.io/) can decide which steps need rebuilding after an input changes, and `pueue` can queue that outer command. A pipeline may start several workers, separate processes performing calculations inside that job. Choose resource limits for both levels. [Chapter 8: Rerun only affected steps: targets and Snakemake](#pipeline-dependencies) explains the dependency runner's role.

[^tk-queue-resources]: A program can divide work into threads, which may execute on different processor cores. Jobs, workers, and threads are different units: limiting the queue to four jobs does not limit all the programs they start to four threads.

# 10. Run work in a separate environment: containers {#containers}

A spatial analysis may need a particular geospatial library as well as its [`R`](https://www.r-project.org/) packages. Recording the packages alone may leave a collaborator without the supporting software they require. A *container* packages the program and its supporting software in a separately configured environment. The agent can also limit which folders and connections it receives when the task requires those limits.

A different project may need an agent and a local large language model (LLM) to process only an approved document collection. That arrangement needs its own software and access configuration. Choose the container's purpose before asking the agent to set it up.

## Decide why the task needs a container

| Research need | What the agent configures |
|---|---|
| Reproduce supporting software | Language/packages, supporting libraries and programs, and the supported platform. |
| Run approved work with restricted inputs | Required input access, separate output storage, permitted network connections, and credentials. |
| Give a local agent a limited workspace | Software to run the LLM and agent, their tools, and the files/accounts available to them. |

A container does not itself authorize processing under a data agreement. Establish the permitted environment through [Chapter 3: Know where your data goes](https://dss-agentic-research.pages.dev/chapters/research-limits.html#data-chain-of-custody) in the companion guide *Doing Research with AI Agents*, then configure and check it for that purpose.

## Specify software and access

With [`Docker`](https://www.docker.com/), an *image* is the packaged software from which a container starts. A `Dockerfile` records how to build the image. The *host* is the computer running the container. A *mount* makes a selected host folder available inside it, for example as read-only inputs or writable output storage. `Docker`'s [container introduction](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/) and [mount documentation](https://docs.docker.com/engine/storage/bind-mounts/) explain those distinctions.

![](figures/research-containers.svg){#fig-research-containers fig-alt="A configured container includes language, packages, and supporting software. It reads selected inputs, writes designated outputs, and can connect to an approved service. A separate note identifies the extra LLM and agent software needed for an optional local-agent setup."}

If the task uses an LLM, state where it will run. Putting commands inside a container does not move an LLM hosted on a provider's computers into it. A local-agent arrangement also needs an *LLM runtime*, software that loads the LLM and generates responses, as described in [Chapter 17: Run and adapt an LLM on your own hardware](#local-models).

::: {.needspace height="7cm"}
:::

## Build and check the environment

::: {.prompt}
> Configure a container for [task and purpose]. Preserve the project's language/package records and include required system software. Give it only the approved input/output locations and connections. Record where the LLM runs if one is involved. Run a representative case, check the saved outputs, and test any required access restrictions with harmless substitute files.
:::

The agent can use [`Colima`](https://github.com/abiosoft/colima) with `Docker`'s command-line tools on a Mac, or retain an existing approved [`Docker Desktop`](https://www.docker.com/products/docker-desktop/) setup. On institutional infrastructure, follow the supported runtime, which may be [`Apptainer`](https://apptainer.org/). The researcher completes required authorization; the agent builds and checks the environment.

A useful report identifies the software, exposed folders, network access, and tested outputs. It distinguishes an analysis that ran from access restrictions that were tested. Sharing the whole home directory, granting powers the task does not need, or exposing `Docker`'s control socket can defeat the intended separation. The control socket is a connection through which programs can control `Docker`; it requires a separate access decision.

## Preserve what is needed to run it again

Save the build/run configuration and environment records with the project. Record and select the required software versions, the platform, and an identifier for the exact image used.[^tk-container-image-id] A `Dockerfile` that downloads software from changing repositories is not a permanent copy of that software; when long-term recovery matters, arrange approved storage for the built image too.

Keep different access arrangements explicit rather than changing one container silently between tasks. [Chapter 2: Control what added tools can access](#tool-access) explains how these controls relate to the agent's other tools.

[^tk-container-image-id]: A digest identifies particular image content. A tag is a convenient name that can later refer to a different image. The agent should record enough information to recover the version actually used.

# 11. Generate documents from research outputs: Quarto and Pandoc {#research-documents}

A manuscript often reports the same result in a table, a figure, and a sentence. Linking those locations to saved analysis outputs makes updates easier to carry through consistently. [`Quarto`](https://quarto.org/) and [`Pandoc`](https://pandoc.org/) let an agent maintain the document's *source*, its text and supporting inputs, and *build* or *render* a readable document from them.

In the synthetic heat-and-birthweight project ([Chapter 10: The example research project](https://dss-agentic-research.pages.dev/chapters/example-project.html) in the companion guide *Doing Research with AI Agents*), a revised estimate should reach both the results table and the text describing it. The agent can connect those locations to the saved result and rebuild the manuscript. Collaborators can still receive [`Word`](https://www.microsoft.com/microsoft-365/word) files or PDFs.

## Connect the document to saved results

Keep the manuscript text, references, figures, and numerical results in known project locations. The document build should read the intended outputs and make clear whether it also runs analysis code. A figure or text revision need not trigger a new fit.

The agent maintains the text and its links to saved results. `Quarto` combines those inputs and uses `Pandoc` to produce the requested format; it can also run analysis code when that is part of the document's instructions. `Pandoc` can convert text source directly. Keep a writing system that already works for the team, including an authoritative `Word` or [`Google Docs`](https://docs.google.com/) document. Conversion is not a prerequisite for agent assistance.

![](figures/document-production.svg){#fig-document-production fig-alt="Maintained text, references, and saved results feed a document build. It produces Word, web, or PDF outputs. In this source-generated workflow, accepted edits from a returned Word draft go back into the maintained text before rebuilding."}

## Choose the deliverable

Markdown is plain text with simple formatting marks for headings, lists, and links. It can serve as the maintained text for a build; the agent handles the syntax and conversion settings.

| Format | Typical purpose | Additional requirement |
|---|---|---|
| Markdown | Readable text source or a simple text deliverable. | Appropriate formatting and links. |
| `Word` (`.docx`) | Editable drafts for coauthors. | Styles, optionally supplied by a reference document. |
| PDF through `LaTeX` | Typeset manuscripts with equations and controlled layout. | A TeX distribution and required fonts. |
| Web document (HTML) | Reports, websites, and interactive material. | Supporting files and inspection in a browser. |

[`LaTeX`](https://www.latex-project.org/) is a typesetting system. A *TeX distribution* supplies the programs and packages needed to use it. For `Quarto`'s PDF route, the agent can follow its [PDF setup](https://quarto.org/docs/output-formats/pdf-basics.html), which includes [`TinyTeX`](https://yihui.org/tinytex/). If no suitable distribution is installed, the agent can use `quarto install tinytex` and verify the chosen PDF engine. Keep a working [`MacTeX`](https://tug.org/mactex/) or [`TeX Live`](https://tug.org/texlive/) installation. `Word` and Markdown output do not require this PDF software.

## Configure and inspect the build

For a source-generated manuscript, ask the agent to save the build as a named command. [`just`](https://just.systems/) is a command runner for this purpose; retain existing build commands if they already work.

::: {.prompt}
> Configure this manuscript to build from its maintained text, references, and saved results. Produce [required formats] and save the build command. Explain which analysis outputs it reads and what it recomputes. Render the document, inspect its pages, and check representative numbers against their source files.
:::

The agent should check the actual document for missing citations, misplaced tables, clipped figures, and broken equations. You review interpretation and prose. A successful conversion alone does not show that a reader can use the result. [Chapter 18: Write and revise the manuscript](https://dss-agentic-research.pages.dev/chapters/research-writing.html#trace-manuscript) in the research guide explains the full check that the right numbers reach the paper.

Keep build settings and dependencies with the project. `Quarto`'s [execution settings](https://quarto.org/docs/projects/code-execution.html) control reuse of previous outputs; the agent should document how the final analysis results are refreshed. Specific `R` and TeX failures belong in [Appendix D: Troubleshooting](#troubleshooting).

## Bring coauthor edits back into the source

Establish which document the team is maintaining. If it is Markdown or `Quarto` source, preserve the returned `Word` file, compare it with the version sent, and transfer accepted edits into that source before rebuilding. If the team edits `Word` or `Google Docs` directly, keep that document authoritative and have the agent check and revise it there.

::: {.prompt}
> Preserve this coauthor's returned document. Compare it with the draft sent, transfer the accepted edits into our maintained source, and flag unresolved changes to claims or results. Rebuild a new draft without overwriting the returned copy, then check that the accepted edits survived.
:::

Conversion cannot be assumed to preserve every comment or tracked change automatically. Resolve conflicting scientific revisions before generating a replacement draft, and retain the returned file and the inputs needed for the next build.

If an accepted edit changes the analysis, have the agent update the current requirements in `SPECIFICATION.md` and add the dated decision and reason to `METHODOLOGY.md`. Rerun the affected analysis and checks before rebuilding the document; a successful document build alone does not establish that the reported results implement the revised requirements.

<!-- ===================== PART IV — CONNECT TO DATA AND SERVICES ===================== -->

# 12. Keep credentials out of research files: 1Password and direnv {#credentials}

Collecting records or sending documents to a service adds account access to the research workflow. An *API* lets a program request operations from a service. An API key is a *credential*, information the service uses to recognize authorized access under an account. If the key is saved in a script, someone receiving that script may receive the same access.

Suppose an agent builds a workflow that sends approved documents to a paid large language model (LLM) service. Each run needs the key; the bibliography, analysis code, and shared repository do not. [`1Password`](https://1password.com/) can hold the credential and supply it when the command runs. If your institution already provides this function, use that service instead. The same separation applies to cloud storage and other authenticated research services.

## Supply a credential to a command

The *vault* is the protected store holding the credential. The project keeps a *secret reference* identifying which vault item to use, rather than the secret value. An *environment variable* is a named value made available to a running program. The script can ask for a variable such as `MODEL_API_KEY` without containing the key itself.

The `1Password` command-line tool, `op`, can resolve those references when it starts a command through `op run`. Ask the agent to configure the intended command and account using the [documented setup](https://developer.1password.com/docs/cli/secrets-scripts/). You complete personal sign-in or authorize access to the appropriate vault item. Use credentials limited to the operations the project needs.

::: {.prompt}
> Configure this project's document-analysis command to use the intended account and approved vault item. Supply the key when the command runs, without saving its value in source files, logs, or conversation. Make an authorized request and report whether it succeeds. Record the account, variable name, and command for future runs; do not include the secret.
:::

![](figures/credential-delivery.svg){#fig-credential-delivery fig-alt="A script refers to an environment variable. When the command starts, the vault supplies the secret value so the command can use the intended service account. Research results are saved without writing the credential into source files."}

The agent should check the actual execution environment. A command launched by a queue or on another computer may not have the authentication available in an interactive session. Keep the necessary setup with the project's run instructions, including whether an API key selects separate usage billing. The researcher chooses that account and spending arrangement.

A vault prevents unnecessary copies in project files; the process receiving a credential can still read or transmit it. Apply the controls described in [Chapter 2: Control what added tools can access](#tool-access) to that process and its tools. Never ask the agent to print all environment variables to diagnose an authentication failure.

## Reuse project settings

For a single command, `op run` may be enough. When several project commands need the same configuration, [`direnv`](https://direnv.net/) can load settings associated with their project directory, such as a service address, project identifier, or reference to a credential. It does not replace the vault.

The settings live in `.envrc`, which contains executable instructions. Ask the agent to explain its contents. You approve the intended configuration; the agent then runs `direnv allow`. Keep secret values out of the file. If an agent or queue does not load your usual terminal settings, `direnv exec .` can apply the approved environment to a particular command. The [`direnv` manual](https://direnv.net/man/direnv.1.html) documents both routes.

Have the agent record which arrangement the workflow uses so later sessions invoke it consistently. Check it through the actual queue or other execution route, using an authorized operation without displaying the credential.

## Respond to an exposed credential

If a key has been exposed, revoke it and replace it through the service that issued it. Deleting it from the latest script does not remove copies from repository history or other systems. The agent can help locate affected files without reproducing the secret and update the workflow to use the replacement. You retain control of account access and any investigation of unauthorized use.

# 13. Connect to research data and services: MCP {#service-connections}

A reference library contains more than the PDFs saved in a project folder. It may also hold collections, notes, tags, and records for papers you have not downloaded. Giving an agent access to that library can make a literature task repeatable without exporting and attaching the same material each time.

For the synthetic heat-and-birthweight study ([Chapter 10: The example research project](https://dss-agentic-research.pages.dev/chapters/example-project.html) in the companion guide *Doing Research with AI Agents*), suppose the relevant papers and notes are organized in a [`Zotero`](https://www.zotero.org/) collection. The agent needs to retrieve records, read available material, and update the project's evidence table. The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) provides a common way for an agent application to discover and use operations such as searching that collection.

## Choose an access route

An MCP *server* is the program that exposes those operations to the agent application. It can run on your computer or elsewhere. The term describes its role in the connection; it does not mean that you must buy or administer a separate computer. The [MCP architecture documentation](https://modelcontextprotocol.io/docs/learn/architecture) explains the connection.

A *connector* is an integration exposing supported operations of another application or service; not every connector uses MCP. An *API* is a defined way for one program to request operations from another. The agent may already have a suitable route without adding a new connection.

| What the task needs | A suitable route |
|---|---|
| Read a fixed set of references once | A saved export or local files may be sufficient. |
| Repeat operations already available through a maintained command-line tool or API | Use that existing route when the agent can access it. |
| Search or change application records through operations supported by the agent app | An existing connector or MCP server can supply those operations. |

Ask the agent to check what is already connected before adding software. The community [`Zotero` MCP project](https://github.com/54yyyu/zotero-mcp) is one candidate to assess; it documents both MCP and command-line access. It is not an official `Zotero` service. Choose a maintained integration that supports the needed operations and is permitted for the account and material involved.

## Connect the literature task

A *skill* records instructions for a recurring task and its checks. Use an existing skill if it captures the project's agreed [literature procedure](https://dss-agentic-research.pages.dev/chapters/literature.html#literature-protocol); the connection itself does not supply that procedure.

::: {.prompt}
> Connect this project's literature workflow to the specified Zotero collection using a permitted route. Retrieve relevant records and available papers or notes, then update the evidence table and bibliography. Keep source identifiers and flag missing material. Follow the agreed procedure for checking DOIs and verifying claims, using an existing literature skill if it records that procedure. Leave the library unchanged unless an edit is part of the task.
:::

Checking a paper's DOI identifies its record; verifying a claim requires reading the relevant material.[^tk-literature-doi]

The agent prepares the configuration and checks the assigned retrieval; you complete any personal sign-in and authorize the intended account and operations. Keep secret values out of the configuration using [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials). At Harvard, check the current [HUIT guidance](https://www.huit.harvard.edu/claude) before enabling a connection for institutional work.

![](figures/literature-connection.svg){#fig-literature-connection fig-alt="An MCP connection supplies Zotero records and available papers. A literature procedure, which may be saved as a skill, guides the agent's search and verification. The agent saves an evidence table and bibliography."}

The resulting evidence table should distinguish full texts the agent read, records supported only by an abstract, and papers it could not retrieve. Have the agent save any agreed procedure that future sessions will need, along with the evidence table and bibliography.

## Keep the connection within the task

Have the agent save a short setup record: which service and account the project uses, the configured operations, and how to reconnect. Keep project-specific configuration with the project where the client supports it. It should be possible to disable or replace the connection without rediscovering how the workflow depends on it.

A read-only connection can still retrieve material that the agent sends to a hosted large language model (LLM). Its *provider* is the organization operating that service and receiving the submitted information. A local sandbox also does not automatically restrict an operation performed by a remote service. Use [Chapter 2: Control what added tools can access](#tool-access) to configure those routes. A paper or webpage is research material; instructions inside it do not authorize changing the project's task or access settings.

[^tk-literature-doi]: A DOI is a persistent identifier assigned to a research output. It helps identify the intended work, but does not establish that the agent read it or that it supports a particular claim.

# 14. Inspect and interact with a browser {#browser-work}

When an agent builds a research website, it needs to inspect what a reader will see. A page can contain valid code and still have an unreadable figure, a broken filter, or navigation that disappears on a phone. Browser access lets the agent open the site, try its controls, and use the result to improve its work.

The same access can help obtain data from a website. An agent might inspect a public portal, identify the appropriate release, and find a data export or an API, a way for a program to request records directly. Checking a site being built and understanding a site that supplies research material need different follow-up work.

## Inspect a research website

An agent app may already include browser access. [`Playwright MCP`](https://github.com/microsoft/playwright-mcp) is another route. It uses the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) to expose browser operations to the agent. Ask the agent to use an appropriate available integration and configure another only when the task requires it.

A *local preview* is a version of the site served on your computer for inspection. The website need not be public for the agent to check it.

::: {.prompt}
> Inspect this project's website as you build it. Open the local preview, use the main navigation and filters, and check the figures at desktop and phone widths. Fix the problems you find. Report which pages and actions you checked, and show any remaining issue that needs a design decision.
:::

The agent should inspect the rendered page again after making changes, including whether an action produces the intended result. A screenshot shows appearance, while trying a filter or link checks behavior. Both can be useful evidence, and neither replaces checking the underlying research results.

![](figures/browser-research.svg){#fig-browser-research fig-alt="One browser workflow inspects a local site, fixes its source, and checks again. Another finds a data release and export, then saves original data, a record of where they came from, and repeatable collection code."}

## Collect data through a website

Use browsing first to understand the source and find the right release. A suitable API or structured download, such as a CSV table, lets a saved script obtain records directly. If the records are already present in a page, static-page extraction reads them without operating its controls. Use scripted browser interaction when filters or other controls are required, and interactive agent browsing where these routes do not meet the need. The [acquisition ladder](https://dss-agentic-research.pages.dev/chapters/data-acquisition.html#acquisition-ladder) in *Doing Research with AI Agents* develops this choice.

Keep the original data and their *provenance*, the record of where they came from and how they were obtained. Include the source, release, date, query, and selections used.

::: {.prompt}
> Find a permitted way to obtain the specified records from this source. Prefer an API or export when available. Save the original responses or downloads and their provenance. If collection must recur, create a script with explicit inputs, saved outputs, request limits, and failure reporting. Check representative records before running the full collection.
:::

Preserve what the agent learns during its first exploration as saved collection code when the task will recur. A transcript of clicks alone cannot reliably repeat a large extraction. The [data-provenance section](https://dss-agentic-research.pages.dev/chapters/data-acquisition.html#data-provenance) explains what to retain for later research use.

## Choose the browser account

A browser profile holds session information such as logins. A separate profile can avoid giving a task access to your everyday signed-in services. If the task needs an authenticated portal, use the intended account and complete personal sign-in yourself; let the agent explain which actions it needs to perform.

Being able to open a page does not establish permission to send its contents to a hosted large language model (LLM), which runs on the service provider's computers. Apply the data-use decisions from [Chapter 3: Know where your data goes](https://dss-agentic-research.pages.dev/chapters/research-limits.html) in the research guide and the access settings from [Chapter 2: Control what added tools can access](#tool-access) to the actual account and content. Submitting a form or changing a record should follow the authorization for that task.

Some tools can also operate desktop applications through computer use. That broader access can help with a task a browser cannot perform, but it is optional here. Configure it for the specific application and work rather than making it a prerequisite for website inspection or collection.

<!-- ===================== PART V — RUN AND COORDINATE AGENTS ===================== -->

# 15. Divide work between agents: shared projects and git worktrees {#parallel-work}

Several agents can develop different parts of a research project at the same time. The benefit depends on whether those tasks can proceed independently and how their results will be combined. Decide which files each agent may change, what information it receives, and what it must supply to the other tasks.

For example, one agent can develop modeling code while another develops figures. Before they start, agree on the saved estimates the plotting code will read, including column names, units, and uncertainty intervals. The agents can then work on their own files and check the complete model-to-figure workflow when the pieces are ready.

## Agree on tasks and exchanged results {#assign-tasks-and-interfaces}

A *subagent* is another agent given a separate assignment by a coordinating agent. Availability depends on the application; [`Claude Code`'s subagents](https://code.claude.com/docs/en/sub-agents) provide one documented route. Separate sessions with distinct assignments are another option. Ask the coordinating agent to use the capabilities available in the current application; a particular terminal layout is not required.

::: {.prompt}
> Divide this work between a modeling agent and a visualization agent. Agree on the saved-results format first. Assign the files each may edit, coordinate changes to shared configuration, and have a lead agent run the combined workflow. Preserve existing edits and report unresolved research decisions.
:::

Each assignment should name its inputs, expected outputs, and files it may change. Give one agent responsibility for shared files, such as functions used by both tasks, records of required software, or definitions connecting analysis steps. The lead agent also coordinates changes to version history so one agent does not remove work another is using.

Record the agreed results format in the project context files, the maintained files that guide later sessions. Assign one agent to update `SPECIFICATION.md`, the current scientific requirements, and `METHODOLOGY.md`, the dated decisions and reasons, after you approve a scientific change.

## Choose shared or separate working copies

Agents editing different files can often share one project directory. [`Git` worktrees](https://git-scm.com/docs/git-worktree) provide separate working copies attached to the same repository, the stored version history, usually on different branches.[^tk-parallel-branch] They help when agents need overlapping files, alternative versions, or a stable copy for testing while other work continues.

| Arrangement | Useful when | What still needs coordination |
|---|---|---|
| One project directory | Tasks own different files and can share current results | Shared files, output names, version-history operations, and results format |
| Separate worktrees | Tasks need different versions or overlapping edits | Inputs and environments in each copy, shared resources, and integration of changes |

![](figures/agent-coordination.svg){#fig-agent-coordination fig-alt="Agents can work on different files in one project or in separate working copies. Both arrangements use an agreed results format and end with a combined workflow check."}

A new worktree may not contain ignored data, installed packages, or saved model fits. Have the agent supply the approved inputs and restore the recorded environment before starting work. Separate output locations prevent one run from replacing another's results. Worktrees share repository history and can still reach other files and services; they are not security sandboxes.

## Integrate the work

The coordinating agent should run a representative path through the combined workflow. Code that works separately can still disagree about a result column, a file location, or a modeling assumption. Resolve those mismatches before the full run. Preserve needed work before removing a worktree, and leave research choices that cannot be inferred from the specification for your decision.

Parallel development differs from the independent-implementation check described in [Chapter 15: Check the agent with independent implementations](https://dss-agentic-research.pages.dev/chapters/checking-analysis.html) of the companion guide *Doing Research with AI Agents*. For that check, fresh agents receive the same fixed specification version and permitted inputs without seeing the other implementation or results. Do not supply a decision log that reveals those results. A worktree alone does not achieve this separation, especially when the earlier code remains in shared history.

[^tk-parallel-branch]: A branch names a line of work within the repository's version history. Separate branches let the agent develop alternative changes and combine the chosen work later.

# 16. Run agents from saved prompts {#headless-agents}

A prepared research archive may need checking again after missing files or instructions are repaired. A saved prompt can ask an agent to inspect a test copy, follow its documented reproduction command, and report what passed, failed, or could not be tested. A *headless* agent runs noninteractively from a program, so the same assignment can be launched without opening another conversation and typing it again.

This task needs an agent because it involves reading instructions, operating tools, and investigating failures. Ordinary analysis code can run directly. A task that only asks a large language model (LLM) to label supplied text may need a direct API call instead; an API is a defined way for one program to request operations from another. The [interview-labeling example](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html#headless-agents) in *Doing Research with AI Agents* explains that simpler route and the responses it must retain.

![](figures/headless-research.svg){#fig-headless-research fig-alt="A fixed prompt and prepared project copy pass through a small checked run before the full headless check. Reports retain responses, tool records, and status, including failed and untested checks. The same assignment can run again on a corrected copy."}

## Turn the task into a saved workflow

For the archive check, use the prepared inputs, documented commands, and comparison criteria described in [Chapter 19: Reproduce and hand off the research](https://dss-agentic-research.pages.dev/chapters/research-handoff.html#test-and-name-the-reproduction-route) of the research guide. Give the checking agent a separate test copy and configure its access to exclude the working project. Missing inputs should be reported rather than silently recovered from that project.

[`Claude Code`](https://code.claude.com/docs/en/headless) documents noninteractive calls through `claude -p`; software libraries also support controlling the agent from a program.[^tk-headless-sdk] An agent in the desktop app can prepare and launch this workflow if its tools have the required access. You can direct it from the app even though the checking run itself has no interactive conversation.

Ask the agent to turn the approved check into a repeatable command. It should verify the intended account, required tools, and output format, and record blocked operations without waiting indefinitely for an approval prompt. Personal sign-in and any decision to use separately billed API access remain yours.

::: {.prompt}
> Turn this approved handoff check into a saved command. Start a fresh agent with the fixed prompt and permitted test copy. Have it follow the documented reproduction steps without access to the working project, then save its report, exact response, tool record, and completion status. Test the complete route on a small prepared copy before using it for the full check. Preserve failed attempts and report any input or access requirement the workflow cannot satisfy.
:::

This preliminary [smoke test](#smoke-tests) runs a small representative task through the actual workflow. Once it passes, the same saved check can run on the intended archive and again on a corrected copy when needed. Keep the version of each copy and its report together.

## Record each case

A *raw response* is the exact text returned. A *parsed result* contains the fields the workflow extracts from it, such as a check identifier and its outcome. Preserve both, along with the tools used and their results. A response with the required fields is readable by the workflow; that alone does not establish that the assessment is correct.

::: {.needspace height="5cm"}
:::

| Record | Why retain it |
|---|---|
| Check identifier, exact prompt, and version of assigned inputs | Establish what the agent was asked to reproduce and compare |
| LLM version and settings, tools, and loaded configuration | Identify the software and information available during the run |
| Raw response, tool record, and separately parsed result | Preserve the report and actions, including material omitted from extracted fields |
| Run status, diagnostics, and attempt identifiers | Distinguish completed checks from refused actions, interruptions, and unreadable responses |

Keep copies of `SPECIFICATION.md`, the current scientific requirements, and `METHODOLOGY.md`, the dated decisions and reasons, as used in each check. Later revisions should not replace those records.

A process can finish successfully while returning an unusable report. Keep malformed responses and identify which required fields or files are missing. Specify when retries are allowed and retain each attempt, so rerunning a check does not erase its earlier failure. For LLM-derived research measurements, the same recordkeeping preserves labels and failed attempts; the [LLM-evaluation procedure](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html#evaluate-llm-labeling) addresses their scientific quality.

For many checks, [`pueue`](https://github.com/Nukesor/pueue) can queue each command as a job and limit how many run at once. Configure the queue's account access and software environment as well as its commands. [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) explains how to confirm progress and report which outputs were saved.

## Control what each run receives

*Context* is the information supplied to the LLM for generating its next response. A fresh conversation can still load project context files, global user instructions, saved memory, or extensions. Its tools may also read the working project or another case. Have the agent identify those routes and configure the inputs and access required for this check. Do not resume an earlier conversation whose information should be excluded.

Use a targeted check of the actual configuration. The agent should be able to read a harmless marker in its assigned test copy while attempted reads of an excluded marker in the working project are denied through the relevant routes. Check unexpected instruction and memory loading too. Save the observed outcomes and identify untested routes; the agent saying it remembers nothing does not establish that it cannot retrieve excluded material.

Use the controls described in [Chapter 2: Control what added tools can access](#tool-access), with a separate execution environment where appropriate as described in [Chapter 10: Run work in a separate environment: containers](#containers). The research guide also explains [controlling the information supplied for interview labeling](https://dss-agentic-research.pages.dev/chapters/llm-measurements.html#control-what-each-reviewer-or-judge-receives). A fresh session, checked access restrictions, and statistical independence are different properties. Launching separate sessions does not by itself establish either of the latter two.

<details class="guide-example">
<summary>`Claude Code` configuration for controlled runs</summary>

The documented [`--bare` option](https://code.claude.com/docs/en/cli-reference) skips much automatic discovery of instructions and extensions. It is not a sandbox and does not remove tool access by itself. It also uses a different authentication route from ordinary subscription sign-in; check the installed version and intended provider, the organization operating the LLM service, before selecting it. Explicit tool, input, session-persistence, and settings choices remain necessary.

The documented [`dontAsk` permission mode](https://code.claude.com/docs/en/permissions) denies calls that would otherwise prompt, but installed extensions can affect approvals, and normally permitted actions still run. Configure and check the complete run rather than treating a flag as proof of isolation. The handoff procedure above is a setup to request and test, not an observed containment result from this guide.

</details>

[^tk-headless-sdk]: An SDK, or software development kit, provides libraries for controlling the agent from a program. The `Claude Code` documentation describes Agent SDK packages for `Python` and `TypeScript`. The agent should choose the supported route that fits the existing workflow and verify its account requirements.

# 17. Run and adapt an LLM on your own hardware {#local-models}

Suppose a study uses a large language model (LLM) to extract outcomes from documents that must remain in an approved environment. The LLM can run on your main computer or an institutional server. Its *weights* are numerical values learned during training; an *LLM runtime* loads them and uses them to generate responses.

Running an existing LLM and training it further are separate choices. Begin by checking whether an existing LLM can perform the research task on the approved hardware. Here, *inference* means running the trained LLM to generate a response, rather than statistical inference about a population. The companion guide *Doing Research with AI Agents* explains [when local LLMs are useful](https://dss-agentic-research.pages.dev/chapters/research-models.html#local-models) and how to evaluate them for a study.

## Choose hardware and a runtime

*Open weights* are available to download under specified terms; availability alone does not mean unrestricted use or a fully open-source system. [`Ollama`](https://docs.ollama.com/quickstart) is one runtime for compatible downloaded LLMs. Keep an approved institutional service if it already meets the need. Ask the agent to check the operating system, memory, supported processing hardware, and storage before choosing an LLM or installing software.[^tk-local-hardware]

The download size is not the memory needed during use. Longer inputs and more simultaneous requests increase that requirement. *Quantization* stores weights at lower numerical precision, often reducing memory use, but it can change the responses. Record and evaluate the exact release and quantization intended for the study.

![](figures/local-llm-execution.svg){#fig-local-llm-execution fig-alt="A script can use an LLM runtime on approved hardware directly. An optional agent harness adds tools and carries out the LLM's tool requests. Running the LLM locally does not itself restrict those tools."}

For `Ollama`, configure the process that actually serves requests. Its documented [local-only setting](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features) disables its cloud features. It can listen on the *loopback address*, `127.0.0.1`, reachable from that same computer, instead of accepting connections from other computers. Keep LLM files outside cloud-synchronized project folders. These settings govern the runtime; an agent's other tools need their own network restrictions.

::: {.prompt}
> Prepare this computer for the approved local-LLM task. Check its resources and existing installations, select a compatible LLM runtime and version, and configure local execution. Keep my usual hosted-agent settings intact. Record the LLM, runtime, storage, maximum supported input and response length, and limit on simultaneous requests. Run representative permitted inputs and report failures and resource use.
:::

Have the agent check whether the requested input length fits the LLM's context capacity as well as the computer's memory.[^tk-local-context] If the setup cannot handle the task, choose a smaller candidate for evaluation or an approved server. Do not quietly shorten study documents or substitute another LLM to make a run finish.

## Run the research task

Use a saved command with explicit inputs and outputs. For extraction or classification, define the response fields, such as document identifier and extracted outcome. Keep the *raw response*, the exact returned text, separately from the fields extracted for the analysis table. Save malformed responses and retries too. A usable structure establishes that the workflow can read the response; comparison with the study's reference judgments assesses its research value.

Keep the runtime version, exact LLM identifier or digest, generation settings, prompt template, and input identifiers with the run. A *digest* identifies particular content; a *tag* is a convenient name that may later refer to different weights. [`Ollama`'s model-list API](https://docs.ollama.com/api/tags), an interface through which programs request that information, supplies identifying records. Preserve the record for the version actually used.

A small setup trial for this guide used Qwen3 4B and demonstrated a response with required fields and a file-reading tool call. It did not establish research accuracy, comprehensive containment, or installation on a clean computer. The [setup-trial record](resources/local-model-setup-trial.md) gives the configuration and observed limitations. Choose and evaluate the research LLM using the [study's evaluation procedure](https://dss-agentic-research.pages.dev/chapters/research-models.html#evaluate-adapted-model). [Chapter 16: Run agents from saved prompts](#headless-agents) distinguishes direct LLM calls from repeated tasks that need an agent.

## Connect the LLM to an agent

An LLM runtime does not itself provide the complete agent environment. A *harness* is the software that supplies information to the LLM, carries out its tool requests, and returns results for the next response. [`Ollama`'s `Claude Code` integration](https://docs.ollama.com/integrations/claude-code) documents a compatible endpoint, the address to which the agent sends requests, for supported LLMs. Have the agent configure a separate invocation and check an actual tool call before relying on it for project work.

Record which runtime processes the LLM requests and which harness controls the tools, retaining a record of the tool calls and results. An LLM that returns fluent text may still fail to produce usable tool requests. Apply file and network restrictions as described in [Chapter 2: Control what added tools can access](#tool-access); a local LLM can still ask a tool to contact a remote service.

## Adapt an LLM when the study calls for it {#adapt-a-model-when-the-study-calls-for-it}

*Fine-tuning* trains an existing LLM on additional examples. *LoRA*, or low-rank adaptation, keeps the original, or *base*, weights fixed and trains a relatively small set of additional values. Those values can be saved as an *adapter*. To use it later, the agent loads the adapter with the compatible base LLM; the adapter alone is not a complete LLM.

The research guide explains [when training may help](https://dss-agentic-research.pages.dev/chapters/research-models.html#context-or-training), [LoRA](https://dss-agentic-research.pages.dev/chapters/research-models.html#lora), and the comparison with a strong unadapted LLM. The tools below support the chosen study; local execution does not require an adaptation project.

| Environment | Candidate tool | What the agent should check |
|---|---|---|
| Apple silicon Mac | [`MLX LM`](https://github.com/ml-explore/mlx-lm) | Supported LLM, available memory, data format, and compatibility between training and later use |
| A supported [`PyTorch`](https://pytorch.org/) environment, commonly with a suitable GPU | [`Hugging Face PEFT`](https://huggingface.co/docs/peft/main/en/quicktour) | Base-LLM support, processing hardware, adapter method, and required software |
| An established institutional training service | Its approved training tools | Data access, computing allocation, saved files, and evaluation of the adapted LLM |

Have the agent install the selected tools in a recorded project environment, as described in [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments). Keep the study's data roles separate: training examples support learning, development examples support choosing the setup, and held-out test cases support the final comparison after those choices are fixed. The baseline is the unadapted LLM with the selected prompt, not an unspecified default invocation.

::: {.prompt}
> Set up the agreed adaptation study using the approved training, development, and held-out test assignments and base LLM. Preserve the unadapted LLM and its selected prompt. Record the configuration, and check that a short training run can save an adapter and reload it with the base LLM before launching the planned run. Save training state, logs, and evaluation outputs. Compare both versions on the same held-out test inputs using the prespecified evaluation. Do not change the data assignments or success criteria to improve the result.
:::

![](figures/llm-adaptation.svg){#fig-llm-adaptation fig-alt="LoRA learns an adapter using training data and development choices. The saved adapter is reloaded with its base LLM. The adapted and unadapted versions are compared on the same held-out test inputs."}

Save the base weights and tokenizer, training-data version and assignments, adapter configuration, software environment, run settings, and evaluation results.[^tk-local-tokenizer] Training *checkpoints* preserve state from which training can continue; they differ from [`Git`](https://git-scm.com/) commits that record file versions. If the adapter is converted or merged into the base weights for another runtime, evaluate that exported version on the task too. Successful conversion does not establish unchanged behavior.

::: {.needspace height="4cm"}
:::

Training may require different resources and software from generating responses. Use a short execution check before a long run, then arrange job management and saved training state appropriate to the machine. Protect training data, logs, weights, and adapters under the study's requirements; training can retain sensitive information. The research guide's [data chain-of-custody discussion](https://dss-agentic-research.pages.dev/chapters/research-limits.html#data-chain-of-custody) applies to these files too.

## Apple's on-device LLM {#apple-on-device}

On a compatible Mac, Apple's system LLM offers another documented route for bounded tasks such as extracting specified fields. Its [`Foundation Models Python SDK`](https://github.com/apple/python-apple-fm-sdk), a library for programmatic access, and the [`fm` command](https://developer.apple.com/videos/play/wwdc2026/334/) have system and execution-mode requirements the agent must check. This differs from downloading open weights for `Ollama`; selecting an offered cloud-processing mode changes where the request runs. Retain the system and SDK versions and evaluate the actual task. These routes were reviewed through documentation, not included in this guide's local execution trial.

[^tk-local-hardware]: An accelerator performs particular calculations faster than a general-purpose processor. A GPU, or graphics processing unit, is commonly used for LLM calculations. The agent should check the runtime's actual hardware support rather than infer it from the computer's name.

[^tk-local-context]: Context is information supplied to the LLM for a response. Capacity is measured in tokens, units of text often smaller than words. The agent should check the runtime's input/output limits and actual token count instead of estimating capacity from document pages.

[^tk-local-tokenizer]: The tokenizer divides text into the units the LLM processes. Keeping its matching version helps reconstruct how the saved prompts and data were presented.

<!-- ===================== PART VI — WORK FROM THE TERMINAL ===================== -->

# 18. Use an agent from the terminal: Claude Code {#terminal-agents}

<!-- aliases: terminal-commands -->

A terminal is another place to work with an agent. It can be convenient when a project's commands and job logs are already open there, or when the work runs on a remote computer. You can give ordinary-language prompts to the agent, then run the saved project commands directly when you want to repeat a task.

For example, ask the agent to revise a figure using saved estimates. Once it has made the change, a [`just`](https://just.systems/) *recipe*, a named saved command, can regenerate it. In this example, `just figures` runs the plotting code without asking a large language model (LLM) to reconstruct the steps. The code and results remain in the project whichever interface you use.

## Open the project in a terminal

A *terminal* is the window that displays typed input and program output. A *shell* is the program that interprets commands entered there. On a Mac, open `Terminal` through Spotlight. For this guide's Windows route, open Ubuntu in [`WSL2`](https://learn.microsoft.com/windows/wsl/) through [`Windows Terminal`](https://learn.microsoft.com/windows/terminal/). An Ubuntu shell and a `PowerShell` tab are different environments; these examples use the former.

The shell has a *working directory*: the folder from which it starts its work. Use `cd` followed by the project's path to select that folder. The agent in the app can give you the exact command. Replace the example path below with the actual location and keep the quotes if it contains spaces:

```text
cd "/Users/your-name/Research/my-project"
```

The command `pwd` displays the current directory. [Appendix E: Terminal vocabulary](#terminal-history) explains paths and related terms further; no additional terminal setup is needed to continue.

## Start a conversation with the agent

Have the agent check whether the [`Claude Code`](https://code.claude.com/docs/en/overview) command-line interface is installed: this is the version started through a typed command. The desktop app and the `claude` command are separate entry points; installing one does not establish that the other is available. The agent can prepare the installation using the current [platform instructions](https://code.claude.com/docs/en/quickstart), with any personal sign-in or authorization completed by you.

At the shell prompt, enter:

```text
claude
```

Once `Claude` is running, type a research prompt in ordinary language:

::: {.prompt}
> Regenerate the main figure from the saved estimates and explain which files you used.
:::

You are now speaking to the agent. It can read project context files and use its permitted tools, just as it can through another interface. Use `/exit` to end that conversation and return to the shell prompt.

![](figures/terminal-agent.svg){#fig-terminal-agent fig-alt="Start Claude from the shell to enter ordinary-language prompts. Exit to return to the shell. In the illustrated recipe, just figures runs plotting code using saved estimates without an LLM call."}

The project directory tells the agent where the work starts; it does not itself restrict every file the agent can reach. The access settings described in [Chapter 2: Control what added tools can access](#tool-access) still apply. If the LLM runs on a provider's computers, information supplied to it is sent to that organization even though you use a local terminal.

## Run a saved command

If the project has a [`just`](https://just.systems/) command menu, these commands list its available recipes and run the figure recipe:

```text
just --list
just figures
```

Enter these at the shell prompt, after leaving the agent. The figure recipe must already exist; ask the agent to create or explain it using [Chapter 7: Give research tasks reliable commands: just](#project-commands). You do not need to remember the underlying analysis commands because the project has saved them.

You can also ask the agent to install a missing tool. With [`Homebrew`](https://brew.sh/) available, `brew install just` is the corresponding installation command. [Chapter 3: Install and manage tools with Homebrew](#adding-tools) explains setup. A “command not found” message can mean that the program is absent or that this shell cannot locate it; have the agent distinguish those causes before reinstalling anything.

## Find session controls

While the agent is running, slash commands control the session. The [interactive reference](https://code.claude.com/docs/en/interactive-mode) and installed help show the controls available in your version and account.

*Context* is the information supplied to the LLM for its next response. Compaction replaces some conversation history with a summary so it occupies less context; details can be omitted. Keep decisions needed later in the project's maintained files.

| Control | What it does |
|---|---|
| `/model`, `/effort` | Select an available LLM and supported reasoning effort |
| `/context` | Show context use for the session |
| `/compact` | Summarize the conversation to reduce the context it occupies |
| `/usage` | Show account-usage information |
| `/exit` | Return to the shell |

The companion guide [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/) explains [usage and context](https://dss-agentic-research.pages.dev/chapters/directing-work.html#usage-and-context). For access configuration, `/permissions` and `/sandbox` expose relevant controls; use them with [Chapter 2: Control what added tools can access](#tool-access), since they govern different mechanisms. Before ending a session, have the agent record checked project state, remaining tasks, and approved scientific changes in the appropriate [project context files](https://dss-agentic-research.pages.dev/chapters/project-context.html#project-records).

For unattended computation, follow [Chapter 9: Keep unattended jobs moving: pueue](#job-queues). For programmatic LLM work, follow [Chapter 16: Run agents from saved prompts](#headless-agents). An open terminal is an interface to those tasks, not a record of whether they completed. Optional layouts for watching them appear in [Appendix A: Optional working environment](#working-environment).

<!-- ===================== REFERENCE ===================== -->

# Appendix A. Optional working environment {#working-environment}

An agent conversation, a job log, and a figure can all belong to the same research task. Keeping them easy to find can make the work more comfortable. Your existing terminal and editor may already provide what you need; add a tool when it solves a recurring inconvenience.

For example, you might want the agent conversation beside a view of the project's queue, with the latest figure open in an editor. Ask the agent to arrange that using the tools already installed. The layout should help you follow the research, without requiring you to learn a collection of new applications.

| Need | Possible addition | What to ask the agent to configure |
|---|---|---|
| See a conversation and a log together | [`iTerm2`](https://iterm2.com/) on macOS; [`Windows Terminal`](https://learn.microsoft.com/windows/terminal/) with [`WSL2`](https://learn.microsoft.com/windows/wsl/) | Readable window areas or tabs in the intended project environment |
| Recognize the current project | [`Oh My Posh`](https://ohmyposh.dev/) | A simple shell prompt showing the folder and useful status |
| Return to a named terminal workspace | [`Zellij`](https://zellij.dev/) | A session and layout for the project |
| Inspect code, data, and plots together | [`Positron`](https://positron.posit.co/) or an existing research editor | The actual project and its recorded language environment |

![](figures/research-workspace.svg){#fig-research-workspace fig-alt="An illustrative workspace places an agent conversation, queue status, and a saved figure together. The queue service runs separately from the window displaying its status."}

## Make the current work visible

Use legible text and a small number of *panes*, separate areas of one window. The *shell prompt* is the line showing that the shell is ready for input, unlike a written prompt addressed to an agent. It can show the project directory and failed-command status. For a project using [`Git`](https://git-scm.com/), it can also show the branch, the named line of work in version history. Decorative symbols and special fonts are optional. Have the agent preserve existing settings and check a new session after making changes.

On Windows, an Ubuntu tab and a `PowerShell` tab use different environments. The agent should configure the intended one rather than assume that settings in one apply to the other. Shell startup files also run instructions, so a visual customization should not silently replace unrelated setup.

## Return to a working session

`Zellij` can keep a group of panes together as a named session. *Detaching* leaves that session running while you stop viewing it; *reattaching* opens it again. The computer and session must remain available. This can preserve a layout across a dropped connection. Ask the agent to configure it and explain the relevant on-screen controls.

Session management does not replace [`pueue`](https://github.com/Nukesor/pueue), which manages submitted jobs and their records. Nor does a restored layout establish that computation continued through sleep or shutdown. Use [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) for unattended work and the institution's scheduler on a cluster.

## Inspect results in the editor you use

`Positron` supports work with [`R`](https://www.r-project.org/) and [`Python`](https://www.python.org/); [`RStudio`](https://posit.co/products/open-source/rstudio/), [`Stata`](https://www.stata.com/), or another familiar editor may already serve the project well. Have the agent open the project in its recorded environment and identify the interpreter being used, following [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments).

You can inspect substantive results while the agent works on the files. Coordinate any simultaneous edits, and keep transformations used in the analysis in saved code rather than only in a data viewer. An extra AI extension or database connection is a separate choice, not a prerequisite for inspecting the work.

# Appendix B. Keep records of shared settings: chezmoi {#shared-settings}

Personal tool settings often live in several folders. A saved, maintained copy makes it easier to recover after a mistake or prepare another computer. [`chezmoi`](https://www.chezmoi.io/) manages selected configuration files and places them where the relevant programs expect to read them.

Suppose you revise your global user instructions, which apply across your research projects. The change should survive a later settings update and be available on another computer. These are personal settings, distinct from a research group's shared files or one project's configuration. A [`Git`](https://git-scm.com/) repository can record the maintained copy's version history.

## Understand the two copies {#understand-the-two-copies}

The *source* is the copy managed by `chezmoi`. The *applied file* is the copy installed where a program reads it. Applying the source updates the installed copy. If the agent edits the applied file directly, it must capture that change back into the source before a later apply restores the older version. `chezmoi` documents [editing and applying changes](https://www.chezmoi.io/user-guide/daily-operations/) and [capturing changed files](https://www.chezmoi.io/reference/commands/re-add/).

![](figures/research-shared-settings.svg){#fig-chezmoi-source-and-applied fig-alt="On each computer, chezmoi applies a local source copy to the settings a program reads and captures selected edits back into source. Source changes are transferred between computers separately, then applied locally."}

Ask the agent to identify any existing settings manager before introducing another. Have it preserve current files, record the source and applied locations, and verify that the target program reads the intended settings. Choose which personal settings belong in this record. Project-only configuration already tracked with its project usually needs no additional manager.

## Preserve differences between machines

On each computer, `chezmoi` applies that computer's maintained source copy to the files programs read. To use an update elsewhere, first transfer the source changes through the chosen synchronization route, such as `Git`, then apply them on that computer.

Some settings can be identical across computers; others need different paths or installed programs. A `chezmoi` *template* is a settings file that can produce the appropriate values for each machine. Have the agent check the resulting files in each intended environment instead of copying one computer's entire setup unchanged.

Keep credentials and account state out of an ordinary settings repository. A private repository controls who can access it; it does not make a stored password harmless. Follow [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) for secret values. *Doing Research with AI Agents* explains the content of [global user instructions](https://dss-agentic-research.pages.dev/chapters/shared-conventions.html#shared-instructions).

If a managed file controls agent permissions, protect both the source and applied locations. Changing the source can change the permissions on the next apply. [Chapter 2: Control what added tools can access](#tool-access) explains that relationship. The agent should check the resulting behavior as well as whether the files were copied successfully.

# Appendix C. Account-usage tools {#usage-tools}

Start with the usage display in the app you already use. It is usually the quickest way to see the account's reported limits and reset information. An additional tool becomes useful when you want a history the app does not show, such as which recorded sessions accounted for most of the week's usage.

[`ccusage`](https://ccusage.com/) summarizes compatible retained local logs, the saved records of session activity. Its reports can help investigate patterns, but they do not replace the account's official usage display or bill. Ask the agent to identify what the available records can answer before installing another reporting tool.

*Tokens* are units of text processed by a large language model (LLM), often word fragments. The *provider* operates the LLM service and reports account use. Charges for API access, where a program calls the service directly, may differ from a subscription's allowance.

| Question | Appropriate source | Limitation |
|---|---|---|
| How much of the account allowance remains, and when does it reset? | The app or provider's account display | Depends on the plan and what the provider reports |
| Which recorded sessions used the most tokens? | Compatible local logs and a tool such as `ccusage` | Missing or unsupported logs leave gaps |
| What was charged, or what would token use cost at specified prices? | Provider billing for actual charges; a log-based calculation for an estimate | Estimated API cost is not a subscription balance or an invoice |

## Ask for a report that answers a question

A usage report counts activity over a period. A context display concerns the information available to the LLM within a session; it does not show the account's remaining allowance. *Doing Research with AI Agents* explains [context and usage choices](https://dss-agentic-research.pages.dev/chapters/directing-work.html#usage-and-context).

::: {.prompt}
> Use the available records to identify the largest sessions this week. State which dates, machines, and interfaces the report covers. Distinguish recorded token totals from explanations inferred about their causes. Keep confidential transcript content out of the report.
:::

The agent should check the [current tool documentation](https://ccusage.com/guide/) and available log formats. A session absent from the report may have been deleted, stored elsewhere, or recorded in an unsupported format. State those gaps rather than interpreting absence as zero use.

A long statistical-model fit on your computer does not consume LLM tokens simply because time passes. Asking an agent for repeated updates or sending it large logs can generate additional LLM calls. If the report identifies that pattern, use saved job records to retrieve useful summaries, following [Chapter 9: Keep unattended jobs moving: pueue](#job-queues).

# Appendix D. Troubleshooting {#troubleshooting}

Tell the agent what you expected and what happened instead. Provide any error message it cannot already see. Ask it to inspect the command, logs (recorded execution messages), and saved outputs before changing software or starting another copy of the job.

| Symptom (links to help) | First check for the agent |
|---|---|
| [Command missing](#ask-the-agent-to-install-the-tool) | Installed program and the session's `PATH` |
| [Queued job stalled or failed](#review-results-and-recover-failures) | Recorded status, active process, and output location |
| [Restored environment differs](#restore-and-check-it) | Actual software versions against recorded versions |
| [Unexpected pipeline reruns](#check-what-reruns) | Declared inputs and changed files |
| [Account access fails](#supply-a-credential-to-a-command) | Intended account and execution route, without printing secrets |
| [Connected records missing](#connect-the-literature-task) | Configured operations and actual retrieval result |
| [Wrong browser session](#choose-the-browser-account) | Profile and signed-in account |
| [Headless agent fails](#turn-the-task-into-a-saved-workflow) | Account access, permissions, and required tools |
| [Local LLM fails](#choose-hardware-and-a-runtime) | Memory use, input length, and raw output |
| [Agent-launched `R` stalls on macOS](#r-on-macos) | Active process and the actual launch route |
| [PDF reports “No counter 'none' defined”](#tex-table-counter) | Exact error and document template |
| [Cloud-synchronized files stall](#cloud-sync-storage) | Synchronization activity and generated-file locations |

## R launched by an agent on macOS {#r-on-macos}

In the environment used to develop these guides, [`R`](https://www.r-project.org/) has sometimes stalled when an agent starts it without a terminal connection. The process uses a processor core but produces no output. This is an observed macOS issue, not a claim about every `R` installation or operating system. A *pseudo-terminal*, a software-created terminal connection, has provided a dependable workaround in that environment.

Have the agent put the workaround in one executable helper, `bin/rscript-pty`, a small program that launches the project's `R` commands in the required way. Keep its standard-input handling intact.[^tk-troubleshooting-stdin] For [`targets`](https://docs.ropensci.org/targets/), use `callr_function = NULL` and disable [`crew`](https://wlandau.github.io/crew/) for the initial check so the work stays in the process with the terminal connection. Separately launched workers need their own verification.

::: {.needspace height="6cm"}
:::

[Download the macOS `R` helper](resources/rscript-pty){.download-button download="rscript-pty"}

<details class="guide-example">
<summary>Read the complete macOS `R` helper</summary>

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

Retain the helper for queued `R` jobs too. Earlier success with a particular queue or worker configuration does not establish that another configuration will behave the same way. Check the actual execution route, the expected output file, and whether the process finishes before scaling up. If a process stalls, identify it and examine progress before stopping it; do not launch replacements that leave the old jobs consuming resources.

If the agent's sandbox prevents pseudo-terminal allocation, use an explicitly approved execution route or run the saved command from your own application. Do not silently turn off the restrictions. For [`Quarto`](https://quarto.org/) that executes `R`, the macOS workaround wraps the complete render:

```text
script -q /dev/null quarto render paper.qmd < /dev/null
```

Linux uses a different `script` interface, so this command should not be copied unchanged there. [Appendix E: Terminal vocabulary](#terminal-history) explains the connection without requiring a shell-programming lesson.

## Captionless tables with TeX Live 2026 {#tex-table-counter}

A PDF build in these guides encountered “No counter 'none' defined” for a captionless table. [`Pandoc`](https://pandoc.org/) emitted a table setting that the installed [`LaTeX`](https://www.latex-project.org/) packages expected to name an existing counter. For that specific error, have the agent add this guarded definition in the template's *preamble*, the setup section before the document content begins:

```tex
\makeatletter
\@ifundefined{c@none}{\newcounter{none}}{}
\makeatother
```

The guard preserves a counter if it already exists. Have the agent rebuild and inspect the affected table. A different error may need a missing font, package, or source correction; this block is not a general repair for failed PDF builds.

## Cloud-synchronized project storage {#cloud-sync-storage}

Installed software, caches of reusable results, logs, and version-history files can contain many rapidly changing files. Rewriting and synchronizing thousands of these files repeatedly has sometimes blocked file operations in the `Dropbox`/macOS environment used for these guides. A [`Git`](https://git-scm.com/) ignore rule controls what `Git` records; it does not control what `Dropbox` synchronizes.

Ask the agent to distinguish authored material from files that can be rebuilt. Keep dependency records and source files with the project, while placing large rebuildable environments and caches outside the synchronized tree where practical. If a provider-specific exclusion is used, configure and verify it on an empty directory before filling that directory. Check the provider and platform: [`Dropbox` documents different mechanisms](https://help.dropbox.com/sync/ignored-files), and these settings are not interchangeable across systems.

For an already populated or stalled directory, preserve the work and diagnose its synchronization state before changing exclusions. Retrospectively applying an exclusion is not the recovery procedure used here. Rebuild a disposable environment outside the synchronized location from its recorded dependencies, then reconnect the project to it. Preserve source, uncommitted work, and repository history when planning any move; do not treat a repository as a disposable cache.

The agent should verify the project's commands after changing locations and explain which material is still backed up. Excluding generated files from synchronization does not itself create a backup or a reproducible environment. [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) covers the records needed to restore software.

[^tk-troubleshooting-stdin]: Standard input is the input channel a program reads. The helper redirects it from `/dev/null`, which supplies no input. Retain that redirection as part of this observed workaround.

# Appendix E. Terminal vocabulary {#terminal-history}

Many terminal terms describe physical equipment that software has replaced. Knowing that history makes the names less arbitrary. This appendix explains the terms used in [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents) and in tool diagnostics; you do not need to memorize them before working with an agent.

## From a device to a window

A terminal was a device through which a person communicated with a computer. A teletype combined a keyboard and printer: typed characters went to the connected machine, and responses appeared on paper. [Museum collections preserve examples](https://collections.museumsvictoria.com.au/items/407696) used for computer access. Later terminals displayed text on a screen.

The abbreviation *TTY*, from teletype, remained in computing. A modern *terminal emulator* provides a similar text interface in a software window. The program inside that interface may be a shell, an editor, or an agent. Its appearance alone does not tell you which program is receiving your input.

![](figures/terminal-vocabulary.svg){#fig-terminal-vocabulary fig-alt="A keyboard and printer terminal, a screen terminal, and a modern terminal window illustrate the history of TTY. A shell or an agent is the program inside the modern interface."}

## The program receiving your commands

A *shell* [reads commands](https://www.gnu.org/software/bash/manual/bash.html) and starts programs. [`Bash`](https://www.gnu.org/software/bash/) and [`zsh`](https://www.zsh.org/) are examples. The shell can interpret a saved script as well as something you type. Its *prompt* indicates that it is ready for a command. This differs from a written prompt addressed to an agent; the agent or another program started from the shell receives input until you exit it.

A [*pseudo-terminal*, or PTY](https://man7.org/linux/man-pages/man7/pty.7.html), is a software connection that behaves like a terminal for the program using it. Programs can behave differently when connected to a terminal than when reading from a file or another process. That distinction matters for the specifically observed [R-on-macOS problem](#r-on-macos), but does not mean every unattended command needs a PTY.

| Term | Meaning in this guide |
|---|---|
| Command-line interface, CLI | A program interface controlled through commands and arguments |
| Argument | A value or option supplied with a command, such as `figures` in `just figures` |
| Working directory | The folder from which the shell starts its work |
| Absolute path | A location starting from the filesystem's root, such as `/Users/your-name/Research/my-project` |
| Relative path | A location interpreted from a starting folder; `data/analysis.csv` means the file inside that folder's `data` directory |
| `PATH` | The list of directories searched to locate an executable command |
| Environment variable | A named value supplied to a program, often inherited by programs it starts |
| Standard input, `stdin` | The input channel a program can read |
| Standard output, `stdout` | The channel for ordinary program output |
| Standard error, `stderr` | A separate channel commonly used for diagnostics |
| Pipe | A connection passing one program's output to another program's input |
| Exit status | A code reporting how a program ended according to that program's rules; also check the expected output |

An exit status of zero does not by itself establish that the intended research job succeeded. The [`pueue wait` example](#review-results-and-recover-failures) shows why the program's own meaning and the saved result both matter.

Ask the agent to explain an unfamiliar term in the command or error where it occurs. The useful question is what the program will do and what result to expect. A vocabulary reference supports that understanding without requiring a course in shell programming.
