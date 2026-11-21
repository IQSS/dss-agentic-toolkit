---
title: "Extending Your Agent's Toolkit"
subtitle: "A Guide for Researchers"
version: "2.3 draft"
---

<!-- ===================== PART I — FOUNDATIONS ===================== -->

# 1. Choose tools for a research need {#choose-tools}

Research involves tasks worth setting up once and repeating reliably: running a batch of analyses, rebuilding a manuscript, or restoring the software used in an analysis. This guide shows how to get an AI agent to set up and use tools for that work.[^tk-overview-agent] A tool is software the agent can use to perform an action, such as searching files, running an analysis, or retrieving records from a database. Examples in this guide use [`Claude Code`](https://code.claude.com/docs/en/overview) in the `Claude` desktop app. You direct the research through conversation; the agent sets up and operates the tools and checks their output, so you do not need to learn their commands.

Suppose a study needs 100 simulation runs, but your computer can handle four at once. A job queue can keep four running and automatically start another whenever one finishes. Ask the agent to prepare the batch, choose a suitable limit, and report completed and failed jobs when you return.

Use this guide as a reference. Read the next chapter on access, then turn to the tool your work needs. Each chapter explains its purpose and what to ask the agent to do. The companion [*Doing Research with AI Agents*](https://iqss.github.io/dss-agentic-research/) covers research workflows and judgment; if you are new to the app, start with its [Chapter 2: Get started with the app](https://iqss.github.io/dss-agentic-research/chapters/first-session.html).

![](figures/agent-toolkit.svg){#fig-agent-toolkit fig-alt="The global user instructions file TOOLCHAIN.md tells an agent when to use tools and what to report. From a conversation in the app, the agent can operate an installed simulation queue or use a connection to a reference library. The queue produces a run report; the library supplies sources and notes. These are examples of capabilities rather than a list of mandatory tools."}

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
| Review a collection of manuscripts using the same prompt in a fresh session for each paper | [Chapter 16: Run agents from saved prompts](#headless-agents) |
| Run or adapt a large language model (LLM) on your own hardware | [Chapter 17: Run and adapt an LLM on your own hardware](#local-models) |
| **Work from the terminal** | |
| Use a terminal interface to the agent | [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents) |
| **Reference** | |
| Customize the terminal, shell, prompts and panes | [Appendix A: Tools for customizing your terminal](#working-environment) |
| Restore personal settings across computers | [Appendix B: Maintain personal settings: chezmoi](#shared-settings) |
| Find and adapt prompts from the guide | [Appendix C: Prompt bank](#prompt-bank) |
| Diagnose execution and document-build problems | [Appendix D: Troubleshooting](#troubleshooting) |
| Understand terminal terminology | [Appendix E: Terminal vocabulary](#terminal-history) |

:::

## Tell the agent when to use each tool {#make-the-tool-part-of-the-workflow}

Tell the agent when you want it to use each tool and what it should report, or ask it for suggestions if you are unsure. Ask it to save guidance that applies across projects in your [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions), such as `TOOLCHAIN.md`.[^tk-toolchain] Keep requirements specific to one study in its [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). A longer recurring procedure can become a [skill](https://iqss.github.io/dss-agentic-research/chapters/reusable-procedures.html#what-skills-add): saved instructions that guide the agent through a task and its checks. The [DSS agent skills catalogue](https://iqss.github.io/dss-agent-skills/) provides reusable procedures for research tasks.

## Use tools from the app

You can ask the agent to install and operate these tools from the app. You supply the research decisions and complete personal steps such as signing in or entering an administrator password.

The setup examples cover macOS and Linux. On Windows, the examples assume the tools run in [`Windows Subsystem for Linux` (`WSL2`)](https://learn.microsoft.com/windows/wsl/), which provides a Linux environment on a Windows computer. Ask the agent to check the environment where the work will run before installing software there. You can keep using [`R`](https://www.r-project.org/), [`Python`](https://www.python.org/), [`Stata`](https://www.stata.com/), or other analysis software; adopting new tools does not require changing research language.

[^tk-overview-agent]: An agent combines a large language model (LLM), which processes supplied information and generates responses or tool requests, with tools and software that runs them and returns their results.

[^tk-toolchain]: See [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents* for guidance on organizing these files and telling the agent when to read them.

# 2. Control what added tools can access {#tool-access}

Adding a tool can change which files, applications, or online services an agent can access. The agent can identify what access the research task requires, explain the choices, and configure and test the controls. You decide which files and accounts it may use.

Suppose a study needs many statistical model fits, but the computer can run only a few at once. A queue is a list of runs waiting to start. A tool such as [`pueue`](https://github.com/Nukesor/pueue) manages that queue and starts another fit when one finishes. Running those fits requires access to the analysis code and approved inputs, plus somewhere to save results and logs. It should not require permission to change the original data or read another study's files.

## Check where the work runs

In [`Claude Code`](https://code.claude.com/docs/en/overview), permission rules[^tk-access-controls] allow tool actions, require approval, or block them. A sandbox[^tk-access-sandbox] adds restrictions enforced by the operating system on programs running inside it.[^tk-access-os] Written instructions explain how the agent should work, but do not enforce those restrictions.

Some tools send work to a background service: a program that runs separately from the agent and carries out submitted tasks. For example, `pueue` uses one to start queued jobs. Ask the agent to check what the service and the programs it starts can access.[^tk-pueue-process]

![](figures/tool-access-routes.svg){#fig-tool-access-routes fig-alt="An agent sends requests and receives information along three distinct routes. A command runs inside a configured sandbox with specified project access. A separate pueue background service starts queued jobs under the service's own access controls. A connected online service provides records through account permissions. Built-in file tools have separate checks. The sandbox shown does not imply that it encloses the other routes."}

`Claude Code`'s built-in sandbox is off by default. When enabled, it covers commands run inside it and the programs they start. It does not enclose every tool available to the agent. Built-in file tools have their own permission checks; connected services and separately running services need their own access controls.[^tk-sandbox-scope]

Ask the agent to check whether the sandbox is enabled and explain which files and services each tool needs to access. Once you agree on the permitted access, have the agent enable and configure the necessary controls, test them with harmless files, and report any restrictions it could not verify.

Suppose you give the agent read-only access to a research database. It can retrieve records without changing them, but the retrieved information may still be sent to the large language model (LLM) it uses. If the LLM runs on a provider's computers, such as Anthropic's, that provider receives the information. Decide which material may be sent before giving the agent access. The companion guide [*Doing Research with AI Agents*](https://iqss.github.io/dss-agentic-research/) explains [what reaches the LLM](https://iqss.github.io/dss-agentic-research/chapters/research-limits.html#what-reaches-the-llm) and [how to establish a chain of custody](https://iqss.github.io/dss-agentic-research/chapters/research-limits.html#data-chain-of-custody).

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

::: {#prompt-configure-access .prompt}
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

Have the agent record which settings it changed, where they are stored, and the test results in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). If a required restriction fails, have the agent diagnose and fix the problem, then confirm that the check passes before using protected inputs. These checks can expose configuration mistakes; they do not establish protection against every possible action.

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

[^tk-access-controls]: These settings can permit routine edits, require approval before publishing files, and block changes to protected inputs. See [Chapter 4: Control what the agent can do](https://iqss.github.io/dss-agentic-research/chapters/agent-access.html#enforce-those-limits) in *Doing Research with AI Agents* for examples. Anthropic's [permission documentation](https://code.claude.com/docs/en/permissions) describes the rules and their precedence.

[^tk-access-sandbox]: A restricted environment for running programs. It can limit which files those programs read or change and which online services they contact. See [Chapter 4: Control what the agent can do](https://iqss.github.io/dss-agentic-research/chapters/agent-access.html#enforce-those-limits) in *Doing Research with AI Agents* for an explanation of how sandboxing works alongside permission rules.

[^tk-sandbox-scope]: Anthropic documents that the [sandbox is off by default](https://code.claude.com/docs/en/sandboxing#what-the-sandbox-restricts) and lists [what runs outside it](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox).

[^tk-home-folder]: The tilde (`~`) means your home folder. The other two paths start inside the project folder. See Anthropic's [settings-file reference](https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect).

[^tk-settings-scope]: See Anthropic's [settings precedence](https://code.claude.com/docs/en/settings#settings-precedence) and [permission-rule precedence](https://code.claude.com/docs/en/permissions#settings-precedence). These explain file merging; the agent must still inspect the configuration used by the actual session and its extensions.

<!-- ===================== PART II — INSTALL TOOLS AND MANAGE PROJECT FILES ===================== -->

# 3. Install and manage tools with Homebrew {#adding-tools}

The agent may need a program that is not yet installed. A package manager installs the program and its supporting software, and provides a consistent way to update or remove it.

[`Homebrew`](https://brew.sh/) supplies many of the tools in this guide. For example, [`pueue`](https://github.com/Nukesor/pueue) is a tool that manages a job queue, starting waiting simulation runs as others finish. The agent checks whether it is installed on the computer that will run the simulations, installs it if needed, and configures the queue for the project.[^tk-homebrew-artwork]

![](figures/tool-installation.svg){#fig-tool-installation fig-alt="An agent checks for pueue on the computer where work will run. If missing, Homebrew installs it and its dependencies; an existing installation can be reused. The agent then confirms the program is found, records its version and checks that a task runs from the session. Institutional installation methods take precedence where appropriate."}

## Ask the agent to install the tool

Describe the task to the agent and name the tool if you have one in mind. Otherwise, ask it to recommend a suitable tool or consult [Chapter 1: Choose tools for a research need](#choose-tools).

`Homebrew` is the package manager we recommend in this guide. It works on macOS and Linux, including Windows through [`Windows Subsystem for Linux` (`WSL2`)](https://learn.microsoft.com/windows/wsl/install). Before adding software, have the agent check what is already installed. On a computing cluster or another institution-managed system, it should also check for established installation methods and use those where appropriate. Otherwise, ask it to install `Homebrew` if needed, explaining any steps you must complete yourself.

::: {#prompt-install-tools .prompt}
> Set up a job queue for this project's simulations, using `pueue` unless a suitable tool is already available. Check existing installations and how software is managed on the computer that will run the jobs. Use `Homebrew` unless an established institutional method is more appropriate, particularly on a computing cluster. Install `Homebrew` if needed, and explain any steps I must complete myself. Configure the queue and confirm that you can submit and monitor jobs from this session.
:::

The installation command for `pueue` is `brew install pueue`; the agent runs it. You handle system password prompts and institutional authorization. Enter passwords only when prompted by the installer or system, not in the conversation.

The agent can install `Homebrew` using its [official installation script](https://brew.sh/). If a step needs your input, such as an administrator password, it should explain exactly what to do in the [`Claude`](https://claude.com/download) app's built-in terminal[^tk-install-terminal] or the relevant system dialog.

After setup, ask the agent to confirm that it can use the tool for the project and tell you which version is installed. If it cannot find a program that is already installed, have it investigate why before installing another copy.

## Keep a record of installed tools

A [`Brewfile`](https://docs.brew.sh/Brew-Bundle-and-Brewfile) lists software to install with `Homebrew`, helping the agent set up the same tools on another computer. Your global user instructions file `TOOLCHAIN.md`[^tk-install-toolchain] records what each tool does and when the agent should use it. Ask the agent to maintain both as tools are added, removed, or changed.

The exact language and package versions used by an analysis need their own records; [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) explains these.

Before updating software used by an analysis, ask the agent to explain the proposed change and preserve the software versions needed to rerun that analysis.

[^tk-homebrew-artwork]: The illustration uses the official `Homebrew` logo, by Homebrew contributors, distributed under BSD-2-Clause. The guide includes its [complete license notice](resources/artwork-licenses/homebrew.txt) and [credits for the software logos](resources/artwork-licenses/README.md).

[^tk-install-terminal]: A terminal is a panel where you can enter commands and see their output. See [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents).

[^tk-install-toolchain]: See [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents* for guidance on organizing these files and telling the agent when to read them.

# 4. Recover earlier work: git and gh {#version-control}

Research projects change as sample definitions, analyses, and manuscripts develop. Keeping a version history of selected files lets the agent explain what changed or recover earlier work. The history remains available after your conversation with the agent has ended.

Suppose a revised exclusion rule removes far more observations than expected. You decide which sample definition is appropriate; the agent can use [`Git`](https://git-scm.com/)[^tk-git-command] to find the relevant change and recover the earlier rule while preserving unrelated manuscript edits. A restored rule can change the results, so affected figures and manuscript values must be regenerated too.

![](figures/version-recovery.svg){#fig-version-recovery fig-alt="Three saved commits preserve an earlier exclusion rule and later manuscript edits. The agent restores the earlier rule, retains the later wording, and regenerates affected results."}

## Give the project a useful history

A `Git` *repository* (often shortened to “repo”) stores the project's history. A *commit* records a version of selected files with a message describing the change. The agent can create these checkpoints after meaningful pieces of work, such as an approved sample rule or a completed figure. The descriptions should explain the change well enough to find it later.

`Git` preserves versions of the project's files, but the study's requirements and the reasons for research decisions still need to be written down. For a paper, keep the current scientific requirements in `SPECIFICATION.md` and dated decisions with their reasons in `METHODOLOGY.md`.[^tk-git-project-context] When you make or revise a research decision, have the agent keep [`SPECIFICATION.md`](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) current and record the decision and its reason at the top of [`METHODOLOGY.md`](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), preserving earlier entries.

::: {#prompt-version-history .prompt}
> Maintain version history for this project using `Git`. Inspect any existing repository and preserve current edits. Track the code, manuscript, and appropriate configuration, excluding protected data, credentials, generated libraries, and caches. Record meaningful checkpoints as tasks are completed, and summarize changes affecting the analysis or reported results.
:::

The agent handles file selection and commits. You do not need to inspect every code difference to benefit from the history. A *diff*, which shows changed lines, remains useful when investigating a particular decision or unexpected result. A `.gitignore` file tells `Git` which untracked files to leave out; it does not erase files already in history. [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) explains how to keep secret values out of research files. Keep appropriate backups for files that `Git` does not track.

A `Git` repository can contain thousands of small internal files that record changes. Cloud storage services such as `Dropbox`, `Google Drive`, and `OneDrive` may try to sync these files as they change, creating heavy sync activity that can slow the computer or temporarily block access to files. Have the agent check the storage setup before creating a repository in a synced folder. [Appendix D: Troubleshooting](#cloud-sync-storage) explains the precautions and how to handle an existing repository.

## Recover the change you need

State the desired outcome rather than a `Git` operation:

::: {#prompt-recover-analysis .prompt}
> Restore the earlier sample-selection rule while preserving unrelated manuscript wording and figure-formatting edits. Update the approved analysis requirements and record why the rule changed. Rerun the affected analysis, regenerate its figures, and identify manuscript values that need updating.
:::

After restoring earlier work, the agent should explain what it restored, which saved version it used, which files it changed, and which outputs it regenerated. If the earlier state was never recorded, the agent should say what it can recover and what must be reconstructed. It should not silently reset the entire project to an older version.

## Share your project online {#share-work-when-intended}

[`GitHub`](https://github.com/) hosts `Git` repositories for collaboration. `GitHub`'s command line interface tool (called [`gh`](https://cli.github.com/)) lets the agent use `GitHub` directly from the [`Claude`](https://claude.com/download) app, including preparing a *pull request*: a proposed change collaborators can discuss before it is incorporated. `Git` can maintain local history without `GitHub`.

If you want to share your project online, ask the agent to use `GitHub` or a repository service you already use. You handle any [personal sign-in](https://cli.github.com/manual/gh_auth_login); the agent configures the connection and uploads the changes you authorize. Before uploading, have it check that protected data and credentials are excluded from both current files and their recorded history. A repository can be public, so anyone can view it, or private, with access limited to you and authorized collaborators. A private repository still stores its contents on the service's computers.

For guidance on sharing a completed study so others can reproduce it, see [Chapter 19: Reproduce and hand off the research](https://iqss.github.io/dss-agentic-research/chapters/research-handoff.html) in *Doing Research with AI Agents*.

[^tk-git-command]: `Git` is the software's name; `git` is the command the agent uses to operate it. The illustration uses the [Git logo by Jason Long](https://git-scm.com/community/logos), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

[^tk-git-project-context]: These are project context files: saved instructions and records that the agent can consult in later sessions. See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) in *Doing Research with AI Agents*.

# 5. Find and inspect project files {#finding-files}

Agents often need to locate a small piece of information in a large project: where an exposure is defined, which script writes a table, or what information a downloaded data file contains. Computers already provide search and file-reading tools. The programs here give the agent faster searches, useful filters, and ways to query structured data without reading everything into the conversation.

Suppose a journal reviewer asks how `hot_days`, a variable counting days of heat exposure, enters an analysis like the [synthetic heat-and-birthweight study](https://iqss.github.io/dss-agentic-research/chapters/example-project.html) in *Doing Research with AI Agents*. To answer that question, the agent needs to find the code that calculates `hot_days`, see how the statistical model uses it, and check how it is labeled in figures. The tool [`ripgrep` (`rg`)](https://github.com/BurntSushi/ripgrep) searches text across files and reports matching paths and lines. `ripgrep` is the program's name; `rg` is its command.

The agent must report the file paths and line numbers of matching text, then explain any inconsistencies in how `hot_days` is calculated, used in the statistical model, and labeled in figures.

![](figures/project-search.svg){#fig-project-search fig-alt="A project search returns file paths, line numbers and code excerpts for an exposure definition, a statistical model and a figure label. The agent interprets the matches and checks consistency. Code excerpts illustrate the search, rather than reproduce a particular project's files."}

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

::: {#prompt-search-project .prompt}
> Find where `hot_days` is constructed, used in statistical models, and labeled in figures. Report the relevant file paths and line numbers. Use focused searches and excerpts. If a saved JSON or YAML response is involved, select the relevant fields rather than printing the entire response. Explain whether the construction, statistical-model use, and figure label describe the same exposure and units.
:::

## Investigate a missing match

`ripgrep` ordinarily skips hidden files, whose names begin with a dot, and files covered by ignore rules. If no match appears, have the agent check [which files were searched](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) and whether any relevant files were excluded.

A text search can miss information even when it includes the right files. The agent may need a suitable tool to read a PDF, image, or saved dataset. If code builds a variable name or filename from several pieces of text, the agent should follow the code to identify it.

When inspecting a JSON or YAML file, the agent should distinguish between an absent field, empty text, and `null`, a marker for no value. These can mean different things. The agent should check their meaning in the source data before treating a value as missing data or replacing it.

[^tk-search-formats]: JSON stands for *JavaScript Object Notation*; YAML stands for *YAML Ain’t Markup Language*. See these examples of [JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON#json_structure) and [YAML](https://yaml.org/spec/1.2.2/#chapter-2-language-overview) to see how information is arranged in each format.

[^tk-search-programs]: The linked `yq` is [Mike Farah's implementation](https://github.com/mikefarah/yq); other programs use that name. Some Linux distributions name `fd` and `bat` differently. Ask the agent to identify the installed program and record any naming convention needed for later sessions.

<!-- ===================== PART III — RUN AND REPRODUCE RESEARCH ===================== -->

# 6. Preserve a software environment: rig, renv, and uv {#environments}

An analysis depends on particular versions of its language, packages, and other software. Recording those versions lets the agent recreate the software setup when investigating a result or preparing to share the project. The agent can recreate an earlier setup without changing the one currently in use.

Suppose a collaborator reruns an analysis and obtains different intervals. The agent can recreate the original software setup to investigate whether a change in software explains the discrepancy.[^tk-version-comparison] It can use [`rig`](https://rig.r-lib.org/) to select the [`R`](https://www.r-project.org/) version and [`renv`](https://rstudio.github.io/renv/) to restore its packages, or [`uv`](https://docs.astral.sh/uv/) to manage both language and package versions for [`Python`](https://www.python.org/).

[^tk-version-comparison]: Gronenschild and colleagues (2012) processed the same brain scans with different versions of FreeSurfer and obtained different estimates of brain-region volumes and cortical thickness. [FreeSurfer version comparison](https://doi.org/10.1371/journal.pone.0038234)

## Record the language and package versions {#record-the-language-and-packages}

A *software environment* includes the language, packages, and other programs used by the analysis. The language interpreter, also called its *runtime*, executes the code. A *package* adds functions and may require other packages or programs; those requirements are its *dependencies*. A *lockfile* records the particular package versions selected to work together, so the agent can restore that set rather than install whatever is newest.

| Responsibility | `R` | `Python` |
|---|---|---|
| Install and select the language | [`rig`](https://rig.r-lib.org/) manages [`R`](https://www.r-project.org/) installations. | [`uv`](https://docs.astral.sh/uv/) manages [`Python`](https://www.python.org/) installations; `.python-version` records a selection. |
| Record and restore packages | [`renv`](https://rstudio.github.io/renv/) maintains `renv.lock`. | `uv` maintains `pyproject.toml` and `uv.lock`. |

The `R` package `renv` records the `R` version and package versions in `renv.lock`, but does not install or switch `R` itself. The standalone tool `rig` supplies that capability. For `Python`, the standalone tool `uv` handles both language and package management. The agent can install [`rig`](https://formulae.brew.sh/formula/r-rig) and [`uv`](https://docs.astral.sh/uv/getting-started/installation/#homebrew) through [`Homebrew`](https://brew.sh/); it installs `renv` from within `R`. [`Stata`](https://www.stata.com/) projects also need their `Stata` release and community-command versions recorded.

![](figures/research-environments.svg){#fig-research-environments fig-alt="R uses rig for its language version and renv for packages; renv.lock records both. Python uses uv with .python-version, pyproject.toml and uv.lock. The agent restores the recorded setup separately and compares a selected output without changing the current working environment."}

## When other environment tools are useful

An *environment manager* creates and maintains a separate software setup for a project. `renv` manages `R` packages this way; `uv` manages `Python` and its packages.

[`Conda`](https://docs.conda.io/projects/conda/en/stable/user-guide/concepts/environments.html), [`Micromamba`](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html), and [`pixi`](https://pixi.prefix.dev/latest/) can also manage other languages and supporting programs. They can be useful when an analysis combines several kinds of software, such as `Python` packages and separate programs for processing genetic data. They may also be the practical choice when collaborators already provide a working setup. Otherwise, `rig` with `renv` for `R`, or `uv` for `Python`, remain the recommended starting points.

These tools can coexist on the same computer, with different projects using different setups. If the agent combines tools within one project, it should explain what each manages and record how to restore the complete setup. It should avoid having two tools independently update the same packages, which can [leave their records inconsistent](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html#using-pip-in-an-environment).

## Capture the working environment

Have the agent use the appropriate tools to record the project's language and package versions. For an existing project, it should capture the versions already in use without upgrading them. To check that the setup can be recreated, the agent should save the output from a small part of the analysis, restore the recorded software versions, and rerun that part to compare the results.

::: {#prompt-restore-environment .prompt}
> Inspect this project's software and record the language version and all required package versions without upgrading them. Choose a small, representative part of the analysis, run it with the current setup, and save the output. Recreate the recorded software setup in a separate environment, leaving the current one unchanged. Rerun the same part of the analysis and compare the outputs. Report anything that could not be restored and any differences in the results. Keep the setup files with the project and update the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) with any additional software requirements, restoration instructions, and the outcome of the check.
:::

When adding or updating a package later, have the agent update the lockfile and rerun the affected part of the analysis.

## Check the restored environment {#restore-and-check-it}

The agent should confirm that the analysis runs with the recorded language and package versions.[^tk-environment-restore] This matters when the computer has several versions installed: installing the intended version does not ensure that the analysis uses it.

It should then rerun the small part of the analysis chosen before restoration, using the same code, data, and analysis settings. The agent should report whether the software versions match, whether the analysis completed, and whether its output differs from the saved result.

The agent should diagnose and fix installation problems, and investigate any differences in results. It should explain any need to change the recorded software versions before making that change.

## Save the setup files and instructions {#include-system-requirements}

Some packages depend on system libraries, compilers, or external programs.[^tk-environment-system-software] For example, a Bayesian analysis may require a working C++ compiler and supporting build tools. Have the agent identify the required software and record its versions and installation instructions. Where compilation is required, it should check that it can compile and run a small representative model.

Ask the agent to keep the setup files with the project, in the locations expected by the tools. These include `renv.lock` and its supporting files for `R`, or `pyproject.toml`, `uv.lock`, and `.python-version` for `Python`.[^tk-environment-setup-files] The agent should maintain these through the relevant tools.

Have it save software setup instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). These should explain any additional software requirements, including the versions used and how to install them. They should also identify the operating system and processor type used for the restoration check, give the commands for restoring the environment and rerunning the check, and summarize the outcome. Where requirements are already recorded in a setup file, the instructions should point to that file.

If supporting software remains difficult to reproduce, ask the agent whether a container would help; see [Chapter 10: Run work in a separate environment: containers](#containers).

[^tk-environment-restore]: For `R`, the agent can compare installed package versions with `renv.lock`. With `uv`, [locked synchronization](https://docs.astral.sh/uv/concepts/projects/sync/) stops if the lockfile needs updating, rather than changing it during restoration. A list of package names alone cannot restore the earlier setup; the agent also needs exact versions available for the intended operating system and hardware.

[^tk-environment-system-software]: A system library provides functions used by other software, such as reading map files. A compiler translates source code into a form the computer can run.

[^tk-environment-setup-files]: The lockfiles belong in the project's top-level folder. For `R`, also retain `.Rprofile`, `renv/activate.R`, and `renv/settings.json`; see the [`renv` collaboration guidance](https://rstudio.github.io/renv/articles/renv.html#collaboration). For `Python`, keep `pyproject.toml` and `.python-version` alongside `uv.lock`; see the [`uv` project files](https://docs.astral.sh/uv/concepts/projects/layout/).

# 7. Give research tasks reliable commands: just {#project-commands}

Repeating a research task means knowing which scripts to run, in what order, and with which settings. A *command* tells the computer which program or saved task to run. Saving the instructions for a task under one command lets the agent or a collaborator repeat it without reconstructing those details.

Suppose a figure shows estimates from a statistical model. If model fitting and plotting are separate steps, the agent can regenerate the figure from saved estimates without fitting the model again. [`just`](https://just.systems/) is a command runner that gives these tasks short names. The agent saves each task's instructions as a *recipe* in the project's `justfile`.

## Make each task runnable on its own {#give-the-commands-useful-work}

Have the agent check that each task can run separately. For example, the plotting code should read the statistical model's estimates from a saved file, so it can regenerate the figure even after the original analysis session has ended. If the code needs reorganizing, the agent should first save the current results, then check that the revised code reproduces them. [Chapter 13: Build a modular analysis workflow](https://iqss.github.io/dss-agentic-research/chapters/research-workflows.html#modular-steps) in the companion guide *Doing Research with AI Agents* explains how to structure the code this way.

![](figures/project-commands.svg){#fig-project-commands fig-alt="The agent calls just figures. The project's justfile maps that name to Rscript code/figures.R. The plotting script reads saved estimates and produces a revised figure without refitting the statistical model."}

## Save the commands

The agent installs `just` if needed, using [`Homebrew`](https://brew.sh/) or your preferred package manager. It then creates and maintains the project's recipes. A small project might offer the following menu. These are examples to create for the project; installing `just` alone does not provide them.

| Example command | Project operation |
|------------------------------|----------------------------------------------------------------------|
| `just all` | Run the project's complete documented workflow. |
| `just fit age-spline`[^tk-command-model] | Fit the named statistical model and save its results. |
| `just contrasts` | Calculate comparisons of interest, such as differences between groups, from saved model results. |
| `just figures` | Generate figures from saved results. |
| `just power` | Run simulations to estimate statistical power for a proposed study. |
| `just paper` | Build the manuscript with its tables, figures, and reported results. |
| `just smoke` | Run a small version of the workflow to check that its steps work together. |

::: {#prompt-saved-commands .prompt}
> Inspect this project's analysis and set up named commands for fitting the statistical model, regenerating figures from saved estimates, and running the complete workflow. Use `just` unless existing project commands already cover these tasks. Check that the individual tasks can run separately. If the code needs reorganizing, save the current results first and confirm that the revised code reproduces them. Explain what each command does and use these commands whenever you carry out the corresponding tasks.
:::

Ask the agent to use these recipes in normal work and keep their descriptions current. You can ask the agent to list the project's commands and explain what each does. A completed figure task should report the command used, the saved estimates it read, and the figure it produced.

## Run a smoke test {#smoke-tests}

A *smoke test* runs a small, representative workload through the actual workflow before a long run. For a simulation study, the agent might run a few repetitions instead of thousands, then produce the expected tables and figures from those results. Ask the agent to propose a small workload for your project, explain which steps it will check, and configure `just smoke` to run it. It should use the same analysis code and software environment as the full run and save the test outputs separately from the main study's results.

::: {#prompt-smoke-test .prompt}
> Add a `just smoke` recipe for this simulation study. Run five repetitions, fitting the planned statistical model in each and then generating the summary tables and figures. Use the same simulation and analysis code, sample size, and software environment as the full run. Save the test outputs separately from the main results. Check that each step completes and produces the expected files, and report any problems. Run this check after relevant code changes and before starting the full simulation.
:::

[]{#runnable-checks}

Ask the agent to check the contents of the outputs as well as whether the files exist. In the simulation example, it should confirm that all five repetitions produced results and that those results were used in the summary tables and figures. A successful smoke test shows that these steps work together on the small run; it does not establish that the statistical method is suitable for the research question.[^tk-smoke-scientific-checks]

[]{#combine-command-and-dependency-runners}

[]{#sec-7d}

To have the workflow determine which steps need rerunning after a change, see [Chapter 8: Rerun only affected steps: targets and Snakemake](#pipeline-dependencies).

[^tk-command-model]: Here, `age-spline` is an example name for a statistical model allowing a curved relationship between age and the outcome. The name after `fit` identifies which model the agent should fit.

[^tk-smoke-scientific-checks]: For checks of statistical performance and independent implementations, see [Chapter 14: Test the analysis against known truth](https://iqss.github.io/dss-agentic-research/chapters/simulation.html) and [Chapter 15: Check the agent with independent implementations](https://iqss.github.io/dss-agentic-research/chapters/checking-analysis.html) in *Doing Research with AI Agents*.

# 8. Rerun only affected steps: targets and Snakemake {#pipeline-dependencies}

When an analysis changes, the agent needs to identify which steps must be repeated and which saved results can still be used. Each step has *dependencies*: the data, code, or earlier results it uses. A *dependency runner* tracks these relationships and determines which steps are affected by a change.

For example, a Bayesian model may take hours to fit. Its *posterior draws* (the sampled parameter values) can be saved and reused to calculate new comparisons or generate figures. A change to the data or model requires updating the fit and the outputs that use it. The agent can manage these dependencies with [`targets`](https://docs.ropensci.org/targets/) for an [`R`](https://www.r-project.org/) workflow, or [`Snakemake`](https://snakemake.readthedocs.io/) for workflows using other languages or combining several.

## Show the dependencies

Suppose two Bayesian models use the same prepared data. The agent uses their saved posterior draws to make a comparison figure included in the manuscript. These connected steps form a *pipeline*.

![](figures/research-dependencies.svg){#fig-research-dependencies fig-alt="The agent runs just all, whose recipe starts targets or Snakemake. With only model B changed, the dependency runner reuses the prepared data and model A's saved posterior draws, reruns model B, and updates the comparison figure and manuscript. Orange paths and labels indicate repeated calculations; blue labels identify reuse."}

Have the agent identify the data, model settings, code, and saved results each step needs, and the outputs it produces. It should record these relationships and show them in a diagram for your project.[^tk-dependency-definitions] You check whether they match the intended analysis.

If a step downloads data, have the agent save a copy and record that file as an input. When the copy is refreshed, the runner can identify the calculations that depend on it. If the agent does not record a required file or setting as a dependency, the runner may reuse old results even after that input changes.

## Use saved commands to run the pipeline {#connect-the-analysis}

[`just`](https://just.systems/) is a command runner: it saves instructions for starting a task under a short name (see [Chapter 7: Give research tasks reliable commands: just](#project-commands)). The agent can set up `just all`[^tk-just-all] to start `targets` or `Snakemake`. The dependency runner then checks which results are current and runs the steps needed to update the analysis. Either dependency runner can also be used on its own. Adding `just` gives the agent a consistent front door for running the project's tasks.

For the two-model example, the expected behavior is:

| What changes | What runs again | What can be reused |
|-------------------------|---------------------------------------------|------------------------------|
| A figure label | The figure and manuscript | Prepared data and both model fits |
| The specification of model B | Model B, the comparison figure, and manuscript | Prepared data and model A |
| The shared input data | Affected data preparation, both fits, and the outputs that use them | Any unaffected earlier work |
| Nothing changes and all outputs are present | No analysis steps | All current saved results |

The agent uses the same `just all` command in every case. The dependency runner determines which calculations actually run. Reusing the saved posterior draws avoids repeating hours of fitting when only a later step has changed.

The agent can also configure `just figures` to ask the dependency runner for the figures. The runner checks the inputs and saved results those figures need, updating them if necessary.

The following prompt uses `targets` for an `R` analysis with Bayesian models.[^tk-dss-targets] For a workflow using other languages, ask the agent to use `Snakemake` instead.

[^tk-dss-targets]: The [DSS targets skill](https://iqss.github.io/dss-agent-skills/skills/targets.html) provides a reusable procedure for building and checking an R pipeline.

::: {#prompt-selective-reruns .prompt}
> Preserve this project's current results and software versions. Set up `targets` for this `R` analysis, installing it in the project's software environment if needed and recording its version. Use the existing analysis code to connect data preparation, the Bayesian model fits, saved posterior draws, comparison figures, and the manuscript through their dependencies. Configure the command `just all` to run the complete workflow through `targets`, and configure `just figures` to request the figures through the same runner. Show me the dependency diagram. Check selective reruns with small representative inputs, keeping test outputs separate from the study's results. Report which steps run and which results are reused, and investigate unexpected differences. Use these commands for future updates to the analysis.
:::

## Check what reruns

Before a long analysis run, ask the agent to show which steps it expects to repeat.[^tk-dependency-preview] It should verify that behavior in a [smoke test](#smoke-tests), using small representative inputs and saving test outputs separately from the study's results.

Have the agent check the three changes in the table: a figure edit, a change to one statistical model, and a change to shared data. It should then run the workflow without further changes and confirm that completed results are reused. Ask it to name the steps repeated and results reused, check the output files, and diagnose any unexpected behavior before running the full analysis. These checks concern how the workflow runs; the statistical methods still need their own evaluation.

## Recover work after an interruption {#run-the-pipeline-unattended-when-useful}

After an interruption, have the agent identify completed steps and restart the workflow, reusing saved results that remain current. Suppose a simulation study needs 100 model fits, each defined as a separate pipeline step with a saved result. If 40 fits finish before an interruption, the runner can reuse those results and run the remaining fits. An unfinished fit may still need to start again.

Continuing partway through an unfinished calculation requires a *checkpoint*: a saved intermediate state that the program can reload.[^tk-pipeline-checkpoint] Checkpointing usually uses capabilities of the existing analysis software, or progress-saving and recovery logic the agent adds to the project's code. It does not generally require another tool.

| What needs to survive an interruption? | What provides it? |
|--------------------------------------------------|--------------------------------------------------|
| Submitted tasks, their status, and logs | The job-queue tool [`pueue`](https://github.com/Nukesor/pueue) |
| Completed analysis steps and their results | Saved outputs managed by `targets` or `Snakemake` |
| Progress inside an unfinished calculation | Checkpoint support in the analysis software or project code |

Have the agent explain what the project's software can recover. If a fit cannot resume partway through, saving each completed fit still limits how much work must be repeated. A single pipeline step containing all 100 fits does not automatically save them individually.

::: {#prompt-recover-interruption .prompt}
> Make this simulation workflow recoverable after an interruption. Save each completed repetition so restarting does not repeat it when the inputs, code, and settings are unchanged. Check whether the fitting software can also save and reload progress within an unfinished fit, and configure that where supported. Choose how often to save progress and document its location and the restart command in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). Test recovery on five repetitions, interrupting after some finish and while another is running. Keep test outputs separate from the study's results. Restart with the same inputs, settings, and software versions, then check that completed work is reused without missing or duplicating repetitions. Explain which unfinished work still needs to start again.
:::

Have the agent keep the workflow definitions, software-version records, and required inputs with the project, and record the location of saved results in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). To run the saved commands unattended, see [Chapter 9: Keep unattended jobs moving: pueue](#job-queues).

[^tk-dependency-definitions]: The agent usually defines a `targets` workflow in `_targets.R` and a `Snakemake` workflow in a `Snakefile`. It writes and maintains these files; see the [`targets` manual](https://books.ropensci.org/targets/) and [`Snakemake` rules](https://snakemake.readthedocs.io/en/stable/snakefiles/rules.html).

[^tk-just-all]: In this example, `all` is the name of a recipe: saved instructions the agent defines in the project's `justfile` to update the complete workflow. `just all` runs that recipe.

[^tk-dependency-preview]: For `targets`, the agent can use [`tar_outdated()`](https://docs.ropensci.org/targets/reference/tar_outdated.html) to identify steps that need updating. A [`Snakemake` dry run](https://snakemake.readthedocs.io/en/stable/tutorial/basics.html#step-1-the-first-rule) shows the planned steps without executing them.

[^tk-pipeline-checkpoint]: Saved posterior draws do not necessarily contain all the state needed to continue sampling. Have the agent check what the fitting software can save and reload. The dependency runner's record of completed steps does not itself provide checkpoints within a fit.

# 9. Keep unattended jobs moving: pueue {#job-queues}

Some analyses involve more tasks than a computer can run at once. A *job queue* holds tasks until they can run, then starts waiting tasks as others finish. Each submitted task is a *job*; a set of jobs is a *batch*. This lets prepared work continue while you are away.

Suppose a sensitivity analysis requires 100 independent model fits, but the computer can comfortably run four at once. The agent can use the tool [`pueue`](https://github.com/Nukesor/pueue) to run four fits at a time and start another whenever one finishes. `pueue`'s background service[^tk-queue-background-service] runs separately from the conversation with the agent and retains each job's status and *logs*, the messages recorded while it runs. You can return later and ask the agent which results are ready and which jobs need attention.

![](figures/job-queues.svg){#fig-job-queues fig-alt="An agent submits named research commands to pueue. A computer shows a queue with a concurrency limit of two, completed and failed jobs, two running jobs and a waiting job. The saved log for job 32 reports a missing input and a nonzero exit code. The agent investigates before resubmitting. This is a schematic status display."}

## Prepare the job batch {#prepare-the-batch}

Have the agent check for `pueue` on the computer that will run the work, install it if needed through [`Homebrew`](https://brew.sh/) or your preferred package manager, and configure and check its background service.[^tk-dss-pueue] [Chapter 3: Install and manage tools with Homebrew](#adding-tools) explains installation. For short tasks, the agent can run the work directly. On a computing cluster, it should use the institution's *scheduler*, the service that assigns jobs to available computing resources.

[^tk-dss-pueue]: The [DSS Pueue skill](https://iqss.github.io/dss-agent-skills/skills/pueue.html) covers job submission, progress checks, and verification of saved outputs.

Each fit needs specified inputs and settings, the intended software versions, and its own output files. Have the agent check that it can run independently, without relying on objects left in an earlier analysis session. [Chapter 7: Give research tasks reliable commands: just](#project-commands) explains how to prepare tasks this way.

For the 100-fit example, ask the agent to submit one representative fit through the queue as a [smoke test](#smoke-tests): a small run through the actual workflow before the full batch. It should inspect the saved result and measure memory and processor use, then set the *concurrency limit*, the maximum number of jobs running at once. The limit should leave the computer usable for other work.[^tk-queue-resources]

Before starting the job batch, the agent should also confirm that queued jobs use the recorded software versions, can read the approved inputs, and can write to the intended output folders. These checks must use the queue service's actual access.[^tk-queue-setup-checks]

::: {#prompt-queue-fits .prompt}
> Set up `pueue` for these 100 sensitivity fits, installing it if needed and checking its background service. Make each fit run independently with the intended inputs, settings, and software versions, saving its results and log separately. Submit one representative fit through the queue, inspect its saved result, and use its memory and processor use to choose how many fits can run at once. Then submit the batch and confirm that jobs start and produce logs or outputs. Save a job list alongside the outputs with each fit's settings, queue identifier, status, result file, and log. Record how to submit and check future batches in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), and use the queue for future unattended runs.
:::

## Run the job batch unattended {#let-the-queue-manage-execution}

After submission, have the agent confirm early progress in the actual batch: a job should be running and its expected log or output should have appeared. A successful small test does not establish that the later batch was launched correctly.

The background service runs submitted jobs independently of the conversation with the agent. The statistical model fits can compute without repeated LLM calls; ask the agent to summarize their saved logs and results when you return. The computer must remain awake and available; a reboot or shutdown can interrupt unfinished fits.[^tk-queue-windows] An interrupted fit may need to start again from the beginning.[^tk-queue-checkpoint]

## Review results and recover failures

Ask the agent to inspect the saved results as well as each job's reported status. A job that reports success may still have saved incomplete results or written them to an unexpected location. Have the agent retain failed attempts and their logs so it can investigate what happened.

::: {.needspace height="3cm"}
:::

An illustrative report might say:

::: {.example-output}
Of 100 jobs, 98 completed with the expected results files. Two failed before saving estimates; their logs report insufficient memory. Their settings and logs are retained, and the 98 completed fits do not need rerunning.
:::

Ask the agent to diagnose the two failures, adjust operational settings where needed, and rerun only those fits. For example, running fewer fits at once may resolve memory pressure. Changes to the statistical model or research inputs require your decision. Have the agent update the job list, link each retry to its original fit, and preserve the earlier logs and completed results.

<details class="guide-example">
<summary>Example commands the agent can use to submit a fit and inspect its outcome</summary>

For a project using [`just`](https://just.systems/), the agent can submit an existing `fit` recipe: saved instructions for fitting a named statistical model. Here, `age-spline` is an example name for a model allowing a curved relationship between age and the outcome.

```text
pueue add --print-task-id -- just fit age-spline
pueue status
```

The agent uses the returned job identifier. If it were 42, the following commands inspect its log, wait for it to finish, and use [`jq`](https://jqlang.org/) to check the recorded success/failure result:

```text
pueue log 42
pueue wait 42
pueue status --json | jq -e '.tasks["42"].status.Done.result == "Success"'
```

`pueue wait` reports that waiting has ended; its own exit status does not establish whether the fit succeeded. The agent must inspect the recorded result and the saved analysis output. This structure of the status report was checked with `pueue` 4.0.4; the agent should check it against the installed version.[^tk-queue-r]

</details>

## Queue a complete workflow {#combine-with-a-dependency-pipeline}

The agent can also queue a complete analysis workflow as one job. Three tools can work together:

| Tool | What the agent uses it for |
|------------------------------|----------------------------------------------------------------------|
| [`just`](https://just.systems/) | Give a task or complete workflow a consistent command. |
| [`targets`](https://docs.ropensci.org/targets/) or [`Snakemake`{style="white-space: nowrap;"}](https://snakemake.readthedocs.io/) | Determine which analysis steps need running and reuse current results. |
| `pueue` | Start submitted jobs when their turn comes and retain their status and logs. |

Suppose a workflow prepares data, fits two Bayesian models, then produces a comparison figure and manuscript. The agent can define `just all` as the command that runs this workflow through `targets`, and submit `just all` to `pueue` as one job. When the queue starts that job, `targets` checks the dependencies and runs the steps that need updating, reusing current results.

The queue counts the whole workflow as one job even if `targets` fits both models at once. Have the agent account for this when setting limits on simultaneous jobs and on calculations within each workflow. [Chapter 8: Rerun only affected steps: targets and Snakemake](#pipeline-dependencies) explains how the agent connects the analysis steps and checks selective reruns.

[^tk-queue-background-service]: A background service is a separate program that runs without ongoing interaction from you or the agent. `pueue`'s service maintains the queue, starts waiting jobs, and records their progress.

[^tk-queue-resources]: A *core* is a part of the computer's processor that can carry out calculations independently. Many computers have several cores. One model fit may use several cores through *threads*, parts of a program that can run at the same time. Limiting the queue to four jobs therefore does not limit the computer to four active threads. Available memory may also limit how many fits can run together.

[^tk-queue-setup-checks]: [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) explains software-version records. [Chapter 2: Control what added tools can access](#tool-access) explains why a separate queue service needs its own access checks.

[^tk-queue-windows]: On Windows through [`WSL2`](https://learn.microsoft.com/windows/wsl/systemd), the Linux environment used by this guide, have the agent check that both the environment and the queue service remain available. Starting a service does not itself keep WSL running.

[^tk-queue-checkpoint]: A *checkpoint* saves the state of an unfinished fit so the fitting software can continue from it. `pueue` can rerun the command that starts a fit, but it does not create checkpoints. Pausing a job also does not save a checkpoint that survives a reboot. [Recover work after an interruption in Chapter 8](#run-the-pipeline-unattended-when-useful) explains how to ask the agent to save progress and check that interrupted work can resume.

[^tk-queue-r]: On macOS, [`R`](https://www.r-project.org/) programs launched by an agent can sometimes stall without producing output. Have the agent follow the [R execution instructions in Appendix D: Troubleshooting](#r-on-macos), including for queued jobs.

# 10. Run work in a separate environment: containers {#containers}

An analysis may depend on software beyond its language and packages, making it difficult to recreate the setup on another computer. A *container* provides a separate environment containing the programs and supporting software needed for a task. The agent can also configure which folders and network connections are available inside it.

Suppose a collaborator needs to rerun your Bayesian analysis. They have the required [`R`](https://www.r-project.org/) packages, but the analysis also needs a compiler[^tk-container-compiler] and supporting software that are missing from their computer. The agent can use [`Docker`](https://www.docker.com/), software for building and running containers,[^tk-container-docker] to package these requirements into a prepared environment, check it with a small model fit, and provide instructions for running the analysis on the collaborator's computer.[^tk-container-platform]

## When a container is useful {#decide-why-the-task-needs-a-container}

A container is useful when collaborators need a prepared software setup that would otherwise be difficult to recreate on each computer. The agent can package the required language, packages, and supporting programs using [the project's recorded versions](#record-the-language-and-packages). It can also configure which files and network connections the analysis can access.

| Research need | What the agent configures |
|----------------------------------------|------------------------------------------------------------|
| Run the analysis on another computer | The required language, packages, and supporting programs, prepared for the intended computer. |
| Run a task with selected files and network access | Read-only input folders, a writable results folder, and the connections the task needs. |

## Prepare the software and file access {#specify-software-and-access}

Have the agent check what container software is already available on the computer that will run the analysis. On a Mac, [`Colima`](https://github.com/abiosoft/colima) provides the Linux environment needed to run the containers, while `Docker`'s command-line tools let the agent build and operate them. The agent can install missing components through [`Homebrew`](https://brew.sh/), or retain an existing suitable [`Docker Desktop`](https://www.docker.com/products/docker-desktop/) setup. On institutional infrastructure, it should use the supported container software, which may be [`Apptainer`](https://apptainer.org/), and check that software's file and network access settings.

For `Docker`, the agent writes a `Dockerfile`: instructions for assembling the required software. Building those instructions produces an *image*, a saved package from which containers can be created. The agent then starts a container and makes selected project folders available inside it. These folder connections are called *mounts*.[^tk-container-mounts] Keeping the study data outside the image lets a collaborator receive the prepared software without receiving those data.

![](figures/research-containers.svg){#fig-research-containers fig-alt="On a host computer, a Dockerfile builds a software image. A running container contains a language, packages, system tools and the analysis command. A read-only mount supplies original inputs, a writable mount saves results, and a separately permitted network connection reaches an approved service."}

For the Bayesian analysis example, have the agent make the required input files available without permission to change them, and save the fitted results to a designated project folder outside the container. Those results remain available when the container is removed. If the fit needs no external service, have the agent disable network access during the analysis. It should share only the folders and connections needed for the task.[^tk-container-control-socket]

These restrictions apply to programs running inside the container. The agent's other tools still need their own access controls; see [Chapter 2: Control what added tools can access](#tool-access). For protected data, establish where processing is permitted before configuring the container. [Chapter 3: Know where your data goes](https://iqss.github.io/dss-agentic-research/chapters/research-limits.html#data-chain-of-custody) in the companion guide *Doing Research with AI Agents* explains that decision.

::: {.guide-note}
The agent can operate the analysis inside the container while its large language model (LLM) runs elsewhere. Even an agent running inside a container can use a hosted LLM, which runs on the service provider's computers; information sent to that service leaves the computer. Running the LLM locally requires additional software, described in [Chapter 17: Run and adapt an LLM on your own hardware](#local-models).
:::

::: {.needspace height="7cm"}
:::

## Build and check the environment {#build-and-check-the-environment}

Ask the agent to save results from a small representative fit using the working setup, then run the same fit inside the container with the same data, code, and analysis settings. This is a [smoke test](#smoke-tests): a small run through the actual workflow before the full analysis. It should check that the model compiles and runs, compare the saved estimates, and investigate unexpected differences.[^tk-container-fit-comparison]

Have the agent confirm that results are saved in the intended project folder and remain available after the test container is removed. It should separately test any required file and network restrictions with harmless substitute inputs. A successful fit does not establish that those restrictions work.

::: {#prompt-container-analysis .prompt}
> Prepare a container so a collaborator can rerun this Bayesian analysis. Preserve the recorded `R` and package versions, and include the compiler and other supporting software the analysis needs. Check the intended computer and any existing container setup, then install or configure what is missing through the appropriate route. Make the required inputs read-only and save fitted results to a designated project folder outside the container. Run a small representative fit in the working setup and in the container with the same data, code, and settings. Compare the estimates and investigate unexpected differences. Check that results remain available after the test container is removed, and test required access restrictions with harmless substitute inputs. Save the configuration with the project and document how to build, run, and check it in `README.md` for collaborators. Link to these instructions from the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and use this setup for future analysis runs.
:::

After the test, have the agent report which software versions were used, which outputs it compared, any differences it found, and where the results are saved. It should identify the access restrictions actually tested and diagnose and fix setup problems before the full run. Changes to the statistical model or research inputs remain your decision.

## Save the setup for future runs {#preserve-what-is-needed-to-run-it-again}

Have the agent keep the `Dockerfile` and existing records of language and package versions with the project. It should also save the command or configuration that starts the container with the intended folders and network access. When tasks need different access, have it maintain separately named commands or configurations so the differences remain explicit.

Ask it to add a "Container setup" section to `README.md` for collaborators, linked from the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). This should identify the tested operating system and processor type, the exact image used,[^tk-container-image-id] and the input and output locations. It should give the commands for building the image, running the analysis, and repeating the check, with a short record of the outcome. The collaborator can give these instructions to their agent to check compatibility and run the analysis.

A `Dockerfile` that downloads software from changing repositories is not a permanent copy of that software. When long-term recovery matters, have the agent save the built image in an agreed storage location and record how to retrieve it. The image identifier establishes which version was used; retaining the image makes that version available later.

The agent can keep the project's saved commands while arranging for them to run the analysis inside the container. If the project uses a job queue, it can submit those commands as before. [Chapter 7: Give research tasks reliable commands: just](#project-commands) and [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) explain how the agent sets up those parts of the workflow.

[^tk-container-compiler]: A compiler translates source code into a form the computer can run. Some Bayesian fitting software compiles code for a statistical model before fitting; the example assumes such a setup.

[^tk-container-docker]: The command-line tool is called `docker`; it sends instructions to the background service that builds images and runs containers. [`Docker Desktop`](https://www.docker.com/products/docker-desktop/) is an application that bundles those components with a graphical interface. See [Docker's explanation of its components](https://docs.docker.com/get-started/docker-overview/#docker-architecture).

[^tk-container-platform]: Containers still have operating-system and processor requirements. Have the agent check the intended computer and prepare a compatible image; [Docker's platform documentation](https://docs.docker.com/build/building/multi-platform/) explains the available approaches.

[^tk-container-mounts]: The computer running the container is called the *host*. A bind mount makes one of its files or folders available inside the container. `Docker` bind mounts allow writing by default, so the agent must explicitly configure read-only inputs. See [Docker's mount documentation](https://docs.docker.com/engine/storage/bind-mounts/).

[^tk-container-control-socket]: Have the agent avoid sharing the entire home folder or granting powers the analysis does not need. `Docker`'s *control socket* is a connection through which software can control `Docker` and its containers; making it available inside a container requires a separate access decision.

[^tk-container-fit-comparison]: Bayesian estimates can vary between runs because fitting involves random sampling. The agent should account for expected sampling variation when comparing results, rather than require identical posterior draws.

[^tk-container-image-id]: A *digest* identifies particular image content. A *tag* is a convenient name that can later refer to a different image. The agent should record enough information to recover the version actually used.

# 11. Generate documents from research outputs: Quarto and Pandoc {#research-documents}

A manuscript often reports the same result in a table, a figure, and a sentence. Linking those locations to saved analysis outputs makes updates easier to carry through consistently. The agent can maintain the text and its supporting inputs as the document's *source*, then *build* or *render* a readable document from them.

Suppose a revised sample definition changes the number of participants and the estimated difference between two groups. The agent can use [`Quarto`](https://quarto.org/), a tool for producing documents from text and code, to read the updated values from saved analysis results and insert them into the results table and accompanying text. It can then produce a [`Word`](https://www.microsoft.com/microsoft-365/word) draft for coauthors and a PDF for review.

## Connect the document to saved results {#connect-the-document-to-saved-results}

Markdown is a plain-text format that uses simple symbols to indicate headings, lists, and links. A `Quarto` source file, usually ending in `.qmd`, can contain this text, document settings, and code. The agent writes and maintains that source.

Have the agent configure the `.qmd` file to read numerical results from saved analysis files. Code within the document can format those values for tables and insert them into the relevant sentences.[^tk-document-inline] The document can also include figures that the analysis has saved as image files.

Have the agent keep the code for fitting statistical models in separate analysis scripts and save their results before building the document. It can then rebuild a draft after a wording or layout change without fitting the statistical models again.

`Quarto` runs the document's code and uses [`Pandoc`](https://pandoc.org/), a tool for converting documents between formats, to produce the requested output. Both are standalone programs.[^tk-document-tools] `Quarto` is the recommended starting point for a new manuscript that reads saved research results. For a document whose text, tables, and figures are already prepared, the agent can use `Pandoc` directly.

![](figures/document-production.svg){#fig-document-production fig-alt="Manuscript source, references and saved results feed a Quarto build. The agent directs the build, shown as a running render command with a processing gear and progress bar. The build produces Word, HTML and PDF documents; the depicted PDF route requires LaTeX."}

## Choose the output formats and prepare the tools {#choose-the-deliverable}

Tell the agent which formats you need and supply any journal or collaborator formatting requirements.

| Output | Typical purpose | What the agent checks |
|---|---|---|
| `Word` (`.docx`) | Editable drafts for coauthors. | Required styles, equations, and editable tables. |
| PDF | Reading, printing, or submission. | Fonts, page layout, equations, and figure placement. |
| Web document (HTML) | Reports read in a browser. | Links, images, interactive elements, and supporting files. |

Have the agent inspect the project's existing document setup and confirm that it can use the required tools from its session. It should install missing components through [`Homebrew`](https://brew.sh/) or the established installation route, preserving a working setup where one exists. [Chapter 3: Install and manage tools with Homebrew](#adding-tools) explains this process.

For the PDF route described here, [`LaTeX`](https://www.latex-project.org/), a document typesetting system, arranges the text, equations, and figures on the page. The agent should check that the required typesetting software and fonts are available, then produce and inspect a PDF.[^tk-document-pdf]

`Word` formatting can come from a [*reference document*](https://quarto.org/docs/output-formats/ms-word-templates.html): a `.docx` file that supplies styles for headings, text, and tables. If a journal or collaborator provides a template, have the agent use its styles and check the resulting draft.

## Build and check the document {#configure-and-inspect-the-build}

The agent can use [`just`](https://just.systems/), a command runner, to save the build instructions as a command such as `just paper`. It creates that command for the project, specifying the manuscript source, output formats, and destination folder. If an equivalent command already exists, have the agent retain it. [Chapter 7: Give research tasks reliable commands: just](#project-commands) explains how it creates and maintains these commands.

When analysis results change, have the agent confirm that rebuilding reads the updated files. If the document reuses earlier computed output, the agent should configure and document how that output is refreshed.[^tk-document-refresh] In the sample-definition example, it should compare the new sample size and group difference in both the table and the text with the saved analysis results.

If the project already uses a dependency runner, such as [`targets`](https://docs.ropensci.org/targets/) or [`Snakemake`](https://snakemake.readthedocs.io/), to decide which steps need rerunning, have the agent include the document build and its saved inputs in that workflow. This lets the runner identify when changed results require a new draft; see [Chapter 8: Rerun only affected steps: targets and Snakemake](#pipeline-dependencies).

::: {#prompt-build-manuscript .prompt}
> Configure this manuscript in `Quarto` to produce a `Word` draft for coauthors and a PDF for review. Check the existing document tools and install any missing components through the appropriate route. Generate the results table and insert numerical values in the text from saved analysis outputs, keeping model fitting separate from document production. Save the build as `just paper`, or use the project's existing equivalent. Build both formats and confirm that the revised sample size and group difference appear correctly in the table and accompanying text. Inspect both documents for citation, equation, figure, and layout problems, and fix any build problems. Record the setup, input files, output locations, and build instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). Use the saved command for subsequent drafts.
:::

Have the agent inspect each requested format for missing citations, misplaced tables, clipped figures, and broken equations. After the build, it should report where it saved the documents, which results files it used, any analysis steps it repeated, and what it checked. It should diagnose and fix build problems and identify anything still unresolved. [Appendix D: Troubleshooting](#troubleshooting) explains known [`R`](https://www.r-project.org/) and TeX build problems.

You review interpretation and prose. [Chapter 18: Write and revise the manuscript](https://iqss.github.io/dss-agentic-research/chapters/research-writing.html#trace-manuscript) in the companion guide *Doing Research with AI Agents* explains how the agent checks reported results throughout the manuscript against their saved sources.

## Save the setup for future drafts

Have the agent keep the manuscript source, bibliography, formatting files, and build configuration with the project. For example, `paper.qmd` can hold the manuscript and `sources.bib`[^tk-document-bibliography] the bibliographic details used to generate its citations and reference list. Retain the saved results and figures that the build reads too.

Ask the agent to record the installed versions of `Quarto`, `Pandoc`, and any PDF software, along with the required fonts, in the global user instructions file `TOOLCHAIN.md`.[^tk-document-toolchain] If the document runs [`R`](https://www.r-project.org/) or [`Python`](https://www.python.org/) code, its packages belong in the project's software-version records; [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) explains how the agent maintains those records.

Have the agent save document build instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). These should identify the maintained manuscript, required software and versions, input files, and output locations. They should give the build command, explain how to refresh reused output, and record the checks completed. Ask the agent to use these instructions for subsequent drafts and keep them current as the setup changes.

## Bring coauthor edits back into the source {#bring-coauthor-edits-back-into-the-source}

Tell the agent which document is being maintained. For a manuscript built from Markdown or `Quarto` source, have it preserve each returned `Word` file and compare it with the draft sent to that coauthor. It should inspect comments and tracked changes before conversion and identify revisions that need your decision.[^tk-document-word-changes] The agent generates each new `Word` draft from the `.qmd` file. It therefore needs to transfer accepted coauthor edits into that file so they appear in subsequent drafts.

::: {#prompt-coauthor-edits .prompt}
> Preserve this coauthor's returned `Word` document and compare it with the draft sent. Inspect its comments and tracked changes, and flag conflicting edits or changes to claims and results that need my decision. Transfer the edits I have accepted into the maintained `Quarto` source. Keep unresolved comments available for review. Use the saved build command to produce a new draft without overwriting the returned copy, then check that the accepted edits appear in the new document.
:::

After transferring the edits, have the agent rebuild and check a new draft. It should confirm that accepted wording, citations, and formatting changes appear as intended, and report any comments or conflicting revisions still awaiting a decision.

If collaborators maintain the manuscript directly in `Word` or [`Google Docs`](https://docs.google.com/), keep that as the working document. Have the agent check which editing tools it can use and propose how to incorporate changes while preserving comments and other collaborators' edits. The research guide's [Incorporate coauthor edits](https://iqss.github.io/dss-agentic-research/chapters/research-writing.html#preserve-coauthor-edits-and-respond-to-reviewers) section explains direct editing and review of an exported copy.

When you approve a revision that changes the analysis, have the agent preserve the earlier results, update the current scientific requirements in `SPECIFICATION.md`, and add the dated decision and reason to `METHODOLOGY.md`.[^tk-document-project-context] It should then rerun the affected analysis and checks, rebuild the manuscript, and check that the new draft uses the revised results.

[^tk-document-inline]: *Inline code* inserts a computed value into a sentence. The agent can configure it to use a value read from a saved results file and apply the appropriate rounding; see [Quarto's inline-code documentation](https://quarto.org/docs/computations/inline-code.html).

[^tk-document-tools]: These programs are installed separately from the analysis language and its packages. The standard `Quarto` installation includes `Pandoc`, so this route does not ordinarily require a separate `Pandoc` installation; see [Quarto's FAQ](https://quarto.org/docs/faq/#how-can-i-upgrade-dependencies).

[^tk-document-pdf]: A *TeX distribution* supplies the programs and packages used by `LaTeX`. If none is suitable, the agent can follow [Quarto's PDF setup](https://quarto.org/docs/output-formats/pdf-basics.html) and install [`TinyTeX`](https://yihui.org/tinytex/) with `quarto install tinytex`. It should retain a working [`MacTeX`](https://tug.org/mactex/) or [`TeX Live`](https://tug.org/texlive/) installation. `Word` and HTML output do not require this PDF software.

[^tk-document-refresh]: `Quarto` can save and reuse the output of code run within a document. This is called *caching* or *freezing*, depending on the mechanism. A change to an external results file may not trigger fresh execution under those settings. The agent should check the actual build route and configure the required refresh; see [Quarto's execution settings](https://quarto.org/docs/projects/code-execution.html).

[^tk-document-bibliography]: A `.bib` file stores references in BibTeX format: plain-text entries containing details such as authors, titles, and publication dates. The agent connects citations in the manuscript to these records and applies the required citation style; see [Quarto's citation documentation](https://quarto.org/docs/authoring/citations.html).

[^tk-document-toolchain]: See [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents* for guidance on organizing these files and telling the agent when to read them.

[^tk-document-word-changes]: When reading a `.docx` file, `Pandoc` accepts tracked insertions and deletions and omits comments by default. Its `--track-changes=all` option retains them for inspection in the converted content; it does not guarantee that a later conversion back to `Word` preserves the original review features. See [Pandoc's tracked-change options](https://pandoc.org/MANUAL.html#option--track-changes).

[^tk-document-project-context]: These are project context files: saved instructions and records that the agent can consult in later sessions. See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) in *Doing Research with AI Agents*.

<!-- ===================== PART IV — CONNECT TO DATA AND SERVICES ===================== -->

# 12. Keep credentials out of research files: 1Password and direnv {#credentials}

Research programs sometimes need access to an online account to retrieve data or use a service. A *credential* is information used to establish that access, such as a password or an API key.[^tk-credentials-api] Keeping credentials separate from research files lets you share scripts and results without also sharing access to the account.

Suppose an agent prepares a script that sends published abstracts to a paid large language model (LLM) service to classify them by study design. The script needs an API key each time it runs. [`1Password`](https://1password.com/), a password manager, can store that key and supply it when needed. If your institution already provides a suitable credential service, have the agent use it instead.

## Supply a credential to a command

For the abstract-classification example, first choose the service account and acceptable spending. Ask the agent to explain how the script's API use will be billed, including whether it is covered by an existing subscription. Have it check the available credential tools and configure the chosen arrangement. For `1Password`, the agent uses its command-line tool, [`op`](https://developer.1password.com/docs/cli/get-started/). Have it install `op` through [`Homebrew`](https://brew.sh/) if needed and configure access to your account.[^tk-credentials-install]

`1Password` stores the key in a *vault*, a protected collection of saved items. The agent should guide any personal steps needed to create the key with the service, save it directly in the vault, and authorize access. Keep the key out of the conversation. Ask the agent to check which service operations the key permits and which vault items the configured programs can access, limiting both to the task where supported.

The script receives the key through an *environment variable*: a named value made available to a running program. For example, it can read `MODEL_API_KEY` without containing the key itself. The agent records a *secret reference*, which identifies the vault item and field holding the key, in the project's settings.[^tk-credentials-reference-file] When the agent starts the script through `op run`, `op` retrieves the referenced key and supplies it under that variable name.

Have the agent save the complete command so later runs use the same credential arrangement. It should tell you if a later run needs renewed sign-in.

![](figures/credential-delivery.svg){#fig-credential-delivery fig-alt="A 1Password vault holds the secret value. A project script reads the named environment variable MODEL_API_KEY without containing the value. op run supplies it to the running process, which authenticates to an approved LLM service account. Research output files do not contain the credential."}

The running program can read or transmit the key it receives. Have the agent apply the access controls in [Chapter 2: Control what added tools can access](#tool-access) to the programs involved. When diagnosing a failure, it should check the required access without printing the key or all environment variables.

## Reuse project settings when useful {#reuse-project-settings}

A saved command using `op run` may be enough. If several project commands need the same settings, the agent can use [`direnv`](https://direnv.net/), a tool that automatically loads environment variables for a project folder. For example, commands that classify abstracts and retry failed classifications may both need the service address and the same credential reference. The key itself remains in the vault.

Have the agent install and configure `direnv` if this would help. Its project file, `.envrc`, contains executable instructions, so the agent should explain what they do before you approve loading them.[^tk-credentials-direnv] Keep secret values out of that file. The agent should confirm that the commands it actually uses receive the intended settings.

## Check access and save the instructions {#check-credential-access}

Ask the agent to classify one permitted abstract through the saved command and confirm that the response reaches the intended results file. It should report which service account was used and whether any access or payment problem occurred. This checks the connection and script; you still assess whether the study-design classifications are suitable for the research.

If the script will run through a job queue, which holds jobs until they can start, have the agent check that route too. A later job may need a sign-in that was available only during the interactive session. The agent should explain and resolve that requirement before submitting unattended work.[^tk-credentials-queued] [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) explains queue setup.

Have the agent save the service access instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). These should record the service and account identifier, credential reference, variable name, saved command, and any personal sign-in required. Have the agent record where the credential tools' settings are stored and how it checked that the saved command works. None of these instructions should contain the key.

::: {#prompt-service-credentials .prompt}
> Set up this project's abstract-classification script to use the chosen LLM service account within the spending limit we agreed. Check the available credential tools and configure `1Password` and `op`, or the established institutional equivalent. Guide any personal steps needed to create, store, or authorize the key without putting it in the conversation. Supply it when the script runs, and keep its value out of source files, logs, and results. Save the command, run it on one permitted abstract, and check the saved classification. Report the account used and any unresolved problem. Save the setup and sign-in instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), without the secret. Use the saved command for later runs.
:::

## Replace an exposed credential {#respond-to-an-exposed-credential}

If a key has been exposed, ask the agent to guide its revocation and replacement through the service that issued it. Complete any required personal account steps there. Deleting the key from the latest script does not remove copies from version history or other systems. The agent can help locate affected files without reproducing the secret, update the credential reference, and check that the script uses the replacement. You decide any further account action or investigation of unauthorized use.

[^tk-credentials-api]: API stands for *application programming interface*: a way for one program to request operations from another. An API key identifies authorized access under a service account; it may permit reading data, making changes, or incurring charges, depending on the service and key settings.

[^tk-credentials-install]: To sign in through the `1Password` desktop app, have the agent configure `op` to use the app and guide any personal authorization. `Homebrew` can install the app on macOS. In WSL2, integration with the Windows app uses the Windows `op.exe`; the agent should follow [1Password's platform-specific setup instructions](https://developer.1password.com/docs/cli/get-started/).

[^tk-credentials-reference-file]: The agent can use an environment file, often ending in `.env`, to associate variable names with secret references. In this arrangement the file holds references, not the key values. `op run` reads the file and supplies the values to the script; see [1Password's environment-variable guidance](https://developer.1password.com/docs/cli/secrets-environment-variables/). Other `.env` files may contain secrets, so the agent should check before sharing one.

[^tk-credentials-direnv]: The agent uses `direnv allow` to approve loading `.envrc`. Where commands do not automatically load the project's settings, `direnv exec` can load them before starting a command. See the [`direnv` manual](https://direnv.net/man/direnv.1.html).

[^tk-credentials-queued]: The submitted job should retrieve the key when it starts. Have the agent check that the queue does not capture a secret value from the submission environment or store one in its command or logs. Personal sign-in during setup does not establish that a later unattended run can authenticate.

# 13. Connect to research data and services: MCP {#service-connections}

Research information often lives inside a reference manager, database, or shared service rather than in the project's files. Giving an agent a supported way to retrieve it can save repeated exports and attachments. The useful connection depends on what the task needs: finding records, reading documents, or making specified changes.

Suppose you keep the papers for a review of exercise and sleep in [`Zotero`](https://www.zotero.org/), a reference manager. They are grouped in a *collection*, a named set of references. The agent needs to retrieve those papers and notes and save a table of relevant findings in the research project. The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) provides a common set of rules through which an agent application can discover and use operations such as searching that collection.

## Choose an access route

An MCP *server* is a program that makes particular operations available to the agent application. It can run on your computer or elsewhere; the name does not mean you need a separate physical computer. For `Zotero`, a suitable server might offer searches and retrieval of reference details or attachments. The available operations depend on that server and its configuration.[^tk-connection-mcp]

A *connector* links an agent to supported operations in another application or service. Some connectors use MCP; others use a different method. The agent may also be able to use an existing command-line tool, a program it operates through commands. An *application programming interface* (API) provides another way for programs to request operations directly.

| What the task needs | A suitable route |
|---|---|
| Read a fixed set of papers once | Saved references and available files may be sufficient. |
| Repeat searches or downloads supported by an existing command-line tool or API | Have the agent use that tool or interface. |
| Search or update application records through tools available in the agent app | Use a connector or MCP server that supports the required operations. |

Ask the agent to check the tools available in the session where you intend to work before adding a connection. The community [`Zotero` MCP project](https://github.com/54yyyu/zotero-mcp) documents both MCP access and a command-line tool, `zotero-cli`, for agents that can run commands. It is one candidate to assess, rather than an official `Zotero` service. Have the agent choose a maintained integration that supplies the needed operations and is permitted for your account and material.[^tk-connection-institution]

## Configure and check the connection {#configure-and-check-the-service-connection}

The agent should follow the chosen integration's setup instructions, install missing components, and configure the connection in the intended agent application. Ask it to identify the account and library, whether the integration runs locally or remotely, and which records it can read or change. A connection configured in another app or session may need to be set up again in the app or session you intend to use.[^tk-connection-config]

You complete any personal sign-in or consent. Some connections provide their own sign-in flow; others need an API key, a credential that grants access under an account. For the latter, [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) explains how the agent can use a key without saving it in project files.

For a task that only retrieves papers, use read-only access where the integration supports it. Asking the agent to use one collection does not necessarily restrict its technical access to that collection. Have it explain the actual limits before you authorize the connection.

Retrieved material may be sent to a hosted large language model (LLM), which runs on the provider's computers. The *provider* is the organization operating that service. Read-only access therefore still requires deciding which material may be sent. Apply [Chapter 3: Know where your data goes](https://iqss.github.io/dss-agentic-research/chapters/research-limits.html) in *Doing Research with AI Agents* and the tool controls in [Chapter 2: Control what added tools can access](#tool-access).

Once connected, have the agent retrieve a known paper from the intended collection. It should compare the title and identifier with the expected record, then read an available attachment or note. This reveals whether it can obtain the material needed for the review, beyond merely finding a reference.

::: {#prompt-connect-library .prompt}
> Set up access to the `Zotero` collection "Exercise and sleep" from this agent session, using a suitable permitted integration. Check existing connections first and install or configure what is missing. Explain the account, library, and records the connection can access, including any ability to make changes. Use read-only permissions where supported and guide any personal sign-in or consent. Retrieve the paper I identify, confirm its title and identifier, and read its available attachment or note. Report what you could access and any missing material. Leave the library unchanged. Save the setup and reconnection instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), without secret values.
:::

## Use the connection for the literature task {#connect-the-literature-task}

With access working, the agent can retrieve the review's papers and notes and assemble an *evidence table*: a table linking each paper to relevant findings or passages and recording what the agent read. For example, it can record the exercise intervention, sleep outcome, and reported finding, with a source location for each. It should distinguish full papers it read, records supported only by an abstract, and papers it could not retrieve.

Have the agent save the table and bibliography in the research project, keeping the `Zotero` library unchanged unless you request an edit. For example, `literature/evidence.csv` can hold the table and `literature/references.bib` the bibliography.[^tk-literature-files] Checking a DOI helps identify a paper; checking whether it supports a claim requires reading the relevant material.[^tk-literature-doi] [Chapter 11: Find and assess research literature](https://iqss.github.io/dss-agentic-research/chapters/literature.html) in the research guide develops that procedure.

::: {#prompt-use-library .prompt}
> Use the configured connection to retrieve papers and notes from the `Zotero` collection "Exercise and sleep" for this review. Follow the agreed research question and inclusion criteria. Save an evidence table linking the relevant findings to source passages, and maintain the project's bibliography. Distinguish full texts you read from abstracts and records without accessible text. Report missing material and unresolved references. Save the outputs in the project's `literature/` folder and report their file paths. Leave the library unchanged unless I request an edit.
:::

A *skill* is a saved set of instructions for a recurring task and its checks. If the review procedure will recur, ask the agent to follow a suitable existing skill or save the agreed procedure as one. The connection supplies access to records, while the procedure tells the agent how to use and assess them. [Chapter 9: Use skills for recurring tasks](https://iqss.github.io/dss-agentic-research/chapters/reusable-procedures.html) in *Doing Research with AI Agents* explains how to find, create, and reuse skills.

![](figures/literature-connection.svg){#fig-literature-connection fig-alt="A skill provides instructions for searching and verifying sources. A research agent sends a search operation through an MCP server to a Zotero collection and receives records and available material. It saves an evidence table and bibliography in the research project's literature folder."}

## Save the setup for later sessions {#keep-the-connection-within-the-task}

Have the agent save the connection details in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). These should identify the integration and version, account and library, available operations, and configuration location, along with any personal sign-in required. Ask it to include the outcome of the retrieval check and instructions for reconnecting or disabling the connection.

Keep the connection's configuration where the agent application expects it. Record the setup and usage instructions in [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), or in [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) such as [`TOOLCHAIN.md`](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions) when they apply across projects. Have it keep those instructions and the agreed literature procedure current.

[^tk-connection-mcp]: MCP standardizes how an application discovers and requests operations from a server. Adding a server makes that server's supported operations available; it does not provide access to every service. See the [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture).

[^tk-connection-institution]: Use connections permitted by your institution for the account and material involved. At Harvard, consult the current [HUIT guidance](https://www.huit.harvard.edu/claude).

[^tk-connection-config]: An agent application's configuration can apply to one project or to several projects. Have the agent choose the intended scope and confirm that the tools appear in the actual session. See [`Claude Code`'s MCP configuration documentation](https://code.claude.com/docs/en/mcp).

[^tk-literature-files]: CSV stands for *comma-separated values*, a plain-text table format. A `.bib` file stores reference details in BibTeX format so document software can generate citations and a reference list. The agent maintains these files; the particular filenames here are examples.

[^tk-literature-doi]: DOI stands for *digital object identifier*, a persistent identifier assigned to a research output. It helps identify the intended work but does not establish that the agent read it or that it supports a particular claim.

# 14. Inspect and interact with a browser {#browser-work}

When an agent builds a research website or a report to read in a browser, it needs to inspect what readers will see and use. A page can contain valid code and still have an unreadable figure, a broken filter, or navigation that disappears on a narrow screen. Browser access lets the agent open the page, try its controls, and use what it finds to improve the work.

Suppose a results page plots population counts by region and lets readers choose a year. Selecting 2024 changes the selection shown, but the plot still displays 2023 results. The agent can investigate using the browser tools already available in its app. Another option is [`Playwright`](https://playwright.dev/), a tool that automates browser actions. After correcting the website code, the agent can reload the page and check that the plotted values and labels match the selected year.

## Set up browser access and choose the account {#choose-the-browser-account}

Ask the agent to check which browser tools it can use in the current session and configure another only if needed. [`Playwright MCP`](https://github.com/microsoft/playwright-mcp) is one option: it makes browser operations available through the Model Context Protocol (MCP), a standard way for an agent application to discover and use tools.[^tk-browser-cli] [Chapter 13: Connect to research data and services: MCP](#service-connections) explains how to choose and configure a connection.

A *browser profile* is a separate set of browser settings and saved login information. Where the integration supports it, have the agent use a separate profile for the task so it does not inherit your everyday signed-in accounts. If the task needs an account, identify which one and complete any personal sign-in yourself. The agent should explain the access it needs before using it.

A page's contents may be sent to a hosted large language model (LLM), which runs on the service provider's computers. Decide which material may be sent using [Chapter 3: Know where your data goes](https://iqss.github.io/dss-agentic-research/chapters/research-limits.html) in *Doing Research with AI Agents*. Have the agent configure the relevant controls from [Chapter 2: Control what added tools can access](#tool-access); a separate browser profile does not itself restrict every website or action. Submitting information or changing an online record should follow your authorization for the task.

## Inspect a research website

For a site under development, have the agent start a *local preview*: the website running on your computer for inspection in a browser. It should confirm that its browser can reach the preview. The site need not be published online for this check.

In the year-selection example, ask the agent to choose 2024, compare the displayed values and labels with the saved 2024 results, and then switch back to 2023. A screenshot can reveal clipped labels or overlapping elements; using the selector reveals whether it changes the plot. Have the agent fix any problems and repeat the affected checks after reloading the page.

::: {#prompt-check-website .prompt}
> Start this project's local website preview and open it using the available browser tools. On the results page, select 2024 and confirm that the plotted values and labels match the saved results for that year. Switch back to 2023 and check again. Try the main navigation and inspect the pages at desktop and narrow phone-sized browser widths. Fix problems and repeat the affected checks after reloading. Report the pages, actions, and widths checked, and show any remaining issue that needs my design decision. Save the preview and checking instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and reuse them after relevant website changes.
:::

The agent should report what it actually checked, including any pages it could not inspect. These checks concern the website's presentation and behavior; you still assess the research choices and interpretation behind its results.

![](figures/browser-research.svg){#fig-browser-research fig-alt="In the first example, a website filter selects 2024 but the plot still shows 2023. The agent fixes the source, reloads and checks that the plot follows the filter. In the second, it inspects a public portal's release selector and download, then preserves the original data, source and release information, and collector script in a collection directory. These are distinct uses of browser access."}

## Collect data through a website

Browser access can also help the agent find data on an unfamiliar website. Suppose you need population counts for every region of a country in 2024 from a public statistics portal. The agent can inspect the release information, check the year and geographic coverage, and locate a download. If a suitable export or API is already known, it can use that directly.[^tk-browser-api]

Ask the agent to use a permitted collection method and confirm what the downloaded file contains. It should check the region identifiers, year, and population measure against the source documentation, compare representative values, and report missing or duplicate regions. A successful download alone does not establish that it contains the requested data.

Have the agent save the original download unchanged, together with its *provenance*: a record of where it came from and how it was obtained. For example, the file can go in `data/raw/` within your project folder, with a source log identifying its address, release, retrieval date, and any selections or requests used. It should also retain earlier releases that support reported results.

If the collection will recur, have the agent turn what it learned into a saved script with explicit inputs and output locations. It may use a direct download, an API, or automated browser actions. The script should respect the service's limits on the number and frequency of requests and report failures, including an unexpected change in the data format or coverage. The research guide's [acquisition guidance](https://iqss.github.io/dss-agentic-research/chapters/data-acquisition.html#acquisition-ladder) explains how to choose a repeatable method.

::: {#prompt-collect-web-data .prompt}
> Obtain the 2024 population counts for every region from the public statistics portal I identified. Use a permitted API or export if available; inspect the website if needed to find the correct release. Confirm the year, geographic coverage, and population measure. Preserve the original download in `data/raw/` and record the source address, release, date, and selections in a source log. Check representative values and missing or duplicate regions. Create a reusable collection script with the year as an input, explicit output locations, the service's request limits, and clear failure reporting. If collection requires multiple requests, check a small retrieval before collecting the full set. Record the command and setup in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and use that script for future updates.
:::

## Save the checks and collection instructions {#save-browser-work-instructions}

For website work, have the agent save the checking instructions in the project context files.[^tk-browser-project-context] These should record how to start and open the preview, which pages and controls to check, and the expected behavior. A recurring check, such as changing the year and verifying the displayed results, can be saved as a browser test that the agent runs after relevant changes.

For data collection, have the agent record the source, collection command, inputs, and output locations in the project context files.[^tk-browser-project-context] The instructions should cover any personal sign-in, request limits, and what to do if collection fails. Have it record the browser or collection software and its version, with the configuration needed to run it again. Ask the agent to maintain these instructions and the source log as the collection changes; the research guide's [data-provenance section](https://iqss.github.io/dss-agentic-research/chapters/data-acquisition.html#data-provenance) explains the retained records in more detail.

[^tk-browser-cli]: Playwright also provides a [command-line tool](https://github.com/microsoft/playwright-cli) that an agent can use to control a browser without an MCP connection.

[^tk-browser-project-context]: Project context files hold a project's instructions and records for the agent to use across sessions. See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) in *Doing Research with AI Agents*.

[^tk-browser-api]: API stands for *application programming interface*, a way for a program to request data or operations directly. An export supplies a downloadable file, such as CSV (comma-separated values), a plain-text table format. If access requires an API key, use [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) to keep it separate from collection code and saved request records.

<!-- ===================== PART V — RUN AND COORDINATE AGENTS ===================== -->

# 15. Divide work between agents: shared projects and git worktrees {#parallel-work}

Several agents can develop different parts of a research project at the same time. This helps when each task can make progress without waiting for the others. For a small change involving the same few files, one agent may finish sooner because there is less work to coordinate.

Suppose an analysis needs new modeling code and figures. The agent in your current conversation can coordinate two others: an analysis agent to write the modeling code and a figure agent to develop the plots. It establishes the format of the results they will exchange, assigns their files, and later combines and checks their work. You continue to direct the work through that coordinating agent.

## Assign tasks and agree on exchanged results {#assign-tasks-and-interfaces}

A *subagent* is another agent given a separate assignment by a coordinating agent. [`Claude Code` supports subagents](https://code.claude.com/docs/en/sub-agents); other applications may offer different ways to delegate work.

::: {#agent-execution-terms style="scroll-margin-top: 9rem;"}

The following terms describe different aspects of how agents work:

| Term | What it describes |
|------------------------|---------------------------------------------------------------------|
| Subagent | Delegation within the coordinating agent's session. The worker has its own context (the information supplied for its work) and returns results to the coordinator. |
| Headless session | How a run receives instructions: a program supplies its prompt and inputs, without an interactive conversation. |
| Background execution | Work continues while the main conversation remains available. This can involve a subagent or a separate agent session. |

These terms can overlap: a subagent can run in the background, and a headless session can itself delegate to subagents.[^tk-agent-execution]

:::

Ask the coordinating agent to delegate the tasks to subagents where supported. If separate runs are needed, have it prepare and launch headless sessions and collect their results. [Chapter 16: Run agents from saved prompts](#control-what-each-run-receives) explains how to configure those runs and control what each receives. Each assignment should identify the task, inputs, expected outputs, and files that agent may change.

In the analysis-and-figure example, both agents need to know what the saved estimates will contain. The coordinator might specify an `estimates.csv` file with a row for each quantity to plot and columns for its name, estimate, and lower and upper uncertainty limits. It should also specify the units and meaning of those limits. The figure agent can develop its plotting code using a clearly labeled synthetic example of this file while the analysis agent builds the code that produces the actual estimates.

Shared files need an assigned maintainer. Have the coordinator handle changes to functions used by both tasks, software requirements, and commands that connect the analysis to the figures. It also coordinates changes to version history so one agent does not remove work another is using.

::: {#prompt-coordinate-agents .prompt}
> Coordinate an analysis agent and a figure agent for this project. The figure agent will write plotting code that reads results saved by the analysis agent. Before they start, specify the contents and layout of that results file, including the estimates, their units, and the lower and upper uncertainty limits. Give each agent its inputs, expected outputs, and files to edit. Let the figure agent develop against a labeled synthetic example while the analysis code is being built. Coordinate shared files and preserve existing edits. When both agents finish, combine their work and run the analysis followed by the figures using the newly produced estimates. Report any research decisions that need my input.
:::

## Choose shared or separate working copies

Agents editing different files can often share one project directory. [`Git` worktrees](https://git-scm.com/docs/git-worktree) provide separate working copies attached to the same *repository*, the project's stored version history. Each worktree usually uses a different *branch*, allowing changes to be developed separately and combined later.[^tk-parallel-branch] Worktrees help when agents need to edit overlapping files or test different versions of the code.

| Arrangement | Useful when | What the coordinating agent manages |
|------------------------|----------------------------------|--------------------------------------------|
| One project directory | The tasks edit different files and can share current results | Shared files, output names, and changes to version history |
| Separate worktrees | The tasks need overlapping edits or different versions | Inputs and software in each copy, separate outputs, and combining the changes |

Have the coordinating agent choose and prepare the arrangement. A new worktree may lack data excluded from version control, installed packages, or saved model fits. The agent should supply the permitted inputs and restore the recorded software environment before work begins. Separate output locations prevent one run from replacing another's results. Worktrees share repository history and do not restrict access to other files or services.

![](figures/agent-coordination.svg){#fig-agent-coordination fig-alt="Three agents collaborate: the coordinating agent in the main session launches an analysis agent and a figure agent. The workers develop complementary code, either in different files in one project folder or in separate Git worktrees with shared history. The coordinating agent then integrates their changes and runs an analysis-to-figure check. The repeated coordinator icon and label refer to the same main-session agent."}

## Combine and check the work {#integrate-the-work}

Once both tasks are complete, the coordinating agent combines their changes and runs the analysis followed by the plotting code. In this example, it should confirm that the figure reads the newly produced `estimates.csv`, includes the intended quantities and uncertainty limits, and no longer uses the synthetic example. This can expose mismatches that neither worker would find alone, such as a renamed column or an estimate reported in different units.

Have the coordinator fix implementation problems and report scientific choices that require your decision. It should document the results format, relevant files, and commands in the project context files[^tk-coordination-project-context] so a later session can repeat the combined workflow. After an approved scientific change, it updates the current requirements in [`SPECIFICATION.md`](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and adds the dated decision and reason to [`METHODOLOGY.md`](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). Before removing a worktree, it should confirm that the needed code and outputs have been retained.

These agents collaborate on one implementation. An independent-implementation check instead asks separate agents to build from the same fixed specification and inputs without seeing one another's code or results. [Chapter 15: Check the agent with independent implementations](https://iqss.github.io/dss-agentic-research/chapters/checking-analysis.html) in the companion guide *Doing Research with AI Agents* explains that different purpose. A worktree alone does not provide the required separation; [Chapter 16: Run agents from saved prompts](#control-what-each-run-receives) explains how to configure and check what a separate session receives.

[^tk-agent-execution]: The `Claude Code` documentation describes [foreground and background subagents](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background), [separate background sessions](https://code.claude.com/docs/en/agent-view), and [headless runs](https://code.claude.com/docs/en/headless).

[^tk-coordination-project-context]: See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) in *Doing Research with AI Agents*.

[^tk-parallel-branch]: A *branch* names a line of work within a repository's version history. The agent can develop changes on separate branches and combine them when ready; see the [`Git` branching introduction](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell).

# 16. Run agents from saved prompts {#headless-agents}

Does a paper draw conclusions that go beyond what its results show? For one manuscript, you can ask an agent to read it and point to any claims it finds weakly supported. To ask the same question across a collection of manuscripts, you can have the agent set up a command that starts a fresh session for each paper, supplies the same review prompt, and saves each review with the paper’s identifier. Running an agent this way, with a program supplying the prompt and collecting the response, is called *headless execution*.[^tk-headless-execution-terms]

Suppose you want to know whether AI and human reviewers independently notice the same weaknesses in a paper’s evidence. A human reviewer might question a conclusion because many participants dropped out of the study. If the AI reviewer reads that comment first, you can no longer tell whether it would have raised the issue on its own. The [`Claude Code` command `claude -p`](https://code.claude.com/docs/en/headless) launches a headless agent to carry out a review. For this example study, ask the agent you’re working with to give each headless session the review instructions and one manuscript. The human reviews stay separate until you’re ready to compare them with the AI reviews.

[]{#define-the-check-and-its-report}

## Define one review {#turn-the-task-into-a-saved-workflow}

Ask each AI reviewer to identify the paper’s main claim, assess how well the evidence supports it, and point to the passage, table, or figure behind its assessment. This gives you a specific criticism to compare with a human reviewer’s, even when the two use different words.[^tk-review-comparison] Have the agent save the agreed wording as the review prompt. If you already have a *skill*, a reusable set of instructions for this task, each session can use it.[^tk-headless-skill]

[^tk-review-comparison]: Liang and colleagues (2024) compared the points GPT-4 raised about manuscripts with those raised by human reviewers. They also measured how often two human reviewers raised the same points, giving readers a reference for interpreting the overlap. [“Can Large Language Models Provide Useful Feedback on Research Papers?”](https://doi.org/10.1056/AIoa2400196)

Have the agent create a command that starts one review session, gives it the saved prompt and one manuscript, and collects its response. The command saves the review under the manuscript’s identifier, for example as `A/review.md` for manuscript A. The agent can then run the same command for each manuscript on your list.[^tk-headless-command]

## Choose what each session can see {#control-what-each-run-receives}

A headless run can start a new conversation or continue an earlier one. Starting fresh for each paper keeps the previous conversation out of the review. A new session could still read another reviewer’s comments if its tools let it open the folder where those comments are saved.

Because the reviewer receives the manuscript directly, have the agent disable the tools it could use to open other files or search the web. Apply the same settings to every review. Also have the agent check which instructions or saved memories load automatically. These can become part of the *context*, the information supplied to the large language model (LLM) as it produces a response.[^tk-headless-context-files] The command that launches the session collects and saves the review.

![](figures/headless-manuscript-reviews.svg){#fig-headless-research fig-alt="Three review sessions use the same saved prompt and tools. Each receives only its assigned manuscript, A, B, or C, and returns a review under the matching identifier. The collected AI reviews and the separately held human reviews come together for comparison after the sessions finish."}

If the `claude` command is missing on the computer where the reviews will run, the agent can install it as described in [Chapter 18: Use an agent from the terminal: Claude Code](#start-a-conversation-with-the-agent). Have the agent confirm that it can run the reviews under your intended account and guide you through sign-in if needed.

<details class="guide-example">
<summary>Claude Code settings for unattended runs</summary>

An unattended session needs a way to handle an action that would normally ask for your approval. The [`dontAsk` permission mode](https://code.claude.com/docs/en/permissions) generally denies such actions. Have the agent report when a restriction prevents a review. The [`--bare` option](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode) skips most automatically loaded instructions and extensions, including skills it would normally discover. It uses separate service credentials.[^tk-headless-credentials] If the agent selects this option, have it supply the review instructions explicitly and check which files the available tools can read.

</details>

## Test two manuscripts, then run the collection {#test-and-run-the-workflow}

Before reviewing the collection, have the agent perform a *smoke test*, a small trial using the actual review command, account, and tools.[^tk-headless-smoke] Two short mock manuscripts on different subjects, such as street trees and seed growth, make it easy to spot a mix-up. The agent should check that each review discusses its assigned paper and that saving the second review leaves the first intact.

Test file access through the same headless setup. For example, the agent can place a harmless file beside the second mock manuscript and have the first session try to read it. Ask for the result of the attempted read. If it succeeds, have the agent correct the permissions and repeat the test before using the study manuscripts. [Chapter 2: Control what added tools can access](#tool-access) explains how to check the tools the task will use.

The following prompt asks the agent to set up the workflow. The saved review prompt is what each new session receives.

::: {#prompt-headless-archive .prompt}
> Set up a headless workflow to review this collection of manuscripts. Give each fresh session my review prompt and one manuscript directly. Disable the tools it could use to open other files or search the web. Save each review under the manuscript’s identifier. Keep earlier AI reviews and the human reviews out of reach. Test the workflow on two mock manuscripts, check what each session can open, and show me both reviews before running the collection. Flag any manuscript that fails to produce a complete review.
:::

Read the two trial reviews. Can you tell which claim each reviewer assessed and what evidence it used? If either review is too general to compare with a human review, revise the prompt and have the agent repeat the trial.

For a large collection, the agent can queue the review jobs and limit how many run at once, as described in [Chapter 9: Keep unattended jobs moving: pueue](#job-queues).

## Account for every manuscript {#record-each-case}

When the sessions finish, have the agent match the saved reviews to your manuscript list and flag missing, incomplete, or duplicate reviews. A session might return a message saying it could not read the manuscript file. Saving that message tells you what went wrong, but the paper still needs a review.

| [When to record it]{.text-nowrap} | What the agent keeps |
|----------------------------|----------------------------------------------------------|
| Once for the collection | The agreed review prompt, launch command, agent software version, LLM identifier, settings, and tools used across sessions. |
| For each attempt | The manuscript identifier and version, the original response if one was returned, and whether the review was completed. For a repeat attempt, also record the reason. |

If a session needs another attempt, have the agent diagnose the failure and save the new response separately. You can then apply the study’s criteria to decide which reviews to include and match the AI and human reviews by manuscript.

[^tk-headless-execution-terms]: [Chapter 15: Divide work between agents: shared projects and git worktrees](#agent-execution-terms) compares headless sessions, subagents, and background execution.

[^tk-headless-skill]: See [Chapter 9: Use skills for recurring tasks](https://iqss.github.io/dss-agentic-research/chapters/reusable-procedures.html) in the companion guide *Doing Research with AI Agents*.

[^tk-headless-command]: If the project uses [`just`](https://just.systems/), the agent can give the review command a short name. See [Chapter 7: Give research tasks reliable commands: just](#project-commands).

[^tk-headless-context-files]: Automatically loaded instructions can include project context files and global user instructions. See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) in *Doing Research with AI Agents*.

[^tk-headless-credentials]: A credential establishes access to an account. See [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) for supplying credentials to saved commands.

[^tk-headless-smoke]: See [“Run a smoke test” in Chapter 7](#smoke-tests) for a worked example using a few simulation repetitions.

# 17. Run and adapt an LLM on your own hardware {#local-models}

You can run a large language model (LLM) on your own computer. A study’s data use agreement may allow you to analyze sensitive interview transcripts on your computer but prohibit sending them to an external AI service. An agent can help you choose and set up a local LLM so you can analyze the transcripts where they’re stored.

Suppose you’re using those transcripts to study why people miss medical appointments. The agent can set up a script that gives the local LLM one excerpt at a time and asks it to identify the barrier the participant describes. If a participant says, “I had no way to get to the clinic once they cut the bus route,” the LLM might assign the label `transport` and quote “they cut the bus route” to support its choice. Comparing the LLM’s labels with those assigned by human reviewers on the same excerpts helps you decide whether an existing LLM does the job well enough or whether further training is worth trying.

## Label an excerpt on your computer {#decide-how-the-research-task-will-use-the-llm}

For each excerpt, the script passes the interview text and your category definitions to the software running the LLM on your computer. This software is called a *runtime*. The LLM uses those definitions to generate a response, a process called *inference*.[^tk-local-inference] The script saves the label and supporting passage with the excerpt’s identifier so you can trace each answer back to the interview.

An agent that uses a hosted LLM, one running on a provider’s computers, can still write and test this script. Give it synthetic interview excerpts and keep the study transcripts outside its reach. Before using those transcripts, have the agent demonstrate with the synthetic excerpts that the script sends the text to the local LLM and saves the responses and any logs containing interview text on your computer.

## Choose hardware and a runtime

Have the agent check your computer’s memory, processing hardware, and storage before choosing an LLM. Even if the LLM fits on disk, your computer may run out of memory when it processes a long excerpt. The agent may suggest a smaller version to try.[^tk-local-quantization] Evaluate the version you expect to use for the study.

To set up the LLM, the agent can install a runtime such as [`Ollama`](https://docs.ollama.com/quickstart) and download a compatible *open-weights* LLM. An open-weights LLM makes its *weights*, the numerical values learned during training, available for download. The runtime uses those weights to run the LLM on your computer. Have the agent check that the license permits the study’s use.

With `Ollama`, have the agent enable the [local-only setting](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features) and verify that the script sends test excerpts to the LLM on your computer. Have the agent also confirm that the [network settings](https://docs.ollama.com/faq#how-can-i-expose-ollama-on-my-network) allow only programs on your computer to connect directly to `Ollama`.

If your computer has too little memory for a suitable LLM, your institution may offer an LLM service approved for the study transcripts. In that case, the agent can connect the script to the service using the institution’s approved method. The companion guide *Doing Research with AI Agents* discusses [when local LLMs are useful](https://iqss.github.io/dss-agentic-research/chapters/research-models.html#local-models).

::: {#apple-on-device}
<details class="guide-example">
<summary>Apple's on-device LLM</summary>

On a compatible Mac, the agent can check whether Apple’s built-in LLM can extract the fields the study needs. Apple documents access from a script through its [`Foundation Models Python SDK`](https://github.com/apple/python-apple-fm-sdk) and from the terminal[^tk-local-terminal] through the [`fm` command](https://developer.apple.com/videos/play/wwdc2026/334/). Have the agent verify that the chosen method processes the excerpts on the device and record the system and software versions used in the trial.

</details>

:::

## Check how well the LLM labels a sample of excerpts {#run-the-research-task}

Have the agent save a command that runs the labeling script. If the project uses a command runner such as [`just`](https://just.systems/)[^tk-local-commands], the agent could name the command `just label-excerpts`. Ask it to test the actual command with permitted excerpts spanning the lengths you expect. For the longest ones, check that the runtime received the full text and had room to generate an answer.[^tk-local-context] If an excerpt is too long, the agent should flag it so you can decide how to handle it.

Have the script save the original response for each excerpt and record any failed or repeated attempt. It can check that the label is one of the study’s categories and that the quoted passage occurs in the excerpt. The LLM can choose a label from the study’s list and quote the participant’s exact words, yet still misidentify why the participant missed the appointment.

Suppose a synthetic interview excerpt reads, “The bus was running, but I couldn’t afford the clinic fee.” The LLM could assign `transport` and quote “The bus was running” exactly. A human reviewer might assign `cost` because the fee kept the interviewee from attending.

To see how often this happens, have the agent run the script on excerpts that people have already labeled, keeping their labels out of the prompt. For each disagreement, the script should show both labels and the quoted passage on your computer. You can then judge whether the labels are accurate enough for the study. The companion guide explains [how to evaluate LLM labeling](https://iqss.github.io/dss-agentic-research/chapters/llm-measurements.html#evaluate-llm-labeling).

::: {#prompt-local-labeling .prompt}
> Set up a command that uses an LLM running on my computer to label interview excerpts. Use synthetic excerpts to check where the text goes and whether the longest expected excerpt fits. Have the script save each excerpt’s identifier, original response, label, and supporting passage. Flag missing or invalid answers. Once I approve the setup, run the command on the human-labeled examples, keeping the human labels out of the prompt. Save the disagreements on my computer so I can inspect them before we label the full collection.
:::

If the labels meet the study’s criteria, the agent can label the remaining excerpts with the same LLM, prompt, and settings. Have it record the runtime version and the exact LLM version used in the trial[^tk-local-version] and keep the command and output locations in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) so the analysis can be repeated. A script and a runtime are sufficient for this workflow.

## Connect the LLM to an agent

Suppose several excerpts produce empty responses. You want an agent to read an affected excerpt, check the corresponding error log, and decide what to inspect next. An agent that uses the local LLM can examine both files on your computer. Its *software harness* runs the tools the LLM requests and returns the results to it. Those results become part of its *context*, the information the LLM receives when producing its next response.

![](figures/local-llm-execution.svg){#fig-local-llm-execution fig-alt="Two separate examples use a local LLM. In one, a script sends an interview excerpt to the LLM and saves the returned label and quotation with the excerpt ID. In the other, the LLM asks the agent to read an error log, then uses the returned message to decide what to check next."}

For example, [`Claude Code` can connect to `Ollama`](https://docs.ollama.com/integrations/claude-code). `Claude Code` runs the tools, and a compatible local LLM supplies the responses. Ask the agent helping with setup to configure a separate launch command so you can still use the hosted service for other work. Have it test the local agent by asking it to read a synthetic file, then report which runtime received the request, which tool ran, and what text it returned. If you’ll use this local agent across projects, have the agent record its launch command and where it is configured in the global user instructions file `TOOLCHAIN.md`.[^tk-local-toolchain]

A tool available to the local agent could still send interview text to an external service. Before allowing it to inspect study files, have the agent check its file and network access as described in [Chapter 2: Control what added tools can access](#tool-access).

## When further training might help {#adapt-a-model-when-the-study-calls-for-it}

Suppose the local LLM repeatedly confuses cost and transport, even after you clarify the category definitions and give it examples. You could train it on excerpts with reviewed labels to see whether it improves. This further training is called *fine-tuning*. One method, *low-rank adaptation* (LoRA), keeps the weights of the original LLM (the *base LLM*) fixed. During training, the software adjusts a small set of additional weights to make the human reviewers’ labels more likely for the training excerpts. These learned weights form an *adapter*. When the agent loads the adapter alongside the original LLM, it changes how likely the LLM is to assign labels such as `cost` and `transport` to new excerpts. Keep the original LLM and its prompt so you can later compare the labels with and without the adapter.

Reserve a set of human-labeled excerpts that no one has used to refine the prompt. These are the *held-out* excerpts for the final comparison. From the remaining examples, the agent uses one set to train the adapter and a separate *development set* to help you choose which version to keep.[^tk-local-training-split] The training files, logs, and adapter can retain information from the interviews, so keep them in storage approved for the study.

<details class="guide-example">
<summary>Training tools for different computers</summary>

Training can require more memory than labeling. Have the agent check the available hardware and record the software it installs as described in [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments).

| Where training runs | Candidate tool | What the agent checks |
|-------------------------|--------------------|--------------------------------------------------|
| Apple silicon Mac | [`MLX LM`](https://github.com/ml-explore/mlx-lm) | Support for the base LLM, available memory, and the format of the training examples.[^tk-local-training-format] |
| A computer using [`PyTorch`](https://pytorch.org/) | [`Hugging Face PEFT`](https://huggingface.co/docs/peft/main/en/quicktour) | Support for the adapter method, the selected LLM, and the available hardware. |
| An institutional training service | The service’s approved tools | Where the service can read and save study files and whether training jobs must be submitted through its job scheduler. |

</details>

### Save and reload the adapter {#save-reload-and-evaluate-the-adapted-llm}

Before a long training run, have the agent fit and save an adapter using a small training sample. To use it later, the labeling script needs the adapter, the compatible base LLM, and its *tokenizer*, the software that divides text into the units the LLM processes. Have the agent save a command that runs the labeling script with the original LLM and the trained adapter. After the training session ends, have the agent use that command to label another excerpt and confirm that the script can reload the adapter.[^tk-local-reload]

![](figures/llm-adaptation.svg){#fig-llm-adaptation fig-alt="The original base weights and tokenizer remain unchanged. After training, the agent retains adapter weights and configuration. The agent reloads the adapter with the compatible base LLM and compares this configuration with the unadapted baseline on the same held-out cases, using selected prompts and recorded generation settings. Both response files retain case identifiers for scoring against human reference labels."}

For a long run, have the agent check whether the training software can save a *checkpoint*, the state it needs to continue interrupted training. If so, ask it to test restarting from one. [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) explains how the agent can queue a job on your own computer.

::: {#prompt-adapt-llm .prompt}
> Test whether further training helps distinguish cost from transport in the interview excerpts. Keep the original LLM and prompt for comparison. Use separate excerpts for training, choosing an adapter, and the final test. Show that the labeling script can reload the adapter from a short run. Compare the selected adapter and the original LLM on the same held-out excerpts. Show me which errors training corrected and which it introduced.
:::

For the final comparison, use the adapter in the runtime and format that will produce the study labels. Have the agent match both sets of responses to the human labels by excerpt identifier. Did training reduce confusion between cost and transport? Did it introduce errors in other categories? You can weigh those results against the cost of further training and decide which version to use for the collection. The research guide discusses [how to evaluate an adapted LLM](https://iqss.github.io/dss-agentic-research/chapters/research-models.html#evaluate-adapted-model).

[^tk-local-inference]: In LLM inference, the trained LLM generates a response one *token* at a time. A token can be a word or part of a word. Statistical inference concerns what data can tell us about a population or effect. See the research guide’s [explanation of LLM inference](https://iqss.github.io/dss-agentic-research/chapters/llm-measurements.html#define-the-output-and-its-research-meaning).

[^tk-local-quantization]: One way to reduce memory use is *quantization*, which stores weights at lower numerical precision. This can change the responses, so include the chosen version in the labeling trial. See the [`Hugging Face` explanation of quantization](https://huggingface.co/docs/optimum/en/concept_guides/quantization).

[^tk-local-terminal]: A terminal is a window where you can type commands and read their output. See [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents).

[^tk-local-commands]: [Chapter 7: Give research tasks reliable commands: just](#project-commands) explains how the agent sets up a named command. In *Doing Research with AI Agents*, [Chapter 13: Build a modular analysis workflow](https://iqss.github.io/dss-agentic-research/chapters/research-workflows.html#saved-commands) shows how to use saved commands to run individual steps of an analysis.

[^tk-local-context]: The *context capacity* is the amount of text that can fit in one request and its response together, measured in units called *tokens*. The runtime can have a lower limit than the LLM supports. Have the agent test the limit with the study’s instructions and longest excerpts.

[^tk-local-toolchain]: For the global user instructions file `TOOLCHAIN.md`, see [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents*.

[^tk-local-version]: In `Ollama`, a *tag* such as `latest` can refer to a different LLM version over time. Have the agent save the *digest*, the identifier for the exact version that passed the labeling trial. Comparing digests lets the agent check that the full run uses that same version. See [`Ollama`’s model-list documentation](https://docs.ollama.com/api/tags).

[^tk-local-training-split]: For a worked example of how to divide interview excerpts into training, development, and held-out test sets, see [Chapter 16: Use LLM outputs as research data](https://iqss.github.io/dss-agentic-research/chapters/llm-measurements.html#evaluate-llm-labeling) in *Doing Research with AI Agents*.

[^tk-local-training-format]: For example, `MLX LM` accepts JSON Lines, a text format with one structured record per line. Each training record can pair a prompt with its reviewed response. See the [`MLX LM` data formats](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md#data).

[^tk-local-reload]: The [`MLX LM` adaptation guide](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md) and [`Hugging Face PEFT` quicktour](https://huggingface.co/docs/peft/main/en/quicktour) describe saving adapters and loading them with compatible base LLMs.


<!-- ===================== PART VI — WORK FROM THE TERMINAL ===================== -->

# 18. Use an agent from the terminal: Claude Code {#terminal-agents}

A *terminal* is a window where you can give a computer typed commands and read their output. Commands can start programs, list files, or run an analysis. You can also start an AI agent there and converse with it in ordinary language. Some researchers prefer a terminal workspace because they can arrange conversations, project commands, and output in tabs or panes. The Claude desktop app also includes a terminal; you can choose the arrangement that suits your work.

A terminal can also connect you to another computer. For example, a university may offer access to more powerful computers for an analysis, such as Harvard's [Cannon computing cluster](https://docs.rc.fas.harvard.edu/kb/iqss-cannon-quickstart-guide/).[^tk-terminal-cluster] The walkthrough below uses your own computer: you will ask the agent to regenerate a figure and prepare a saved command that you can use to repeat the task.

## Open the project in a terminal

Inside a terminal, a *shell* is the program that reads commands and starts other programs. The *shell prompt* is the text showing that the shell is ready for a command. It may look different on each computer and is separate from a written prompt you give the agent.

On a Mac, you can open `Terminal` through Spotlight. On Windows, this guide uses [`WSL2`](https://learn.microsoft.com/windows/wsl/), which provides a Linux environment on your computer, and Ubuntu, a version of Linux, within it. [`Windows Terminal`](https://learn.microsoft.com/windows/terminal/) provides the window in which to open Ubuntu. Ask the agent in the desktop app to help you identify or set up the terminal you will use.

Before starting, ask the agent in the app to check whether the `claude` command is available in that terminal, install it if needed, and give you the command for opening your project folder. The desktop app and the terminal command are separate ways to use `Claude Code`; installing the app does not guarantee that the command is available. The agent can guide any personal sign-in needed for the command-line version.[^tk-terminal-cli]

The shell's *working directory* is its current folder. To select the project, enter the `cd` command supplied by the agent at the shell prompt. On a Mac, it might look like this, with your own project path in place of the example:

```text
cd "/Users/your-name/Research/my-project"
```

The quotes keep a path containing spaces together. Then enter `pwd` to display the current folder and check that it is the project you intended. [Appendix E: Terminal vocabulary](#terminal-history) explains paths and related terms.

## Start a conversation with the agent

At the shell prompt in your project folder, enter:

```text
claude
```

This starts [`Claude Code`](https://code.claude.com/docs/en/overview) in the terminal. Your typed instructions now go to the agent rather than the shell. For a project with saved statistical estimates and a main results figure, you might ask:

::: {#prompt-terminal-figure .prompt}
> Regenerate the main results figure from the saved estimates. Prepare and check a `just figures` command that repeats this task. Report the estimates file and the path to the figure produced.
:::

The agent can read the project context files[^tk-terminal-project-context] and use its permitted tools to carry out the task. It can prepare the saved command using [`just`](https://just.systems/), the command runner described in [Chapter 7: Give research tasks reliable commands: just](#project-commands). Check its report for the estimates file and figure location.

Starting in a project folder does not by itself restrict every file the agent can access; [Chapter 2: Control what added tools can access](#tool-access) explains the controls. A hosted large language model (LLM) runs on the provider's computers, so information supplied to it is sent there even when you use a terminal on your own computer.

## Find session controls

While `Claude Code` is running, type `/` to see its available controls. These *slash commands* control the agent application; they are entered in the conversation, not at the shell prompt. Availability varies by version, account, and environment; the [command reference](https://code.claude.com/docs/en/commands) gives details.

*Context* is the information supplied to the LLM for its next response. The controls below include ways to inspect that information and manage a long conversation.

| Control | What it does |
|------------------------------|----------------------------------------------------------------------|
| `/model`, `/effort` | Select an available LLM and its reasoning effort. |
| `/context` | Show how much of the session's context capacity is in use. |
| `/compact` | Summarize conversation history to reduce the space it occupies. |
| `/usage` | Show account-usage information available for your plan. |
| `/exit` | Leave the agent and return to the shell. |

Compaction replaces some conversation history with a summary, which can omit details.[^tk-terminal-controls] Before leaving, have the agent record current work and decisions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). Ending the session does not necessarily delete its conversation: to choose an earlier conversation later, enter `claude -r` at the shell prompt.

## Run a saved command

When you are ready to leave the agent, enter `/exit` in the conversation. The shell prompt returns, ready for another command. You can ask the agent to run the prepared task in a later conversation, or run it yourself when you want to repeat the same task directly.

`just` stores each named task as a *recipe* in the project's `justfile`. Once the agent has prepared and checked the recipe, enter the following at the shell prompt to regenerate the figure:

```text
just figures
```

Here, `just figures` runs the saved plotting code with the saved estimates; it does not ask an LLM to reconstruct the analysis. Look for the figure at the location the agent reported. If a command fails, give the agent the message and ask it to investigate.[^tk-terminal-missing-command]

To see the other saved tasks available in the project, enter:

```text
just --list
```

The diagram below shows the change in who receives your input. The `%` is an example shell prompt; you do not type it. Your own shell prompt may look different.

![](figures/terminal-agent.svg){#fig-terminal-agent fig-alt="Three states of the same terminal: a shell starts Claude Code; the researcher asks the agent to regenerate a figure and prepare a checked command, then exits; the shell runs the saved just figures command directly."}

To arrange terminal tabs and panes for your work, see [Appendix A: Tools for customizing your terminal](#working-environment). For unattended research jobs, see [Chapter 9: Keep unattended jobs moving: pueue](#job-queues); for agent runs started from saved prompts, see [Chapter 16: Run agents from saved prompts](#headless-agents).

[^tk-terminal-cluster]: A computing cluster is a group of computers available for research work. Follow the institution's guidance for connecting, using agents, and submitting analyses; Harvard's [FAS Research Computing AI guidance](https://docs.rc.fas.harvard.edu/kb/fasrc-ai-facilitation/) describes requirements for its clusters.

[^tk-terminal-cli]: A *command-line interface* lets you start and control a program by typing commands. See the [Claude Code quickstart](https://code.claude.com/docs/en/quickstart) for installation and sign-in.

[^tk-terminal-missing-command]: If the shell reports “command not found,” have the agent check whether the program is installed and available in that shell. [Chapter 3: Install and manage tools with Homebrew](#adding-tools) explains installation.

[^tk-terminal-project-context]: For project context files, see [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) in *Doing Research with AI Agents*.

[^tk-terminal-controls]: [Chapter 5: Choose settings for the task](https://iqss.github.io/dss-agentic-research/chapters/directing-work.html#usage-and-context) in *Doing Research with AI Agents* explains account-usage limits, the context window, and compaction.

<!-- ===================== REFERENCE ===================== -->


# Appendix A. Tools for customizing your terminal {#working-environment}

The terminal can serve as a workspace for directing an agent while keeping research tasks in view. For example, you can discuss the next task while monitoring a long analysis, with other projects organized in separate tabs. Customizing the layout and status information makes those activities easier to follow and return to. Several tools contribute to this setup, from the application displaying the window to the information shown before each command.

This appendix explains those components and recommends a primary tool and an alternative for each. Have the agent adapt the tools and settings already on your computer, adding what serves your work. [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents) explains starting and using the agent; the additions here customize that working environment.

| Component | What it provides | Primary choice | An alternative |
|--------------------|--------------------------------------|----------------------|--------------------|
| Terminal emulator | The application displaying terminal sessions, with fonts, colors, tabs and shortcuts. | [`iTerm2`](https://iterm2.com/) | [`Ghostty`](https://ghostty.org/) |
| Shell | The program interpreting commands and starting other programs. | [`zsh`](https://www.zsh.org/) | [`Bash`](https://www.gnu.org/software/bash/) |
| Shell framework / plugin manager | Tools for configuring the shell and loading extensions. | [`Oh My Zsh`](https://ohmyz.sh/) | [`antidote`](https://antidote.sh/) |
| Prompt theme | The information and appearance of the shell's prompt. | [`Powerlevel10k`{style="white-space: nowrap;"}](https://github.com/romkatv/powerlevel10k) | [`Oh My Posh`](https://ohmyposh.dev/) |
| Multiplexer | Several terminal panes and tabs organized into named sessions. | [`Zellij`](https://zellij.dev/) | [`tmux`](https://github.com/tmux/tmux/wiki) |

## Terminal emulator: iTerm2 {#make-the-current-work-visible}

A *terminal emulator* is the application providing the terminal window. `iTerm2` is the recommended choice on macOS: it supports tabs, split panes and searching previous output. A *pane* is a separate area of the window. Ask the agent to set a comfortable font size and contrasting text and background colors, and show you the shortcuts for opening a tab and moving between projects. It can save related appearance and startup settings in a *profile*.

`Ghostty` is an alternative for macOS or Linux, with settings maintained in a text file that the agent can edit. On Windows, use [`Windows Terminal`](https://learn.microsoft.com/windows/terminal/) to open Ubuntu as described in [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents). The remaining tools are configured inside that environment.

## Shell: zsh

The shell interprets commands such as `claude` or `just figures` and starts the corresponding programs. `zsh` is the recommended shell for using the terminal and the [default shell on macOS](https://support.apple.com/guide/terminal/change-the-default-shell-trml113/mac), so you may already be using it. Its command history and completion can reduce typing: for example, completion can fill in a long project-folder name. Have the agent check the existing shell and configure the intended one to start in new terminal sessions.

`Bash` is a useful alternative when it is already part of a working setup, particularly on a shared computer. Using `zsh` in the terminal does not mean every saved script must use it. The agent should preserve each script's requirements. The `Oh My Zsh`, `antidote` and `Powerlevel10k` choices below are for `zsh`, so a `Bash` setup needs its own configuration.

## Shell framework: Oh My Zsh

A *shell framework* organizes configuration and extensions called *plugins*. `Oh My Zsh` supplies plugins and a common way to load them. For example, its [`Git` plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git) adds short commands for common version-control operations. Ask the agent to configure the plugins useful to your work and explain any shortcuts it adds. It should preserve existing setup in `.zshrc`, the file `zsh` reads when starting a shell for entering commands.[^tk-terminal-config-files]

`antidote` is a lighter alternative focused on loading a selected list of plugins. It can load plugins from `Oh My Zsh` without enabling the whole framework. Have the agent use one consistent loading arrangement and check a newly opened shell for errors or unexpected delays.

## Prompt theme: Powerlevel10k

The *shell prompt* marks where the shell is ready for a command. A prompt theme changes its appearance and the information it displays. `Powerlevel10k` can show the current folder, the active software environment, and whether the previous command failed.[^tk-powerlevel-support] If the project uses `Git`, it can also show the branch, the named line of work in version history. These cues help distinguish projects that are open at the same time.

Have the agent configure the information you want and a font containing the chosen symbols. It should check the result in your terminal and explain the indicators. `Oh My Posh` is an alternative when you want a prompt that also works with other shells, including `Bash`, or prefer its theme configuration. Its [online configurator](https://configurator.ohmyposh.dev/) lets you arrange prompt elements, customize their appearance, and preview the result in your browser.

## Multiplexer: Zellij {#return-to-a-working-session}

A *terminal multiplexer* runs several terminal programs in panes and tabs within a named session. `Zellij` provides this arrangement with on-screen shortcut hints. Although terminal applications can also split windows, a multiplexer maintains its own session, which you can leave and return to. Ask the agent to prepare a named session for the projects and tools you want to keep together and save the arrangement of panes and tabs in a reusable [layout file](https://zellij.dev/documentation/layouts.html).

The example below places projects in separate terminal tabs. Within the selected tab, the agent has configured `Zellij` to display its conversation beside queue status and [`btop`](https://github.com/aristocratos/btop), a tool for viewing processor and memory use. Queue status shows which research jobs are waiting, running or finished; the resource monitor shows how heavily the computer is being used. You can keep the applications you normally use to view figures or edit your manuscript open alongside the terminal.

![](figures/research-workspace.svg){#fig-research-workspace fig-alt="A computer shows one terminal window with project tabs for heat-birthweight, review-times and website. The selected project tab contains a Zellij layout: Claude Code fills the left pane, pueue queue status occupies the upper-right pane, and btop shows CPU activity, memory use and processes in the lower-right pane. Shared dividers and one status bar identify a single terminal workspace."}

*Detaching* leaves the multiplexer session running while you stop viewing it; *reattaching* reconnects to that session. Have the agent show you both actions and check that you return to the intended project. This requires the computer and session to remain available. Reopening a saved layout after shutdown does not recover an unfinished calculation. [Chapter 9: Keep unattended jobs moving: pueue](#job-queues) explains how to manage submitted jobs and their records.

`tmux` is an alternative, especially when it is already configured on a computer you use remotely. It also supports panes and sessions that can be detached and reattached. The agent can configure either tool and explain the small set of controls needed for your layout.

## Have the agent configure and check the setup

Start with the setup already in use. Ask the agent to identify what is installed and preserve the existing configuration before changing it. The example prompt below requests the primary macOS choices; adapt the applications and layout to your computer and preferences.

::: {#prompt-terminal-setup .prompt}
> Inspect my current terminal setup and configure `iTerm2`, `zsh`, `Oh My Zsh`, `Powerlevel10k` and `Zellij`, installing only what is missing. Preserve my existing settings and project software setup. Use a clear terminal font, a comfortable text size, and good contrast between text and background. Configure a shell prompt showing the project folder and useful status. Prepare a named session with an agent pane, a view of my project's job queue and `btop` resource monitoring. Save this arrangement as a `Zellij` layout file and show me how to reopen it. Check that a new terminal starts the intended shell, displays the prompt correctly and can launch `Claude Code` in the project. Show me how to move between panes and detach from and return to the session. Record the configuration locations and how to reopen the setup in the global user instructions file [`TOOLCHAIN.md`](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions).
:::

After configuration, the agent should check the actual terminal you will use, including whether its shortcuts reach `Zellij`. It should report what changed and record the configuration locations and reopening instructions in the global user instructions file `TOOLCHAIN.md`.[^tk-terminal-setup-records] [Appendix B: Maintain personal settings: chezmoi](#shared-settings) explains maintaining those settings for recovery or use on another computer.

[]{#inspect-results-in-the-editor-you-use}

[^tk-terminal-setup-records]: For the global user instructions file TOOLCHAIN.md, see [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions) in *Doing Research with AI Agents*.

[^tk-terminal-config-files]: Configuration filenames beginning with a dot are often called *dotfiles*. `~/.zshrc` means the `.zshrc` file in your home folder. The agent should maintain it; you do not need to edit it yourself. See the [`zsh` startup-file documentation](https://zsh.sourceforge.io/Doc/Release/Files.html).

[^tk-powerlevel-support]: The [`Powerlevel10k` README](https://github.com/romkatv/powerlevel10k#readme) reports very limited support, no planned new features and that most bugs will remain unfixed. Keep this in mind when choosing it; `Oh My Posh` is an alternative.


# Appendix B. Maintain personal settings: chezmoi {#shared-settings}

Personal tool settings can contain months of useful work: global user instructions[^tk-settings-user-instructions] refined through research projects, a terminal layout that works well, or settings that resolved a recurring software problem. Recreating them after a lost computer or an accidental overwrite would mean repeating that work. Their configuration files are scattered across locations chosen by different tools, rather than collected in one project folder that can simply be put under version control.

[`chezmoi`](https://www.chezmoi.io/) is a tool that maintains copies of selected configuration files together in one folder and installs them in the locations where the tools read them. The agent can use [`Git`](https://git-scm.com/) to record changes to this collection in a *repository*: a folder with a recorded history of its files. Keeping a copy of that repository elsewhere allows recovery after a lost computer or setup on another one.

## Choose which settings to preserve {#choose-settings-to-preserve}

Configuration files supply a program's settings or instructions. Many have names beginning with a dot, or live inside folders whose names begin with a dot, so they are often called *dotfiles*. The examples below are personal settings across projects; a study's own configuration can remain with its project files.

| Settings worth preserving | Example location |
|-------------------------------------------|---------------------------------------------------------|
| [Global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) for [`Claude Code`](https://code.claude.com/docs/en/memory) | [`~/.claude/CLAUDE.md`](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) |
| Shell configuration for [`zsh`](https://www.zsh.org/) | `~/.zshrc` |
| Terminal panes and shortcuts for [`Zellij`](https://zellij.dev/documentation/configuration) | `~/.config/zellij/config.kdl` |

In macOS and Linux shell paths, `~` means your home folder. These are example locations: ask the agent to identify the files your tools actually use and preserve any existing settings-management arrangement. [Appendix A: Tools for customizing your terminal](#working-environment) explains the terminal tools.

Have the agent check the selected files before adding them to `chezmoi`. Files containing passwords, access tokens, or saved sign-in details should be left out, even if the settings repository is private. [Chapter 12: Keep credentials out of research files: 1Password and direnv](#credentials) explains how to store and supply credentials separately. Once you have agreed which files to preserve, ask the agent to save their current contents and install and configure `chezmoi` if needed.

## How chezmoi manages the files {#understand-the-two-copies}

Each tool expects to find its settings in a particular location. `chezmoi` keeps a second copy of selected files together in one folder, so the agent can maintain them as a collection and use `Git` to record their history. The tools continue reading their settings from the original locations.

The copy stored by `chezmoi` is called the *source copy*.[^tk-chezmoi-files] The copy that the tool reads is called the *applied file*. *Applying* a change means updating the file the tool reads from the source copy.[^tk-chezmoi-permissions]

Suppose you want agents to keep numerical results at full precision and round them only in tables and prose. Ask the agent to add this rule to the source copy of your [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions). It then uses `chezmoi` to update the file that `Claude Code` reads, such as [`~/.claude/CLAUDE.md`](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions), and checks that a new session reads the updated instructions.

## Maintain the settings and recover earlier versions {#maintain-and-recover-settings}

Settings can also change directly in the files that tools read. For example, changing the font size in a terminal application can update its settings file without updating the `chezmoi` source copy. Have the agent save that change back into the source copy before applying other updates; otherwise, the older font setting could overwrite the new one.[^tk-chezmoi-edits]

Both copies are normally on the same computer, so both could be lost if that computer fails. After checking that the tools use the intended settings, have the agent use `Git` to record changes to the source files and keep an updated copy elsewhere, such as a private [`GitHub`](https://github.com/) repository you authorize.

If a later edit accidentally removes the full-precision rule, ask the agent to restore that instruction from version history while retaining other changes. It should then update the applied file and check that a new session reads the restored instruction. Have the agent record the file locations and the update, backup, and recovery procedure in your [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions).

## Use the settings on another computer {#preserve-differences-between-machines}

On another computer, have the agent install `chezmoi` if needed and retrieve the source collection from the backup location. It should compare the saved settings with any already on that computer, preserve anything you want to keep, and then apply the agreed settings to the files the tools will read.[^tk-chezmoi-transfer]

Some settings need to differ between computers. For example, your research folder may have a different path on each one. The agent can use a `chezmoi` *template*, a source file containing rules for those differences, to insert the correct path while keeping shared settings consistent.[^tk-chezmoi-machines] It should check the result on the new computer, such as opening the intended terminal layout or confirming that a new agent session reads your [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions).

![](figures/research-shared-settings.svg){#fig-chezmoi-source-and-applied fig-alt="Two computers each contain a chezmoi source folder and an applied settings file. The example maps dot_zshrc in the default source directory to .zshrc in the home directory. Apply goes from source to installed settings; capture goes back after an applied-file edit. The shell reads the applied file. Git transfers source changes between computers; chezmoi then applies the source on the receiving computer."}

::: {#prompt-preserve-settings .prompt}
> Preserve my [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) and useful personal tool settings. Inspect their current locations and any existing settings manager before changing anything. Identify the files to manage with `chezmoi`, excluding passwords, access tokens, and saved sign-in details, and preserve their current contents. Use `chezmoi` to maintain the source copies and `Git` to record their history. Check that applying the source copies updates the intended files and that the tools read the settings correctly. Propose a backup location outside this computer and configure it after my approval. Record how to maintain the settings, recover an earlier version, and set up another computer in my [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions). Use that maintenance process for future settings changes.
:::

[^tk-settings-user-instructions]: See [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) in *Doing Research with AI Agents*.

[^tk-chezmoi-files]: Source copies normally live under `~/.local/share/chezmoi/`. The source file `dot_zshrc`, for example, becomes `~/.zshrc` when applied: the `dot_` prefix represents the leading dot. The [`chezmoi` setup guide](https://www.chezmoi.io/user-guide/setup/) explains the file locations, and its [source-state attributes](https://www.chezmoi.io/reference/source-state-attributes/) explain filename prefixes. The agent handles these names.

[^tk-chezmoi-permissions]: An unauthorized change to the source copy of a permissions file could change the agent's access when applied. Protect both copies as described in [Chapter 2: Control what added tools can access](#tool-access).

[^tk-chezmoi-edits]: See [`chezmoi` daily operations](https://www.chezmoi.io/user-guide/daily-operations/) for editing and applying source changes, and [`re-add`](https://www.chezmoi.io/reference/commands/re-add/) for capturing changes made to applied files.

[^tk-chezmoi-transfer]: The [`chezmoi` setup guide](https://www.chezmoi.io/user-guide/setup/) describes using a hosted repository, including a private one, to transfer settings between computers.

[^tk-chezmoi-machines]: See [`chezmoi`'s guide to differences between machines](https://www.chezmoi.io/user-guide/manage-machine-to-machine-differences/). Templates can vary particular settings without requiring independently maintained copies of every file.

# Appendix C. Prompt bank {#prompt-bank}

[]{#usage-tools}
[]{#ask-for-a-report-that-answers-a-question}

This prompt bank collects the same example prompts used throughout the guide, organized by task. Each links back to the explanation of when to use it, what the tools do, and how to check the result. Choose a prompt and adapt it to your project, naming the relevant files, accounts, and decisions.[^tk-prompt-context-files] The agent can read files already available to it; you do not need to paste their contents into the conversation.

[^tk-prompt-context-files]: See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) for project context files and [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) for global user instructions in *Doing Research with AI Agents*.

[Download all prompts as Markdown](resources/prompt-bank.md){.download-button download="prompt-bank.md"}

<!-- collection:prompts -->
[Set up tools and manage project files](#prompts-setup) · [Run and reproduce research](#prompts-workflow) · [Build and revise documents](#prompts-documents) · [Connect to data and services](#prompts-services) · [Run and coordinate agents](#prompts-agents) · [Use the terminal and preserve settings](#prompts-settings) · [Diagnose a problem](#prompts-troubleshooting)

## Set up tools and manage project files {#prompts-setup}

::: {.keep-together}
### Configure and check tool access {#bank-configure-access .unlisted}

Explanation and checks: [Chapter 2: Control what added tools can access](#prompt-configure-access).

::: {.prompt}
> Set up access for these statistical model fits. The approved inputs are in [folder]; results and logs belong in [folder]. Leave the inputs unchanged and block access to [excluded folder]. Check the current agent settings and the queue service's access. Explain where changes are needed before applying them. Test permitted and blocked actions with harmless substitute files, then report the settings changed, the outcomes, and anything you could not verify.
:::

:::

::: {.keep-together}
### Install and check a job-queue tool {#bank-install-tools .unlisted}

Explanation and checks: [Chapter 3: Install and manage tools with Homebrew](#prompt-install-tools).

::: {.prompt}
> Set up a job queue for this project's simulations, using `pueue` unless a suitable tool is already available. Check existing installations and how software is managed on the computer that will run the jobs. Use `Homebrew` unless an established institutional method is more appropriate, particularly on a computing cluster. Install `Homebrew` if needed, and explain any steps I must complete myself. Configure the queue and confirm that you can submit and monitor jobs from this session.
:::

:::

::: {.keep-together}
### Maintain project version history {#bank-version-history .unlisted}

Explanation and checks: [Chapter 4: Recover earlier work: git and gh](#prompt-version-history).

::: {.prompt}
> Maintain version history for this project using `Git`. Inspect any existing repository and preserve current edits. Track the code, manuscript, and appropriate configuration, excluding protected data, credentials, generated libraries, and caches. Record meaningful checkpoints as tasks are completed, and summarize changes affecting the analysis or reported results.
:::

:::

::: {.keep-together}
### Restore an earlier analysis decision {#bank-recover-analysis .unlisted}

Explanation and checks: [Chapter 4: Recover earlier work: git and gh](#prompt-recover-analysis).

::: {.prompt}
> Restore the earlier sample-selection rule while preserving unrelated manuscript wording and figure-formatting edits. Update the approved analysis requirements and record why the rule changed. Rerun the affected analysis, regenerate its figures, and identify manuscript values that need updating.
:::

:::

::: {.keep-together}
### Trace a variable through project files {#bank-search-project .unlisted}

Explanation and checks: [Chapter 5: Find and inspect project files](#prompt-search-project).

::: {.prompt}
> Find where `hot_days` is constructed, used in statistical models, and labeled in figures. Report the relevant file paths and line numbers. Use focused searches and excerpts. If a saved JSON or YAML response is involved, select the relevant fields rather than printing the entire response. Explain whether the construction, statistical-model use, and figure label describe the same exposure and units.
:::

:::

## Run and reproduce research {#prompts-workflow}

::: {.keep-together}
### Record and restore the software environment {#bank-restore-environment .unlisted}

Explanation and checks: [Chapter 6: Preserve a software environment: rig, renv, and uv](#prompt-restore-environment).

::: {.prompt}
> Inspect this project's software and record the language version and all required package versions without upgrading them. Choose a small, representative part of the analysis, run it with the current setup, and save the output. Recreate the recorded software setup in a separate environment, leaving the current one unchanged. Rerun the same part of the analysis and compare the outputs. Report anything that could not be restored and any differences in the results. Keep the setup files with the project and update the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) with any additional software requirements, restoration instructions, and the outcome of the check.
:::

:::

::: {.keep-together}
### Give research tasks saved commands {#bank-saved-commands .unlisted}

Explanation and checks: [Chapter 7: Give research tasks reliable commands: just](#prompt-saved-commands).

::: {.prompt}
> Inspect this project's analysis and set up named commands for fitting the statistical model, regenerating figures from saved estimates, and running the complete workflow. Use `just` unless existing project commands already cover these tasks. Check that the individual tasks can run separately. If the code needs reorganizing, save the current results first and confirm that the revised code reproduces them. Explain what each command does and use these commands whenever you carry out the corresponding tasks.
:::

:::

::: {.keep-together}
### Test the workflow before a full simulation {#bank-smoke-test .unlisted}

Explanation and checks: [Chapter 7: Give research tasks reliable commands: just](#prompt-smoke-test).

::: {.prompt}
> Add a `just smoke` recipe for this simulation study. Run five repetitions, fitting the planned statistical model in each and then generating the summary tables and figures. Use the same simulation and analysis code, sample size, and software environment as the full run. Save the test outputs separately from the main results. Check that each step completes and produces the expected files, and report any problems. Run this check after relevant code changes and before starting the full simulation.
:::

:::

::: {.keep-together}
### Set up selective analysis reruns {#bank-selective-reruns .unlisted}

Explanation and checks: [Chapter 8: Rerun only affected steps: targets and Snakemake](#prompt-selective-reruns).

::: {.prompt}
> Preserve this project's current results and software versions. Set up `targets` for this `R` analysis, installing it in the project's software environment if needed and recording its version. Use the existing analysis code to connect data preparation, the Bayesian model fits, saved posterior draws, comparison figures, and the manuscript through their dependencies. Configure the command `just all` to run the complete workflow through `targets`, and configure `just figures` to request the figures through the same runner. Show me the dependency diagram. Check selective reruns with small representative inputs, keeping test outputs separate from the study's results. Report which steps run and which results are reused, and investigate unexpected differences. Use these commands for future updates to the analysis.
:::

:::

::: {.keep-together}
### Make a simulation recoverable after interruption {#bank-recover-interruption .unlisted}

Explanation and checks: [Chapter 8: Rerun only affected steps: targets and Snakemake](#prompt-recover-interruption).

::: {.prompt}
> Make this simulation workflow recoverable after an interruption. Save each completed repetition so restarting does not repeat it when the inputs, code, and settings are unchanged. Check whether the fitting software can also save and reload progress within an unfinished fit, and configure that where supported. Choose how often to save progress and document its location and the restart command in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). Test recovery on five repetitions, interrupting after some finish and while another is running. Keep test outputs separate from the study's results. Restart with the same inputs, settings, and software versions, then check that completed work is reused without missing or duplicating repetitions. Explain which unfinished work still needs to start again.
:::

:::

::: {.keep-together}
### Queue a batch of model fits {#bank-queue-fits .unlisted}

Explanation and checks: [Chapter 9: Keep unattended jobs moving: pueue](#prompt-queue-fits).

::: {.prompt}
> Set up `pueue` for these 100 sensitivity fits, installing it if needed and checking its background service. Make each fit run independently with the intended inputs, settings, and software versions, saving its results and log separately. Submit one representative fit through the queue, inspect its saved result, and use its memory and processor use to choose how many fits can run at once. Then submit the batch and confirm that jobs start and produce logs or outputs. Save a job list alongside the outputs with each fit's settings, queue identifier, status, result file, and log. Record how to submit and check future batches in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), and use the queue for future unattended runs.
:::

:::

::: {.keep-together}
### Prepare a container for a collaborator {#bank-container-analysis .unlisted}

Explanation and checks: [Chapter 10: Run work in a separate environment: containers](#prompt-container-analysis).

::: {.prompt}
> Prepare a container so a collaborator can rerun this Bayesian analysis. Preserve the recorded `R` and package versions, and include the compiler and other supporting software the analysis needs. Check the intended computer and any existing container setup, then install or configure what is missing through the appropriate route. Make the required inputs read-only and save fitted results to a designated project folder outside the container. Run a small representative fit in the working setup and in the container with the same data, code, and settings. Compare the estimates and investigate unexpected differences. Check that results remain available after the test container is removed, and test required access restrictions with harmless substitute inputs. Save the configuration with the project and document how to build, run, and check it in `README.md` for collaborators. Link to these instructions from the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and use this setup for future analysis runs.
:::

:::

## Build and revise documents {#prompts-documents}

::: {.keep-together}
### Build manuscript drafts from saved results {#bank-build-manuscript .unlisted}

Explanation and checks: [Chapter 11: Generate documents from research outputs: Quarto and Pandoc](#prompt-build-manuscript).

::: {.prompt}
> Configure this manuscript in `Quarto` to produce a `Word` draft for coauthors and a PDF for review. Check the existing document tools and install any missing components through the appropriate route. Generate the results table and insert numerical values in the text from saved analysis outputs, keeping model fitting separate from document production. Save the build as `just paper`, or use the project's existing equivalent. Build both formats and confirm that the revised sample size and group difference appear correctly in the table and accompanying text. Inspect both documents for citation, equation, figure, and layout problems, and fix any build problems. Record the setup, input files, output locations, and build instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records). Use the saved command for subsequent drafts.
:::

:::

::: {.keep-together}
### Incorporate accepted coauthor edits {#bank-coauthor-edits .unlisted}

Explanation and checks: [Chapter 11: Generate documents from research outputs: Quarto and Pandoc](#prompt-coauthor-edits).

::: {.prompt}
> Preserve this coauthor's returned `Word` document and compare it with the draft sent. Inspect its comments and tracked changes, and flag conflicting edits or changes to claims and results that need my decision. Transfer the edits I have accepted into the maintained `Quarto` source. Keep unresolved comments available for review. Use the saved build command to produce a new draft without overwriting the returned copy, then check that the accepted edits appear in the new document.
:::

:::

## Connect to data and services {#prompts-services}

::: {.keep-together}
### Supply credentials to a research script {#bank-service-credentials .unlisted}

Explanation and checks: [Chapter 12: Keep credentials out of research files: 1Password and direnv](#prompt-service-credentials).

::: {.prompt}
> Set up this project's abstract-classification script to use the chosen LLM service account within the spending limit we agreed. Check the available credential tools and configure `1Password` and `op`, or the established institutional equivalent. Guide any personal steps needed to create, store, or authorize the key without putting it in the conversation. Supply it when the script runs, and keep its value out of source files, logs, and results. Save the command, run it on one permitted abstract, and check the saved classification. Report the account used and any unresolved problem. Save the setup and sign-in instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), without the secret. Use the saved command for later runs.
:::

:::

::: {.keep-together}
### Connect to a reference library {#bank-connect-library .unlisted}

Explanation and checks: [Chapter 13: Connect to research data and services: MCP](#prompt-connect-library).

::: {.prompt}
> Set up access to the `Zotero` collection "Exercise and sleep" from this agent session, using a suitable permitted integration. Check existing connections first and install or configure what is missing. Explain the account, library, and records the connection can access, including any ability to make changes. Use read-only permissions where supported and guide any personal sign-in or consent. Retrieve the paper I identify, confirm its title and identifier, and read its available attachment or note. Report what you could access and any missing material. Leave the library unchanged. Save the setup and reconnection instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), without secret values.
:::

:::

::: {.keep-together}
### Gather evidence from the connected library {#bank-use-library .unlisted}

Explanation and checks: [Chapter 13: Connect to research data and services: MCP](#prompt-use-library).

::: {.prompt}
> Use the configured connection to retrieve papers and notes from the `Zotero` collection "Exercise and sleep" for this review. Follow the agreed research question and inclusion criteria. Save an evidence table linking the relevant findings to source passages, and maintain the project's bibliography. Distinguish full texts you read from abstracts and records without accessible text. Report missing material and unresolved references. Save the outputs in the project's `literature/` folder and report their file paths. Leave the library unchanged unless I request an edit.
:::

:::

::: {.keep-together}
### Check an interactive research website {#bank-check-website .unlisted}

Explanation and checks: [Chapter 14: Inspect and interact with a browser](#prompt-check-website).

::: {.prompt}
> Start this project's local website preview and open it using the available browser tools. On the results page, select 2024 and confirm that the plotted values and labels match the saved results for that year. Switch back to 2023 and check again. Try the main navigation and inspect the pages at desktop and narrow phone-sized browser widths. Fix problems and repeat the affected checks after reloading. Report the pages, actions, and widths checked, and show any remaining issue that needs my design decision. Save the preview and checking instructions in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and reuse them after relevant website changes.
:::

:::

::: {.keep-together}
### Collect data from a statistics portal {#bank-collect-web-data .unlisted}

Explanation and checks: [Chapter 14: Inspect and interact with a browser](#prompt-collect-web-data).

::: {.prompt}
> Obtain the 2024 population counts for every region from the public statistics portal I identified. Use a permitted API or export if available; inspect the website if needed to find the correct release. Confirm the year, geographic coverage, and population measure. Preserve the original download in `data/raw/` and record the source address, release, date, and selections in a source log. Check representative values and missing or duplicate regions. Create a reusable collection script with the year as an input, explicit output locations, the service's request limits, and clear failure reporting. If collection requires multiple requests, check a small retrieval before collecting the full set. Record the command and setup in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and use that script for future updates.
:::

:::

## Run and coordinate agents {#prompts-agents}

::: {.keep-together}
### Coordinate analysis and figure agents {#bank-coordinate-agents .unlisted}

Explanation and checks: [Chapter 15: Divide work between agents: shared projects and git worktrees](#prompt-coordinate-agents).

::: {.prompt}
> Coordinate an analysis agent and a figure agent for this project. The figure agent will write plotting code that reads results saved by the analysis agent. Before they start, specify the contents and layout of that results file, including the estimates, their units, and the lower and upper uncertainty limits. Give each agent its inputs, expected outputs, and files to edit. Let the figure agent develop against a labeled synthetic example while the analysis code is being built. Coordinate shared files and preserve existing edits. When both agents finish, combine their work and run the analysis followed by the figures using the newly produced estimates. Report any research decisions that need my input.
:::

:::

::: {.keep-together}
### Set up one review session per manuscript {#bank-headless-archive .unlisted}

Explanation and checks: [Chapter 16: Run agents from saved prompts](#prompt-headless-archive).

::: {.prompt}
> Set up a headless workflow to review this collection of manuscripts. Give each fresh session my review prompt and one manuscript directly. Disable the tools it could use to open other files or search the web. Save each review under the manuscript’s identifier. Keep earlier AI reviews and the human reviews out of reach. Test the workflow on two mock manuscripts, check what each session can open, and show me both reviews before running the collection. Flag any manuscript that fails to produce a complete review.
:::

:::

::: {.keep-together}
### Run interview labeling with a local LLM {#bank-local-labeling .unlisted}

Explanation and checks: [Chapter 17: Run and adapt an LLM on your own hardware](#prompt-local-labeling).

::: {.prompt}
> Set up a command that uses an LLM running on my computer to label interview excerpts. Use synthetic excerpts to check where the text goes and whether the longest expected excerpt fits. Have the script save each excerpt’s identifier, original response, label, and supporting passage. Flag missing or invalid answers. Once I approve the setup, run the command on the human-labeled examples, keeping the human labels out of the prompt. Save the disagreements on my computer so I can inspect them before we label the full collection.
:::

:::

::: {.keep-together}
### Prepare and evaluate an adapted LLM {#bank-adapt-llm .unlisted}

Explanation and checks: [Chapter 17: Run and adapt an LLM on your own hardware](#prompt-adapt-llm).

::: {.prompt}
> Test whether further training helps distinguish cost from transport in the interview excerpts. Keep the original LLM and prompt for comparison. Use separate excerpts for training, choosing an adapter, and the final test. Show that the labeling script can reload the adapter from a short run. Compare the selected adapter and the original LLM on the same held-out excerpts. Show me which errors training corrected and which it introduced.
:::

:::

## Use the terminal and preserve settings {#prompts-settings}

::: {.keep-together}
### Ask the terminal agent to regenerate a figure {#bank-terminal-figure .unlisted}

Explanation and checks: [Chapter 18: Use an agent from the terminal: Claude Code](#prompt-terminal-figure).

::: {.prompt}
> Regenerate the main results figure from the saved estimates. Prepare and check a `just figures` command that repeats this task. Report the estimates file and the path to the figure produced.
:::

:::

::: {.keep-together}
### Configure the terminal and its panes {#bank-terminal-setup .unlisted}

Explanation and checks: [Appendix A: Tools for customizing your terminal](#prompt-terminal-setup).

::: {.prompt}
> Inspect my current terminal setup and configure `iTerm2`, `zsh`, `Oh My Zsh`, `Powerlevel10k` and `Zellij`, installing only what is missing. Preserve my existing settings and project software setup. Use a clear terminal font, a comfortable text size, and good contrast between text and background. Configure a shell prompt showing the project folder and useful status. Prepare a named session with an agent pane, a view of my project's job queue and `btop` resource monitoring. Save this arrangement as a `Zellij` layout file and show me how to reopen it. Check that a new terminal starts the intended shell, displays the prompt correctly and can launch `Claude Code` in the project. Show me how to move between panes and detach from and return to the session. Record the configuration locations and how to reopen the setup in the global user instructions file [`TOOLCHAIN.md`](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#specialist-conventions).
:::

:::

::: {.keep-together}
### Preserve personal settings and instructions {#bank-preserve-settings .unlisted}

Explanation and checks: [Appendix B: Maintain personal settings: chezmoi](#prompt-preserve-settings).

::: {.prompt}
> Preserve my [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) and useful personal tool settings. Inspect their current locations and any existing settings manager before changing anything. Identify the files to manage with `chezmoi`, excluding passwords, access tokens, and saved sign-in details, and preserve their current contents. Use `chezmoi` to maintain the source copies and `Git` to record their history. Check that applying the source copies updates the intended files and that the tools read the settings correctly. Propose a backup location outside this computer and configure it after my approval. Record how to maintain the settings, recover an earlier version, and set up another computer in my [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions). Use that maintenance process for future settings changes.
:::

:::

## Diagnose a problem {#prompts-troubleshooting}

::: {.keep-together}
### Diagnose, repair, and check a failed operation {#bank-diagnose-problem .unlisted}

Explanation and checks: [Appendix D: Troubleshooting](#prompt-diagnose-problem).

::: {.prompt}
> Diagnose why [operation] produced [observed result] instead of [expected result]. Inspect the exact command, relevant logs, software setup, and outputs before changing anything. Check whether an earlier attempt is still running and making progress. Explain the likely cause and make a targeted correction, preserving existing work. Use a small representative check first if the full operation is expensive, then repeat the affected operation and inspect its output. Report what changed, what now works, and anything unresolved. Record lasting setup corrections in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), or in [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) if they apply across projects. Ask me before changing research methods or inputs.
:::

:::
<!-- /collection:prompts -->

# Appendix D. Troubleshooting {#troubleshooting}

This appendix helps identify the next step when a tool fails or behaves unexpectedly. Use the symptom table to find the relevant explanation, then ask the agent to diagnose the problem. Tell it what you expected and what happened instead, and provide any error message it cannot already see. It should inspect the command, logs (recorded execution messages), and saved outputs before changing software or starting another copy of a job.

| Symptom (links to help) | First check for the agent |
|---|---|
| [Command missing](#ask-the-agent-to-install-the-tool) | Whether the program is installed and this session can find it |
| [Queued job stalled or failed](#review-results-and-recover-failures) | Recorded status, whether the program is still running, and progress in its logs or outputs |
| [Restored environment differs](#restore-and-check-it) | Actual software versions against recorded versions |
| [Unexpected pipeline reruns](#check-what-reruns) | The saved dependencies and which input or code files changed |
| [Account access fails](#supply-a-credential-to-a-command) | Whether the actual command uses the intended account, without printing secrets |
| [Connected records missing](#connect-the-literature-task) | Whether the connection can retrieve a known record and its attachment |
| [Wrong browser session](#choose-the-browser-account) | The browser profile and signed-in account |
| [Headless agent fails](#control-what-each-run-receives) | The account, tools, inputs, and permissions supplied when that run starts |
| [Local LLM fails](#choose-hardware-and-a-runtime) | Memory use, input length, and the original response or error |
| [Agent-launched `R` stalls on macOS](#r-on-macos) | Whether the process is making progress and how it was launched |
| [Cloud-synchronized files stall](#cloud-sync-storage) | Synchronization activity and the locations of files being rewritten |
| [PDF reports “No counter 'none' defined”](#tex-table-counter) | The exact error and the document template |

## Have the agent diagnose, repair, and verify {#diagnose-repair-verify}

A symptom can have several causes. For example, a queued fit that has produced no results may still be computing, may be unable to read its inputs, or may have failed before writing a file. Ask the agent to distinguish these possibilities using the running process, logs, and expected outputs. A *process* is a running instance of a program. High processor use alone does not establish whether that program is progressing or stuck.

Once the cause is understood, the agent should make a targeted correction and repeat the failed operation. For a long calculation, it can first use a small representative case through the same app, queue, or other execution method. It should check the resulting files as well as the reported status, then record lasting setup changes in the project context files, or in global user instructions if they apply across projects.[^tk-troubleshooting-context-files]

::: {#prompt-diagnose-problem .prompt}
> Diagnose why [operation] produced [observed result] instead of [expected result]. Inspect the exact command, relevant logs, software setup, and outputs before changing anything. Check whether an earlier attempt is still running and making progress. Explain the likely cause and make a targeted correction, preserving existing work. Use a small representative check first if the full operation is expensive, then repeat the affected operation and inspect its output. Report what changed, what now works, and anything unresolved. Record lasting setup corrections in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records), or in [global user instructions](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) if they apply across projects. Ask me before changing research methods or inputs.
:::

The sections below cover problems with running research code and building documents. For incorrect analyses, unsupported claims, or other problems with the research itself, see [Appendix C: Troubleshooting](https://iqss.github.io/dss-agentic-research/chapters/troubleshooting.html) in the companion guide *Doing Research with AI Agents*.

## R launched by an agent on macOS {#r-on-macos}

On some macOS setups, [`R`](https://www.r-project.org/) can stall when an agent starts it without a terminal connection: the process uses a processor core but produces no output. If the agent identifies these symptoms, have it try a *pseudo-terminal*, a software-created terminal connection, and verify that the command finishes and produces the expected output.

Have the agent put the workaround in `bin/rscript-pty`, an executable helper: a small program that launches the project's `R` commands with that connection. It changes how the analysis is started, without changing the analysis code. Ask the agent to check a small run through the method the project will actually use, including the queue if jobs will be queued. It should confirm that the expected output is produced and the process finishes before launching a long run.

[Download the macOS `R` helper](resources/rscript-pty){.download-button download="rscript-pty"}

<details class="guide-example">
<summary>Helper code and additional checks for targets, workers, and Quarto</summary>

Have the agent save this helper as `bin/rscript-pty`, make it executable, and use it for the project's `R` commands. Keep its standard-input handling intact.[^tk-troubleshooting-stdin]

```sh
#!/bin/sh
command -v script >/dev/null 2>&1 || {
  echo "No script command; cannot allocate a pseudo-terminal" >&2
  exit 127
}
exec script -q /dev/null Rscript "$@" < /dev/null
```

For [`targets`](https://docs.ropensci.org/targets/), use `callr_function = NULL` and disable [`crew`](https://wlandau.github.io/crew/) for the initial check so the work stays in the process with the terminal connection. Separately launched workers need their own verification. Retain the helper for queued `R` jobs too; success with one worker or queue configuration does not establish that another will behave the same way.

For [`Quarto`](https://quarto.org/) that executes `R`, the macOS workaround wraps the complete render:

```text
script -q /dev/null quarto render paper.qmd < /dev/null
```

Linux uses a different `script` interface, so this command should not be copied unchanged there. [Appendix E: Terminal vocabulary](#terminal-history) explains terminal connections and program input.

</details>

If the agent's sandbox prevents pseudo-terminal allocation, use an explicitly approved execution method or run the saved command from your own terminal. Do not silently turn off the restrictions. If a process stalls, have the agent identify it and inspect its progress before stopping it; launching a replacement without resolving the earlier attempt can leave both consuming resources.

## Cloud-synchronized project storage {#cloud-sync-storage}

[`Git`](https://git-scm.com/) repositories and installed software environments can contain thousands of small files. Synchronizing frequent changes to these files through cloud-storage services such as [`Dropbox`](https://www.dropbox.com/), [`Google Drive`](https://workspace.google.com/products/drive/), or [`OneDrive`](https://www.microsoft.com/microsoft-365/onedrive/online-cloud-storage) can create heavy background activity and slow or block work on the project. A `Git` ignore rule controls what `Git` records; it does not control what a cloud-storage service synchronizes.

For an existing or stalled directory, first have the agent preserve the work and diagnose the synchronization state. Changing exclusions after a service has indexed thousands of files can itself trigger further synchronization work. There are two approaches:

1. **Exclude the affected folders from synchronization.** This is the preferred option when the service supports keeping those folders locally without syncing them. Have the agent configure and verify the appropriate exclusion. For a new directory, it should do this before adding files. The mechanism depends on the service and platform; [`Dropbox` documents its supported methods](https://help.dropbox.com/sync/ignored-files).
2. **Move the affected folders outside cloud storage.** Use this option when suitable exclusions are unavailable or cannot resolve the problem. Have the agent move or recreate the affected items, configure the project to use their new locations, and check that its commands still work. It must preserve source files, uncommitted edits, and `Git` history.

The agent should target the folders causing the activity. For `Git`, this may be the `.git/` directory that stores the repository's history. A [`Python`](https://www.python.org/) project's `.venv/` directory holds installed packages, while `uv.lock` records their versions. The installed environment can be excluded or recreated elsewhere while the version record and analysis source remain with the synchronized project. [Chapter 6: Preserve a software environment: rig, renv, and uv](#environments) explains software restoration.

After the repair, have the agent rerun the affected project command and, for a repository, confirm that its history and uncommitted changes remain intact. It should record any changed locations in the [project context files](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) and explain how excluded files are backed up or recreated.

## PDF reports “No counter 'none' defined” {#tex-table-counter}

A PDF build can report “No counter 'none' defined” for a table without a caption when [`Pandoc`](https://pandoc.org/) emits a table setting that the installed [`LaTeX`](https://www.latex-project.org/) packages expect to name an existing counter. For that specific error, have the agent add this guarded definition in the template's *preamble*, the setup section before the document content begins:

```tex
\makeatletter
\@ifundefined{c@none}{\newcounter{none}}{}
\makeatother
```

The guard preserves a counter if it already exists. Have the agent rebuild the document and inspect the affected table. A different error may need a missing font, package, or source correction; this code block is not a general repair for failed PDF builds.

[^tk-troubleshooting-context-files]: See [Chapter 7: Give the agent context for your project](https://iqss.github.io/dss-agentic-research/chapters/project-context.html#project-records) for project context files and [Chapter 8: Apply your conventions across projects](https://iqss.github.io/dss-agentic-research/chapters/shared-conventions.html#shared-instructions) for global user instructions in *Doing Research with AI Agents*.

[^tk-troubleshooting-stdin]: Standard input is the input channel a program reads. The helper redirects it from `/dev/null`, which supplies no input. Retain that redirection as part of this workaround.

# Appendix E. Terminal vocabulary {#terminal-history}

This appendix explains terms encountered in terminal windows, commands, and tool diagnostics. Use it to look up an unfamiliar word or ask the agent to explain that word in the command or error you are reading.

## From a device to a window

Many terminal terms describe physical equipment that software has replaced. A terminal was a device through which a person communicated with a computer. A *teletype* combined a keyboard and printer: typed characters went to the connected machine, and responses appeared on paper. [Museum collections preserve examples](https://collections.museumsvictoria.com.au/items/407696) used for computer access. Later terminals displayed text on a screen.

A modern *terminal emulator* provides a similar text interface in a software window. It can display a *shell* for entering commands and starting programs, a *text editor* for changing text files, or an *AI agent* that follows instructions and uses tools to carry out tasks. The window's appearance alone does not tell you which program is receiving your input.

![](figures/terminal-vocabulary.svg){#fig-terminal-vocabulary fig-alt="A teletype-style keyboard and printer leads to a physical screen terminal and then a terminal-emulator window. TTY preserves the older name. The lower cutaway shows three alternative programs inside the interface: a shell receiving commands, an editor receiving document text, or an agent receiving a research prompt. The hardware drawings are original schematic illustrations, not particular models."}

## The program receiving your commands

Shells such as [`Bash`](https://www.gnu.org/software/bash/) and [`zsh`](https://www.zsh.org/) can run saved scripts as well as commands you type. When a shell starts a program such as an agent, your input goes to that program until it finishes or you exit it; the shell then becomes ready for another command. [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents) demonstrates this sequence. [Appendix A: Tools for customizing your terminal](#working-environment) explains shell choices and terminal configuration.

| Term | Meaning in this guide |
|--------------------------------|--------------------------------------------------------------------------|
| Terminal / terminal emulator | The text interface, now usually a software window, in which programs receive typed input and display output |
| Shell | The program interpreting commands and starting other programs; for example, `zsh` starts the agent when you enter `claude` |
| Shell prompt | The text indicating that the shell is ready for a command; distinct from a written prompt addressed to an agent |
| TTY | A terminal connection; the term appears in diagnostics about how programs receive input |
| Pseudo-terminal, PTY | A software-created connection that behaves like a terminal for the program using it |

Programs can behave differently when their input comes from a terminal rather than a file or another program. That distinction explains messages such as `not a tty`: *TTY* names a terminal connection, so the message means that the program's input is not connected to one.[^tk-vocabulary-tty] A pseudo-terminal[^tk-vocabulary-pty] supplies a terminal connection when needed. [Appendix D: Troubleshooting](#r-on-macos) explains an example involving [`R`](https://www.r-project.org/) started by an agent on macOS. This does not mean every unattended command requires one.

## Commands and file locations {#commands-and-file-locations}

In `just figures`, [`just`](https://just.systems/) names the program and `figures` selects a saved task, called a *recipe*. [Chapter 7: Give research tasks reliable commands: just](#project-commands) explains how the agent creates those recipes. Programs also need to locate their files. A path such as `data/analysis.csv` is interpreted from the program's *working directory*, its current folder, so the same command can find different files when started elsewhere.

| Term | Meaning in this guide |
|--------------------------------|--------------------------------------------------------------------------|
| Command-line interface, CLI | An interface in which you control a program by typing commands and supplying arguments |
| Argument | Information supplied after the program name; `figures` is an argument in `just figures` |
| Option / flag | An argument that selects a program's behavior, such as `--list` in `just --list`; some options also take a value |
| Working directory | A program's current folder, used as the starting point for relative file paths |
| Absolute path | A location starting at the filesystem's root, such as `/Users/your-name/Research/my-project` |
| Relative path | A location interpreted from a starting folder; `data/analysis.csv` identifies a file in that folder's `data/` directory |
| Home folder, `~` | Your personal folder on the computer; in shell paths, `~/Research/` refers to its `Research/` subfolder |
| `PATH` | The list of directories searched for a program when its command is given without a file path |
| Dotfile | A file whose name begins with a dot, such as `.zshrc`; these files are usually hidden in normal file listings and often contain configuration |

The home folder and working directory are different concepts. For example, the working directory may be a research project while `~/.zshrc` still points to the shell settings in your home folder.

The file-path examples above use *Unix* conventions shared by the macOS and Linux operating systems.[^tk-vocabulary-unix] Their shells use forward slashes to separate folders and `~` for the home folder. These conventions also apply in the Linux environment provided on Windows by [`WSL2`](https://learn.microsoft.com/windows/wsl/); [Chapter 18: Use an agent from the terminal: Claude Code](#terminal-agents) introduces that Windows route. The `/Users/your-name/Research/my-project` path is specific to macOS.

## Programs, input, and output {#program-input-and-output}

A running program can receive information from the terminal, files, or another program. It can also send results and diagnostic messages through separate output channels. These terms help explain what the agent is inspecting when a command fails.

| Term | Meaning in this guide |
|--------------------------------|--------------------------------------------------------------------------|
| Process | A running instance of a program; two simultaneous analysis runs are separate processes |
| Environment variable | A named value supplied to a program, such as a setting that identifies a project folder; programs can pass these values to programs they start |
| Standard input, `stdin` | The input channel a program can read, supplied through typing, a file, or another program |
| Standard output, `stdout` | The channel a program uses for ordinary output, which can be displayed or saved |
| Standard error, `stderr` | A separate output channel commonly used for errors and other diagnostic messages |
| Pipe | A connection passing one program's output to another program's input; for example, passing a status report to a tool that selects the failed jobs |
| Exit status | A number a program returns when it finishes |

A zero exit status[^tk-vocabulary-exit-status] reports success according to the program's own rules. In [Chapter 9: Keep unattended jobs moving: pueue](#review-results-and-recover-failures), the `pueue wait` command returns zero when it finishes waiting, even if the queued job failed. The agent must check the job's recorded outcome and saved research outputs.

[^tk-vocabulary-tty]: TTY abbreviates teletype, an early keyboard-and-printer terminal. In modern software, the name refers to a terminal connection, including connections created by software.

[^tk-vocabulary-pty]: A pseudo-terminal (PTY) is a software-created connection that lets a program behave as though it were attached to a terminal. It can provide terminal input and output without a person opening a terminal window.

[^tk-vocabulary-unix]: An operating system manages a computer's hardware and runs programs. Unix is an operating system whose design influenced many later systems. macOS is based on Unix, and Linux follows many of the same conventions.

[^tk-vocabulary-exit-status]: An exit status is a number a program returns when it finishes. By convention, zero reports success; other numbers usually indicate an error. The number describes the program's own outcome, which may cover only one step of a research task.
