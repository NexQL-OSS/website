/**
 * Copy and data for /docs/getting-started (src/pages/docs/getting-started.astro
 * and src/components/docs/tour/*).
 *
 * Every command title, setting key, keybinding and default here was checked
 * against the committed manifests: core `package.json` and pro
 * `contributes.pro.json`. Command titles are written as users see them in the
 * Command Palette (a command with a category shows as "Category: Title").
 * Change a name here only after checking it again in the manifest.
 */

import { INSTALL_CMD, MCP_URL, THEMES_URL } from "./site";

export interface TourStop {
  id: string;
  label: string;
  minutes: string;
  /** h2 split around its one serif-italic word. */
  head: [string, string, string];
  lede: string;
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: "install",
    label: "Install",
    minutes: "2 min",
    head: ["Install it in a ", "minute", "."],
    lede: "NexQL is a VS Code extension. Install it from the Marketplace, or from Open VSX if your editor reads that instead.",
  },
  {
    id: "connect",
    label: "Connect",
    minutes: "3 min",
    head: ["Add your first ", "connection", "."],
    lede: "Three ways in. All three end with a connection in the Connections view. Set its environment now, while you are in the form.",
  },
  {
    id: "explore",
    label: "Explore",
    minutes: "3 min",
    head: ["Walk the ", "schema", "."],
    lede: "The Connections view is a live tree of the catalog. Right-click anything to see what you can do with it.",
  },
  {
    id: "query",
    label: "Query",
    minutes: "3 min",
    head: ["Run your first ", "query", "."],
    lede: "Queries live in .pgsql notebooks. Each cell keeps its own results, so you can come back to them.",
  },
  {
    id: "ai",
    label: "Ask",
    minutes: "2 min",
    head: ["Turn on the ", "assistant", "."],
    lede: "NexQL Bot works out of the box with no key and no account. Bring your own provider when you want to. It writes SQL; you press play.",
  },
  {
    id: "safe",
    label: "Stay safe",
    minutes: "2 min",
    head: ["Be careful on ", "production", "."],
    lede: "Label the environment, turn on read-only where it fits, and keep auto-LIMIT on. These are the settings that do the work.",
  },
];

export const CMD_INSTALL = INSTALL_CMD;
export const CMD_INSTALL_CLI = "code --install-extension ric-v.postgres-explorer";

/** Stop 1: where NexQL appears after install. */
export const VIEWS = [
  { name: "Connections", note: "The database tree. Open by default.", open: true },
  { name: "Notebooks", note: "Your .pgsql notebooks, with folders.", open: false },
  { name: "Saved Queries", note: "The query library.", open: false },
  { name: "Query History", note: "What ran, and how long it took.", open: false },
] as const;

/** Stop 2: the three ways to add a connection. */
export const ADD_WAYS = [
  {
    title: "Add PostgreSQL Connection",
    where: "Command Palette, or the + button on the Connections view. Ctrl+Alt+A (Cmd+Alt+A on macOS).",
    body: "Opens the connection form. Fill in host, port, database, user and password, or paste a postgresql:// URL and press Apply URL. Press Test Connection; once it passes, Add Connection appears.",
  },
  {
    title: "Import Connection from DATABASE_URL (.env)",
    where: "The … menu on the Connections view.",
    body: "Scans .env, .env.local, .env.development and .env.production in your workspace for DATABASE_URL-style keys. Pick one if there are several, or paste a URL if there are none, then name it.",
  },
  {
    title: "Add Connection from Clipboard URL",
    where: "Command Palette, or the … menu on the Connections view.",
    body: "Copy a postgres:// or postgresql:// URL first. Choose Add connection to save it as is, or Open in connection editor to review the fields before saving.",
  },
] as const;

/** Stop 2: SSL modes, in the order the form lists them. */
export const SSL_MODES = ["disable", "allow", "prefer", "require", "verify-ca", "verify-full"] as const;

/** Stop 3: what right-click on a table offers, grouped as the menu groups them. */
export const TABLE_MENU: { group: string; items: string[]; note?: string }[] = [
  {
    group: "Inline icons",
    items: ["View Table Data", "Show Table Properties", "Open Definition Viewer", "Attach to NexQL Bot"],
    note: "Hover a table row to see them.",
  },
  {
    group: "Actions",
    items: ["New PostgreSQL Notebook", "Table Operations", "Scripts", "Maintenance", "Smart Paste (create table from clipboard)"],
  },
  {
    group: "Analysis",
    items: ["View Table Profile", "View Table Activity", "View Index Usage", "View Table Definition"],
  },
  {
    group: "Operations",
    items: ["Quick Clone Table", "Truncate Table", "Insert Data", "Update Data", "Export Table Data", "Drop Table"],
  },
];

