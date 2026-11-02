/**
 * The human layer of the docs. `extension-manifest.json` is what the extension
 * ships (regenerate it with `npm run sync:manifest`); this file groups its
 * commands and settings into user-facing areas, explains each area in plain
 * words, and defines the docs navigation. The build throws if a command or
 * setting lands in no area, so a new one can't ship undocumented.
 *
 * Adding a guide: add an entry to GUIDES and a page at src/pages/docs/guides/<slug>.astro.
 * Adding an area: add it to AREAS, then add rules that route commands or settings to it.
 */
import raw from "./extension-manifest.json";
import { FEATURES, GROUPS, featureHref } from "./feature-stories";

// ---- manifest types -----------------------------------------------------------

export interface Keybinding {
  key: string;
  mac: string | null;
  when: string | null;
}
export interface Location {
  type: "view-item" | "view-title" | "editor-title" | "notebook-toolbar" | "notebook-cell";
  view?: string;
  items?: string[];
  submenu?: string;
  inline?: boolean;
  toolbar?: boolean;
  when?: string;
  notebookTypes?: string[];
}
export interface ManifestCommand {
  id: string;
  title: string | null;
  category: string | null;
  icon: string | null;
  palette: boolean;
  keybindings?: Keybinding[];
  locations: Location[];
  pro: boolean;
}
export interface ManifestSetting {
  key: string;
  type: string | string[] | null;
  default: unknown;
  scope: string | null;
  enum?: (string | number)[];
  enumDescriptions?: string[];
  markdownEnumDescriptions?: string[];
  minimum?: number;
  maximum?: number;
  items?: unknown;
  description?: string;
  markdownDescription?: string;
  deprecation?: string;
  pro: boolean;
}
export interface ManifestView {
  id: string;
  name: string;
  container: string;
  type: string;
  collapsedByDefault: boolean;
  pro: boolean;
}
export interface ManifestKeybinding {
  command: string;
  title: string | null;
  key: string;
  mac: string | null;
  when: string | null;
  pro: boolean;
}
interface Manifest {
  version: string;
  containers: { id: string; title: string; location: string; pro: boolean }[];
  views: ManifestView[];
  commands: ManifestCommand[];
  settings: ManifestSetting[];
  keybindings: ManifestKeybinding[];
  walkthroughs: { id: string; title: string; steps: { id: string; title: string }[] }[];
}
export const MANIFEST = raw as unknown as Manifest;

// ---- areas --------------------------------------------------------------------

export interface Area {
  id: string;
  name: string;
  /** One line for hub cards. */
  summary: string;
  /** Opening paragraph on the reference pages. Describe only what the commands and settings show. */
  intro: string;
}

