/** Marketing content for the redesigned landing — sourced from website/design/NexQL Site.dc.html */

export const MARKETPLACE =
  "https://marketplace.visualstudio.com/items?itemName=ric-v.postgres-explorer";
export const OPEN_VSX = "https://open-vsx.org/extension/ric-v/postgres-explorer";
export const GITHUB = "https://github.com/dev-asterix/NexQL";
export const CHANGELOG = `${GITHUB}/blob/main/CHANGELOG.md`;
export const COMPATIBILITY = `${GITHUB}/blob/main/docs/COMPATIBILITY.md`;
export const ARCHITECTURE = `${GITHUB}/blob/main/docs/ARCHITECTURE.md`;
export const INSTALL_CMD = "ext install ric-v.postgres-explorer";

export const MARQUEE = [
  "SQL notebooks",
  "Live dashboard",
  "Visual table designer",
  "RLS Policy Studio",
  "Plan Studio",
  "Schema diff",
  "ERD + DBML",
  "Index advisor",
  "Migration hub",
  "Foreign data wrappers",
  "Smart paste",
  "SSH tunnels",
  "Vision AI",
  "Drag & drop context",
  "Backup & restore",
  "Sentinel prod guards",
];

export const FEATURES = [
  {
    mark: "NB",
    tint: "rgba(61,111,224,.16)",
    ink: "#7aa3f5",
    title: "SQL notebooks",
    body: "Native .pgsql notebooks with per-cell results, transactions that persist across cells and CodeLens actions on every query.",
    points: [
      "Sliding-window streaming for huge SELECTs",
      "Column stats, transpose, filters, in-grid edits",
      "Export CSV, JSON or Excel from the original SQL",
    ],
  },
  {
    mark: "AI",
    tint: "rgba(224,56,143,.16)",
    ink: "#f06ab0",
    title: "Assistant that reads your schema",
    body: "Agentic tool-calling over your live catalog, with a collapsible trace so you can see exactly which objects it looked at.",
    points: [
      "Zero-config free tier, or bring your own keys",
      "Drag tables, columns and notebooks in as @mentions",
      "Explain and fix failing queries in the error cell",
    ],
  },
  {
    mark: "DB",
    tint: "rgba(242,107,58,.16)",
    ink: "#f58a5c",
    title: "Live dashboard",
    body: "Activity, locks, WAL and checkpointer stats, bloat, autovacuum progress and unused-index severity — refreshed in place.",
    points: [
      "Cancel or kill blocking queries inline",
      "Ask AI about any metric without leaving the panel",
      "Degradation alerts against a tracked baseline",
    ],
  },
  {
    mark: "SG",
    tint: "rgba(34,197,94,.16)",
    ink: "#4ade80",
    title: "Production guardrails",
    body: "Tag connections prod, staging or dev. NexQL tints the chrome, badges the status bar and scores every statement before it runs.",
    points: [
      "Read-only mode enforced at the connection",
      "Risk multiplier and confirmation on prod writes",
      "Auto-LIMIT on SELECT, configurable per workspace",
    ],
  },
];

export const AGENTS = [
  "GitHub Copilot",
  "Cursor",
  "Claude Desktop",
  "Codex",
  "Antigravity",
  "Any MCP client",
];

export const MCP_TOOLS = [
  { name: "list_schemas", desc: "schema discovery" },
  { name: "list_objects", desc: "tables, views, routines" },
  { name: "describe_object", desc: "columns, types, comments" },
  { name: "search_schema", desc: "full-text over names" },
  { name: "run_select", desc: "SELECT / EXPLAIN only" },
  { name: "explain_query", desc: "EXPLAIN ANALYZE plans" },
  { name: "get_join_path", desc: "FK relationship traversal" },
  { name: "get_table_stats", desc: "size and row estimates" },
  { name: "get_index_usage", desc: "scan counts and waste" },
  { name: "switch_connection", desc: "context switching" },
];

export const PLATFORMS = [
  { name: "PostgreSQL", note: "12–17, self-hosted or Docker", icon: "postgresql.svg" },
  { name: "Neon", note: "direct endpoint, sslmode require", icon: "neon.svg" },
  { name: "Supabase", note: "direct or session pooler (5432)", icon: "supabase.svg" },
  { name: "TimescaleDB", note: "extension — everything works", icon: "timescale.svg" },
  { name: "YugabyteDB", note: "YSQL on 5433, gated fallbacks", icon: "yugabytedb.svg" },
  { name: "AWS RDS", note: "SSL require, bastion via SSH", icon: "aws.svg" },
  { name: "Aurora", note: "cluster endpoint, full support", icon: "aurora.svg" },
  { name: "Cloud SQL", note: "auth proxy or SSL certs", icon: "googlecloud.svg" },
  { name: "AlloyDB", note: "real Postgres, no caveats", icon: "alloydb.svg" },
  { name: "Azure Flexible", note: "SSL require", icon: "azure.svg" },
];

