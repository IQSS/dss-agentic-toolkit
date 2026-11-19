--[[ site-filter.lua — everything the two agentic-AI sites need that is genuinely HTML-only.

Shared by dss-agentic-research and dss-agentic-toolkit; wired into each `_quarto.yml` under
`filters:`. See dss-training-ops/docs/plans/2026-08-30-agentic-sites-conversion-plan.md, Phase 3.

It runs at render time rather than at sync time on purpose: the chapters are byte-for-byte slices of
the upstream markdown, so any rule here can change without re-syncing a single file, and a chapter can
always be diffed against its source.

What it does, and why each one is a silent failure without it:

  1. Strips every HTML comment. Pandoc passes them straight into the page, where the guide's
     per-chapter STATUS / PHASE / VERIFY authoring notes -- including which claims rest on secondary
     sources -- are readable with view-source.
  2. Drops the print-only divs (.pagebreak, .vspace, .needspace, .subsection-rule). Upstream's own
     filter drops them for non-LaTeX output, but that filter belongs to the PDF build; here they would
     render as stray empty divs.
  3. Errors on any surviving raw-LaTeX block. After the upstream conversion there are none, and a
     dropped figure is exactly what this pipeline exists to prevent, so absence is asserted.
  4. Points figure and in-document links at the right page. A `figures/x.svg` in a chapter resolves to
     `chapters/figures/x.svg` and 404s; an in-document `#anchor` written when the document was one
     file now names a heading on some other page.
  5. Turns a section reference into a link, from the maps the splitter writes into `_quarto.yml`.
  6. Marks up the tool-chain's function matrix so CSS can shade it, replacing what the LaTeX-only
     matrix-shade.lua does for print.

Automatic § references inside footnotes are left alone because they may cite the companion guide.
Explicit Markdown links still resolve through this site's anchor map, including in footnotes.
]]

local chapters = {}   -- "13"       -> /chapters/13-permissions-and-sandboxing.qmd
local anchors = {}    -- "#package-manager" -> /chapters/01-foundation.qmd#package-manager
local daily = {}      -- "13a" -> true, the matrix rows the author marks as everyday tools
local this_page       -- the slug of the chapter being rendered, to keep same-page links on the page
local this_number     -- its chapter number, for the subsection anchors below
local subsection = 0  -- H2 counter, so §13c can land on the third subsection of chapter 13

local PRINT_ONLY = { pagebreak = true, vspace = true, needspace = true, ["subsection-rule"] = true }

local function meta_string(v)
  return v and pandoc.utils.stringify(v) or nil
end

-- A map the splitter had nothing to put in is absent from _quarto.yml, and an empty YAML mapping
-- would come back as a string rather than a table, so take a value only when it is one.
local function as_table(v)
  return type(v) == "table" and v or {}
end

local function read_meta(meta)
  for k, v in pairs(as_table(meta["chapter-map"])) do chapters[k] = meta_string(v) end
  for k, v in pairs(as_table(meta["anchor-map"])) do anchors[k] = meta_string(v) end
  for _, v in ipairs(as_table(meta["daily-use"])) do daily[meta_string(v)] = true end

  -- Quarto hands pandoc a temporary .md, so PANDOC_STATE.input_files names a file in /var/folders
  -- rather than the chapter. quarto.doc.input_file is the real path; fall back for bare pandoc.
  local input = (quarto and quarto.doc and quarto.doc.input_file)
                or (PANDOC_STATE.input_files or {})[1] or ""
  this_page = input:match("([^/]+)%.qmd$")
  this_number = this_page and this_page:match("^(%d+)%-")
  -- "00" is the tool-chain's unnumbered Introduction; nothing cites it as a section.
  if this_number then
    this_number = tonumber(this_number)
    if this_number == 0 then this_number = nil end
  end
  return meta
end

-- 1. HTML comments, in both the block and the inline position.
local function drop_comment(el)
  if el.format:match("html") and el.text:match("^%s*<!%-%-") then return {} end
end

-- 3. Raw LaTeX. There should be none; say so loudly rather than dropping it the way pandoc would.
local function check_raw(el)
  if not el.format:match("tex") and not el.format:match("latex") then return nil end
  if el.text:match("tikzpicture") then
    error("site-filter: a raw-LaTeX figure survived into " .. (this_page or "?") ..
          ". It would be dropped silently in HTML. Extract it to figures/<slug>.tex upstream.")
  end
  io.stderr:write("site-filter: dropping raw LaTeX in " .. (this_page or "?") .. ": "
                  .. el.text:gsub("%s+", " "):sub(1, 60) .. "\n")
  return {}
end

