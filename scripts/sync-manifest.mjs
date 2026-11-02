#!/usr/bin/env node
// Regenerates src/data/extension-manifest.json: the commands, settings, views,
// keybindings and walkthroughs of the NexQL extension, so the reference docs
// list exactly what ships and can't drift out of date.
//
//   npm run sync:manifest
//
// Source: the COMMITTED files of the sibling repos, not their working trees
// (those can hold unreleased edits):
//   ../core  package.json               at git ref CORE_REF (default HEAD)
//   ../pro   contributes.pro.json       at git ref PRO_REF  (default HEAD)
// Override the checkouts with NEXQL_CORE_DIR / NEXQL_PRO_DIR.
//
// The two are merged with the rules of core/scripts/merge-pro-manifest.js, the
// script that builds the published manifest:
//   commands, views, view containers, settings  core wins on an id / key clash
//   menus                                       Pro entries are appended
//   keybindings                                 skipped when core already binds that command
// Every command, setting, view and keybinding that Pro lists is marked
// `pro: true`, whether or not core also lists it (today core lists them all).
//
// Where a command appears is derived from `contributes.menus`: Command Palette
// (listed unless a commandPalette entry says `when: false`), view title bars,
// tree item context menus (the viewItem values in `when`, with submenus
// resolved), editor title, notebook toolbar and notebook cell toolbar.
//
// The output is sorted and has no timestamps, so reruns give identical bytes.

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const coreDir = resolve(process.env.NEXQL_CORE_DIR ?? resolve(here, "../../core"));
const proDir = resolve(process.env.NEXQL_PRO_DIR ?? resolve(here, "../../pro"));
const out = resolve(here, "../src/data/extension-manifest.json");

const show = (dir, ref, file) => JSON.parse(execFileSync("git", ["-C", dir, "show", `${ref}:${file}`], { encoding: "utf8", maxBuffer: 64 << 20 }));
const pkg = show(coreDir, process.env.CORE_REF ?? "HEAD", "package.json");
const pro = show(proDir, process.env.PRO_REF ?? "HEAD", "contributes.pro.json");

// ---- merge, mirroring core/scripts/merge-pro-manifest.js -----------------------

const core = pkg.contributes;
const proIds = {
  commands: new Set((pro.commands ?? []).map((c) => c.command)),
  settings: new Set(Object.keys(pro.configuration?.properties ?? {})),
  views: new Set(Object.values(pro.views ?? {}).flat().map((v) => v.id)),
  containers: new Set(Object.values(pro.viewsContainers ?? {}).flat().map((v) => v.id)),
  keybindings: new Set((pro.keybindings ?? []).map((k) => k.command)),
};

// Core declares a few ids twice (e.g. dropType with and without a category). VS Code
// treats them as one command, so fold repeats into the first entry and let later
// entries fill in fields it lacks.
const commands = [];
for (const c of [...core.commands, ...(pro.commands ?? [])]) {
  const first = commands.find((x) => x.command === c.command);
  if (!first) commands.push({ ...c });
  else for (const [k, v] of Object.entries(c)) first[k] ??= v;
}

const mergeById = (a = {}, b = {}) => {
  const res = Object.fromEntries(Object.entries(a).map(([k, v]) => [k, [...v]]));
  for (const [k, list] of Object.entries(b)) {
    res[k] ??= [];
    for (const item of list) if (!res[k].some((x) => x.id === item.id)) res[k].push(item);
  }
  return res;
};
const containers = mergeById(core.viewsContainers, pro.viewsContainers);
const views = mergeById(core.views, pro.views);

const properties = { ...core.configuration.properties };
for (const [k, v] of Object.entries(pro.configuration?.properties ?? {})) if (!properties[k]) properties[k] = v;

const menus = Object.fromEntries(Object.entries(core.menus).map(([k, v]) => [k, [...v]]));
for (const [k, list] of Object.entries(pro.menus ?? {})) menus[k] = [...(menus[k] ?? []), ...list];

const keybindings = [...core.keybindings];
for (const k of pro.keybindings ?? []) if (!keybindings.some((x) => x.command === k.command)) keybindings.push(k);

// ---- helpers ------------------------------------------------------------------

const uniq = (a) => [...new Set(a)];
const byKey = (f) => (a, b) => (f(a) < f(b) ? -1 : f(a) > f(b) ? 1 : 0);
const submenuLabel = Object.fromEntries((core.submenus ?? []).map((s) => [s.id, s.label]));

