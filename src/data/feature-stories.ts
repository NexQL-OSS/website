/**
 * Canonical feature stories — sourced from nexql-core + nexql-pro product surfaces.
 * Used by /features/* pages and the homepage workspace map.
 */

export type FeatureTier = "free" | "sponsor" | "singularity";
export type SpineBeat = "connect" | "explore" | "query" | "analyze";

export type FeatureStepVisual =
  | "connect"
  | "tree"
  | "notebook"
  | "sql"
  | "ai"
  | "safety"
  | "schema"
  | "explain"
  | "dashboard";

export interface FeatureStep {
  title: string;
  body: string;
  visual: FeatureStepVisual;
  /** Optional SQL or chat snippet shown in the demo panel */
  snippet?: string;
}

export interface FeatureStory {
  slug: string;
  spineBeat: SpineBeat;
  spineN: string;
  path: string;
  label: string;
  kicker: string;
  title: string;
  titleEm?: string;
  lede: string;
  tier: FeatureTier;
  tierLabel: string;
  caps: string[];
  steps: FeatureStep[];
  tryDemo: { file: string; panel?: string };
  related: string[];
}

export const FEATURES: FeatureStory[] = [
  {
    slug: "notebooks",
    spineBeat: "query",
    spineN: "03",
    path: "workspace / notebooks",
    label: "query.pgsql",
    kicker: "SQL notebooks",
    title: "Notebooks that commit",
    titleEm: "like source.",
    lede:
      ".pgsql files mix SQL cells and markdown in one editor tab. Run one cell or the whole notebook — results, charts, and export land inline. Git-tracked by default.",
    tier: "free",
    tierLabel: "Free · Core",
    caps: ["Write & run", "Inline results", "Export", "Query history"],
    steps: [
      {
        title: "Create a notebook bound to a connection",
        body: "New Notebook → pick connection and database. The file lives in your repo as query.pgsql — not a separate client export.",
        visual: "notebook",
      },
      {
        title: "Write SQL cells with schema-aware completions",
        body: "IntelliSense knows your live catalog: tables, columns, functions. Ctrl+Enter runs the active cell through the notebook kernel.",
        visual: "sql",
        snippet:
          "SELECT date_trunc('day', created_at) AS day,\n       COUNT(*) AS orders\nFROM orders\nGROUP BY day;",
      },
      {
        title: "Results render below the cell — sort, filter, edit",
        body: "Sortable grids, column stats, in-grid edits with explicit commit SQL. Streaming fetch for large result sets.",
        visual: "notebook",
      },
      {
        title: "Export or save to library",
        body: "CSV, JSON, Excel from the result footer. Save Query pushes to the Saved Queries sidebar with connection context.",
        visual: "notebook",
      },
    ],
    tryDemo: { file: "query", panel: "nexql" },
    related: ["explorer", "assistant", "plan-studio"],
  },
  {
    slug: "explorer",
    spineBeat: "explore",
    spineN: "02",
    path: "workspace / explorer",
    label: "demo_db · public",
    kicker: "Database explorer",
    title: "One tree for the",
    titleEm: "whole schema.",
    lede:
      "Connections → databases → schemas → 16+ object types. Right-click generates correct SQL. Drag tables into notebooks or the SQL Assistant as @mentions.",
    tier: "free",
    tierLabel: "Free · Core",
    caps: ["16+ objects", "Column insights", "Schema search", "Generated SQL"],
    steps: [
      {
        title: "Connect with platform presets",
        body: "Neon, Supabase, RDS, AlloyDB — SSL and port pre-filled. SSH tunnel in Advanced when the DB is behind a bastion.",
        visual: "connect",
      },
      {
        title: "Browse the live object tree",
        body: "Tables, views, mat views, functions, triggers, partitions, FDWs, publications, extensions — expand without leaving VS Code.",
        visual: "tree",
      },
      {
        title: "Inspect columns on demand",
        body: "Click a column for null %, distinct count, min/max. Constraints and indexes sit beside the column list.",
        visual: "tree",
      },
      {
        title: "Generate scripts or open operations notebooks",
        body: "SELECT / INSERT / ALTER from context menu with real object names. Table Profile and Index Usage open as guided notebooks.",
        visual: "sql",
        snippet: "SELECT * FROM orders\nWHERE created_at >= NOW() - INTERVAL '7 days';",
      },
    ],
    tryDemo: { file: "query", panel: "nexql" },
    related: ["notebooks", "schema-tools", "sentinel"],
  },
  {
    slug: "assistant",
    spineBeat: "query",
    spineN: "03",
    path: "workspace / sql assistant",
    label: "Ask with schema context",
    kicker: "Schema-aware AI",
    title: "Zero-config AI.",
    titleEm: "No API keys.",
    lede:
      "NexQL Free AI (Smart / Engineer / Architect) ships by default. Or bring OpenAI, Anthropic, Gemini, GitHub Models, VS Code LM. AI never auto-runs — you insert SQL into a notebook cell and Run.",
    tier: "sponsor",
    tierLabel: "Pro · Free AI included",
    caps: ["Text → SQL", "Explain", "Optimize", "Agentic tools"],
    steps: [
      {
        title: "Open SQL Assistant beside your code",
        body: "Activity bar panel or editor tab. @mention tables from the explorer drag-and-drop or picker.",
        visual: "ai",
      },
      {
        title: "Ask in plain English with live schema",
        body: "The assistant grounds on your connected database — not invented table names.",
        visual: "ai",
        snippet:
          "Top 10 customers by revenue last 30 days,\nexclude cancelled orders",
      },
      {
        title: "Review SQL, then insert into notebook",
        body: "Generated SQL lands in a new cell. You control execution — production safety by design.",
        visual: "sql",
        snippet:
          "SELECT c.name, SUM(o.amount) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.status <> 'cancelled'\nGROUP BY c.name\nORDER BY revenue DESC LIMIT 10;",
      },
      {
        title: "Explain, optimize, or debug from results",
        body: "CodeLens on notebook cells: Ask AI, Explain Analyze, Optimize. Agentic mode can search schema and run read-only tools.",
        visual: "ai",
      },
    ],
    tryDemo: { file: "query", panel: "nexql" },
    related: ["notebooks", "plan-studio", "explorer"],
  },
  {
    slug: "sentinel",
    spineBeat: "connect",
    spineN: "01",
    path: "workspace / sentinel",
    label: "DEV / STAGE / PROD",
    kicker: "Sentinel safety",
    title: "Know which database",
    titleEm: "you're on.",
    lede:
      "Environment tags, read-only mode, and query risk scoring before execution. Optional theme swap per environment pairs with NexQL Themes.",
    tier: "free",
    tierLabel: "Free · Core",
    caps: ["Env labels", "Risk scoring", "Read-only", "Theme swap"],
    steps: [
      {
        title: "Tag connections DEV / STAGE / PROD",
        body: "Set in Settings Hub. Labels propagate to status bar, notebook strip, and tab accents when a .pgsql file is focused.",
        visual: "safety",
      },
      {
        title: "Enable read-only on sensitive connections",
        body: "Extension-level block on writes. Auto-LIMIT still applies to SELECTs.",
        visual: "safety",
      },
      {
        title: "Risk score before destructive SQL runs",
        body: "DELETE without WHERE, TRUNCATE, DROP — scored modal with Execute / Transaction / Cancel.",
        visual: "safety",
        snippet: "DELETE FROM orders WHERE status = 'pending';",
      },
      {
        title: "Switch profiles for role context",
        body: "Admin vs analyst presets from the status bar — env + read-only in one click.",
        visual: "connect",
      },
    ],
    tryDemo: { file: "connections", panel: "nexql" },
    related: ["explorer", "notebooks"],
  },
  {
    slug: "schema-tools",
    spineBeat: "explore",
    spineN: "02",
    path: "workspace / visual tools",
    label: "schema.diff · erd",
    kicker: "Visual schema tools",
    title: "Design, diff, and map",
    titleEm: "without hand DDL.",
    lede:
      "Table designer, schema diff with migration SQL, auto ERD from foreign keys, CSV/JSON import wizard, and DBML import — all as editor webviews.",
    tier: "sponsor",
    tierLabel: "Pro · Sponsor",
    caps: ["Table designer", "Schema diff", "ERD", "Import wizard"],
    steps: [
      {
        title: "Create or alter tables visually",
        body: "Form-based columns, PK/FK/check constraints — NexQL generates correct DDL preview before you apply.",
        visual: "schema",
      },
      {
        title: "Compare two schemas",
        body: "Pick source and target connections. Review diff tree, copy migration script to a notebook.",
        visual: "schema",
      },
      {
        title: "Generate ERD from live FK graph",
        body: "Pan/zoom entity map. Export SVG, PNG, Mermaid, or DBML for docs.",
        visual: "schema",
      },
      {
        title: "Import CSV/JSON with column mapping",
        body: "Guided type inference and preview before bulk load.",
        visual: "schema",
      },
    ],
    tryDemo: { file: "doc-schema", panel: "nexql" },
    related: ["explorer", "notebooks"],
  },
  {
    slug: "plan-studio",
    spineBeat: "analyze",
    spineN: "04",
    path: "workspace / performance",
    label: "EXPLAIN · plans",
    kicker: "Plan Studio",
    title: "From slow query to",
    titleEm: "concrete fix.",
    lede:
      "EXPLAIN ANALYZE in a notebook cell opens interactive plan trees, flame graphs, and diff between runs. Index recommendations tie back to your schema.",
    tier: "sponsor",
    tierLabel: "Pro · Sponsor",
    caps: ["Visual EXPLAIN", "Plan diff", "Flame graph", "Index hints"],
    steps: [
      {
        title: "Run EXPLAIN from a notebook cell",
        body: "CodeLens Explain Analyze appends a plan cell. Text plan for quick scan; Visual tab for structure.",
        visual: "explain",
        snippet: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM orders\nWHERE created_at >= NOW() - INTERVAL '30 days';",
      },
      {
        title: "Open Plan Studio on the result",
        body: "Tree + flame graph highlight sequential scans and nested loops. Compare two runs side by side.",
        visual: "explain",
      },
      {
        title: "Ask AI to optimize with schema context",
        body: "Optimize CodeLens or assistant suggests CREATE INDEX CONCURRENTLY with expected impact.",
        visual: "ai",
        snippet:
          "CREATE INDEX CONCURRENTLY idx_orders_created_at\n  ON orders (created_at DESC);",
      },
      {
        title: "Charts and analyst on result sets",
        body: "Bar/line/pie from query output. Pivot and histogram in the Analyst tab — optional Send to Assistant.",
        visual: "explain",
      },
    ],
    tryDemo: { file: "query", panel: "nexql" },
    related: ["notebooks", "assistant", "dashboard"],
  },
  {
    slug: "dashboard",
    spineBeat: "analyze",
    spineN: "04",
    path: "workspace / performance",
    label: "live metrics",
    kicker: "Live dashboard",
    title: "Ops metrics",
    titleEm: "without leaving VS Code.",
    lede:
      "Connections, active queries, locks, cache hit ratio, and top tables — refreshed from pg_stat* views. Optional AI health chat grounded on live metrics.",
    tier: "sponsor",
    tierLabel: "Pro · Sponsor",
    caps: ["Connections", "Locks", "Top queries", "AI health chat"],
    steps: [
      {
        title: "Open dashboard from connection or database",
        body: "Tree → Show Database Dashboard, or Ctrl+Alt+D from palette.",
        visual: "dashboard",
      },
      {
        title: "Watch throughput and contention",
        body: "Active sessions, wait events, lock graph — spot blocking chains before they stall deploys.",
        visual: "dashboard",
      },
      {
        title: "Drill into slow queries",
        body: "Jump from dashboard metrics to notebook with pre-filled investigation SQL.",
        visual: "sql",
      },
      {
        title: "Pair with backup workspace",
        body: "pg_dump/pg_restore with version checks and filtered table dumps — same connection context.",
        visual: "dashboard",
      },
    ],
    tryDemo: { file: "gif-dashboard", panel: "nexql" },
    related: ["plan-studio", "sentinel"],
  },
  {
    slug: "sync",
    spineBeat: "connect",
    spineN: "01",
    path: "workspace / sync",
    label: "team profiles",
    kicker: "Cloud sync",
    title: "Shared context",
    titleEm: "for teams.",
    lede:
      "E2E-encrypted sync of connections, saved queries, and notebooks. Sponsor: NexQL Cloud auto-sync. Singularity: team workspaces and audit hooks.",
    tier: "singularity",
    tierLabel: "Pro · Singularity",
    caps: ["Encrypted sync", "Team sharing", "Audit log", "BYO Postgres"],
    steps: [
      {
        title: "Run sync setup walkthrough",
        body: "Activate license → choose NexQL Cloud or self-hosted Postgres backend → first Sync Now.",
        visual: "connect",
      },
      {
        title: "Connections follow you across machines",
        body: "Secrets stay encrypted — server stores ciphertext only.",
        visual: "connect",
      },
      {
        title: "Share notebooks and saved queries",
        body: "Singularity: invite team, import shared workspace. Notebooks remain plain files in git.",
        visual: "notebook",
      },
      {
        title: "Production audit log",
        body: "Singularity gate: sensitive actions recorded for compliance review.",
        visual: "safety",
      },
    ],
    tryDemo: { file: "readme", panel: "nexql" },
    related: ["sentinel", "notebooks"],
  },
];

export function getFeature(slug: string): FeatureStory | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export const FEATURE_BY_SLUG = Object.fromEntries(FEATURES.map((f) => [f.slug, f])) as Record<
  string,
  FeatureStory
>;
