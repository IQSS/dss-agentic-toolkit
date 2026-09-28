---
title: "Extending Your Agent's Toolkit"
subtitle: "A Guide for Researchers"
version: "2.1 draft"
---


# Introduction

This guide shows how to add tools to an agent you already use: tools for managing long computations, preserving software environments, producing documents, and connecting to approved research services.

An agent that can read files, edit them, and run your analysis software can already do useful research work. The companion guide, [*Doing Research with AI Agents*](https://dss-agentic-research.pages.dev/), explains how to delegate and verify that work. Additional tools help when a task needs more support: a long fit needs a saved status record, a working analysis needs its package versions preserved, or a script needs a credential without storing it in the code.

In Parts I–IV, you ask the agent to install, configure, and run the tools from the app. You decide which tools the project needs, what they may access, and whether their results meet the request. Each section provides a setup request and checks you can use. Steps requiring your sign-in, password, or approval are identified separately. Part V covers optional terminal use.

## Who this is for

Researchers who already work with an agent and have hit a limit: a fit that died overnight, a simulation that would take a week run one job at a time, a key sitting in a script, an analysis nobody else can rebuild. You may work in R, Python, or Stata. The general tools apply to all three; the environment and pipeline sections identify their language-specific routes. Stata users can retain a master do-file and recorded community-command versions without adopting another language. You do not need to have opened a terminal.

We are Data Science Services at Harvard's Institute for Quantitative Social Science. What we recommend here is what we use every day. Where we describe something we do not use ourselves, we say that it comes from the vendor's documentation.

## What each section tells you

Each tool section explains the problem it solves, when you need it, the recommended path, and what to inspect after the agent uses it. Copyable requests help you start; examples show the files and results to expect. Existing tools that already meet your needs can stay.

We favor tools with clear documentation, maintained releases, inspectable inputs and outputs, and a reproducible way to record configuration. We also consider institutional availability, data access, and the burden of maintaining the tool. Open-source and local tools are useful where they provide that control, but they are not requirements in every category.

Read the common setup and access limits in Part I, then choose a small progression:

1. Add search tools (§5) and GitHub access (§6) if useful for your current project.
2. Preserve the project's environment (§9), give its existing commands clear names (§8), and add appropriate checks (§13).
3. Add a queue (§7), document rendering (§10), or a pipeline runner (§11) when the work requires it.

Check the built-in usage display early (§14); the additional tool for reviewing past usage is optional. Turn to connections, containers, or parallel agents when a task needs them. Section 19 explains how to keep a recoverable record of settings stored across your machine.

## The five Parts

**Part I. What an agent has, and what it lacks.** Start with how an agent uses installed programs and connected services. Then learn how to add tools, give the agent instructions for using them, and configure their access limits.

**Part II. Tools for recurring work.** Search, version control, queues, project commands, environments, and rendering. Choose the sections that solve a current problem; a queue or publishing engine is not a prerequisite for using an agent.

**Part III. Reproducible and safe.** Record the analysis steps, software requirements, and checks so the work can be repeated without reconstructing the agent conversation. These sections cover pipeline runners, credential handling, tests, usage reports, and containers for separate execution environments.

**Part IV. Reaching further.** Use these sections when the agent needs to query a service, inspect a website, work alongside another agent, or manage settings kept in several locations. Connections and parallel work require additional decisions about access and coordination. Read §4 before granting new access.

**Part V. Working in the terminal yourself.** If you want to run commands or use Claude directly in a terminal, §20 introduces the basics and §21 walks through a first session. Sections 22–25 cover optional conveniences, including terminal panes, informative prompts, persistent sessions, and an editor for inspecting code and results.

## The tools, by what they let the agent do

::: {.vspace height="12pt"}
:::

| § | To let the agent… | We recommend |
|:--|:------------------------------------------|:-------------------------------|
| | **I. What an agent has, and what it lacks** | |
| 1 | (what an agent is, and the three ways to extend one) | |
| 2 | get tools onto the machine | [Homebrew]{.tool} |
| 3 | know what it has, and when to use it | instruction files, skills |
| 4 | work within limits you set | permission settings, the OS sandbox |
| | **II. Tools for recurring work** | |
| 5 | find and read things fast | [rg]{.tool}, [fd]{.tool}, [jq]{.tool}, [yq]{.tool}, [bat]{.tool} |
| 6 | review and recover tracked files; work with GitHub | [git]{.tool}, [gh]{.tool} |
| 7 | run long jobs in your own queue | [pueue]{.tool} |
| 8 | use one command for every task in a project | [just]{.tool} |
| 9 | pin the language and its packages | [rig]{.tool} + [renv]{.tool}; [uv]{.tool} |
| 10 | turn the analysis into a paper or a deck | [Quarto]{.tool}, [pandoc]{.tool} |
| | **III. Reproducible and safe** | |
| 11 | re-run only what changed | [targets]{.tool}; [Snakemake]{.tool} |
| 12 | use keys and tokens without writing them down | [1Password]{.tool}, [direnv]{.tool} |
| 13 | show you what it changed, and test it | test tools, [difftastic]{.tool} |
| 14 | account for what it did and what it cost | usage and session tools |
| 15 | limit a separate execution environment | a container |
| | **IV. Reaching further** | |
| 16 | reach approved data and services | MCP |
| 17 | use a browser, and the screen | a browser connection; computer use |
| 18 | work alongside other agents | [git]{.tool} worktrees |
| 19 | keep your tools' settings under version control | [chezmoi]{.tool} |
| | **V. Working in the terminal yourself** | |
| 20 | learn the terminal basics and decide whether to use it | |
| 21 | run in a terminal | [Claude Code]{.tool} |
| 22 | | a terminal: [iTerm2]{.tool}; [Windows Terminal]{.tool} |
| 23 | | a shell and prompt: [zsh]{.tool}, [Oh My Posh]{.tool} |
| 24 | | sessions and panes: [Zellij]{.tool} |
| 25 | | an editor: [Positron]{.tool} |

::: {.pagebreak}
:::

## Macs, Windows, and Linux

The main routes are macOS and Ubuntu Linux. Windows readers use Ubuntu through WSL2 (Windows Subsystem for Linux), which §2 introduces. Platform-specific installation, authentication, and process behavior still need checking. Native Windows tools are outside this guide.

The agent must run in the environment where its tools and files are available. An app session, an editor session, and a terminal session may have different paths, credentials, and supported connections. Two things are worth knowing early if you use the app on Windows. According to the vendor's documentation (read September 2026), the app reaches tools inside WSL2 only in a *WSL session*, which you choose when you start a session; an ordinary Windows session will not see them. And in a WSL session the app's connectors are not available, which matters for §16. The same documentation says WSL sessions may be switched off on a computer your institution manages.

Day to day, we work on Macs, in the app and in the terminal, and one of us works in a terminal inside WSL2. What this guide says about the app on Windows and on Linux comes from the vendor's documentation.

## How this guide is kept current

The parts age at different rates. Permission settings, authentication, app interfaces, and institutional policy need checking at each release and before consequential use. The underlying purposes of version control, queues, and recorded environments change more slowly. Links point to primary documentation so the installed version can be checked.

This edition was reviewed in September 2026.

<!-- ===== PART I — WHAT AN AGENT HAS, AND WHAT IT LACKS ===== -->

# 1. An agent is a model with tools

An agent uses tools to read files, make changes, and run programs, then uses the results to decide what to do next. This chapter explains how installed programs, service connections, and instructions extend what it can do for your project. Hadley Wickham's ["What is an Agent?"](https://tidydesign.substack.com/p/what-is-an-agent) gives a fuller explanation of the model-and-tool interaction.

## One tool reaches all the others

A coding agent can run shell commands. Through that route it can use installed programs that its execution environment and permissions make available. After adding a program, check that the agent can find it and use it as intended.

You can ask the agent to install and operate a program without learning its command syntax yourself. You still need to understand what the program does, which files or services it can access, and what evidence will show that it worked. Those are the decisions each tool chapter helps you make.

## What an agent has on a plain machine

A Mac with Apple's Command Line Tools provides git and standard command-line utilities. Your research language and institutional software may add much more. Inventory those first (§2); the missing pieces depend on the machine and the project.

An agent may improvise when a tool or procedure is missing. Common failures include:

| Asked to… | With a plain install, the agent… | What goes wrong | § |
|:--|:--|:--|:--|
| run a six-hour model fit | launches it without a durable job record | interruption or failure may go unnoticed | 7 |
| run 400 simulations | runs them one at a time, or all at once | a week, or a frozen machine | 7 |
| install a package | puts it in the system-wide library | the project cannot be rebuilt elsewhere | 9 |
| rebuild the analysis | works out the commands again each time | a different result on a different day | 8, 11 |
| use an API key | pastes it into a script | the key ends up in the repository | 12 |
| find where a variable is used | chains slow, general-purpose commands | more time, more tokens, more mistakes | 5 |

The tools in those sections make execution and review more dependable. They still need a clear specification and checks on the result.

## Three ways to give an agent more

**Installed programs.** Through its command tool, the agent can use a job queue, run the project's build command, manage R or Python packages, or retrieve credentials from a secrets store. Parts II and III cover these tools.

**Connected tools and services.** Connections can give the agent access to a browser, database, or reference library. The Model Context Protocol (MCP) provides a standard way to make such tools available; the server supplying them may run locally or remotely. Part IV explains how to choose and check a connection.

**Instructions.** Tell the agent when to use each tool and what evidence to return. Installing a queue does not teach it to record a task identifier or check the result. §3 covers those standing instructions.

# 2. Get tools onto the machine: Homebrew

Homebrew is a package manager: it installs and updates programs. This chapter explains how to have the agent check your existing setup, add Homebrew if needed, and verify a small first installation. A managed university computer or an established research environment may already provide the tools you need.

## What you need first

On a Mac, the research guide assumes Apple's Command Line Tools are installed, including git. Ask the agent to check that assumption and the machine's architecture before proposing an installation. Keep an existing institutional package-management arrangement if it meets the need; do not build a competing setup without a reason.

The current [Homebrew installation instructions](https://docs.brew.sh/Installation) provide both the supported command-line route and a macOS package installer. Use those instructions rather than a copied installer command from an old guide. A password or installer dialog is a step for you, not a credential to paste into the conversation. If a terminal step is required, §20 explains how to open Terminal and paste one command. The macOS package route is documented here, but has not been tested as a complete new-user walkthrough for this edition.

## Ask for a small installation

> Inventory the tools this project already has and how they are managed. If Homebrew is needed, identify the supported installation route for this machine and explain any step I must perform myself. Then install ripgrep and jq if absent. Show their versions and use them on harmless example files. Do not upgrade the project's research language or package environment.

Once Homebrew works, the agent can install further tools as you reach the relevant section. You do not need the whole toolkit at once. For noninteractive installs, Homebrew documents the `HOMEBREW_NO_ASK` setting; it does not remove operating-system authorization requirements. Record installed tools and why the project needs them.

A personal `Brewfile` can record a growing installation set. It is useful for rebuilding a machine, but is not a substitute for the project's pinned research environment (§9). This guide uses section-by-section installation, so no separate bundle is needed to start.

## Check that it works

Ask the agent to show `brew --version`, the installed tool versions, and the small example's output. A `brew doctor` warning needs interpretation; it does not necessarily mean an installation failed. A command that cannot be found may be absent or may be outside the agent process's search path. After installation, a fresh app session may be needed to inherit that path.

Keep installation review separate from research work. An installer may request network access or write outside the project. Approving that operation does not authorize later commands to use the same access without review (§4).

## Windows through WSL2, and Linux

This guide's Windows route is Ubuntu inside WSL2, not native Windows tools. Follow Microsoft's [WSL installation instructions](https://learn.microsoft.com/windows/wsl/install), including any administrator step and restart. Keep the project and its Linux tools inside the same distribution; a Windows installation of a program is not automatically a Linux installation.

Homebrew supports Linux under its documented requirements. Follow its Linux instructions rather than copying the macOS installer. If your institution already supplies packages through Ubuntu or a managed environment, use those when adequate and record any differences in command names. The tools' platform notes identify consequential differences rather than promising identical operation everywhere.

# 3. Tell the agent what it has and when to use it

A newly installed tool can go unused, or be used incorrectly, unless the agent has instructions for it. This chapter shows how to record when to use a tool, what limits apply, and which results to report. The research guide's *The files the agent reads* and *Repeatable workflows* chapters explain the instruction files and skills that hold those procedures.

## Start with short, specific instructions

A machine-wide convention can live in your personal `CLAUDE.md`. A project's commands, resource limits, and data-access rules belong with that project. Keep an established instruction layout rather than creating a second one for this guide.

For example:

- Submit long jobs through pueue, record the task identifier, and verify both completion status and expected outputs.
- Fetch required credentials from the approved vault for the command that needs them. Never print or commit their values.
- Use the project's recorded environment. Report proposed dependency changes before applying them.

Each line names an action and a check. “Use pueue” alone leaves the agent to guess how to establish that a job succeeded. Keep a short inventory of installed tools and their purpose alongside these instructions.

## Package procedures only when they recur

A skill can hold a recurring procedure such as submitting a job, inspecting its status, and reporting failure. Start with a standing instruction; add the longer procedure if you repeatedly need the same correction. Hooks can run checks at specified events, but are executable configuration that needs review. Neither instructions nor hooks replace a data-access boundary (§4).

## Check that the instruction is used

In a fresh session, ask which project instructions apply and how the agent would run a long job. Have it identify the file it read, then demonstrate the procedure on a harmless task. A confident summary alone does not prove the file was loaded or the procedure works.

# 4. Keeping the agent's reach in proportion: permission settings and the OS sandbox

An added tool may reach files or services through a different process, account, or connection from the agent's existing tools. This chapter explains how to configure permission rules and the operating-system sandbox, inspect exceptions, and test access with harmless files. The companion guide's *Boundaries* and *Data confidentiality* chapters explain how to decide which research material the agent may use.

![](figures/security-layers-intro.svg){#fig-security-layers-intro fig-alt="Permission checks, sandboxed execution, and optional containers provide different protections. Each applies only to the tools and access routes it covers." above="10pt" below="14pt"}

## Combine the controls

Written instructions tell the language model what you want it to do. Permission rules let Claude Code allow, refuse, or ask about matching tool calls. Approval prompts let you review those proposed actions. A sandbox restricts file and network access for programs running inside it, using operating-system controls. Containers (§15) can provide an additional separate environment, depending on their configuration.

None covers every route automatically. A file permission rule can block a direct read without blocking an arbitrary unsandboxed script that opens the file. A connector or browser may reach data through credentials rather than local paths. Git can recover tracked edits but cannot reverse disclosure.

![](figures/security-layers-guarantee.svg){#fig-security-layers-guarantee fig-alt="Rules match recognized actions, prompts ask for a decision, the sandbox limits covered processes, and a container limits access according to its mounts, credentials, network, and privileges." above="18pt" below="16pt"}

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

The example refuses unsandboxed fallback. Some tools may need access it does not provide: a queue socket, an application integration, system installation, or a pseudo-terminal for the locally observed R issue (§8). Diagnose the particular failure before deciding how to handle it. Do not add broad exemptions for every `gh`, `op`, or queue command as part of the baseline.

If an authorized workflow needs a reviewed unsandboxed invocation, document its scope and protection separately. Do not describe that command as sandboxed. In particular, a job submitted to pueue runs under the queue service's account and permissions; the submission command's sandbox does not contain the resulting job. Credentials supplied to a process are available to that process even when a vault stored them safely.

For a protected analysis, use an execution environment with the required access controls instead of weakening them to accommodate a tool. A convenient local workaround may be inappropriate there.

## Check both execution and editing

Test direct file access and subprocess access separately, using disposable files. Confirm the expected failures and an allowed operation that still succeeds. Test again after changing path rules, command exemptions, or the tool used to run the work. These tests reveal configuration errors; they do not prove containment against every possible program.

Keep the effective settings and any exceptions documented outside the model's conversation. Review changes to both project and personal settings, including copies managed by chezmoi (§19). Protecting only the applied file can leave an editable source copy that later restores broader access.

## On Windows (WSL2) and Linux

The sandbox is supported on macOS, Linux, and WSL2, with platform-specific requirements in the linked documentation. Native Windows is outside this guide. Have the agent check the installed version's requirements and any managed-device restrictions before configuring it. A missing sandbox is not repaired by selecting a more cautious permission mode.

<!-- ===== PART II — TOOLS FOR RECURRING WORK ===== -->

# 5. Find and read things fast: `rg`, `fd`, `jq`, `yq`, `bat`

These tools help the agent locate files, find text in them, and extract fields from structured data without writing a new program for each lookup. Start with ripgrep (`rg`) for text searches and `jq` for JSON, a common format for data returned by online services. This chapter shows what each tool returns and how to check that a search or selection found the intended material.

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

## Keep adequate existing tools

On a server where installations are restricted, the standard search and file tools may be sufficient. A managed Ubuntu installation may use names such as `fdfind` or `batcat`; record the actual commands rather than installing a second copy merely to match this page.

# 6. Review and recover tracked files: git and `gh`

Git records versions of files you deliberately track, so you can review changes and recover earlier work. This chapter builds on the research guide's commit-and-review routine: it covers GitHub access through `gh`, a small review exercise, and precautions for repositories in cloud-synced folders. Add GitHub access only when the project needs collaboration or an approved remote copy.

## What the tools give the agent

A git diff shows how tracked text changed. A commit records an inspectable version. Neither can undo an external upload, a database change, an overwritten untracked file, or exposure of confidential data. Keep backups and access controls appropriate to those risks.

The GitHub command-line tool, `gh`, lets the agent inspect issue reports, proposed changes called pull requests, and checks run by GitHub. It can also prepare changes for collaborators. Decide whether the files may be sent to the hosting service before creating or using a remote repository; private repositories still transfer their contents there.

## Set up access only when needed

Use your lab's existing host. For GitHub, we recommend `gh` with HTTPS authentication. The [authentication manual](https://cli.github.com/manual/gh_auth_login) explains its browser flow and credential storage: it uses the system credential store when available, but can fall back to a plain-text file. Check the reported storage location rather than assuming a keychain is in use.

> Install gh if needed and check this repository's existing remote and authentication configuration. Help me sign in through the browser without pasting a token into chat. Configure git's HTTPS credential integration if appropriate. Report authentication status and the credential storage method without showing a secret. Do not create a remote or push files yet.

You complete the browser sign-in. Have the agent inspect existing name and email settings before changing them. Keep functioning SSH or institutional-host authentication if there is no reason to replace it.

## Check a small change

Ask the agent to show the repository status, make an agreed edit to a practice file, and display its diff. After review, have it stage that file by name, selecting it for the commit, and inspect the proposed file list before committing. If the repository already contains uncommitted changes, identify and preserve them. Leave unrelated work untouched.

For GitHub, start with a read-only operation such as inspecting the approved repository. A blocked call may reflect network, credential-store, or sandbox restrictions. Review that route under §4 rather than exempting all git and GitHub operations from the sandbox.

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

# 7. Run long jobs in your own queue: pueue

**We recommend** pueue when the agent needs to manage long computations on your machine and check them later. It keeps a record of submitted jobs, their output, and their status, and limits how many run at once. This chapter covers setting up the queue, choosing that limit, and verifying completion.

## Without it

A long fit started from an agent session can be interrupted or become difficult to monitor from a later session. Even if the fit continues, the agent may have no reliable record of its progress. Starting many fits at once can also exhaust memory or make them compete for the same processor capacity.

## What it gives the agent

[Pueue](https://github.com/Nukesor/pueue) separates submission from execution. A background service owns the jobs, records their commands and working directories, limits simultaneous runs, and retains their output and outcomes. The agent can leave the submission session and inspect the same job later.

Because the queue service runs the job, closing the submitting conversation or terminal need not stop it. The machine must still be awake and the service available; a reboot or WSL shutdown can stop the computation. After an interruption, inspect the queue and output files before restarting. A queue record tells you what happened to a job, but resuming a fit partway through requires progress saved by the fitting program itself.

## Do you need it yet?

Use it for recurring long fits, substantial simulations, or a batch of independent jobs. For a short task, the agent can run the command directly and read its outcome before continuing. Keep an established cluster scheduler for work already running on a cluster.

## What we recommend

Install pueue and configure its service for your platform. Start with one concurrent job. Measure peak memory and threads for a representative run, then set a limit that leaves capacity for the machine's other work. Four fits using four threads each are sixteen competing threads, even though the queue shows only four jobs.

A queued job runs with the queue service's permissions, outside the agent's command sandbox (§4). Review the command that will start it, the inputs it may read, and where it will write outputs. The queue manages execution; it does not impose the agent's access restrictions on the job.

## Ask for it, and tell the agent

> Install pueue and configure the service for this machine. Start with one job at a time. Demonstrate it with a harmless short job, recording the task ID, working directory, log, and final result. Before queuing research jobs, inspect their memory and thread requirements and propose a concurrency limit. Explain the service's access and any sandbox exception needed; do not add a blanket exemption.

Add these standing instructions: submit long jobs through the agreed queue; record each task ID; confirm actual status before reporting progress; read the final outcome and inspect the expected artifact before claiming success.

## Check that it's working

If the project has a saved `just` recipe named `fit` (§8), the agent can submit it to the queue, inspect its status, and read its output with these commands:

```
FIT_TASK=$(pueue add --print-task-id -- just fit)
pueue status
pueue log "$FIT_TASK"
```

The task may first be queued, then running, then complete. “Submitted” establishes only that the queue accepted it. While it runs, look for an advancing log or expected intermediate output. At completion, inspect both the stored result and the fit artifact.

This is the outcome check for the JSON shape used by pueue 4.0.4:

```
pueue wait "$FIT_TASK"
pueue status --json | jq -e --arg id "$FIT_TASK"   '.tasks[$id].status.Done.result == "Success"'
```

`pueue wait` does not establish success; it returns after waiting even when a task fails. If the result is unsuccessful or the expected artifact is absent, read the log and report the failure. Do not resubmit repeatedly without checking whether an earlier process is still active.

The common setup failures are an absent service, a blocked service socket, and a command running from the wrong directory or environment. Distinguish them from a model error. For the observed macOS R hang, use §8's troubleshooting procedure for both direct and queued execution until your route is verified.

## If you already use a runner

Targets and Snakemake (§11) manage dependencies within a pipeline; pueue can submit the outer pipeline command. A cluster scheduler manages jobs on institutional compute. Keep these roles distinct rather than installing a second queue to replace a working one.

## On Windows (WSL2) and Linux

Use the service inside the same environment as the project. In WSL2, verify its lifetime explicitly: Microsoft's [systemd guidance](https://learn.microsoft.com/windows/wsl/systemd) notes that systemd services do not keep a WSL instance alive. Do not promise an overnight job will survive closing Windows or shutting down the distribution.

# 8. One command for every task in a project: just

**We recommend** just for giving a project's recurring commands clear names, such as `check`, `fit`, and `figures`. This chapter shows how the agent can record those commands in a file, choose which to run after an edit, and test them on a small example. Keep an adequate existing master script or Makefile.

## Without it

When the execution sequence is undocumented, the agent must infer which scripts clean the data, fit the model, and render the paper. It may miss a required step or repeat work unnecessarily.

## What it gives the agent

A `justfile` records named commands called *recipes*. Each recipe calls the scripts or tools that perform a project task, and `just --list` displays the available names. Just does not determine which results need updating or resume an interrupted fit. A recipe can call a pipeline runner (§11) when that dependency tracking is needed.

## Do you need it yet?

Add just when remembering and repeating the commands has become a problem. For an existing paper, first document and test the current execution sequence. An adequate master script can provide a reproducible hand-off without adding another tool.

## What we recommend

Use a small set of recipes named for the tasks they perform. This R example assumes the named analysis scripts already exist. It calls them through `bin/rscript-pty`, a small helper script described in the troubleshooting subsection below; that helper must also be present and executable.

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

1. Ask the agent to check whether just is installed and follow §2 if it is missing. Record the language and package environment (§9); this exercise needs no new analysis packages.
2. Have it create `practice.csv` with two columns, `id` and `value`, and exactly three rows: `(1, 10)`, `(2, 20)`, `(3, 30)`. These are invented data. The output should be a text report stating `rows: 3` and `sum: 60`.
3. Ask for a script that checks unique IDs and the expected columns, then writes the report. Add `check` and `build` recipes, plus a short project instruction naming their purpose.
4. Run `just --list`, then the check and build. Open the report and compare it with the expected count and sum above. Ask the agent to identify the input and script it actually used.
5. Duplicate ID 2 in the practice input and run the check again. It should fail with a duplicate-ID message. Restore the original three rows, rerun, and inspect the final diff before committing the exercise.

A successful valid case and an intentional failure show more than a report saying the installation worked. This is a proposed teaching exercise, not a recorded execution in this edition.

### Troubleshooting R launched by an agent on macOS

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

If the agent sandbox blocks pseudo-terminal allocation, the strict settings in §4 will refuse the call. Use a separately reviewed execution route or run the saved script in your own application; do not silently disable the sandbox. For Quarto that executes R, the equivalent macOS wrapper surrounds the whole render:

```
script -q /dev/null quarto render paper.qmd < /dev/null
```

Check the process and artifact as well as the returned status. If a process appears stuck, establish its identity and progress before stopping it; do not launch several replacements. Linux has a different `script` interface, so the macOS wrapper should not be copied unchanged there.

## If you already have a build command

Keep a working Makefile, master do-file, or document render command. Just can provide a convenient front end without replacing it. Add targets or Snakemake only when dependency tracking is useful (§11).

# 9. Pin the language and its packages: rig and renv; uv

To repeat an analysis, preserve the versions of its language and packages. **We recommend** renv for R packages, rig when several R versions are needed, and uv for Python projects whose dependencies it can manage. This chapter covers recording an existing environment, setting up a new one, and checking that the recorded versions can be restored.

## Without it

A package update can change an analysis even when its source code has not changed. If the project never recorded its environment, restoring the earlier behavior becomes guesswork.

## What it gives the agent

A lockfile records exact package versions and their dependencies. R projects using renv use `renv.lock`; uv projects use `pyproject.toml`, `uv.lock`, and a Python-version record. The installed library can be rebuilt from those records, subject to platform support and the continued availability of packages and system dependencies.

Rig manages R installations; renv manages project packages. Uv can manage both the Python interpreter and project environment. A lockfile does not preserve the operating system or guarantee identical numerical results on all hardware.

## Do you need it yet?

Record the environment whenever results need to be repeated. For an existing project, preserve the working versions before any migration. Stata users should record Stata and community-command versions and their sources; retain the master do-file. A second programming language is not required.

## What we recommend

Use [renv](https://rstudio.github.io/renv/articles/renv.html) for R, and [uv projects](https://docs.astral.sh/uv/concepts/projects/) for Python. Keep an established environment manager if it already provides the needed record and restoration route. Add rig when you need to install or select a particular R version, not as a reason to upgrade every project.

A package addition should produce changes to the lockfile that you can account for. For example, adding one plotting package may also add packages it depends on. It should not silently replace most of the packages used for modeling. Have the agent explain the changed versions, run the affected checks, and test restoration in a separate environment before relying on the record.

## Ask for it, and tell the agent

For an existing analysis:

> Inventory the language, installed package versions, system dependencies, and current environment records. Preserve a baseline result. If a lockfile is missing, propose a way to capture the working environment without upgrading it. Show the resulting manifest and verify restoration in a separate environment. Do not change the original library or language version to make the migration easier.

For a new project:

> Set up a project environment for the agreed language version and packages: renv for R, or uv for Python. Record the complete dependency resolution, run a small import and analysis check, and show the lockfile. Keep generated libraries out of git and cloud synchronization before populating them.

**What only you can do.** Approve any system installation or password step. Installing a new R version may need administrator access. Credentials and package repositories also need the access decision in §4.

Standing instructions: use the project's environment manager, review lockfile changes alongside code changes, and keep the original working environment until a migration is verified.

## Check that it's working

For R, inspect `renv::status()`, the R version, and the lockfile diff. For Python, test the recorded environment with a locked restore, such as `uv sync --locked`, followed by the project's checks. A [locked sync](https://docs.astral.sh/uv/concepts/projects/sync/) refuses a stale lockfile instead of resolving an update silently. Test in a separate environment because syncing can remove packages not in the lockfile.

Common failures are unrecorded packages, missing system libraries, and a lockfile update that changes far more than intended. In renv, use the ordinary project snapshot after an approved change; selecting a single package for a snapshot can omit the rest of the environment. In either tool, inspect the complete dependency record rather than counting only direct imports.

A restore may need system libraries such as a compiler or spatial-data library. Record their installation requirements in the README. If the project depends on a conda-based scientific stack, consider pixi or retain its existing conda environment rather than repeatedly forcing those dependencies through a different manager. A single failed installation is a diagnosis to investigate, not an automatic reason to migrate.

On the author's affected Mac execution route, R environment commands use §8's wrapper. Keep generated libraries outside synchronized folders, or apply the documented exclusion before creating their contents (§6).

## If the environment needs more

Use a container (§15) when system dependencies also need to be packaged. Keep an existing conda or other managed environment when it is adequate. Platform-specific binaries can differ, so test restoration on the collaborator's target platform before promising portability.

## On Windows (WSL2) and Linux

Create the environment where the tools run: inside Ubuntu for WSL2. Use [rig's platform instructions](https://rig.r-lib.org/install.html) if adding R versions; the macOS installer is not the Linux installer. Check system-library requirements on that platform and document them with the project.

# 10. Turn the analysis into a paper or a deck: Quarto and pandoc

This chapter shows how the agent can generate a paper, report, or slide deck from saved source files. Use Quarto when the document needs to combine text with executed code and results, or pandoc with a template for conversion and layout without running an analysis. Keep a working Word, R Markdown, or notebook workflow when it already serves the collaboration.

## What the tools give the agent

A Quarto source file can hold prose, code, citations, and references to figures and tables. The agent edits that source and renders the result. This makes it easier to keep reported numbers connected to the analysis, provided the document executes the appropriate code or reads current result files.

A render does not always rerun the analysis. Quarto's [execution documentation](https://quarto.org/docs/projects/code-execution.html) explains caching, frozen results, and notebook execution. Record whether the build executes models, reuses saved fits, or only formats existing output. Include the required refresh in the release check.

Pandoc converts text sources into formats such as Word, HTML, and PDF. For a designed PDF, a LaTeX template can specify fonts and layout. The XeLaTeX route requires a TeX installation and the fonts named by the template.

## Ask for a small first document

> Inspect the project's existing writing workflow. If Quarto is appropriate, set up a one-page document in the recorded language environment, with one result computed from a tiny invented dataset and one plot. Add a build command that renders it to the required format. State what executes during that command and what is reused. Show me the rendered file before adapting the manuscript.

For a text-only PDF, request pandoc and a template instead. TinyTeX is a small TeX distribution supported by Quarto; an existing MacTeX or TeX Live installation can stay. Follow [Quarto's PDF setup](https://quarto.org/docs/output-formats/pdf-basics.html), and check that an independently invoked pandoc can find XeLaTeX. A larger TeX installation reduces missing-package problems but does not guarantee an identical build years later.

## Check the document, not just the command

Open the output and inspect the result, figure, citations, and layout. Change one value in the invented input, rebuild, and verify the corresponding reported result changes. For the manuscript, check a selected result against the saved analysis output. A recent modification time alone cannot establish that the right analysis ran.

Save the rendering command and its options as a project recipe (§8), and record the language packages, TeX dependencies, and fonts needed for hand-off. Preserve a Word route when coauthors need it; conversion still requires checking tables, equations, references, and tracked changes.

For an R process that hangs when launched by an agent on macOS, use the single troubleshooting procedure in §8. Queueing the render is not itself a guarantee that the problem disappears.

One specific template error encountered with TeX Live 2026 is “No counter 'none' defined” for a captionless table. The pandoc-to-XeLaTeX templates used here include this compatibility block in their preamble:

```
\makeatletter
\@ifundefined{c@none}{\newcounter{none}}{}
\makeatother
```

Other failures need their own diagnosis. Check missing fonts and packages in the render log rather than changing the document's statistical code to obtain a PDF.

<!-- ===== PART III — REPRODUCIBLE AND SAFE ===== -->

# 11. Re-run only what changed: targets and Snakemake

When an analysis has expensive steps, you may want to rerun only the work affected by a change. A pipeline runner records those dependencies and decides what needs updating. This chapter explains how to have the agent build and check a small pipeline: targets for R, or Snakemake for a file-based workflow spanning several programs. A short analysis may need only its existing master script.

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

For parallel work, budget memory and threads as well as worker count. A model using several threads inside each of several workers can exhaust a laptop. Start with one representative job (§7). Targets can use crew for parallel workers, but the observed macOS R problem requires checking that execution route; §8 gives the conservative troubleshooting baseline without separate workers.

These tools do different parts of the work. A just recipe (§8) gives you a named command. The pipeline runner decides which analysis steps need rerunning. A queue (§7) manages submission and execution of the overall job.

![](figures/detachable-pipeline.svg){#fig-detachable-pipeline fig-alt="A project command invokes a dependency runner; a queue can manage that outer job. Dependency tracking, process lifetime, and execution permissions require separate checks." above="18pt" below="16pt"}

Keep generated caches out of git and configure cloud-sync exclusions before populating them (§6). Required validation scripts and environment records remain part of the reproducible project, even when their generated results are cached. Keep an established pipeline framework if it already supplies the needed dependency tracking and execution record.

# 12. Keep keys and tokens out of your files: 1Password and direnv

When a script needs an API key or other credential, the agent should be able to use it without saving the secret in project files. This chapter explains how to supply it from an approved 1Password vault through the `op` command and check which programs receive it. Direnv is an optional addition for loading the same project environment across several commands.

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

If direnv does not load in the agent's noninteractive shell, `direnv exec .` can explicitly load the approved project environment for a command. Do not fix an authentication or sandbox failure by granting general vault access. Review the particular access route under §4.

Standing instructions: never paste credentials into chat or source files; report variable names rather than values; avoid dumping the environment; use the narrowest credential scope and lifetime available. Do not introduce an AI-provider API key into the agent's environment unless API billing is intentional and approved.

# 13. Check what the agent changed: tests and diff review

This chapter explains how to have the agent add small tests for consequential mistakes and how to review changes that tests cannot settle. Start with the project's existing tools: testthat or assertions in R, pytest or assertions in Python, and assertions in Stata. An assertion is a check that stops a script when an expected condition fails. Add a test framework when it makes those checks easier to maintain.

## Ask for evidence about behavior

A script can run successfully and still drop observations or compute the wrong contrast. A useful check has an expected result established independently of the implementation. Repeating the same calculation in a test can repeat the same error.

For a many-to-one join, use a tiny invented example with three observations and two lookup rows. Establish the expected matches and row count yourself. Then add a duplicate lookup key: the check should fail before the join expands the data. Include an unmatched observation and verify that the specified flag or exclusion rule is followed. These cases test the required behavior against known answers, without copying the cleaning function into its own test.

## Ask for it, and tell the agent

> Identify changes in this task that could alter the analytic sample or reported results. Add small known-answer checks for those behaviors using the project's existing test tools. Include a case that should fail. Expose the quick checks through the project command surface, and explain what they do not establish. Do not refit all models unless the change requires it.

Separate quick checks from expensive recalibration and the full reproduction run (§8). Required validation belongs in the maintained project, even if it began as an exploratory script. Follow §8 if R checks hang when launched through the agent.

## Inspect the changes that tests cannot settle

Use the app's diff view to inspect changed specifications, exclusions, dependencies, and execution rules. Difftastic is an optional structural diff tool that can reduce formatting noise in supported languages; it still does not interpret the scientific meaning of a change. Keep the ordinary diff available.

A formatter makes code layout consistent; a linter inspects code for specified style issues and some programming mistakes. Use them when they help the project, and review their adoption separately from an analysis correction. Reformatting a whole file during a small edit can make the substantive change harder to see.

## Check the checks

Ask the agent to run the deliberately failing example and the valid one, report outcomes, and restore the intended test inputs. Review changes to tests as carefully as changes to analysis code. A specification change can justify updating a test, but the reason must be explicit; deleting a failing check to finish the task is not a correction.

Tests establish only the properties they examine. The research guide's *Verification* chapter explains the complementary role of independent implementations, methodological review, and calibration. Passing tests alone establishes none of those broader conclusions.

# 14. Understand usage: the built-in display and ccusage

Use Claude's own usage display to check the allowance for your account. This chapter also explains how ccusage can summarize past sessions from saved local logs, helping you identify where usage accumulated. Its token counts and monetary estimates may differ from your subscription balance or bill.

## What to inspect first

Check the app's usage controls or the terminal's `/usage` command. Limits depend on the account and can change; use the current [Claude usage guidance](https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits) and your institutional plan rather than a fixed number in this guide.

Long conversations, large inputs and outputs, model choice, and reasoning effort can increase usage. A model fit computing on your laptop does not itself consume language-model tokens merely because time passes. Repeatedly asking the agent for progress updates or having it read large logs can create additional calls to the language model.

## What ccusage adds

[ccusage](https://ccusage.com/guide/) summarizes compatible local logs by periods and sessions. Its coverage depends on which sessions were logged, retained, and available on this machine. Deleted logs, work on other machines, and unsupported interfaces can leave gaps. Cost estimates depend on the tool's pricing assumptions and are not an invoice.

> Check Claude's built-in usage information first. If the retained logs can answer my question, use a reviewed version of ccusage to summarize this week's largest sessions. Report the covered dates and missing sources. Separate measured token totals from hypotheses about why a session was expensive. Do not upload the logs or quote confidential contents.

Review and record the package version before running it. A package executed through npx is still downloaded code, even if it is not installed permanently.

## Use the result to change a habit

Compare the report with sessions you remember, and look for an actionable pattern: whole data files read into context, repeated full builds, or a long conversation that should have ended after its task. Read selected log lines instead of streaming everything. Queue long computations and inspect their status and outputs (§7).

A missing session is a coverage problem to investigate, not evidence of zero use. Retained logs may themselves contain confidential material; apply the project's access and retention rules to them.

# 15. Run in a separate environment: containers

A container provides a separate software environment in which to run a program. This chapter covers two uses: packaging an analysis so a collaborator can run it, and restricting the resources available to unfamiliar code. It explains how to have the agent propose a configuration and check each purpose separately. The folders, credentials, network access, and privileges you provide determine what code inside can reach.

## What it gives the agent

A Dockerfile is a recipe for building the environment from a starting image, system packages, research-language dependencies, and project files. The resulting *image* is the packaged software used to start a container. Sharing it can help a collaborator run the same software. The Dockerfile alone does not preserve package repositories, external services, hardware behavior, or downloads whose versions were not fixed.

A folder shared from your computer into the container is called a *host mount*. If that mount is writable, code in the container can change the files in it. Supplied credentials are also available to that code. Broad system privileges or access to Docker's control socket can defeat much of the intended separation. Review [Docker's security model](https://docs.docker.com/engine/security/) and [bind mounts](https://docs.docker.com/engine/storage/bind-mounts/) when deciding what the container may access.

## The recommended route

On a Mac, Colima with the Docker CLI is the command-line setup used here. Follow [Colima's setup](https://github.com/abiosoft/colima) for the current supported route. On Ubuntu or WSL2, use a supported Docker Engine installation. Keep an institutionally managed Docker Desktop installation if it is already approved and suitable; there is no need to replace it to follow this chapter.

Containers are optional for an ordinary analysis with an adequate environment record. They become useful when system dependencies are difficult to reproduce, a collaborator needs a portable environment, or code needs a more restricted execution space.

## Ask for a limited first run

> Propose a container configuration for this reproduction package. List every host mount, its read/write status, network access, credentials, and runtime privileges. Start with a harmless test, no credentials, and only the required input mounted read-only plus a separate output directory. Show that allowed output works and that an unmounted practice file is inaccessible before running the package.

For a reproducible environment, specify the exact base image in the Dockerfile using its *digest*, a fingerprint of its contents, and restore recorded dependencies (§9). Record the platform architecture and build instructions. If future rebuilding matters, preserve the built image through an approved archive route as well as the recipe, and test restoration. None of this guarantees indefinite compatibility.

## Check both uses separately

A successful reproduction establishes that this build ran under this configuration. It does not show the container safely contains arbitrary untrusted code. Conversely, blocking access to a test file does not establish that numerical results match the original analysis.

Inspect mounts and privileges before each materially different workload. Do not mount the whole home directory for convenience. A container used to build a trusted project may reasonably have different access from one used to inspect an unknown replication package; label and review those configurations separately.

For institutional clusters, use the runtime the service supports, often Apptainer, with the research-computing team's instructions. Container installation and its daemon can require privileges outside the agent's ordinary sandbox (§4); approval for that setup is separate from permission to run every future container.

<!-- ===== PART IV — REACHING FURTHER ===== -->

# 16. Connect the agent to data and services: MCP

A connection can let the agent search a reference library, query a database, or use a service without exchanging files by hand. This chapter explains how to choose an approved MCP connection, limit its access, and check it with a known record. Add one when it solves a recurring task and the service, data, and permissions are approved for that use.

## What a connection adds

The Model Context Protocol (MCP) gives an agent a standard way to call tools supplied by a server. That server may run locally or remotely. Its functions and credentials determine whether the agent can read, write, or send information. The protocol itself does not establish that a server is trustworthy or appropriate for research data.

A reference-library connection might return titles and abstracts. A database connection might return rows or also permit updates. Ask which operations are exposed, which account authorizes them, and where returned content is processed. A read-only service can still disclose data to the model.

## Start with one approved, limited connection

Use a service's official or institutionally approved connection when available, with read-only access if the task only requires reading. Follow [Claude's MCP documentation](https://code.claude.com/docs/en/mcp) for the actual interface and installation scope. Prefer project-specific configuration when only one project needs the service.

At Harvard, check the current [HUIT Claude guidance](https://www.huit.harvard.edu/claude) before connecting a service. As of September 2026, HUIT requires review and approval of connectors. A connector's presence in a catalog does not establish institutional approval.

> Identify the approved connection for [service] and the operations this task needs. Show its source, data destinations, credentials, and requested access before configuring it. Use a test collection with no confidential material and read-only access first. Retrieve one record I can check independently. Do not send messages or change service records.

You complete authentication and approve the intended scope. Do not put a token in a shared configuration file; use the credential mechanism appropriate to the connection (§12).

## Check what it can reach

Verify the known test record and inspect which tools the connection exposes. If available, use a harmless test to confirm write operations are unavailable. Check the connection's own controls: a local shell sandbox does not automatically constrain a separately hosted service.

Treat returned text as source material rather than instructions. A document can contain directions aimed at the agent, including requests to visit another site or reveal files. Restrict access so that a mistaken response has fewer possible consequences.

## Keep project decisions in project files

A connection may offer memory, and Claude may retain notes between sessions. The research guide explains how to keep durable conventions and decisions in inspectable files. Do not add a memory service merely to duplicate those files. If you do use one, decide what it stores, who can read it, and how it is corrected or deleted.

Interface support differs. In particular, check the current desktop documentation before relying on a connector in a WSL session. A CLI-configured server and an app connector may have different availability and authentication routes.

# 17. Let the agent inspect a browser and interact with pages

Browser access is useful for checking a rendered report or carrying out a limited interaction that a direct download cannot provide. For data acquisition, first follow the research guide's *Getting data* chapter: prefer a documented API or export when it meets the need and is permitted.

## The recommended starting point

Use [Playwright MCP](https://github.com/microsoft/playwright-mcp) for a browser the agent controls in a separate profile. Start with a local report or a public test page, without account credentials. A separate browser profile helps avoid accidental use of your existing logins, but is not a complete security boundary.

The agent can inspect page structure, navigate, interact, and capture evidence of the rendered result. For a report, ask it to compare a displayed number with the saved result and inspect a figure at the size readers will see. Reading HTML alone cannot establish that the layout is usable.

> Configure the official Playwright MCP server for this project using a reviewed version. Open the local test report in a separate browser profile with no signed-in accounts. Inspect the table, figure, and navigation. Report concrete problems with screenshots or page locations, and compare one displayed result with its source file.

Check current installation requirements in the server documentation. An MCP package and its browser dependencies are executable software, so review their access under §4 and configure them under §16.

## When the browser needs an account

Claude's browser integration can work in a signed-in browser when the account and interface support it. Follow the current [Chrome integration documentation](https://code.claude.com/docs/en/chrome) and institutional approval process. Grant the specific site access needed for the task, and review consequential actions such as submitting a form or changing a record.

Whatever the agent reads may become part of model processing. Do not expose participant portals, private correspondence, or other confidential systems merely because you can open them yourself. A web page can also carry malicious instructions; account access increases what following them could affect.

## Make recurring collection reproducible

An agent can help discover a permitted route and prototype the interaction. Once the collection steps are stable, save a script, inputs, outputs, and failure handling. Test it on a small sample before increasing volume. Browser-driven collection can be reproducible, but a conversational record of clicks alone is a weak reproduction package.

Computer use reaches beyond browser pages to a desktop's visible applications. Reserve it for a task the narrower tools cannot perform, in an approved isolated environment with appropriate mounts, network access, and credentials (§15). A container label alone does not establish that the desktop is isolated. This guide does not require computer use to follow any of its core paths.

# 18. Run several agents at once: git worktrees

Git worktrees give parallel agents separate working folders and branches within the same repository. This chapter explains how to assign tasks, provide each agent's inputs and environment, and review the combined changes. Start with two tasks whose results you can check independently.

## What a worktree separates

Separate working folders reduce the chance that agents overwrite each other's edits. They still share repository history and may share databases, caches, credentials, or outputs outside those folders. Worktrees do not restrict access for security purposes, and changes can still conflict when combined. See the [git worktree manual](https://git-scm.com/docs/git-worktree).

For example, one agent could add known-answer checks for a cleaning function while another prepares a figure from an already saved result. Give each a separate output directory. Review both changes, then test their combined state before accepting it.

## Ask for it, and tell the agent

> Prepare separate worktrees and branches for these two tasks: [task A] and [task B]. Identify shared inputs and resources before starting. Give each task a separate output location and the recorded environment it needs. Preserve existing uncommitted work. Do not merge or remove either worktree until its changes and outputs have been reviewed.

Use the app's supported worktree controls or have the agent prepare them with git. Terminal users can open a session in each worktree (§21). Confirm the actual folder and branch each session uses before either starts editing.

## Prepare the inputs deliberately

A new worktree contains the files tracked by git. Ignored data, package libraries, and saved model fits may be absent. Arrange approved access to those inputs and a way to restore the environment before either agent starts. Otherwise it may improvise a substitute for a missing file or repeat an expensive fit. Do not let both agents write to a shared cache without checking that the tool supports it.

Independent implementation for verification needs additional separation. Give fresh sessions the approved inputs and specification without exposing the first implementation or its intermediate results. Worktrees alone do not provide that independence, especially if the reference implementation is in shared history. The research guide's *Verification* chapter explains what to compare and how to interpret agreement.

## Review and integrate

Ask for `git worktree list`, each branch's changes, test results, and remaining uncommitted files. Resolve overlapping edits deliberately. Run checks on the combined result, since two individually passing changes can fail together.

Remove a worktree only after confirming its needed work is committed or preserved and its branch is no longer needed. Keep parallelism within the machine's memory and compute limits (§7). Extra agents are useful only when their outputs can be specified, checked, and integrated.

# 19. Keep a history of tool settings: chezmoi

As you add tools, their settings can become scattered across several folders. Chezmoi keeps maintained copies together and puts them where each tool expects to read them. This chapter explains how to record changes, test an update, and restore earlier settings. It is optional when project-local configuration already covered by git meets your needs.

## What it gives the agent

Chezmoi keeps source versions of selected settings and writes them to the locations each program reads. A private git repository can record changes to that source. This makes it possible to inspect a proposed update and recover a previous configuration.

![](figures/chezmoi-source-and-applied.svg){#fig-chezmoi-source-and-applied fig-alt="Chezmoi keeps source versions in a settings repository and applies them to the paths programs read. Both locations need review and protection." above="16pt" below="14pt"}

There are two copies to consider: the source managed by chezmoi and the applied file used by the program. Protect both when a file defines the agent's permissions. If the source remains editable, the agent could change it and later have chezmoi overwrite the protected active setting (§4).

## Start with a harmless setting

> Inspect how my settings are already managed. If chezmoi would help, propose a small initial set and preserve backups before importing it. Exclude credentials and sensitive account details. Show the source and applied paths, the proposed diff, and a way to restore the previous version. Do not publish the settings repository.

Use the [chezmoi quick start](https://www.chezmoi.io/quick-start/) for the current workflow. Start with a harmless setting, inspect `chezmoi diff`, and apply it after review. Confirm the program sees the change, then rehearse restoring the previous setting before managing permission files.

## Keep the record and the active files aligned

If the agent edits an applied file directly, it must capture that change back to chezmoi's source before a later apply overwrites it. Review the resulting source diff and commit the intended change. Do not broadly capture a directory that might contain tokens or account state.

Templates can express differences between machines, but test them before applying to a working setup. A startup file that references a missing program can break the next shell session. On WSL2, manage the Linux home deliberately rather than assuming it is the same as the Windows user's settings.

Keep an existing institutional configuration manager when it already does this job. Adding chezmoi should make settings easier to inspect and restore, not create a second authority that continually overwrites the first.

<!-- ===== PART V — WORKING IN THE TERMINAL YOURSELF ===== -->

# 20. Starting in the terminal

The terminal is optional. It becomes useful when you want to run a saved command yourself, work on a remote machine, or view an agent session beside a job log. This chapter introduces moving between folders, running commands, saving output, and reviewing a small git change. Start with the terminal already on your machine; later sections cover optional additions.

## The terminal and the shell

A terminal is a window for typed commands and their output. A shell is the program inside it that interprets the commands. On a Mac, open Terminal through Spotlight (Command-Space, then type Terminal). For this guide's Windows route, open the Ubuntu environment installed through WSL2 (§2), either directly or through Windows Terminal. The examples below use a Unix shell, not PowerShell.

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

If the project has a justfile (§8), `just --list` shows its named recipes. Run an inexpensive check first. A *command not found* message can mean the program is absent or that its directory is missing from `PATH`, the list of folders the shell searches for programs. Ask the agent to identify the cause before reinstalling anything.

Programs normally print ordinary output and errors to the terminal. To save both, an example is:

```
just check > check.log 2>&1
```

This overwrites `check.log`; use a new name when an earlier log matters. Saving a log does not put the job in a queue; use §7 for long work. Control-C requests interruption of the program currently running in the terminal. It does not undo files already written or guarantee that other processes started by that program have stopped.

An environment variable is a named value available to a running program and usually to programs it starts. Credentials are often supplied this way. Use the vault procedure in §12 rather than typing secret values into commands, shell history, or startup files. A program that receives the value can read it.

## Review a small git change

In an existing practice repository, these read-only commands establish where you are:

```
git status
git diff
git log --oneline -5
```

`git diff` normally shows unstaged tracked changes. `git diff --staged` shows what would be included in a commit. After reviewing an agreed change to `notes.md`, stage just that file and inspect it:

```
git add notes.md
git diff --staged
git commit -m "Clarify the practice task"
```

Check that no unrelated files were already staged. Restoring a file discards its uncommitted edits, so inspect the diff and preserve needed work before using a restore command. Ask the agent for a command scoped to the exact file and intended version. Git cannot undo changes to external services (§6).

## What a terminal does and does not keep alive

A terminal window displays a process; a multiplexer can preserve its session when that window closes (§24). A queue records and manages submitted jobs (§7). A pipeline runner determines which analysis steps need rerunning (§11). None makes computation continue while a laptop is asleep or after a process has been terminated.

For a remote server, use the institution's approved access and scheduling procedures. Installing an agent on that server is a separate data-processing decision: being close to the files does not mean their contents stay away from the model provider.

# 21. Your first Claude session in the terminal

This chapter walks through starting Claude Code in a terminal, checking its account and project, and making a small edit. It also introduces the session controls and a mode that returns an answer and exits. You can keep using the app for other work; the terminal provides another way to work with the agent.

## Install and start

Follow the current [Claude Code quickstart](https://code.claude.com/docs/en/quickstart) for the supported installation route on your platform. Having the desktop app does not by itself establish that the `claude` command is installed. Ask the agent to check first. Complete account sign-in yourself and select the institutional subscription route you intend to use.

In the practice folder from §20, run:

```
claude
```

Read the folder-trust prompt before accepting it. Ask Claude to identify the project instructions it loaded and summarize `notes.md` without changing anything. Then request one small edit and inspect the file and diff, as in the research guide's first-session exercise.

The project directory determines ordinary relative paths; it is not by itself a boundary on everything the process can read. The access configuration in §4 still matters.

## Controls you will use

The research guide's *Modes* chapter explains when to plan and how much autonomy to give an agent. As of September 2026, the terminal documentation describes these controls; check their availability against the installed version's help and [interactive-mode documentation](https://code.claude.com/docs/en/interactive-mode):

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

# 22. Optional terminal conveniences: iTerm2 and Windows Terminal

If you want commands and job output visible side by side, a terminal with split panes can help. This chapter shows a small layout to try in iTerm2 on a Mac or Windows Terminal with Ubuntu WSL2. These applications also offer searchable output and reusable profiles. Keep the terminal you already use if it meets your needs.

## Try one useful layout

On a Mac, ask the agent to help install [iTerm2](https://iterm2.com/documentation.html) without replacing existing shell settings. Open the project in one pane and a read-only queue status command in another. Search the output for a task identifier, copy its result, and close the extra pane. If that improves your work, save the layout or profile.

On Windows, use the Ubuntu profile in [Windows Terminal](https://learn.microsoft.com/windows/terminal/). Confirm the working directory and Linux environment with the commands from §20. A neighboring PowerShell tab is a different environment.

Use legible fonts and a restrained color scheme. Special fonts are only needed if your chosen prompt requires their symbols. No terminal replacement or theme is required to run Claude or any of the project's saved commands.

# 23. Optional shell and prompt conveniences

A shell interprets commands, and its prompt marks where you enter the next one. This chapter shows how an optional Oh My Posh prompt can display the current directory, git branch, and failed-command status, helping you check where you are before acting. Keep the shell your machine already provides: usually zsh on a current Mac, and often bash in Ubuntu.

## Add information before decoration

The useful question is whether you can tell which project and branch a command will affect. First use `pwd` and `git status`. If you switch projects often, a prompt that displays that information can help prevent mistakes.

[Oh My Posh](https://ohmyposh.dev/docs/) is the configurable prompt used here. It can work with an existing shell; adopting it does not require replacing the shell or adding a framework such as Oh My Zsh. Keep a simple existing prompt if it already provides the information you need.

> Preserve my existing shell startup files and show the proposed diff. If a prompt change would help, configure Oh My Posh to show the directory, git branch, and failed-command status. Test a fresh shell and explain how to restore the previous prompt. Do not replace unrelated aliases or environment settings.

Shell startup files execute commands, so review changes before opening a fresh shell. A harmless prompt change should not add credentials, start services, or change which R or Python a project uses. Test both your interactive shell and the agent's actual execution environment; they may load different startup files.

Further interactive conveniences can wait until you have a repeated need. They are not prerequisites for agent work, and installing a collection of aliases can make copied commands harder to understand.

# 24. Keep terminal sessions available: Zellij

Zellij groups terminal panes into a named session that you can leave and return to from another terminal window. This chapter shows how to try that with a harmless session and explains what continues running while you are away. It is useful when closing a window or losing a remote connection would otherwise disrupt your working layout.

## Try a session without important work

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

## Separate the session from the job

Detaching leaves the session's processes running while the host and session remain available. It does not protect against shutdown, lost storage, or a program failure. Restoring a layout after a restart is different from resuming the processes that previously occupied it.

Use pueue for a local job's submission record and result (§7), or the institutional scheduler on a cluster. Zellij provides a convenient place to inspect those jobs and their logs. On a remote machine, the session lives there; reconnecting your laptop does not revive a remote process that has died.

Keep an established multiplexer if it already works for you. The useful check is being able to detach and recover a harmless session before relying on it during important work.

# 25. An editor beside the agent: Positron

Positron is an optional editor for inspecting R or Python code, data, and plots in one window. This chapter shows how to open a project in its recorded environment and review changes made by an agent working in the app or terminal. Keep RStudio, Stata, or an existing editor when it already supports your work.

## Open an existing project

Install through [Positron's official site](https://positron.posit.co/) if you want to try it, then open a practice project folder. Select the R or Python interpreter that belongs to the recorded project environment (§9). Confirm the version and library path before executing code; an editor can discover several installations.

Run a small existing analysis, inspect a dataframe in the [Data Explorer](https://positron.posit.co/data-explorer), and view its saved plot. Filtering or sorting the displayed table is useful for inspection, but those temporary views do not replace reproducible cleaning code.

## Review the agent's work in the editor

Have the agent make a small agreed change through your existing app or terminal session. Inspect the changed file, its diff, and its output in Positron. Both programs are working on the same files, so avoid simultaneous conflicting edits.

An AI extension or database connection is a separate addition with its own access and account requirements. You do not need one for this workflow. Keep the initial trial focused on whether the editor makes code, data, and results easier for you to inspect.