export const AREAS: Area[] = [
  {
    id: "connections",
    name: "Connections & safety",
    summary: "Add, edit, group and switch connections; Sentinel environment cues.",
    intro:
      "Add, edit, duplicate, pin, group and color connections, import one from a DATABASE_URL in a .env file or from a URL on the clipboard, and connect, reconnect or disconnect. Switch the connection or database a notebook uses, or set a default connection for the workspace. Sentinel settings control how the editor signals which environment you are on (title bar, status bar, notebook strip, tab badges), and the Production audit log is listed here too.",
  },
  {
    id: "profiles",
    name: "Profiles",
    summary: "Create, switch, export and import connection profiles.",
    intro: "Create, switch and delete connection profiles, and export them to a file or import them from one.",
  },
  {
    id: "explorer",
    name: "Explorer & objects",
    summary: "Browse, inspect and search objects in the tree and the Definition Viewer.",
    intro:
      "Refresh the tree, search schema objects, add objects to favorites, and open properties, definitions and data for tables, views, functions, types, roles, foreign objects and more. The Definition Viewer (DDL viewer) settings control the SQL preview. Auto refresh settings control how often the tree and Notebooks panel poll PostgreSQL for changes.",
  },
  {
    id: "objects",
    name: "Object management",
    summary: "Create, edit, drop and maintain tables, views, roles and other objects.",
    intro:
      "Create, edit and drop database objects, enable or disable triggers, truncate tables, grant and revoke privileges, schedule pg_cron jobs, and run VACUUM, ANALYZE and REINDEX. The Operations commands are per-object menus that group these actions.",
  },
  {
    id: "scripts",
    name: "Scripts & templates",
    summary: "Generate SELECT, INSERT, UPDATE, DELETE and DDL scripts from the tree.",
    intro:
      "Generate SQL from a selected object: SELECT, INSERT, UPDATE and DELETE scripts, CREATE and ALTER scripts, and templates for columns, constraints and indexes. The Call Function and Call Procedure commands are here too.",
  },
  {
    id: "notebooks",
    name: "Notebooks & queries",
    summary: "SQL notebooks, Query Tool, Query Studio, psql and the SQL formatter.",
    intro:
      "Create and organise notebooks, open them quickly, jump between sections, and open the Query Tool, Query Studio or a psql session. Settings cover the query timeout, what happens when a statement in a batch fails, prompted parameters, and the SQL formatter.",
  },
  {
    id: "results",
    name: "Results & export",
    summary: "Result limits, binary display, streaming and exporting.",
    intro:
      "Export table data and notebooks, and toggle full dataset mode on a cell. Settings cover the automatic LIMIT, the default row limit, sliding-window streaming for large results, and how bytea columns are shown.",
  },
  {
    id: "saved",
    name: "Saved queries & history",
    summary: "Save, search, load and share queries; query history.",
    intro:
      "Save queries to a library, search, load, edit, copy and delete them, import and export the library, and see query recommendations. Query History entries can be opened, copied or deleted, and the whole history cleared.",
  },
  {
    id: "schema",
    name: "Schema tools",
    summary: "Table designer, ERD, schema diff, data import, DBML and the database index.",
    intro:
      "Design tables visually, view entity-relationship diagrams, compare schemas, import data and DBML, and open the Migration Hub. The database index commands and settings build and manage the local index of your database structure.",
  },
  {
    id: "performance",
    name: "Performance & Plan Studio",
    summary: "EXPLAIN, index usage, table activity and statistics.",
    intro:
      "Run EXPLAIN and EXPLAIN ANALYZE on a query, view index usage, table activity, table profiles and column statistics. A setting sets the threshold for flagging a query as slow in history and results.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    summary: "The live database dashboard and the LISTEN/NOTIFY monitor.",
    intro: "Open the live database dashboard for a connection and database, and open the LISTEN/NOTIFY monitor.",
  },
  {
    id: "ai",
    name: "AI / NexQL Bot",
    summary: "NexQL Bot, Ask AI, query generation and AI provider settings.",
    intro:
      "Open NexQL Bot in the sidebar or an editor tab, attach objects and queries to a chat, use Ask AI on a notebook cell, generate or optimize a query, and reveal an object in the explorer from the bot. Settings choose the provider and model for chat and notebooks, set the context budget, and configure the OpenCode integration.",
  },
  {
    id: "mcp",
    name: "MCP",
    summary: "Settings for the NexQL MCP server the extension can start.",
    intro:
      "These settings control the NexQL MCP server that the extension exposes to MCP clients: whether it is on, where its binary is, the row cap on AI tool queries, and which tools it offers. The MCP site documents the server itself.",
  },
  {
    id: "backup",
    name: "Backup & restore",
    summary: "Back up and restore a database.",
    intro: "Back up a database, restore one, or open the Backup & Restore workspace and choose a connection and database.",
  },
  {
    id: "sync",
    name: "Sync",
    summary: "Cloud sync for notebooks and saved items, with workspace sharing.",
    intro:
      "Set up sync, run it on demand or pause it, pull or push only, preview what would change, and resolve conflicts. Share items with a workspace, invite members and choose items to leave out. Repair, rebuild-index and diagnostics commands are listed too. Settings cover automatic sync, the notebook folder, the pull interval and the API endpoint.",
  },
  {
    id: "help",
    name: "Settings, license & help",
    summary: "Settings hub, What's New and license commands.",
    intro: "Open the settings hub and What's New, and manage your license: activate it, manage it, view plans and show free usage.",
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    summary: "Debug logging, telemetry and server configuration.",
    intro:
      "Turn on verbose logging to the NexQL Debug output channel, choose a telemetry mode (off, basic or detailed) and tune what is sent, and show a database's configuration.",
  },
];