/** Stop 3: the Scripts and Maintenance submenus. */
export const SCRIPTS = ["SELECT Script", "INSERT Script", "UPDATE Script", "DELETE Script", "CREATE Script"];
export const MAINTENANCE = ["VACUUM", "ANALYZE", "REINDEX"];

/** Stop 3: tree-level commands. */
export const TREE_SHORTCUTS = [
  { keys: "Ctrl+Shift+O", mac: "Cmd+Shift+O", does: "Search Schema Objects" },
] as const;

/** Stop 4: the starter queries. Valid on any PostgreSQL database. */
export const FIRST_SQL = `SELECT version();`;
export const SECOND_SQL = `SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY 1, 2;`;

/** Stop 4: keyboard shortcuts. The first two are VS Code notebook defaults. */
export const SHORTCUTS = [
  { keys: "Ctrl+Enter", mac: "Cmd+Enter", does: "Run the current cell", source: "VS Code" },
  { keys: "Shift+Enter", mac: "Shift+Enter", does: "Run the cell and move to the next", source: "VS Code" },
  { keys: "Ctrl+Alt+N", mac: "Cmd+Alt+N", does: "New PostgreSQL Notebook", source: "NexQL" },
  { keys: "Ctrl+Alt+E", mac: "Cmd+Alt+E", does: "Query Tool", source: "NexQL" },
  { keys: "Ctrl+Shift+C", mac: "Cmd+Shift+C", does: "Switch Notebook Connection", source: "NexQL" },
  { keys: "Ctrl+Shift+B", mac: "Cmd+Shift+B", does: "Quick Open Notebook", source: "NexQL" },
  { keys: "Ctrl+Shift+O", mac: "Cmd+Shift+O", does: "Search Schema Objects", source: "NexQL" },
  { keys: "Shift+Alt+F", mac: "Shift+Alt+F", does: "Format SQL", source: "NexQL" },
] as const;

/** Stop 5: providers the Bot can use (enum of postgresExplorer.ai.chat.provider). */
export const PROVIDERS = [
  "NexQL Free AI",
  "VS Code LM",
  "GitHub Models",
  "Cursor",
  "OpenCode",
  "OpenAI",
  "Anthropic",
  "Gemini",
  "Ollama",
  "LM Studio",
  "Custom endpoint",
];

export const FIRST_QUESTIONS = [
  "which tables have no primary key?",
  "how do orders relate to customers?",
  "top customers by revenue this quarter",
  "which indexes are we paying for and not using?",
];

/** Stop 6: settings.json snippets. `.c` spans are comments and are not copied. */
export const SNIPPET_LIMIT = `{
  <span class="c">// Append LIMIT to SELECTs that have none (default: true)</span>
  "postgresExplorer.query.autoLimitEnabled": true,
  <span class="c">// Rows that auto-LIMIT allows (default: 1000)</span>
  "postgresExplorer.performance.defaultLimit": 1000,
  <span class="c">// Stop queries after this many ms (default: 0, no timeout)</span>
  "postgresExplorer.queryTimeout": 30000
}`;

export const SNIPPET_SENTINEL = `{
  <span class="c">// Tint the status bar by environment (default: true)</span>
  "postgresExplorer.sentinel.statusBarAccent": true,
  <span class="c">// Tint the title bar and activity bar too (default: true)</span>
  "postgresExplorer.sentinel.chromeAccent": true,
  <span class="c">// [P] [S] [D] badges on notebook tabs (default: true)</span>
  "postgresExplorer.sentinel.tabBadges": true,
  <span class="c">// Notify when the focused notebook changes environment (default: false)</span>
  "postgresExplorer.sentinel.notifyOnTransition": true
}`;

export const SNIPPET_AI = `{
  <span class="c">// Default: "nexql-free". Others: "openai", "anthropic", "gemini", "ollama", ...</span>
  "postgresExplorer.ai.chat.provider": "anthropic",
  <span class="c">// Notebook AI (Ask AI on a cell) has its own provider</span>
  "postgresExplorer.ai.notebook.provider": "anthropic"
}`;

/** The arrived handoff. */
export const NEXT_LINKS = [
  { href: "/features", title: "Features", desc: "One page per workflow: notebooks, explorer, assistant, safety, dashboard.", ext: false },
  { href: "/docs", title: "Docs", desc: "Guides for each part of NexQL.", ext: false },
  { href: "/docs/reference/commands", title: "Command reference", desc: "Every command, its title and its shortcut.", ext: false },
  { href: "/docs/reference/settings", title: "Settings reference", desc: "Every setting, its default and what it changes.", ext: false },
  { href: MCP_URL, title: "NexQL MCP", desc: "Give Claude, Cursor or Copilot read access to the same live schema.", ext: true },
  { href: THEMES_URL, title: "NexQL themes", desc: "Colour themes to match the editor around your queries.", ext: true },
] as const;