-- 5. "§12" and "§13c" become links. The letter is the subsection's position in its chapter, which is
-- how both documents number them, so §13c is the third H2 of chapter 13 -- see the anchors added
-- to headers below. An unknown number is left as text rather than guessed at.
local function link_sections(str)
  local out, rest = {}, str.text
  local matched = false
  while true do
    -- [a-z], not %l: Lua patterns match bytes and %l can take the lead byte of a multi-byte
    -- character, which turned "§9’s" into a corrupted anchor and a broken apostrophe.
    local before, number, letter, after = rest:match("^(.-)§(%d+)([a-z]?)(.*)$")
    if not before then break end
    matched = true
    if before ~= "" then out[#out + 1] = pandoc.Str(before) end
    local target = chapters[number]
    local label = "§" .. number .. letter
    if target then
      if letter ~= "" then target = target .. "#sec-" .. number .. letter end
      out[#out + 1] = pandoc.Link(pandoc.Str(label), target)
    else
      out[#out + 1] = pandoc.Str(label)
    end
    rest = after
  end
  if not matched then return nil end
  if rest ~= "" then out[#out + 1] = pandoc.Str(rest) end
  -- `false` stops the traversal descending into what was just built. Without it the new link's own
  -- label is another "§12" Str, this function matches it again, and pandoc recurses until it runs
  -- out of stack.
  return out, false
end

local function html_escape(value)
  return value:gsub("&", "&amp;"):gsub('"', "&quot;"):gsub("<", "&lt;"):gsub(">", "&gt;")
end

-- Opt-in chapter maps keep their hit areas beside the drawing geometry in SVG metadata.
-- Native HTML links work without JavaScript; the image retains normal theme switching.
local function chapter_map(img)
  if not img.classes:includes("chapter-map") then return nil end
  local root = (quarto and quarto.project and quarto.project.directory) or "."
  local file = assert(io.open(root .. img.src, "r"), "Cannot read chapter-map SVG: " .. img.src)
  local svg = file:read("*a")
  file:close()
  local metadata = assert(svg:match('<metadata id="chapter%-links">(.-)</metadata>'),
                          "Chapter-map SVG has no link coordinates: " .. img.src)
  local map = pandoc.json.decode(metadata)
  img.classes:insert("nolightbox")
  if img.attributes["fig-alt"] then
    img.caption = {pandoc.Str(img.attributes["fig-alt"])}
  end
  local image_html = pandoc.write(pandoc.Pandoc({pandoc.Plain({img})}), "html")
  local out = {'<span class="chapter-map-frame" role="group" aria-label="Research chapters">', image_html}
  for _, link in ipairs(map.links) do
    local target = anchors[link.anchor]
    -- The anchor map can omit a chapter id already represented by the chapter map.
    for _, chapter_path in pairs(chapters) do
      if chapter_path:match("/([^/]+)%.qmd$") == link.anchor then target = chapter_path end
    end
    assert(target, "Unknown chapter-map anchor: " .. link.anchor)
    target = target:gsub("%.qmd", ".html")
    local style = string.format("left:%.5f%%;top:%.5f%%;width:%.5f%%;height:%.5f%%;",
      100 * link.x / map.width, 100 * link.y / map.height,
      100 * link.w / map.width, 100 * link.h / map.height)
    out[#out + 1] = '<a class="chapter-map-link no-external" href="' .. html_escape(target) ..
      '" aria-label="' .. html_escape(link.label) .. '" title="' .. html_escape(link.label) ..
      '" style="' .. style .. '"></a>'
  end
  out[#out + 1] = '</span>'
  return pandoc.RawInline("html", table.concat(out))
end

local function rewrite_link(link)
  if link.target:match("^resources/") then
    link.target = "/" .. link.target
    link.classes:insert("no-external")
    return link
  end
  local anchor = link.target:match("^#(.+)$")
  local target = anchor and anchors[anchor]
  if not target then return nil end
  -- Quarto otherwise misclassifies local preview links as external.
  link.classes:insert("no-external")
  if this_page and target:match("/([^/]+)%.qmd") == this_page then
    link.target = "#" .. anchor
  else
    link.target = target
  end
  return link
end

-- Keep the familiar TeX/LaTeX lettering in prose while preserving searchable,
-- copyable names. Commands and filenames are not whole-name matches.
local function tex_logo(name)
  if name ~= "TeX" and name ~= "LaTeX" then return nil end
  local letters = {}
  if name == "LaTeX" then
    letters[#letters + 1] = pandoc.Str("L")
    letters[#letters + 1] = pandoc.Span("a", pandoc.Attr("", {"tex-logo-a"}))
  end
  letters[#letters + 1] = pandoc.Str("T")
  letters[#letters + 1] = pandoc.Span("e", pandoc.Attr("", {"tex-logo-e"}))
  letters[#letters + 1] = pandoc.Str("X")
  local visible = pandoc.Span(letters, pandoc.Attr("", {}, {["aria-hidden"] = "true"}))
  return pandoc.Span({visible}, pandoc.Attr("", {"tex-logo"}, {role = "img", ["aria-label"] = name}))
end

local function prose_tex_logos(el)
  local result, cursor = {}, 1
  for first, word, after in el.text:gmatch("()(%w+)()") do
    local logo = tex_logo(word)
    if logo then
      if first > cursor then result[#result + 1] = pandoc.Str(el.text:sub(cursor, first - 1)) end
      result[#result + 1] = logo
      cursor = after
    end
  end
  if cursor == 1 then return nil end
  if cursor <= #el.text then result[#result + 1] = pandoc.Str(el.text:sub(cursor)) end
  return result
end

return {
  { Meta = read_meta },
  {
    -- Resolve explicit footnote links without guessing which guide a bare § reference cites.
    traverse = "topdown",
    Note = function(note)
      return pandoc.walk_inline(note, {Link = rewrite_link}), false
    end,

    RawBlock = function(el) return drop_comment(el) or check_raw(el) end,
    RawInline = function(el) return drop_comment(el) or check_raw(el) end,

    -- 2. print-only divs
    Div = function(div)
      for _, class in ipairs(div.classes) do
        if PRINT_ONLY[class] then return {} end
      end
    end,

    -- 4a. figures live at the site root, not beside the chapter that shows them
    Image = function(img)
      img.src = img.src:gsub("^figures/", "/figures/")
      img.src = img.src:gsub("^resources/", "/resources/")
      -- `above` and `below` are the print build's figure spacing; here they ride along into the page
      -- as data- attributes. Rebuild the attribute set rather than assigning nil into it: the table
      -- read off an element is a copy, so the deletion would apply to nothing.
      local keep = {}
      for k, v in pairs(img.attributes) do
        if k ~= "above" and k ~= "below" then keep[k] = v end
      end
      -- Drop a `fig-` identifier too. These figures carry their title inside the image and the
      -- markdown gives them no caption, so with that identifier Quarto makes each one a numbered
      -- float and prints a bare "Figure 1" under it. Neither document cross-references a figure.
      local id = img.identifier:match("^fig%-") and "" or img.identifier
      img.attr = pandoc.Attr(id, img.classes, keep)
      return chapter_map(img) or img
    end,

    -- 4b. an in-document anchor from when the document was one file
    Link = rewrite_link,

    -- 5 + the anchors it points at: name each H2 of a numbered chapter `sec-13c`, by its position,
    -- which is how both documents letter their subsections. Generated here rather than upstream so
    -- the links and the targets can never disagree -- the same filter makes both.
    --
    -- As a block before the heading, not a span inside it: Quarto renders the heading's own content
    -- into the page's contents list too, so an id placed inside would appear twice and the link
    -- would land on the sidebar entry instead of the section.
    Blocks = function(blocks)
      if not this_number then return nil end
      local out, added = {}, false
      for _, block in ipairs(blocks) do
        if block.t == "Header" and block.level == 2 and subsection < 26 then
          subsection = subsection + 1
          out[#out + 1] = pandoc.Div({}, pandoc.Attr("sec-" .. this_number .. string.char(96 + subsection),
                                                     { "subsection-anchor" }))
          added = true
        end
        out[#out + 1] = block
      end
      if added then return out end
    end,

    Str = link_sections,

    -- 6. the tool-chain's function matrix: shade each numbered group, and mark the everyday rows.
    -- The LaTeX build draws these with matrix-shade.lua; the marks come from the same list, carried
    -- into _quarto.yml by the splitter so the two cannot drift.
    Table = function(tbl)
      local head = tbl.head.rows[1]
      if not head or #head.cells == 0 then return nil end
      if pandoc.utils.stringify(head.cells[1].contents) ~= "#" then return nil end
      local group, band = nil, 0
      for bi, body in ipairs(tbl.bodies) do
        local rows = body.body
        for ri, row in ipairs(rows) do
          local cells = row.cells
          local key = pandoc.utils.stringify(cells[1].contents)
          local digits = key:match("^(%d+)")
          if digits and digits ~= group then
            group, band = digits, 1 - band
          end
          local classes = { "matrix-band-" .. band }
          if daily[key] then classes[#classes + 1] = "matrix-daily" end
          -- The mark goes on the row's first cell, not on the row: pandoc's HTML writer gives every
          -- row its own odd/even class and discards the row attributes, so a class set there never
          -- reaches the page. The stylesheet reaches the row from the cell with :has().
          local first = cells[1]
          first.contents = { pandoc.Plain({ pandoc.Span(pandoc.utils.blocks_to_inlines(first.contents),
                                                        pandoc.Attr("", classes)) }) }
          cells[1] = first
          -- Read back out of a table body, a row and its cells are copies; assign them back or the
          -- change is made to something the document no longer contains.
          rows[ri] = pandoc.Row(cells, row.attr)
        end
        body.body = rows
        tbl.bodies[bi] = body
      end
      return tbl
    end,
  },
  {
    Str = prose_tex_logos,
    Code = function(el) return tex_logo(el.text) end,
  },
}