const AREA_BY_ID = new Map(AREAS.map((a) => [a.id, a]));

// ---- classification -----------------------------------------------------------
// Rules run on the command id without its prefix ("postgres-explorer."), first
// match wins. Explicit overrides run before the rules.

const shortId = (id: string) => id.replace(/^postgres-explorer\./, "").replace(/^postgresExplorer\./, "");

const COMMAND_OVERRIDES: Record<string, string> = {
  searchSchema: "explorer",
  openColumnNotebook: "explorer",
  openRoleDesigner: "schema",
  formatSql: "notebooks",
  copyQuery: "saved",
  openQuery: "saved",
  optimizeQuery: "ai",
  quickClone: "objects",
  pasteTable: "objects",
  sequenceNextValue: "objects",
  refreshMaterializedView: "objects",
  "ddlViewer.executeRoutine": "scripts",
  disconnectDatabase: "connections",
  switchNotebookConnection: "connections",
};

const COMMAND_RULES: [area: string, test: RegExp][] = [
  ["sync", /^sync\./],
  ["help", /^(license\.|settingsHub$|showWhatsNew$)/],
  ["diagnostics", /^(telemetry\.|showConfiguration$)/],
  ["connections", /^(sentinel\.|audit\.)/],
  ["profiles", /ConnectionProfiles?$/],
  ["ai", /^(nexql\.bot\.|ai[A-Z]|attachToChat$|chatWithQuery$|generateQuery$|openSqlAssistantTab$)/],
  ["backup", /^(backup|restore|openBackup)/],
  ["dashboard", /^(showDashboard|openListenNotify)/],
  ["performance", /^(explain|queryStudio\.explain|analyzeIndexUsage$|indexUsage$|tableActivity$|tableProfile$|viewColumnStatistics$)/],
  ["notebooks", /^(queryStudio|openQueryStudio|queryTool$|psqlTool$|newNotebook$|notebooks\.|quickOpenNotebook$|jumpToSection$)/],
  ["results", /^(exportTable$|exportNotebook$|toggleFullDataset)/],
  ["saved", /(SavedQuer|QueryToLibrary)|^(clearHistory|deleteHistoryItem|showQueryRecommendations)$/],
  ["schema", /^(openErd|openSchemaDiff|openTableDesigner|createTableVisual|importDbml|importData$|migrationHub$|dbindex\.)/],
  [
    "connections",
    /^(addConnection|connect$|disconnect|editConnection|deleteConnection|duplicateConnection|manageConnections|importConnectionFromDatabaseUrl|smartPasteConnection|refreshConnections|pinConnection|unpinConnection|assignConnectionColor|setConnectionGroup|reconnectConnection|switch(Connection|Database|WorkspaceDefaultConnection)$)/,
  ],
  ["scripts", /^(script|generate|insertData$|updateData$|callFunction$|callProcedure$|viewScript)/],
  [
    "objects",
    /^(create|drop|edit|add(?!ToFavorites)|enable|disable|truncate|grantRevoke$|detach|validate|maintenance|viewMaintenance|installPgCron$|scheduleCronJob$|unscheduleCronJob$)|Operations$/,
  ],
  ["explorer", /^(show|list|refresh|view|open|copy|addToFavorites$|removeFromFavorites$|ddlViewer\.|tableDefinition$)/],
];

const SETTING_RULES: [area: string, test: RegExp][] = [
  ["sync", /^sync\./],
  ["diagnostics", /^(telemetry\.|debug$)/],
  ["connections", /^(connections$|sentinel\.)/],
  ["mcp", /^mcp\./],
  ["ai", /^(ai|opencode)/],
  ["schema", /^dbIndex\./],
  ["explorer", /^(ddlViewer\.|autoRefresh\.)/],
  ["performance", /^performance\.slowQueryThresholdMs$/],
  ["results", /^(performance\.|query\.(autoLimitEnabled|byteaDisplayFormat)$)/],
  ["saved", /^queryHistory\./],
  ["notebooks", /^(query\.|queryTimeout$|formatter\.|parameters\.)/],
];