export const COMPARE = [
  { k: "Lives in VS Code", nexql: "Native", a: "—", b: "—", c: "—" },
  { k: "SQL notebooks", nexql: "Interactive .pgsql", a: "—", b: "—", c: "—" },
  { k: "AI assistant", nexql: "Built in, schema-grounded", a: "—", b: "—", c: "—" },
  { k: "MCP server for agents", nexql: "Bundled binary", a: "—", b: "—", c: "—" },
  { k: "Real-time dashboard", nexql: "Yes", a: "Yes", b: "Limited", c: "Limited" },
  { k: "In-grid editing", nexql: "Yes, explicit commit", a: "Yes", b: "Yes", c: "Yes" },
  { k: "Export formats", nexql: "CSV, JSON, Excel", a: "CSV, JSON", b: "CSV, JSON, Excel", c: "CSV, JSON, SQL" },
  { k: "Foreign data wrappers", nexql: "Full management", a: "Yes", b: "Limited", c: "—" },
  { k: "License", nexql: "MIT core", a: "PostgreSQL", b: "Apache 2.0", c: "Proprietary" },
];

export const RELEASES = [
  {
    v: "v2.5.0",
    date: "2026-08-08",
    tag: "nightly",
    title: "Nightly channel for v2.4.0",
    body: "Pre-release build carrying the v2.4.0 feature set — NexQL Bot rebrand, MCP install/update UX, agentic step limits, and notebook context fixes.",
  },
  {
    v: "v2.4.0",
    date: "2026-08-08",
    tag: "stable",
    title: "NexQL Bot and smarter MCP setup",
    body: "SQL Assistant is now NexQL Bot. MCP gets one-click install, update checks, and tool profiles in Preferences. Agentic step limits, scratch-notebook fixes, and packaged-build dependency corrections round out the release.",
  },
  {
    v: "v2.2.3",
    date: "2026-07-29",
    tag: "stable",
    title: "MCP server moves to stdio",
    body: "VS Code now spawns the bundled nexql-mcp binary directly. Ephemeral profiles emit TLS settings for Neon, Supabase and RDS; SSH-tunnelled connections are named rather than failing opaquely.",
  },
  {
    v: "v2.2.2",
    date: "2026-07-17",
    tag: "stable",
    title: "Drag & drop into chat and notebooks",
    body: "Drag tables, views, columns and routines from the explorer into the assistant as @mentions — or onto a cell for a formatted reference. Indexing gets an in-webview wizard and auto-rebuild of stale indexes.",
  },
  {
    v: "v2.2.0",
    date: "2026-07-09",
    tag: "milestone",
    title: "NexQL Free AI is generally available",
    body: "Zero-config managed models behind a secure gateway, atomic monthly quotas and per-tier throttling. Data import, backup/restore and database indexing became unlimited on every tier.",
  },
];

export const FAQS = [
  {
    q: "Do I need an API key to use the AI features?",
    a: "No. NexQL Free AI autoloads as the default provider — no key, no account, no configuration. If you would rather use your own, OpenAI, Anthropic, Gemini, GitHub Models, VS Code LM, Ollama, LM Studio and custom endpoints are all supported, each with its key stored separately in the OS keychain.",
  },
  {
    q: "Will it ever run a query without asking me?",
    a: "No. The execution model is notebook-first: the assistant writes SQL into a cell and stops. You review it and press run. Risky statements against a Production-tagged connection require an extra confirmation on top of that.",
  },
  {
    q: "Is it actually open source?",
    a: "The core is MIT and builds a fully working free extension you may fork, rebrand and publish under your own ID. The Marketplace build adds proprietary premium features on top of that core.",
  },
  {
    q: "Does it work with Neon and Supabase?",
    a: "Yes — anything speaking the PostgreSQL wire protocol. Use the direct (non-pooler) endpoint on Neon, and direct or the session pooler on port 5432 for Supabase; transaction-mode poolers break cross-cell transactions, LISTEN/NOTIFY and temp tables.",
  },
  {
    q: "How are my credentials stored?",
    a: "Through VS Code SecretStorage, which is encrypted by the OS keychain — Keychain on macOS, Credential Manager on Windows, libsecret on Linux. Nothing is written in plain text, and .pgpass files are supported.",
  },
  {
    q: "What does telemetry collect?",
    a: "No SQL text, schema or object names, hostnames, database names, usernames or credentials. Payloads are allowlisted and bucketed, VS Code global telemetry is a hard gate, and the mode can be set to off.",
  },
];

