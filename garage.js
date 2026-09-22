// garage.js — the landing page's garage. Hand-maintained, like index.qmd; not part of the sync.
// Every tool in the room is a section of the guide and a real link to its page. The room, the bench and
// the tools are drawn here; the corkboard, its readout and the robot are the static SVG in index.qmd.
// Pointer: hover previews on the corkboard, a press opens the section. Touch: the first tap pins the
// section to the corkboard, with a link, and the second opens it.
// Named garage.js on purpose: the shared splitter takes a console.js as the sign of a site with
// per-chapter robots, and this site has none.
(function () {
  const SITE = "chapters/";
  const NS = "http://www.w3.org/2000/svg";
  const v = n => "var(--g-" + n + ")";

  const GROUPS = {
    I:   { name: "Part I",   long: "I · What an agent has, and what it lacks", dot: v("foundation") },
    II:  { name: "Part II",  long: "II · The core set",                        dot: v("language") },
    III: { name: "Part III", long: "III · Reproducible and safe",              dot: v("control") },
    IV:  { name: "Part IV",  long: "IV · Reaching further",                    dot: v("agents") },
    V:   { name: "Part V",   long: "V · Working in the terminal yourself",     dot: v("surface") },
  };

  // ---- sections: the tool that stands for each, and what the corkboard says about it ----
  // Slugs are the site's chapter file names: a retitled chapter needs its slug updated here by hand.
  const CH = [
    { n: "1", group: "I", slug: "01-an-agent-is-a-model-with-tools", title: "An agent is a model with tools", tool: "the robot",
      body: "What an agent is, what a plain machine gives it, and the three ways to give it more: programs, connections, and instructions." },
    { n: "2", group: "I", slug: "02-your-starting-toolkit-and-how-to-grow-it-homebrew", title: "Your starting toolkit, and how to grow it", tool: "the workbench",
      body: "Every tool arrives through a package manager, the one thing the agent cannot fetch for itself. The few steps only you can do, on a Mac and on Windows." },
    { n: "3", group: "I", slug: "03-telling-the-agent-what-it-has-instruction-files-and-skills", title: "Telling the agent what it has", tool: "the clipboard",
      body: "An installed tool does nothing until the agent knows to reach for it: the file it reads every session, and what a standing line looks like." },
    { n: "4", group: "I", slug: "04-keeping-the-agents-reach-in-proportion-permission-settings-and-the-os-sandbox", title: "Keeping the agent's reach in proportion", tool: "the locked cabinet",
      body: "More tools means more reach, for mistakes too. Deny rules, approval prompts, and the sandbox, set before the tools arrive." },
    { n: "5", group: "II", slug: "05-find-and-read-things-fast-rg-fd-jq-yq-bat", title: "Find and read things fast", tool: "the hammer",
      body: "The small tools the agent uses hundreds of times a session to find and read things: faster searches, fewer tokens, fewer mistakes." },
    { n: "6", group: "II", slug: "06-undo-anything-and-work-with-github-git-and-gh", title: "Undo anything, and work with GitHub", tool: "the tape measure",
      body: "Every change reviewable and reversible, and GitHub without improvised API calls." },
    { n: "7", group: "II", slug: "07-run-long-jobs-in-your-own-queue-pueue", title: "Run long jobs in your own queue", tool: "the clock",
      body: "A queue on your own machine. Long fits outlive the session, and a simulation study keeps every core busy until the list is empty." },
    { n: "8", group: "II", slug: "08-one-command-for-every-task-in-a-project-just", title: "One command for every task in a project", tool: "the power drill",
      body: "One command for every task in a project, so the agent stops working out the build afresh each time." },
    { n: "9", group: "II", slug: "09-pin-the-language-and-its-packages-rig-and-renv-uv", title: "Pin the language and its packages", tool: "the wrench set",
      body: "A pinned language and pinned packages, so the project rebuilds on another machine, or next year." },
    { n: "10", group: "II", slug: "10-turn-the-analysis-into-a-paper-or-a-deck-quarto-and-pandoc", title: "Turn the analysis into a paper or a deck", tool: "the pencil cup",
      body: "From analysis to a paper or a deck: Quarto for documents that run code, pandoc for those that do not." },
    { n: "11", group: "III", slug: "11-re-run-only-what-changed-targets-and-snakemake", title: "Re-run only what changed", tool: "the gears",
      body: "A pipeline that knows what is out of date and re-runs only that, for when steps take hours." },
    { n: "12", group: "III", slug: "12-keep-keys-and-tokens-out-of-your-files-1password-and-direnv", title: "Keep keys and tokens out of your files", tool: "the drawers and keys",
      body: "The agent uses a key without ever seeing it written down. 1Password holds the values; direnv hands each project only what it needs." },
    { n: "13", group: "III", slug: "13-check-what-the-agent-changed-tests-and-diff-review", title: "Check what the agent changed", tool: "the level and square",
      body: "Tests the agent can run and differences it can show, so you can check what it changed." },
    { n: "14", group: "III", slug: "14-see-what-the-agent-spent-so-the-allowance-lasts-ccusage", title: "See what the agent spent", tool: "the multimeter",
      body: "Where the token allowance goes, and how to make it last." },
    { n: "15", group: "III", slug: "15-contain-the-agent-completely-a-container", title: "Contain the agent completely", tool: "the toolbox",
      body: "A box the agent cannot leave, for untrusted code and for environments that must rebuild exactly." },
    { n: "16", group: "IV", slug: "16-connect-the-agent-to-data-and-services-and-let-it-remember-mcp-memory", title: "Connect the agent to data and services", tool: "the power strip and jars",
      body: "What the agent plugs into and what it keeps: connections to data and services, and memory across sessions." },
    { n: "17", group: "IV", slug: "17-let-the-agent-use-a-browser-and-the-screen", title: "Let the agent use a browser, and the screen", tool: "the window",
      body: "A browser, and the screen itself, for work that crosses from your machine to the outside." },
    { n: "18", group: "IV", slug: "18-run-several-agents-at-once-git-worktrees", title: "Run several agents at once", tool: "the charging dock",
      body: "Several agents at once, each in its own working tree and branch, so parallel work cannot collide." },
    { n: "19", group: "IV", slug: "19-version-control-for-your-tools-settings-chezmoi", title: "Version control for your tools' settings", tool: "the parts organizer",
      body: "Version control for the settings files your tools scatter across the home directory." },
    { n: "20", group: "V", slug: "20-why-use-the-terminal-instead-of-the-app", title: "Why use the terminal instead of the app?", tool: "the light switch",
      body: "What a terminal gives that the app does not, and why most readers can stop before this Part." },
    { n: "21", group: "V", slug: "21-the-agent-in-a-terminal-claude-code", title: "The agent in a terminal", tool: "the radio",
      body: "The same agent, started as a command in a terminal." },
    { n: "22", group: "V", slug: "22-a-terminal-worth-working-in-iterm2-windows-terminal", title: "A terminal worth working in", tool: "the strip light",
      body: "The window everything in a terminal appears through." },
    { n: "23", group: "V", slug: "23-the-shell-its-framework-and-the-prompt-zsh-oh-my-zsh-oh-my-posh", title: "The shell, its framework, and the prompt", tool: "the screwdrivers",
      body: "The shell, the framework that loads its plugins, and a prompt that shows the state you would otherwise ask for." },
    { n: "24", group: "V", slug: "24-keep-sessions-alive-and-watch-several-things-at-once-zellij", title: "Keep sessions alive and watch several things", tool: "the vise",
      body: "Sessions that survive closing the window, and panes to watch several things at once." },
    { n: "25", group: "V", slug: "25-an-editor-beside-the-terminal-positron", title: "An editor beside the terminal", tool: "the drafting lamp",
      body: "An editor beside the terminal, for reading and writing at length." },
  ];
  const byN = n => CH.find(c => c.n === n);

  // ---- svg helpers ----
  const el = (name, attrs, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const R = (p, x, y, w, h, fill, extra) => el("rect", Object.assign({ x, y, width: w, height: h, fill }, extra || {}), p);
  const C = (p, cx, cy, r, fill, extra) => el("circle", Object.assign({ cx, cy, r, fill }, extra || {}), p);
  const E = (p, cx, cy, rx, ry, fill, extra) => el("ellipse", Object.assign({ cx, cy, rx, ry, fill }, extra || {}), p);
  const P = (p, d, fill, extra) => el("path", Object.assign({ d, fill }, extra || {}), p);
  const S = (p, d, stroke, w, extra) => el("path", Object.assign({ d, fill: "none", stroke, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" }, extra || {}), p);
  const G = (p, x, y, s, extra) => el("g", Object.assign({ transform: "translate(" + x + "," + y + ")" + (s && s !== 1 ? " scale(" + s + ")" : "") }, extra || {}), p);
  const D = { class: "d" };                       // a detail: left out of the outline a hung tool leaves behind
  const pts = ps => ps.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
  const poly = (p, ps, fill, extra) => el("polygon", Object.assign({ points: pts(ps), fill }, extra || {}), p);

  // ---- perspective: one vanishing point for everything that has depth ----
  // A box's front face is drawn flat; its side and top recede toward VP by the fraction t. A box left of
  // VP shows its right side, a box right of it shows its left, so each shows the side facing the centre.
  const VP = [540, 200];
  const back = (x, y, t) => [x + (VP[0] - x) * t, y + (VP[1] - y) * t];
  function box(p, x, y, w, h, t, front, side, top, showTop) {
    if (showTop !== false && y > VP[1]) poly(p, [[x, y], [x + w, y], back(x + w, y, t), back(x, y, t)], top);
    if (x + w < VP[0]) poly(p, [[x + w, y], [x + w, y + h], back(x + w, y + h, t), back(x + w, y, t)], side);
    else if (x > VP[0]) poly(p, [[x, y], [x, y + h], back(x, y + h, t), back(x, y, t)], side);
    return R(p, x, y, w, h, front);
  }

  // =====================================================================================
  // the room
  // =====================================================================================
  const FLOOR = 546, W = 1200, H = 712;
  (function room() {
    const g = document.getElementById("room");
    R(g, 0, 40, W, FLOOR - 40, v("wall"));
    for (let x = 62; x < W; x += 62) el("line", { x1: x, y1: 40, x2: x, y2: FLOOR, stroke: v("wall-line"), "stroke-width": 1.5 }, g);
    R(g, 0, 0, W, 40, v("beam"));
    R(g, 0, 33, W, 7, v("beam-2"));
    for (let x = 90; x < W; x += 204) R(g, x, 0, 26, 33, v("beam-2"), { opacity: 0.55 });   // rafter ends
    R(g, 0, FLOOR, W, H - FLOOR, v("floor"));
    for (let xb = -900; xb <= 2100; xb += 150) {
      const k = (FLOOR - VP[1]) / (H - VP[1]);
      el("line", { x1: (VP[0] + (xb - VP[0]) * k).toFixed(1), y1: FLOOR, x2: xb, y2: H, stroke: v("floor-line"), "stroke-width": 2 }, g);
    }
    for (const y of [578, 628, 694]) el("line", { x1: 0, y1: y, x2: W, y2: y, stroke: v("floor-line"), "stroke-width": 2 }, g);
    R(g, 0, FLOOR, W, 8, v("skirt"));
  })();

  // =====================================================================================
  // the tools. Each draws into the group it is given; flat ones in local coordinates about an origin,
  // boxes in the scene's own coordinates, since what a box shows depends on where it stands.
  // =====================================================================================
  const DRAW = {
    striplight(g) {
      const t = G(g, 515, 40);
      R(t, -160, 0, 320, 9, v("metal-3"));
      R(t, -166, 0, 12, 22, v("metal-2")); R(t, 154, 0, 12, 22, v("metal-2"));
      R(t, -152, 9, 304, 13, v("glow"), { rx: 4 });
      R(t, -152, 9, 304, 4, "#fff", { rx: 2, opacity: 0.55 });
    },
    window(g) {
      const t = G(g, 140, 112);
      R(t, -71, -48, 142, 96, v("frame"));
      R(t, -63, -40, 126, 80, v("sky"));
      E(t, -22, -6, 24, 9, v("sky-2")); E(t, -6, -13, 17, 9, v("sky-2")); E(t, 30, 16, 20, 7, v("sky-2"));
      P(t, "M-63 -12 L-35 -40 H-22 L-63 1Z M-63 22 L-1 -40 H6 L-63 29Z", "#fff", { opacity: 0.22 });
      R(t, -3, -40, 6, 80, v("frame")); R(t, -63, -3, 126, 6, v("frame"));
      R(t, -79, 48, 158, 9, v("frame")); R(t, -79, 55, 158, 3, v("skirt"));
    },
    jars(g) {
      const t = G(g, 60, 250);
      [["red", 0], ["mustard", 31], ["teal", 62]].forEach(([c, x]) => {
        R(t, x, -40, 26, 40, v("steel"), { rx: 4, opacity: 0.75 });
        R(t, x + 2, -26, 22, 24, v(c), { rx: 3 });
        R(t, x + 4, -20, 18, 10, v("cream"), { rx: 1.5 });
        R(t, x + 7, -17, 12, 1.6, v("metal-3")); R(t, x + 7, -14, 8, 1.6, v("metal-3"));
        R(t, x - 1, -46, 28, 8, v("metal-3"), { rx: 2 });
        R(t, x + 4, -38, 3, 10, "#fff", { opacity: 0.4 });
      });
      // the power strip: what the agent plugs into
      S(t, "M176 -7 q16 0 16 14 v26", v("dark"), 3);
      R(t, 187, 30, 10, 13, v("dark"), { rx: 2 }); R(t, 189, 43, 2, 6, v("metal")); R(t, 193, 43, 2, 6, v("metal"));
      R(t, 98, -14, 80, 14, v("cream"), { rx: 3 });
      R(t, 98, -4, 80, 4, v("metal"), { rx: 2, opacity: 0.5 });
      for (let i = 0; i < 4; i++) { R(t, 106 + i * 15, -11, 2, 5, v("dark")); R(t, 111 + i * 15, -11, 2, 5, v("dark")); }
      R(t, 166, -11, 7, 6, v("red"), { rx: 1 });
    },
    radio(g) {
      const x = 62, y = 310;
      S(g, "M" + (x + 56) + " " + y + " L" + (x + 84) + " " + (y - 36), v("metal-2"), 3);
      C(g, x + 84, y - 36, 3, v("metal-3"));
      S(g, "M" + (x + 12) + " " + (y - 1) + " q24 -18 48 0", v("dark"), 4);
      box(g, x, y, 76, 40, 0.035, v("red"), v("red-dk"), v("red-lt"));
      C(g, x + 21, y + 20, 14, v("dark")); C(g, x + 21, y + 20, 9, v("metal-3")); C(g, x + 21, y + 20, 3.5, v("dark"));
      R(g, x + 42, y + 8, 27, 10, v("cream"), { rx: 1.5 }); R(g, x + 58, y + 8, 1.6, 10, v("red-dk"));
      C(g, x + 48, y + 29, 5, v("cream")); C(g, x + 63, y + 29, 5, v("cream"));
      R(g, x + 47.3, y + 25, 1.4, 5, v("dark")); R(g, x + 62.3, y + 25, 1.4, 5, v("dark"));
    },
    dock(g) {
      const t = G(g, 200, 350);
      S(t, "M46 -5 q14 0 14 12 v10", v("dark"), 2.5);
      for (let i = 0; i < 3; i++) {
        const x = -40 + i * 28;
        R(t, x, -42, 24, 32, v("teal"), { rx: 3 });
        R(t, x, -42, 24, 9, v("teal-lt"), { rx: 3 });
        R(t, x + 4, -28, 16, 3, v("teal-dk")); R(t, x + 4, -22, 16, 3, v("teal-dk"));
      }
      R(t, -48, -12, 96, 12, v("dark"), { rx: 3 });
      for (let i = 0; i < 3; i++) C(t, -28 + i * 28, -6, 2.6, i === 2 ? v("mustard-2") : v("green"));
    },
    wrenches(g) {
      [[326, 104, 1.0], [366, 94, 0.86], [402, 84, 0.72]].forEach(([x, len, k]) => {
        const t = G(g, x, 146, k);
        const L = len / k;
        C(t, 0, 0, 2.6, v("metal-3"), D);
        P(t, "M-4 9 L4 9 L3.4 " + (L - 9) + " L-3.4 " + (L - 9) + "Z", v("metal"));
        P(t, "M0 -10 A10 10 0 1 0 0 10 A10 10 0 1 0 0 -10Z M0 -5 A5 5 0 1 1 0 5 A5 5 0 1 1 0 -5Z", v("metal"), { "fill-rule": "evenodd" });
        P(t, "M4.5 11.1 V2 H-4.5 V11.1 A12 12 0 1 1 4.5 11.1Z", v("metal"), { transform: "translate(0," + L + ") rotate(14)" });
        R(t, -1.2, 14, 2.4, L - 30, v("steel"), Object.assign({ opacity: 0.7 }, D));
      });
    },
    hammer(g) {
      const t = G(g, 470, 196, 1.25);
      C(t, -9, -18, 2.4, v("metal-3"), D); C(t, 9, -18, 2.4, v("metal-3"), D);
      P(t, "M-4.5 -14 L4.5 -14 L6 46 Q6 58 0 58 Q-6 58 -6 46Z", v("wood"));
      P(t, "M-5.6 22 L5.6 22 L6 46 Q6 58 0 58 Q-6 58 -6 46Z", v("red"));
      for (const y of [28, 34, 40, 46]) R(t, -5.8, y, 11.6, 1.6, v("red-dk"), D);
      P(t, "M-26 -34 h17 v-3 h11 v3 h5 c12 0 21 7 25 19 c-9 -7 -16 -9 -25 -8 h-5 v5 h-11 v-5 h-17z", v("metal-3"));
      R(t, -26, -34, 5, 11, v("metal"), D);
      R(t, -20, -31.5, 11, 2, v("steel"), Object.assign({ opacity: 0.6 }, D));
    },
    drill(g) {
      const t = G(g, 596, 176, 1.15);
      P(t, "M-42 40 h46 l4 6 v12 h-54 v-12z", v("dark"));
      R(t, -40, 50, 46, 4, v("teal-lt"), D);
      P(t, "M-31 0 h25 l4 42 h-29z", v("teal-dk"));
      R(t, -28, 10, 19, 27, v("dark"), Object.assign({ rx: 5, opacity: 0.4 }, D));
      P(t, "M-6 5 q9 2 7 15 h-6z", v("dark"), D);
      P(t, "M-46 -24 q0 -7 7 -7 h55 q8 0 8 8 v19 q0 7 -7 7 h-56 q-7 0 -7 -7z", v("teal"));
      R(t, -40, -28, 58, 5, v("teal-lt"), Object.assign({ rx: 2.5, opacity: 0.8 }, D));
      for (let i = 0; i < 4; i++) S(t, "M" + (-40 + i * 6) + " -6 l3 -12", v("teal-dk"), 2, D);
      R(t, -14, -10, 30, 5, v("mustard"), D);
      R(t, 24, -28, 9, 32, v("dark"), { rx: 1.5 });
      for (let i = 0; i < 4; i++) R(t, 25.5, -24 + i * 7, 6, 2, v("metal-2"), D);
      poly(t, [[33, -24], [48, -17], [48, -7], [33, 0]], v("metal-3"));
      R(t, 48, -16, 7, 8, v("metal"));
      P(t, "M55 -13.6 h16 l4 1.6 l-4 1.6 h-16z", v("steel"));
    },
    meter(g) {
      const t = G(g, 712, 162, 1.05);
      C(t, 0, -36, 2.4, v("metal-3"), D);
      S(t, "M-7 28 c-6 22 -26 14 -22 40", v("red"), 2.6);
      S(t, "M7 28 c4 26 26 16 20 44", v("dark"), 2.6);
      R(t, -32.5, 66, 5, 20, v("red"), { rx: 2 }); R(t, -31.2, 85, 2.4, 9, v("steel"));
      R(t, 24.5, 70, 5, 20, v("dark"), { rx: 2 }); R(t, 25.8, 89, 2.4, 9, v("steel"));
      R(t, -21, -33, 42, 66, v("mustard"), { rx: 8 });
      R(t, -17, -29, 34, 58, v("dark"), Object.assign({ rx: 5 }, D));
      R(t, -13, -25, 26, 15, v("lcd"), Object.assign({ rx: 2 }, D));
      const tx = el("text", { x: 11, y: -13.5, "text-anchor": "end", class: "tiny d", style: "font-size:10px;fill:var(--g-dark)" }, t); tx.textContent = "12.6";
      C(t, 0, 6, 10, v("metal-3"), D); C(t, 0, 6, 7, v("metal-2"), D);
      S(t, "M0 6 L5 -1", v("mustard-2"), 2.4, D);
      for (let i = 0; i < 7; i++) { const a = (-150 + i * 50) * Math.PI / 180; C(t, Math.sin(a) * 13.5, 6 - Math.cos(a) * 13.5, 1, v("cream"), D); }
      C(t, -9, 23, 3.2, v("red"), D); C(t, 0, 23, 3.2, v("metal-2"), D); C(t, 9, 23, 3.2, v("metal-3"), D);
    },
    level(g) {
      const t = G(g, 552, 312, 1.05);
      C(t, -58, -14, 2.4, v("metal-3"), D); C(t, 58, -14, 2.4, v("metal-3"), D);
      R(t, -76, -10, 152, 20, v("mustard"), { rx: 3 });
      R(t, -76, -10, 8, 20, v("dark"), Object.assign({ rx: 2 }, D)); R(t, 68, -10, 8, 20, v("dark"), Object.assign({ rx: 2 }, D));
      R(t, -76, -10, 152, 4, v("mustard-2"), Object.assign({ opacity: 0.7 }, D));
      R(t, -15, -7, 30, 14, v("lcd"), Object.assign({ rx: 3 }, D));
      E(t, 1, 0, 6, 3.6, "#fff", Object.assign({ opacity: 0.85 }, D));
      R(t, -6.6, -7, 1.2, 14, v("dark"), D); R(t, 7.4, -7, 1.2, 14, v("dark"), D);
      [-46, 46].forEach(x => { C(t, x, 0, 7, v("lcd"), D); C(t, x, 0, 7, "none", Object.assign({ stroke: v("mustard-3"), "stroke-width": 1.5 }, D)); R(t, x - 0.6, -7, 1.2, 14, v("dark"), D); });
      // the try square beside it
      const q = G(g, 690, 302);
      C(q, -22, -34, 2.4, v("metal-3"), D);
      R(q, -17, 14, 56, 9, v("steel"));
      for (let i = 0; i < 9; i++) R(q, -10 + i * 5.4, 14, 1, i % 2 ? 3 : 5, v("metal-3"), D);
      R(q, -28, -28, 12, 52, v("wood-dk"), { rx: 1.5 });
      C(q, -22, -18, 1.8, v("mustard-2"), D); C(q, -22, 0, 1.8, v("mustard-2"), D); C(q, -22, 16, 1.8, v("mustard-2"), D);
    },
    clock(g) {
      const t = G(g, 806, 128);
      C(t, 0, 0, 31, v("blue-dk")); C(t, 0, 0, 26, v("cream"), D);
      for (let i = 0; i < 12; i++) R(t, -0.9, -24, 1.8, i % 3 ? 3.5 : 6.5, v("dark"), Object.assign({ transform: "rotate(" + i * 30 + ")" }, D));
      S(t, "M0 0 V-16", v("dark"), 3, D); S(t, "M0 0 L12 7", v("dark"), 3, D);
      S(t, "M0 4 L-7 -19", v("red"), 1.4, D); C(t, 0, 0, 2.6, v("red"), D);
    },
    clipboard(g) {
      const t = G(g, 806, 268);
      R(t, -27, -34, 54, 72, v("wood-dk"), { rx: 4 });
      R(t, -22, -24, 44, 57, v("cream"), D);
      [-12, 2, 16].forEach((y, i) => {
        R(t, -17, y - 4, 8, 8, "none", Object.assign({ stroke: v("metal-3"), "stroke-width": 1.4 }, D));
        if (i < 2) S(t, "M-16 " + y + " l3 3 l5 -7", v("language"), 2, D);
        R(t, -5, y - 2.5, 22, 2, v("metal-2"), D); R(t, -5, y + 2, 14, 2, v("metal"), D);
      });
      R(t, -13, -42, 26, 14, v("metal-2"), { rx: 3 }); C(t, 0, -36, 3, v("wall"), D);
    },
    bench(g) {
      const xfl = 8, xfr = 1022, yf = 466, t = 0.2, apron = 28;
      const bl = back(xfl, yf, t), br = back(xfr, yf, t);
      poly(g, [bl, br, [xfr, yf], [xfl, yf]], v("wood-lt"));
      for (const k of [0.3, 0.62]) { const a = back(xfl, yf, t * k), b = back(xfr, yf, t * k); el("line", { x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: a[1].toFixed(1), stroke: v("wood"), "stroke-width": 1.5 }, g); }
      for (const x of [70, 250, 470, 640, 860]) S(g, "M" + x + " " + (yf - 9) + " q18 -5 46 -1", v("wood"), 1.2, { opacity: 0.7 });
      R(g, xfl, yf, xfr - xfl, apron, v("wood"));
      R(g, xfl, yf, xfr - xfl, 3, v("wood-lt"), { opacity: 0.8 });
      R(g, xfl, yf + apron - 5, xfr - xfl, 5, v("wood-dk"));
      for (const x of [120, 380, 610, 900]) S(g, "M" + x + " " + (yf + 12) + " q30 -5 70 0", v("wood-dk"), 1.2, { opacity: 0.45 });
    },
    drawers(g) {
      const x = 70, y = 500, w = 150, h = 140, t = 0.10;
      const clip = el("g", { "clip-path": "url(#underBench)" }, g);
      box(clip, x, y, w, h, t, v("blue"), v("blue-dk"), v("blue-lt"), false);
      R(g, x, y + h - 7, w, 7, v("blue-dk"));
      const dh = (h - 17) / 4;
      for (let i = 0; i < 4; i++) {
        const yy = y + 5 + i * dh;
        R(g, x + 6, yy, w - 12, dh - 5, v("blue-lt"), { rx: 2 });
        R(g, x + 6, yy + dh - 8, w - 12, 3, v("blue-dk"), { rx: 1.5, opacity: 0.5 });
        R(g, x + w / 2 - 20, yy + 8, 40, 5, v("steel"), { rx: 2.5 });
        R(g, x + w / 2 - 20, yy + 12, 40, 2, v("blue-dk"), { opacity: 0.6 });
        R(g, x + 14, yy + 6, 20, 9, v("cream"), { rx: 1 });
      }
      // the keys hang on the wall behind the bench: the secrets, kept off the work surface
      const kx = x + w + (VP[0] - x - w) * t + 28;
      R(g, kx, 504, 48, 7, v("wood-dk"), { rx: 2 });
      [[8, 16], [24, 22], [40, 14]].forEach(([dx, len]) => {
        C(g, kx + dx, 511, 1.8, v("metal-3"));
        C(g, kx + dx, 519, 5.5, "none", { stroke: v("mustard"), "stroke-width": 2.6 });
        R(g, kx + dx - 1.4, 524, 2.8, len, v("mustard"));
        R(g, kx + dx + 1.4, 524 + len - 8, 3.4, 2.4, v("mustard")); R(g, kx + dx + 1.4, 524 + len - 4, 2.4, 2.4, v("mustard"));
      });
    },
    cabinet(g) {
      const x = 740, y = 500, w = 170, h = 140, t = 0.10;
      const clip = el("g", { "clip-path": "url(#underBench)" }, g);
      box(clip, x, y, w, h, t, v("metal-3"), v("dark"), v("metal"), false);
      R(g, x, y + h - 7, w, 7, v("dark"), { opacity: 0.6 });
      [x + 6, x + w / 2 + 2].forEach(dx => {
        R(g, dx, y + 6, w / 2 - 8, h - 19, v("metal-2"), { rx: 2 });
        R(g, dx + 8, y + 14, w / 2 - 24, h - 35, v("metal"), { rx: 2 });
        R(g, dx + 8, y + 14, w / 2 - 24, 3, v("steel"), { opacity: 0.6 });
      });
      for (const yy of [y + 18, y + h - 36]) { R(g, x + 2, yy, 5, 14, v("dark"), { rx: 1 }); R(g, x + w - 7, yy, 5, 14, v("dark"), { rx: 1 }); }
      R(g, x + 16, y + 20, 40, 13, v("mustard-2"), { rx: 1.5 });
      for (let i = 0; i < 5; i++) poly(g, [[x + 16 + i * 9, y + 33], [x + 21 + i * 9, y + 33], [x + 26 + i * 9, y + 20], [x + 21 + i * 9, y + 20]], v("dark"));
      // hasp and padlock
      const cx = x + w / 2, cy = y + h / 2 - 8;
      R(g, cx - 24, cy - 5, 48, 11, v("steel"), { rx: 2 });
      C(g, cx - 18, cy + 0.5, 1.8, v("metal-3")); C(g, cx + 18, cy + 0.5, 1.8, v("metal-3"));
      S(g, "M" + (cx - 9) + " " + (cy + 8) + " v-9 a9 9 0 0 1 18 0 v9", v("metal-3"), 4.5);
      R(g, cx - 15, cy + 7, 30, 25, v("mustard"), { rx: 4 });
      R(g, cx - 15, cy + 7, 30, 6, v("mustard-2"), { rx: 3 });
      C(g, cx, cy + 19, 3.4, v("dark")); R(g, cx - 1.4, cy + 20, 2.8, 7, v("dark"));
    },
    vise(g) {
      const x = 108, y = 448, t = 0.05, f = v("blue"), s = v("blue-dk"), tp = v("blue-lt");
      box(g, x, y - 11, 70, 11, t, f, s, tp);
      box(g, x + 8, y - 48, 18, 38, t, f, s, tp);
      R(g, x + 22, y - 48, 4, 13, v("steel"));
      R(g, x + 30, y - 35, 36, 7, v("metal"));
      R(g, x + 30, y - 35, 36, 2, v("steel"));
      box(g, x + 36, y - 48, 18, 38, t, f, s, tp);
      R(g, x + 36, y - 48, 4, 13, v("steel"));
      R(g, x + 54, y - 35, 34, 7, v("metal")); R(g, x + 54, y - 35, 34, 2, v("steel"));
      R(g, x + 84, y - 52, 5, 40, v("metal-2"), { rx: 2 });
      C(g, x + 86.5, y - 52, 4.5, v("metal-3")); C(g, x + 86.5, y - 12, 4.5, v("metal-3"));
      C(g, x + 17, y - 5.5, 2.4, v("blue-dk")); C(g, x + 60, y - 5.5, 2.4, v("blue-dk"));
    },
    pencils(g) {
      const t = G(g, 470, 446, 1.1);
      const pencil = (x, rot, len, c) => {
        const p = el("g", { transform: "translate(" + x + ",-24) rotate(" + rot + ")" }, t);
        R(p, -2.8, -len, 5.6, len, v(c));
        P(p, "M-2.8 " + (-len) + " L0 " + (-len - 8) + " L2.8 " + (-len) + "Z", v("wood-lt"));
        P(p, "M-1 " + (-len - 5.2) + " L0 " + (-len - 8) + " L1 " + (-len - 5.2) + "Z", v("dark"));
      };
      R(t, 6, -68, 9, 46, v("mustard-2"), { transform: "rotate(9 10 -24)" });
      for (let i = 0; i < 6; i++) R(t, 6, -64 + i * 7, i % 2 ? 3 : 5, 1, v("dark"), { transform: "rotate(9 10 -24)" });
      pencil(-8, -12, 30, "mustard"); pencil(-1, -2, 36, "red"); pencil(5, 6, 27, "blue");
      P(t, "M-17 -30 L17 -30 L13 0 L-13 0Z", v("cream"));
      P(t, "M-16 -22 L16 -22 L15 -14 L-15 -14Z", v("blue"));
      E(t, 0, -30, 17, 3.4, v("metal"));
      E(t, 0, 0, 13, 2.4, v("metal-2"), { opacity: 0.5 });
    },
    tape(g) {                                   // §6: every change can be reeled back in
      const t = G(g, 322, 446);
      R(t, 16, -10, 66, 6, v("mustard-2"));
      for (let i = 0; i < 9; i++) R(t, 24 + i * 6.5, -10, 1, i % 2 ? 2.5 : 4, v("dark"), D);
      R(t, 81, -13, 3, 11, v("metal-3"));
      R(t, -20, -38, 42, 38, v("mustard"), { rx: 8 });
      R(t, -20, -38, 42, 8, v("mustard-2"), { rx: 5, opacity: 0.75 });
      C(t, 1, -18, 12, v("dark"), D); C(t, 1, -18, 4.5, v("metal"), D);
      R(t, -24, -30, 5, 16, v("metal-3"), { rx: 2 });
    },
    screwdrivers(g) {                           // §23: the shell, the everyday hand tools of Part V
      R(g, 336, 290, 108, 6, v("wood-dk"), { rx: 2 });
      [["red", 24], ["blue", 19], ["mustard", 27], ["teal", 17]].forEach(([c, len], i) => {
        const x = 351 + i * 26;
        R(g, x - 6, 296, 12, 23, v(c), { rx: 4 });
        R(g, x - 6, 303, 12, 2, v("dark"), Object.assign({ opacity: 0.35 }, D)); R(g, x - 6, 309, 12, 2, v("dark"), Object.assign({ opacity: 0.35 }, D));
        R(g, x - 3, 319, 6, 4, v("metal-3"));
        R(g, x - 1.6, 323, 3.2, len, v("steel"));
        P(g, "M" + (x - 2.4) + " " + (323 + len) + " h4.8 l-1.2 4 h-2.4z", v("metal-2"));
      });
    },
    gears(g) {                                  // §11: only the wheels that need to turn, turn
      R(g, 360, 502, 110, 66, v("metal-3"), { rx: 5, opacity: 0.55 });
      const gear = (cx, cy, r, n, fill, rot) => {
        const t = el("g", { transform: "translate(" + cx + "," + cy + ") rotate(" + rot + ")" }, g);
        for (let i = 0; i < n; i++) R(t, -2.6, -r - 5, 5.2, 7, fill, { transform: "rotate(" + (i * 360 / n) + ")" });
        C(t, 0, 0, r, fill); C(t, 0, 0, r * 0.62, v("metal-3"), D); C(t, 0, 0, r * 0.24, v("steel"), D);
        for (let i = 0; i < 3; i++) R(t, -1.4, -r * 0.62, 2.8, r * 0.62, fill, Object.assign({ transform: "rotate(" + (i * 120) + ")" }, D));
      };
      gear(392, 536, 20, 12, v("mustard"), 0);
      gear(427, 521, 13, 8, v("metal"), 11);
      gear(449, 545, 10, 7, v("red"), 4);
    },
    organizer(g) {                              // §19: many small drawers, each a setting that lives somewhere else
      const x = 352, y = 592, w = 112, h = 50;
      box(g, x, y, w, h, 0.06, v("metal-2"), v("metal-3"), v("metal"));
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const dx = x + 4 + c * 26.5, dy = y + 4 + r * 15;
        R(g, dx, dy, 24, 12.5, v("blue-lt"), { rx: 1.5 });
        R(g, dx + 7, dy + 3, 10, 4, v("cream"), { rx: 1 });
      }
    },
    lamp(g) {                                   // §25: for close reading
      R(g, 740, 439, 34, 8, v("dark"), { rx: 3 });
      S(g, "M757 439 L746 394 L783 366", v("metal-2"), 5);
      C(g, 746, 394, 4.5, v("metal-3")); C(g, 757, 439, 4, v("metal-3"));
      C(g, 790, 362, 16, v("sky"), { opacity: 0.55 });
      C(g, 790, 362, 16, "none", { stroke: v("metal-3"), "stroke-width": 5 });
      S(g, "M781 356 q5 -7 13 -6", "#fff", 2, Object.assign({ opacity: 0.7 }, D));
    },
    lightswitch(g) {                            // §20: a way in, not a tool
      R(g, 244, 104, 24, 38, v("cream"), { rx: 3, stroke: v("metal"), "stroke-width": 1.5 });
      R(g, 252, 114, 8, 18, v("metal-2"), { rx: 2 });
      R(g, 252, 114, 8, 9, v("steel"), { rx: 2 });
      C(g, 256, 109, 1.3, v("metal-3")); C(g, 256, 137, 1.3, v("metal-3"));
    },
    toolbox(g) {
      const x = 800, y = 396, w = 104, h = 54, t = 0.07, lid = 19;
      box(g, x, y + lid, w, h - lid, t, v("red-dk"), "#6f2f25", v("red-dk"), false);
      box(g, x - 4, y, w + 8, lid, t, v("red"), v("red-dk"), v("red-lt"));
      const m = back(x + w / 2, y, t / 2);
      S(g, "M" + (m[0] - 24) + " " + m[1] + " v-13 q0 -4 4 -4 h40 q4 0 4 4 v13", v("dark"), 5);
      R(g, x - 4, y + lid - 3, w + 8, 3, v("red-dk"));
      [x + 16, x + w - 30].forEach(lx => { R(g, lx, y + lid - 8, 14, 15, v("steel"), { rx: 2 }); R(g, lx + 3, y + lid - 1, 8, 4, v("metal-3"), { rx: 1 }); });
      R(g, x + 8, y + lid + 22, w - 16, 2, "#6f2f25");
    },
  };

  // The strip light's throw: over the wall and what hangs on it, under nothing that can be pressed.
  function cone(layer) {
    poly(layer, [[365, 62], [665, 62], [880, FLOOR], [150, FLOOR]], "url(#cone)", { style: "opacity:var(--g-cone);pointer-events:none" });
  }

  // =====================================================================================
  // a tool is a link
  // =====================================================================================
  function tool(layer, n, draw, o) {
    const ch = byN(n);
    // A section opens in a new tab: this page is the way into the map and stays put, the same rule the
    // companion site's console follows.
    const a = el("a", { href: SITE + ch.slug + ".html", class: "hot" + (o.heavy ? " heavy" : ""), "data-n": n, tabindex: "0", role: "link", target: "_blank", rel: "noopener" }, layer);
    el("title", {}, a).textContent = "§" + n + " " + ch.title;
    if (o.ghost) draw(el("g", { class: "ghost" }, a));
    const obj = el("g", { class: "obj" }, a);
    draw(obj);
    const bb = obj.getBBox(), pad = 5;
    const frame = { x: bb.x - pad, y: bb.y - pad, width: bb.width + 2 * pad, height: bb.height + 2 * pad, rx: 7 };
    a.insertBefore(el("rect", Object.assign({ class: "hit" }, frame)), a.firstChild);
    el("rect", Object.assign({ class: "ring" }, frame), a);
    const tg = el("g", { class: "tag", transform: "translate(" + o.tag[0] + "," + o.tag[1] + ")" }, a);
    const wd = n.length > 1 ? 42 : 35;
    R(tg, -wd / 2, -8.5, wd, 17, "none", { rx: 4 });
    C(tg, -wd / 2 + 8, 0, 3.2, GROUPS[ch.group].dot);
    const tx = el("text", { x: 4, y: 3.8, "text-anchor": "middle" }, tg); tx.textContent = "§" + n;
    return a;
  }

  // shelves are furniture, not tools
  function shelf(g, x, y, w) {
    poly(g, [[x + 14, y + 9], [x + 22, y + 9], [x + 14, y + 30]], v("wood-dk"));
    poly(g, [[x + w - 14, y + 9], [x + w - 22, y + 9], [x + w - 14, y + 30]], v("wood-dk"));
    R(g, x, y, w, 9, v("wood-lt")); R(g, x, y + 6, w, 3, v("wood-dk"));
  }
  function pegboard(g, x, y, w, h) {
    R(g, x + 5, y + 6, w, h, v("shadow"));
    R(g, x, y, w, h, v("peg"), { rx: 3, stroke: v("peg-edge"), "stroke-width": 3 });
    for (let i = 0; x + 17 + i * 26 < x + w - 8; i++) for (let j = 0; y + 17 + j * 26 < y + h - 8; j++) C(g, x + 17 + i * 26, y + 17 + j * 26, 1.8, v("peg-hole"));
    for (const [cx, cy] of [[x + 8, y + 8], [x + w - 8, y + 8], [x + 8, y + h - 8], [x + w - 8, y + h - 8]]) C(g, cx, cy, 3, v("metal-2"));
  }

  const wall = document.getElementById("wall"), benchL = document.getElementById("bench");
  tool(wall, "17", DRAW.window, { heavy: true, tag: [222, 170] });
  tool(wall, "20", DRAW.lightswitch, { heavy: true, tag: [256, 90] });
  shelf(wall, 46, 250, 214);
  tool(wall, "16", DRAW.jars, { tag: [226, 222] });
  shelf(wall, 46, 350, 214);
  tool(wall, "21", DRAW.radio, { tag: [100, 376] });
  tool(wall, "18", DRAW.dock, { tag: [200, 376] });
  pegboard(wall, 285, 92, 470, 262);
  tool(wall, "22", DRAW.striplight, { heavy: true, tag: [704, 56] });
  tool(wall, "9", DRAW.wrenches, { ghost: true, tag: [440, 252] });
  tool(wall, "23", DRAW.screwdrivers, { ghost: true, tag: [312, 318] });
  tool(wall, "5", DRAW.hammer, { ghost: true, tag: [512, 262] });
  tool(wall, "8", DRAW.drill, { ghost: true, tag: [652, 232] });
  tool(wall, "14", DRAW.meter, { ghost: true, tag: [722, 112] });
  tool(wall, "13", DRAW.level, { ghost: true, tag: [600, 340] });
  tool(wall, "7", DRAW.clock, { ghost: true, tag: [806, 174] });
  tool(wall, "3", DRAW.clipboard, { ghost: true, tag: [806, 322] });
  cone(wall);

  // the bench: back legs and recess, the bench itself, what stands under it, the front legs, what stands on it
  (function () {
    const xfl = 8, xfr = 1022, yf = 466, t = 0.2, apron = 28, front = 642;
    const under = el("g", {}, benchL);
    R(under, xfl + 20, yf + apron, xfr - xfl - 40, FLOOR - yf - apron, v("recess"));
    for (const fx of [xfl + 8, xfr - 8]) { const b = back(fx, front, t); R(under, b[0] - 7, back(fx, yf, t)[1] + 14, 14, b[1] - back(fx, yf, t)[1] - 14, v("wood-dk"), { opacity: 0.85 }); }
    tool(benchL, "2", DRAW.bench, { heavy: true, tag: [515, 480] });
    tool(benchL, "12", DRAW.drawers, { heavy: true, tag: [145, 493] });
    tool(benchL, "4", DRAW.cabinet, { heavy: true, tag: [825, 493] });
    tool(benchL, "11", DRAW.gears, { tag: [492, 536] });
    tool(benchL, "19", DRAW.organizer, { heavy: true, tag: [408, 654] });
    // the stool is furniture
    const st = G(benchL, 560, 650, 1.1);
    S(st, "M-20 -62 L-30 0 M20 -62 L30 0 M-25 -24 H25", v("wood-dk"), 5);
    S(st, "M-8 -62 L-11 -8 M8 -62 L11 -8", v("wood-dk"), 4, { opacity: 0.55 });
    R(st, -32, -70, 64, 11, v("red-dk"), { rx: 4 }); E(st, 0, -70, 32, 6, v("red"));
    for (const x of [xfl + 8, xfr - 28]) box(benchL, x, yf + apron, 20, front - yf - apron, 0.035, v("wood"), v("wood-dk"), v("wood"), false);
    tool(benchL, "24", DRAW.vise, { tag: [222, 442] });
    tool(benchL, "6", DRAW.tape, { tag: [322, 396] });
    tool(benchL, "25", DRAW.lamp, { tag: [722, 430] });
    tool(benchL, "10", DRAW.pencils, { tag: [510, 442] });
    tool(benchL, "15", DRAW.toolbox, { tag: [938, 442] });
  })();

  // The robot is §1: the agent itself. It stands in front of everything, so its link is the last thing drawn.
  (function () {
    const ch = byN("1"), svg = document.getElementById("scene");
    const a = el("a", { href: SITE + ch.slug + ".html", class: "hot heavy", "data-n": "1", tabindex: "0", role: "link", target: "_blank", rel: "noopener" }, svg);
    el("title", {}, a).textContent = "§1 " + ch.title;
    const frame = { x: 1040, y: 366, width: 136, height: 312, rx: 10 };
    el("rect", Object.assign({ class: "hit" }, frame), a);
    el("rect", Object.assign({ class: "ring" }, frame), a);
    const tg = el("g", { class: "tag", transform: "translate(1150,560)" }, a);
    R(tg, -17.5, -8.5, 35, 17, "none", { rx: 4 });
    C(tg, -9.5, 0, 3.2, GROUPS[ch.group].dot);
    const tx = el("text", { x: 4, y: 3.8, "text-anchor": "middle" }, tg); tx.textContent = "§1";
  })();

  const lg = document.getElementById("legend");
  for (const k in GROUPS) { const s = document.createElement("span"); s.style.setProperty("--dot", GROUPS[k].dot); s.textContent = GROUPS[k].long; lg.appendChild(s); }

  // =====================================================================================
  // the robot: incidental. It stands under the corkboard and points at it while a tool is read.
  // =====================================================================================
  const rad = d => d * Math.PI / 180;
  const SHOULDER = { L: [556, 160], R: [644, 160] };
  const SEG = { sleeve: 64, forearm: 44, hand: 22 };
  const POSE = { rest: { L: [8, -6], R: [-8, 6] }, point: { L: [158, 14], R: [-8, 6] } };
  const armsG = document.getElementById("arms"), arm = {};
  for (const side of ["L", "R"]) {
    const [sx, sy] = SHOULDER[side];
    const g = el("g", { class: "arm-seg" }, armsG);
    el("rect", { x: -13, y: -4, width: 26, height: SEG.sleeve + 4, rx: 6, class: "coat" }, g);
    el("rect", { x: -13, y: SEG.sleeve - 8, width: 26, height: 9, class: "coat-dk" }, g);
    el("circle", { cx: 0, cy: 0, r: 9, class: "coat-dk" }, g);
    const f = el("g", { class: "arm-seg" }, g);
    C(f, 0, 0, 8, "var(--c-metal-3)");
    R(f, -10, 0, 20, SEG.forearm, "var(--c-metal)", { rx: 4 });
    R(f, -10, SEG.forearm - 6, 20, 6, "var(--c-metal-3)");
    R(f, -12, SEG.forearm, 24, SEG.hand, "var(--gloves)", { rx: 4 });
    [-9, -2, 5].forEach(x => R(f, x, SEG.forearm + SEG.hand - 4, 6, 12, "var(--gloves-dk)", { rx: 2 }));
    R(f, -12, SEG.forearm, 24, 4, "var(--gloves-dk)");
    arm[side] = { g, f, sx, sy };
  }
  const irises = document.querySelectorAll("#figure .iris");
  function pose(name) {
    for (const side of ["L", "R"]) {
      const [a1, a2] = POSE[name][side], m = arm[side];
      m.g.style.transform = "translate(" + m.sx + "px," + m.sy + "px) rotate(" + a1 + "deg)";
      m.f.style.transform = "translate(0px," + SEG.sleeve + "px) rotate(" + a2 + "deg)";
    }
    irises.forEach(i => { i.setAttribute("r", name === "point" ? 11 : 9); i.setAttribute("fill", name === "point" ? "#6fa3e6" : "#f0d67a"); });
  }

  // =====================================================================================
  // the readout
  // =====================================================================================
  const ro = document.getElementById("readout");
  const roIntro = document.getElementById("ro-intro"), roChapter = document.getElementById("ro-chapter"), roHow = document.getElementById("ro-how");
  const roPart = document.getElementById("ro-part"), roTitle = document.getElementById("ro-title"),
        roBody = document.getElementById("ro-body"), roLink = document.getElementById("ro-link"), roHint = document.getElementById("ro-hint");
  let pinned = null;
  function show(ch, preview) {
    pose("point");
    roIntro.hidden = true; roChapter.hidden = false;
    ro.style.setProperty("--dot", GROUPS[ch.group].dot);
    ro.dataset.preview = preview ? "1" : "0";
    roPart.textContent = GROUPS[ch.group].name + " · " + ch.tool;
    roTitle.innerHTML = '<span class="n">§' + ch.n + "</span>" + ch.title;
    roBody.textContent = ch.body;
    roLink.href = SITE + ch.slug + ".html"; roLink.textContent = "Open §" + ch.n + " →"; roLink.hidden = preview;
    roHint.textContent = preview ? "" : "Tap the tool again to open the section, or use the link.";
    roHint.hidden = preview;
    document.querySelectorAll(".hot.on").forEach(a => a.classList.remove("on"));
    const keep = pinned || (!preview ? ch : null);
    if (keep) { const k = document.querySelector('.hot[data-n="' + keep.n + '"]'); if (k) k.classList.add("on"); }
  }
  function restore() {
    if (pinned) { show(pinned, false); return; }
    pose("rest");
    ro.dataset.preview = "0"; ro.style.setProperty("--dot", v("mustard"));
    roChapter.hidden = true; roIntro.hidden = false;
  }
  const find = a => byN(a.dataset.n);
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine) roHow.textContent = "Tap one to read it, and tap it again to open it.";
  document.querySelectorAll(".hot").forEach(a => {
    a.addEventListener("click", e => {
      if (fine) return;                          // pointer: hover previews, a press opens the section
      const ch = find(a);                        // touch: first tap pins the readout, second opens
      if (pinned && pinned.n === ch.n) return;
      e.preventDefault(); pinned = ch; show(ch, false);
    });
    a.addEventListener("focus", () => show(find(a), !pinned || pinned.n !== a.dataset.n));
    a.addEventListener("blur", restore);
    if (fine) {
      a.addEventListener("mouseenter", () => show(find(a), !pinned || pinned.n !== a.dataset.n));
      a.addEventListener("mouseleave", restore);
    }
  });

  // The note's type scales with the drawing, so below 760px the readout moves out under the scene, and
  // the note carries the title in type large enough to survive the scaling.
  const home = document.getElementById("board-home"), scene = document.querySelector(".garage-scene");
  const noteTitle = document.getElementById("note-title"), fo = document.getElementById("board-fo");
  const narrow = window.matchMedia("(max-width: 760px)");
  const placeReadout = () => {
    if (narrow.matches) { scene.after(ro); fo.style.display = "none"; noteTitle.style.display = ""; }
    else { home.appendChild(ro); fo.style.display = ""; noteTitle.style.display = "none"; }
  };
  narrow.addEventListener("change", placeReadout); placeReadout();
  pose("rest");
})();