/** Pulls the tree item types out of a `when`: viewItem == x, viewItem =~ /^(a|b)(:|$)/. Negated terms are dropped. */
function viewItems(when = "") {
  const positive = when.replace(/!\s*\([^()]*\)/g, "").replace(/!\s*viewItem\b/g, "");
  const items = [];
  for (const m of positive.matchAll(/viewItem\s*==\s*'?([\w-]+)'?/g)) items.push(m[1]);
  for (const m of positive.matchAll(/viewItem\s*=~\s*\/\^?\(?([\w|-]+)\)?[^/]*\//g)) items.push(...m[1].split("|"));
  if (/!\s*viewItem\b/.test(when)) items.push("(empty area)");
  return uniq(items);
}
const viewOf = (when = "") => when.match(/view\s*==\s*([\w.]+)/)?.[1] ?? null;
const notebookTypes = (when = "") => uniq([...when.matchAll(/notebookType\s*==\s*'?([\w-]+)'?/g)].map((m) => m[1])).sort();

// Palette: visible unless a commandPalette entry has when: "false".
const hiddenFromPalette = new Set((menus.commandPalette ?? []).filter((m) => String(m.when).trim() === "false").map((m) => m.command));

// Submenu id -> the trees entries that open it.
const submenuHosts = {};
for (const m of menus["view/item/context"] ?? []) {
  if (!m.submenu) continue;
  (submenuHosts[m.submenu] ??= []).push({ view: viewOf(m.when), items: viewItems(m.when) });
}

/** Collects raw location facts for each command, then folds duplicates. */
const raw = {};
const add = (cmd, loc) => (raw[cmd] ??= []).push(loc);
for (const [menu, list] of Object.entries(menus)) {
  for (const m of list) {
    if (!m.command) continue;
    const inline = typeof m.group === "string" && m.group.startsWith("inline");
    if (menu === "view/item/context") {
      add(m.command, { type: "view-item", view: viewOf(m.when), items: viewItems(m.when), inline });
    } else if (menu === "view/title") {
      add(m.command, { type: "view-title", view: viewOf(m.when), toolbar: typeof m.group === "string" && m.group.startsWith("navigation") });
    } else if (menu === "editor/title") {
      add(m.command, { type: "editor-title", when: m.when ?? null });
    } else if (menu === "notebook/toolbar") {
      add(m.command, { type: "notebook-toolbar", notebookTypes: notebookTypes(m.when) });
    } else if (menu === "notebook/cell/title") {
      add(m.command, { type: "notebook-cell", notebookTypes: notebookTypes(m.when) });
    } else if (submenuHosts[menu]) {
      for (const host of submenuHosts[menu]) {
        add(m.command, { type: "view-item", view: host.view, items: host.items, inline: false, submenu: submenuLabel[menu] ?? menu });
      }
    }
  }
}

function fold(locs = []) {
  const map = new Map();
  for (const l of locs) {
    const key = JSON.stringify([l.type, l.view ?? null, l.submenu ?? null, l.inline ?? null, l.toolbar ?? null, l.when ?? null, l.notebookTypes ?? null]);
    const prev = map.get(key);
    if (prev) prev.items = uniq([...(prev.items ?? []), ...(l.items ?? [])]);
    else map.set(key, { ...l });
  }
  return [...map.values()].map((l) => {
    const o = { type: l.type };
    if (l.view) o.view = l.view;
    if (l.items) o.items = l.items.slice().sort();
    if (l.submenu) o.submenu = l.submenu;
    if (l.type === "view-item") o.inline = !!l.inline;
    if (l.type === "view-title") o.toolbar = l.toolbar;
    if (l.when) o.when = l.when;
    if (l.notebookTypes?.length) o.notebookTypes = l.notebookTypes;
    return o;
  }).sort(byKey((l) => JSON.stringify(l)));
}

// ---- output -------------------------------------------------------------------

const kbByCommand = {};
for (const k of keybindings) {
  (kbByCommand[k.command] ??= []).push({ key: k.key, mac: k.mac ?? null, when: k.when ?? null });
}

const outCommands = commands
  .map((c) => {
    const o = { id: c.command, title: c.title ?? null, category: c.category ?? null, icon: c.icon ?? null, palette: !hiddenFromPalette.has(c.command) };
    if (kbByCommand[c.command]) o.keybindings = kbByCommand[c.command];
    o.locations = fold(raw[c.command]);
    o.pro = proIds.commands.has(c.command);
    return o;
  })
  .sort(byKey((c) => c.id));

const outSettings = Object.entries(properties)
  .map(([key, p]) => {
    // Telemetry project keys are not secrets, but they are noise in the docs: leave them out.
    const o = { key, type: p.type ?? null, default: /api-?key/i.test(key) && p.default ? "(built in)" : (p.default ?? null), scope: p.scope ?? null };
    for (const f of ["enum", "enumDescriptions", "markdownEnumDescriptions", "minimum", "maximum", "items", "description", "markdownDescription", "deprecationMessage", "markdownDeprecationMessage"]) {
      if (p[f] !== undefined) o[f] = p[f];
    }
    const note = p.markdownDeprecationMessage ?? p.deprecationMessage ?? (/^deprecated\b/i.test(p.description ?? p.markdownDescription ?? "") ? (p.description ?? p.markdownDescription) : undefined);
    if (note) o.deprecation = note;
    o.pro = proIds.settings.has(key);
    return o;
  })
  .sort(byKey((s) => s.key));

const title = Object.fromEntries(commands.map((c) => [c.command, c.title ?? null]));
const outKeybindings = keybindings
  .map((k) => ({ command: k.command, title: title[k.command] ?? null, key: k.key, mac: k.mac ?? null, when: k.when ?? null, pro: proIds.keybindings.has(k.command) }))
  .sort(byKey((k) => `${k.command}\0${k.key}`));

const outContainers = Object.entries(containers).flatMap(([location, list]) =>
  list.map((c) => ({ id: c.id, title: c.title, location, pro: proIds.containers.has(c.id) })),
);
const outViews = Object.entries(views).flatMap(([container, list]) =>
  list.map((v) => ({ id: v.id, name: v.name, container, type: v.type ?? "tree", collapsedByDefault: v.visibility === "collapsed", pro: proIds.views.has(v.id) })),
);

const outWalkthroughs = (core.walkthroughs ?? []).map((w) => ({
  id: w.id,
  title: w.title,
  steps: w.steps.map((s) => ({ id: s.id, title: s.title })),
}));

const manifest = {
  version: pkg.version,
  containers: outContainers,
  views: outViews,
  commands: outCommands,
  settings: outSettings,
  keybindings: outKeybindings,
  walkthroughs: outWalkthroughs,
};

writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `sync-manifest: v${manifest.version}, ${outCommands.length} commands (${outCommands.filter((c) => c.pro).length} Pro), ` +
    `${outSettings.length} settings (${outSettings.filter((s) => s.pro).length} Pro), ${outViews.length} views, ${outKeybindings.length} keybindings.`,
);