export const PLAYGROUND_QUERIES = [
  {
    title: "Revenue leaderboard",
    ask: "top customers by revenue this quarter",
    reply:
      "Grounded in public.customers + public.orders (FK: orders.customer_id). Joined, aggregated and capped at 10 — review before running.",
    sql: `SELECT c.name AS customer,
       count(o.id) AS orders,
       sum(o.total) AS revenue
FROM   customers c
JOIN   orders o ON o.customer_id = c.id
WHERE  o.placed_at >= date_trunc('quarter', now())
GROUP  BY c.name
ORDER  BY revenue DESC
LIMIT  10;`,
    meta: "6 rows · 41 ms · auto-LIMIT 1000",
    cols: ["customer", "orders", "revenue"],
    rows: [
      ["Northwind Ltd", "412", "$184,220"],
      ["Kestrel Data", "388", "$171,905"],
      ["Halcyon Foods", "301", "$142,380"],
      ["Vantage Rail", "264", "$118,740"],
      ["Corvid Labs", "208", "$96,510"],
      ["Marlowe & Co", "177", "$81,224"],
    ],
    bars: [
      { l: "Northwind", v: "184k", h: "100%" },
      { l: "Kestrel", v: "172k", h: "93%" },
      { l: "Halcyon", v: "142k", h: "77%" },
      { l: "Vantage", v: "119k", h: "64%" },
      { l: "Corvid", v: "97k", h: "52%" },
      { l: "Marlowe", v: "81k", h: "44%" },
    ],
  },
  {
    title: "Index audit",
    ask: "which indexes are we paying for and not using?",
    reply:
      "Reading pg_stat_user_indexes on the live connection. Sorted by wasted bytes — these are drop candidates once you confirm no rare batch job needs them.",
    sql: `SELECT relname      AS table,
       indexrelname AS index,
       idx_scan     AS scans,
       pg_size_pretty(
         pg_relation_size(indexrelid)
       ) AS size
FROM   pg_stat_user_indexes
WHERE  idx_scan < 50
ORDER  BY pg_relation_size(indexrelid) DESC;`,
    meta: "5 rows · 12 ms · 1.8 GB reclaimable",
    cols: ["table", "index", "scans", "size"],
    rows: [
      ["orders", "idx_orders_legacy_ref", "0", "812 MB"],
      ["events", "idx_events_payload_gin", "3", "504 MB"],
      ["customers", "idx_customers_upper_email", "11", "268 MB"],
      ["orders", "idx_orders_status_old", "24", "171 MB"],
      ["sessions", "idx_sessions_ua", "41", "96 MB"],
    ],
    bars: [
      { l: "orders_legacy", v: "812MB", h: "100%" },
      { l: "events_gin", v: "504MB", h: "62%" },
      { l: "cust_email", v: "268MB", h: "33%" },
      { l: "status_old", v: "171MB", h: "21%" },
      { l: "sessions_ua", v: "96MB", h: "12%" },
    ],
  },
  {
    title: "Slow checkout",
    ask: "why did checkout get slow after the last deploy?",
    reply:
      "Ran EXPLAIN ANALYZE against the tracked baseline. The join flipped from an index scan to a sequential scan — statistics on orders are stale.",
    sql: `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.total, p.captured_at
FROM   orders o
JOIN   payments p ON p.order_id = o.id
WHERE  o.status = 'pending'
  AND  o.placed_at > now() - interval '1 day';`,
    meta: "planning 0.6 ms · execution 4 812 ms · 312% slower than baseline",
    cols: ["node", "rows", "time"],
    rows: [
      ["Hash Join", "18 402", "4 802 ms"],
      ["→ Seq Scan on orders", "2 140 883", "4 511 ms"],
      ["→ Hash", "18 402", "214 ms"],
      ["→ Index Scan on payments", "18 402", "188 ms"],
      ["Filter: status = pending", "—", "—"],
      ["Suggestion: ANALYZE orders", "—", "—"],
    ],
    bars: [
      { l: "Seq Scan", v: "4511", h: "100%" },
      { l: "Hash", v: "214", h: "5%" },
      { l: "Idx Scan", v: "188", h: "4%" },
      { l: "Plan", v: "0.6", h: "1%" },
      { l: "Baseline", v: "1180", h: "26%" },
      { l: "Target", v: "200", h: "5%" },
    ],
  },
];