/**
 * Settings that exist in the manifest but are not for users to change, so the
 * reference leaves them out. The license overrides are ignored in production
 * builds and are not something to advertise.
 */
const INTERNAL_SETTINGS = new Set(["postgresExplorer.license.enforcement", "postgresExplorer.license.endpoint"]);

const settingShortKey = (key: string) => key.replace(/^postgresExplorer\./, "").replace(/^nexql\./, "");

// ---- build-time check ---------------------------------------------------------

export interface DocCommand extends ManifestCommand {
  area: Area;
  /** Title with decoration (emoji, "(Deprecated)") removed. */
  label: string;
  deprecated: boolean;
}
export interface DocSetting extends ManifestSetting {
  area: Area;
  /** Key without the extension prefix. */
  short: string;
}

const classify = (rules: [string, RegExp][], name: string, overrides: Record<string, string> = {}) => {
  const id = overrides[name] ?? rules.find(([, re]) => re.test(name))?.[0];
  return id ? AREA_BY_ID.get(id) : undefined;
};

/** A command with no title, or hidden from the Command Palette and every menu, is plumbing. */
const isInternal = (c: ManifestCommand) => !c.title || (!c.palette && c.locations.length === 0);

const stripDecoration = (title: string) =>
  title
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/\s*\(deprecated\)\s*$/i, "")
    .trim();

const unclassified: string[] = [];
export const COMMANDS: DocCommand[] = [];
export const INTERNAL_COMMANDS: ManifestCommand[] = [];
for (const c of MANIFEST.commands) {
  if (isInternal(c)) {
    INTERNAL_COMMANDS.push(c);
    continue;
  }
  const area = classify(COMMAND_RULES, shortId(c.id), COMMAND_OVERRIDES);
  if (!area) {
    unclassified.push(c.id);
    continue;
  }
  COMMANDS.push({ ...c, area, label: stripDecoration(c.title!), deprecated: /\(deprecated\)/i.test(c.title!) });
}
export const SETTINGS: DocSetting[] = [];
for (const s of MANIFEST.settings) {
  if (INTERNAL_SETTINGS.has(s.key)) continue;
  const short = settingShortKey(s.key);
  const area = classify(SETTING_RULES, short);
  if (!area) {
    unclassified.push(s.key);
    continue;
  }
  SETTINGS.push({ ...s, area, short });
}
if (unclassified.length) {
  throw new Error(
    `docs.ts has no area for: ${unclassified.join(", ")}. Add a rule or override in src/data/docs.ts, or an area in AREAS.`,
  );
}
const staleOverrides = Object.keys(COMMAND_OVERRIDES).filter((k) => !MANIFEST.commands.some((c) => shortId(c.id) === k));
if (staleOverrides.length) throw new Error(`COMMAND_OVERRIDES names commands the manifest no longer has: ${staleOverrides.join(", ")}`);

export const commandsIn = (areaId: string) => COMMANDS.filter((c) => c.area.id === areaId);
export const settingsIn = (areaId: string) => SETTINGS.filter((s) => s.area.id === areaId);
export const areaHasPro = (areaId: string) => commandsIn(areaId).some((c) => c.pro) || settingsIn(areaId).some((s) => s.pro);

// ---- presentation helpers -----------------------------------------------------

const VIEW_NAME = new Map(MANIFEST.views.map((v) => [v.id, v.name]));
export const viewName = (id?: string) => (id ? (VIEW_NAME.get(id) ?? id) : undefined);

/** Human wording for a tree item type (VS Code context value). */
function itemLabel(item: string): string {
  if (item === "(empty area)") return "empty space";
  if (item === "connection-query-history-item") return "query history entry";
  if (item === "connection-saved-query-item") return "saved query";
  if (item === "savedQuery") return "saved query";
  if (item.startsWith("category-")) return `${item.slice(9).replaceAll("-", " ")} category`;
  return item.replaceAll("-", " ");
}
const itemLabels = (items: string[]) => {
  // connection, connection-pinned, connection-disconnected ... are all "a connection".
  const mapped = items.map((i) => (/^connection(-pinned)?(-disconnected)?$/.test(i) ? "connection" : itemLabel(i)));
  return [...new Set(mapped)];
};

