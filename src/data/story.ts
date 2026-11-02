/**
 * Copy and data for the landing story (src/components/landing/Story.astro and
 * src/components/story/*). Facts come from landing-content.ts and
 * feature-stories.ts; edit here, not in the components.
 */

export interface StopCopy {
  /** h2 split around its one serif-italic word. */
  head: [string, string, string];
  lede: string;
  points: string[];
}

export const STOP_COPY: Record<"connect" | "explore" | "ask" | "watch" | "guard", StopCopy> = {
  connect: {
    head: ["Know which database you’re ", "on", "."],
    lede: "Add a connection in the sidebar, give it a name and an environment, and go. The status bar always shows where you are.",
    points: [
      "Label each connection DEV, STAGE or PROD",
      "SSH tunnels and SSL, set per connection",
      "Works with Neon, Supabase, AWS RDS and other managed Postgres",
      "Passwords stay in VS Code secret storage",
    ],
  },
  explore: {
    head: ["Browse the schema, query in ", "notebooks", "."],
    lede: "A tree explorer for the catalog, and native .pgsql notebooks for the queries. Each cell keeps its own results.",
    points: [
      "Transactions that persist across cells, and CodeLens actions on every query",
      "Sliding-window streaming for huge SELECTs",
      "Column stats, transpose, filters and in-grid edits",
      "Export CSV, JSON or Excel from the original SQL",
    ],
  },
  ask: {
    head: ["Ask in English, get SQL you can ", "read", "."],
    lede: "NexQL Bot reads your live catalog before it writes anything, and shows which objects it looked at. The SQL lands in a notebook cell. Nothing runs until you press play.",
    points: [
      "Free tier with no key and no account",
      "Drag tables, columns and notebooks in as @mentions",
      "Explain and fix a failing query from its error cell",
    ],
  },
  watch: {
    head: ["See what the database is ", "doing", "."],
    lede: "A live dashboard inside VS Code. Activity, locks, WAL and checkpointer stats, bloat, autovacuum progress and unused indexes, refreshed in place.",
    points: [
      "Cancel or kill blocking queries inline",
      "Unused indexes ranked by severity",
      "Degradation alerts against a tracked baseline",
      "Ask AI about any metric without leaving the panel",
    ],
  },
  guard: {
    head: ["Production writes get a second ", "look", "."],
    lede: "Tag a connection prod and NexQL tints the editor, badges the status bar and scores every statement before it runs.",
    points: [],
  },
};

/** Environment options shown in the connection mock. */
export const ENVS = [
  { id: "dev", label: "DEV", cls: "dev" },
  { id: "stage", label: "STAGE", cls: "stage" },
  { id: "prod", label: "PROD", cls: "prod" },
] as const;

export const PROVIDERS = [
  "NexQL Free AI",
  "OpenAI",
  "Anthropic",
  "Gemini",
  "GitHub Models",
  "VS Code LM",
  "Ollama",
  "LM Studio",
  "Custom endpoint",
];

export const FIRST_QUESTIONS = [
  "top customers by revenue this quarter",
  "which indexes are we paying for and not using?",
  "why did checkout get slow after the last deploy?",
  "what is blocking my migration right now?",
  "explain this error and fix the query",
];

export const GUARD_CARDS = [
  {
    title: "The editor knows it’s prod",
    body: "Tag a connection prod, staging or dev. NexQL tints the chrome and badges the status bar, so you can’t mistake one for another.",
    proof: "status bar: ● PRODUCTION",
  },
  {
    title: "Every statement is scored",
    body: "DELETE without WHERE, TRUNCATE and DROP open a scored dialog with Execute, Transaction or Cancel. On prod connections the score is multiplied.",
    proof: "DELETE without WHERE → high risk",
  },
  {
    title: "Prod writes ask first",
    body: "A write against a prod connection needs an explicit confirmation. Nothing from the assistant runs on its own either.",
    proof: "Confirm: UPDATE on PROD?",
  },
  {
    title: "Read-only when you say so",
    body: "Turn on read-only for a connection and writes are blocked. SELECTs still get an automatic LIMIT, configurable per workspace.",
    proof: "auto-LIMIT 1000",
  },
];

export const GIFS = {
  explore: {
    src: "/assets/03-explorer.gif",
    width: 900,
    height: 506,
    alt: "The NexQL explorer tree beside a .pgsql notebook in VS Code, running ANALYZE on a table and showing the guidance cell.",
    caption: "Tree explorer and notebook, side by side.",
  },
  watch: {
    src: "/assets/05-dashboard.gif",
    width: 960,
    height: 540,
    alt: "The NexQL live dashboard in VS Code: activity charts, idle-in-transaction sessions and a session list with Explain, Cancel and Kill buttons.",
    caption: "Activity tab: sessions with Explain, Cancel and Kill.",
  },
};

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