export interface Where {
  /** Short kind used for styling and filtering. */
  kind: "palette" | "context" | "inline" | "toolbar" | "menu" | "editor" | "notebook";
  /** Complete phrase, e.g. "Right-click a table in Connections". */
  text: string;
  /** Extra item names beyond the first few, shown behind a disclosure. */
  more?: string[];
  /** The visible head phrase when `more` is set. */
  head?: string;
}

const LIST_LIMIT = 4;
const joinOr = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} or ${xs[xs.length - 1]}`);

/** Where in the editor a command can be run, derived from the manifest's menus. */
export function whereList(c: ManifestCommand): Where[] {
  const out: Where[] = [];
  if (c.palette) out.push({ kind: "palette", text: "Command Palette" });
  for (const l of c.locations) {
    const view = viewName(l.view);
    const inView = view ? ` in ${view}` : "";
    if (l.type === "view-item") {
      const labels = itemLabels(l.items ?? []);
      const verb = l.inline ? "Inline button on" : "Right-click";
      const via = l.submenu ? ` (${l.submenu} submenu)` : "";
      if (labels.length === 0) {
        out.push({ kind: l.inline ? "inline" : "context", text: `${verb} an item${inView}${via}` });
      } else if (labels.length <= LIST_LIMIT) {
        out.push({ kind: l.inline ? "inline" : "context", text: `${verb} ${joinOr(labels.map(withArticle))}${inView}${via}` });
      } else {
        const head = `${verb} any of ${labels.length} item types${inView}${via}`;
        out.push({ kind: l.inline ? "inline" : "context", text: `${head}: ${labels.join(", ")}`, head, more: labels });
      }
    } else if (l.type === "view-title") {
      out.push({ kind: l.toolbar ? "toolbar" : "menu", text: l.toolbar ? `${view ?? "View"} toolbar` : `${view ?? "View"} “…” menu` });
    } else if (l.type === "editor-title") {
      out.push({ kind: "editor", text: l.when?.includes("nexql-ddl") ? "Title bar of a Definition Viewer tab" : "Editor title bar" });
    } else if (l.type === "notebook-toolbar") {
      out.push({ kind: "notebook", text: "Notebook toolbar" });
    } else if (l.type === "notebook-cell") {
      out.push({ kind: "notebook", text: "Notebook cell toolbar" });
    }
  }
  return out;
}
const withArticle = (label: string) => (label === "empty space" ? label : `${/^[aeiou]/i.test(label) ? "an" : "a"} ${label}`);

/** `ctrl+alt+n` -> `Ctrl+Alt+N`. */
export function formatKey(key: string | null): string {
  if (!key) return "";
  return key
    .split("+")
    .map((p) => (p.length === 1 ? p.toUpperCase() : p === "cmd" ? "Cmd" : p[0].toUpperCase() + p.slice(1)))
    .join("+");
}

/** Escapes text for HTML. */
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Renders the markdown a setting description may hold: **bold**, `code`,
 * [links](https://...) and blank-line paragraphs. Everything is escaped first;
 * only http(s) links become anchors.
 */
export function renderMarkdown(text: string): string {
  const paragraphs = text.split(/\n{2,}/).map((p) =>
    esc(p.trim())
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, "<br>"),
  );
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

/** Plain-text version of a description, for search. */
export const plainText = (text: string) => text.replace(/[`*]|\[([^\]]+)\]\([^)]*\)/g, "$1");

export const settingDescription = (s: ManifestSetting) => s.markdownDescription ?? s.description ?? "";

export function typeLabel(s: ManifestSetting): string {
  return Array.isArray(s.type) ? s.type.join(" | ") : (s.type ?? "any");
}

export function formatDefault(v: unknown): string {
  if (v === "(built in)") return "built in";
  if (typeof v === "string") return v === "" ? '"" (empty)' : JSON.stringify(v);
  return JSON.stringify(v);
}

/** A settings.json line for the setting, set to its default. Null when the value is a list of records better edited through the UI. */
export function settingSnippet(s: ManifestSetting): string | null {
  const items = s.items as { properties?: unknown } | undefined;
  if (items?.properties) return null;
  const value = s.default === "(built in)" ? "" : s.default;
  return `"${s.key}": ${JSON.stringify(value)}`;
}

// ---- navigation ---------------------------------------------------------------

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  /** An AREAS id: which reference section the guide links to. */
  area: string;
}

/**
 * Task guides. Each entry needs a page at src/pages/docs/guides/<slug>.astro.
 * Empty for now: add entries here and the hub and sidebar pick them up.
 */
export const GUIDES: Guide[] = [];
for (const g of GUIDES) {
  if (!AREA_BY_ID.has(g.area)) throw new Error(`Guide "${g.slug}" names an unknown area "${g.area}".`);
}
export const guideHref = (slug: string) => `/docs/guides/${slug}`;

export interface NavLink {
  href: string;
  label: string;
}
export interface NavSection {
  id: "start" | "guides" | "features" | "reference";
  label: string;
  /** Top link of the section, when it has an overview page. */
  overview?: NavLink;
  links: NavLink[];
  /** Sub-groups (Features is grouped by workflow). */
  groups?: { label: string; links: NavLink[] }[];
}

export const REFERENCE_LINKS: (NavLink & { summary: string })[] = [
  { href: "/docs/reference/commands", label: "Commands", summary: `All ${COMMANDS.length} commands: where to find each one, and its keyboard shortcut.` },
  { href: "/docs/reference/settings", label: "Settings", summary: `All ${SETTINGS.length} settings: type, default, allowed values and a settings.json snippet.` },
  { href: "/docs/reference/shortcuts", label: "Keyboard shortcuts", summary: "Default keybindings for Windows, Linux and macOS." },
];

export const DOCS_NAV: NavSection[] = [
  {
    id: "start",
    label: "Start",
    links: [{ href: "/docs/getting-started", label: "Getting started" }],
  },
  {
    id: "guides",
    label: "Guides",
    links: GUIDES.map((g) => ({ href: guideHref(g.slug), label: g.title })),
  },
  {
    id: "features",
    label: "Features",
    overview: { href: "/features", label: "All features" },
    links: [],
    groups: GROUPS.map((g) => ({
      label: g.label,
      links: FEATURES.filter((f) => f.group === g.id).map((f) => ({ href: featureHref(f.slug), label: f.name })),
    })),
  },
  {
    id: "reference",
    label: "Reference",
    overview: { href: "/docs/reference", label: "Overview" },
    links: REFERENCE_LINKS.map(({ href, label }) => ({ href, label })),
  },
];

export const areaAnchor = (id: string) => `area-${id}`;

/** Plain wording for the `when` of a keybinding. Unknown conditions come back as the raw expression. */
export function describeWhen(when: string | null): { text: string; raw: boolean } {
  if (!when) return { text: "Anywhere in VS Code", raw: false };
  if (when.includes("nexql.queryStudioActive")) return { text: "In a Query Studio editor", raw: false };
  if (when.includes("notebookEditorFocused") && when.includes("editorTextFocus")) return { text: "In a notebook cell editor", raw: false };
  if (when.includes("notebookEditorFocused")) return { text: "In a notebook", raw: false };
  if (/^editorLangId == sql \|\| editorLangId == pgsql$/.test(when)) return { text: "In .sql and .pgsql files", raw: false };
  return { text: when, raw: true };
}

// ---- views --------------------------------------------------------------------

/** Which reference area each sidebar view belongs to. */
const VIEW_AREA: Record<string, string> = {
  postgresExplorer: "connections",
  "postgresExplorer.notebooks": "notebooks",
  "postgresExplorer.savedQueries": "saved",
  "postgresExplorer.history": "saved",
  "postgresExplorer.chatView": "ai",
};
for (const v of MANIFEST.views) {
  if (!VIEW_AREA[v.id]) throw new Error(`docs.ts: view "${v.id}" (${v.name}) has no entry in VIEW_AREA.`);
}
export const viewArea = (id: string) => AREA_BY_ID.get(VIEW_AREA[id])!;
/** How many documented commands put an item in this view's toolbar or menus. */
export const viewCommandCount = (id: string) => COMMANDS.filter((c) => c.locations.some((l) => l.view === id)).length;
export const containerTitle = (id: string) => MANIFEST.containers.find((c) => c.id === id)?.title ?? id;
