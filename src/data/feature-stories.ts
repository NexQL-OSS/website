/**
 * Feature pages: one entry per capability. Drives /features (hub cards),
 * /features/<slug> (page body) and the docs sidebar (DocsLayout).
 *
 * Copy rules: plain, specific, sentence case. Wrap the one serif word of a
 * title in asterisks: "Know which *database* you're on".
 */

export type FeatureTier = "free" | "sponsor" | "singularity";
export type FeatureGroupId = "connect" | "explore" | "query" | "analyze";
export type FeatureMock =
  | "connect"
  | "tree"
  | "notebook"
  | "ai"
  | "safety"
  | "schema"
  | "explain"
  | "dashboard";

export interface FeatureStep {
  title: string;
  body: string;
  /** Optional SQL or chat prompt shown under the step. */
  snippet?: string;
}

export interface FeatureStory {
  slug: string;
  group: FeatureGroupId;
  /** Short name used in nav, cards and related links. */
  name: string;
  /** Page title with the serif word in *asterisks*. */
  title: string;
  /** One sentence for hub cards. */
  summary: string;
  /** Opening paragraph of the page; also its meta description. */
  lede: string;
  tier: FeatureTier;
  tierLabel: string;
  /** Key facts, shown as a compact list. */
  facts: string[];
  steps: FeatureStep[];
  /** Figure: a recorded GIF from /assets when one matches, otherwise a drawn mock. */
  figure: {
    mock: FeatureMock;
    gif?: { src: string; alt: string; width: number; height: number };
    caption: string;
  };
  related: string[];
}

export const GROUPS: { id: FeatureGroupId; label: string; blurb: string }[] = [
  { id: "connect", label: "Connect", blurb: "Know where you are and keep it in sync." },
  { id: "explore", label: "Explore", blurb: "See and change the schema." },
  { id: "query", label: "Query", blurb: "Write SQL, or ask for it." },
  { id: "analyze", label: "Analyze", blurb: "Plans, metrics and fixes." },
];

export const FEATURES: FeatureStory[] = [
  {
    slug: "notebooks",
    group: "query",
    name: "SQL notebooks",
    title: "SQL notebooks that commit like *source*",
    summary: "Mix SQL cells and markdown in a .pgsql file, run them, and keep the file in git.",
    lede: "A .pgsql file holds SQL cells and markdown in one editor tab. Run one cell or the whole notebook, and results, charts and exports appear inline. The file is plain text, so it commits like any other source file.",
    tier: "free",
    tierLabel: "Free",
    facts: ["Write and run cells", "Inline results and charts", "CSV, JSON and Excel export", "Query history and saved queries"],
    steps: [
      {
        title: "Create a notebook bound to a connection",
        body: "Choose New Notebook, then pick a connection and database. The file lives in your repo as query.pgsql.",
      },
      {
        title: "Write SQL with schema-aware completions",
        body: "Completions come from your live catalog: tables, columns and functions. Ctrl+Enter runs the active cell.",
        snippet: "SELECT date_trunc('day', created_at) AS day,\n       COUNT(*) AS orders\nFROM orders\nGROUP BY day;",
      },
      {
        title: "Read results below the cell",
        body: "Results show in a sortable grid with column stats. You can edit cells in the grid and commit with explicit SQL. Large results stream in.",
      },
      {
        title: "Export or save the query",
        body: "Export CSV, JSON or Excel from the result footer. Save Query adds it to the Saved Queries sidebar with its connection.",
      },
    ],
    figure: {
      mock: "notebook",
      gif: {
        src: "/assets/04-ai-copilot.gif",
        alt: "A .pgsql notebook in VS Code showing query results in a grid, with the SQL Assistant open beside it",
        width: 960,
        height: 540,
      },
      caption: "A notebook with results in a grid, and the SQL Assistant beside it.",
    },
    related: ["explorer", "assistant", "plan-studio"],
  },
  {
    slug: "explorer",
    group: "explore",
    name: "Database explorer",
    title: "One tree for the whole *schema*",
    summary: "Browse connections, databases, schemas and 16+ object types without leaving VS Code.",
    lede: "Connections, databases, schemas, then more than 16 object types in one tree. Right-click to generate SQL with the real object names. Drag a table into a notebook or the SQL Assistant to mention it.",
    tier: "free",
    tierLabel: "Free",
    facts: ["16+ object types", "Column insights", "Schema search", "Generated SQL from the context menu"],
    steps: [
      {
        title: "Connect with a platform preset",
        body: "Presets for Neon, Supabase, RDS and AlloyDB fill in SSL and port. Use an SSH tunnel under Advanced when the database sits behind a bastion.",
      },
      {
        title: "Browse the object tree",
        body: "Tables, views, materialized views, functions, triggers, partitions, foreign data wrappers, publications and extensions all expand in place.",
      },
      {
        title: "Inspect a column",
        body: "Click a column to see null percentage, distinct count, and min and max. Constraints and indexes sit beside the column list.",
      },
      {
        title: "Generate scripts or open an operations notebook",
        body: "SELECT, INSERT and ALTER scripts come from the context menu. Table Profile and Index Usage open as guided notebooks.",
        snippet: "SELECT * FROM orders\nWHERE created_at >= NOW() - INTERVAL '7 days';",
      },
    ],
    figure: {
      mock: "tree",
      gif: {
        src: "/assets/03-explorer.gif",
        alt: "The NexQL explorer tree expanding schemas, tables and columns in VS Code",
        width: 900,
        height: 506,
      },
      caption: "Expanding the tree from a connection down to its columns.",
    },
    related: ["notebooks", "schema-tools", "sentinel"],
  },
  {
    slug: "assistant",
    group: "query",
    name: "SQL assistant",
    title: "AI that reads your *schema*",
    summary: "Ask in plain English. The assistant grounds on your live schema and never runs SQL for you.",
    lede: "NexQL Free AI (Smart, Engineer and Architect modes) works with no API key. You can also bring OpenAI, Anthropic, Gemini, GitHub Models or the VS Code language model. AI never auto-runs: you insert the SQL into a notebook cell and press Run.",
    tier: "sponsor",
    tierLabel: "Pro, free AI included",
    facts: ["Text to SQL, explain and optimize", "Agentic mode with read-only tools", "No API key needed for Free AI", "Bring your own provider"],
    steps: [
      {
        title: "Open the SQL Assistant beside your code",
        body: "Use the activity bar panel or an editor tab. @mention tables by dragging from the explorer or using the picker.",
      },
      {
        title: "Ask in plain English",
        body: "The assistant grounds on your connected database, so it uses tables that exist.",
        snippet: "Top 10 customers by revenue last 30 days,\nexclude cancelled orders",
      },
      {
        title: "Review the SQL, then insert it into a notebook",
        body: "Generated SQL lands in a new cell. You decide whether to run it.",
        snippet:
          "SELECT c.name, SUM(o.amount) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.status <> 'cancelled'\nGROUP BY c.name\nORDER BY revenue DESC LIMIT 10;",
      },
      {
        title: "Explain, optimize or debug from a result",
        body: "CodeLens on notebook cells offers Ask AI, Explain Analyze and Optimize. In agentic mode the assistant can search the schema and run read-only tools.",
      },
    ],
    figure: {
      mock: "ai",
      gif: {
        src: "/assets/04-ai-assist.gif",
        alt: "The SQL Assistant panel under the NexQL explorer tree in VS Code, with a chat box for questions",
        width: 900,
        height: 506,
      },
      caption: "The SQL Assistant panel under the explorer tree.",
    },
    related: ["notebooks", "plan-studio", "explorer"],
  },
  {
    slug: "sentinel",
    group: "connect",
    name: "Sentinel safety",
    title: "Know which *database* you're on",
    summary: "Environment tags, read-only mode and a risk score before destructive SQL runs.",
    lede: "Tag connections DEV, STAGE or PROD, make sensitive ones read-only, and get a risk score before a destructive statement runs. Each environment can also switch the editor theme, using NexQL Themes.",
    tier: "free",
    tierLabel: "Free",
    facts: ["Environment labels", "Query risk scoring", "Read-only connections", "Optional theme swap per environment"],
    steps: [
      {
        title: "Tag connections DEV, STAGE or PROD",
        body: "Set the tag in Settings Hub. The label shows in the status bar, the notebook strip and the tab accents when a .pgsql file is focused.",
      },
      {
        title: "Turn on read-only for sensitive connections",
        body: "The extension blocks writes on that connection. Auto-LIMIT still applies to SELECTs.",
      },
      {
        title: "Check the risk score before destructive SQL",
        body: "DELETE without WHERE, TRUNCATE and DROP open a scored dialog with Execute, Transaction and Cancel.",
        snippet: "DELETE FROM orders WHERE status = 'pending';",
      },
      {
        title: "Switch profiles for role context",
        body: "Admin and analyst presets are in the status bar. One click changes the environment and read-only together.",
      },
    ],
    figure: {
      mock: "safety",
      caption: "Environment tags and a risk score on a DELETE statement.",
    },
    related: ["explorer", "notebooks"],
  },
  {
    slug: "schema-tools",
    group: "explore",
    name: "Visual schema tools",
    title: "Design, diff and map your *schema*",
    summary: "Table designer, schema diff, ERD and an import wizard, all as editor tabs.",
    lede: "A table designer, schema diff with migration SQL, an ERD built from foreign keys, a CSV and JSON import wizard, and DBML import. Each opens as a webview in the editor.",
    tier: "sponsor",
    tierLabel: "Pro, Sponsor",
    facts: ["Table designer", "Schema diff with migration SQL", "ERD export to SVG, PNG, Mermaid and DBML", "CSV and JSON import wizard"],
    steps: [
      {
        title: "Create or alter tables visually",
        body: "Fill in columns and PK, FK and check constraints in a form. NexQL previews the DDL before you apply it.",
      },
      {
        title: "Compare two schemas",
        body: "Pick a source and a target connection, review the diff tree, and copy the migration script into a notebook.",
      },
      {
        title: "Generate an ERD from foreign keys",
        body: "Pan and zoom the entity map. Export SVG, PNG, Mermaid or DBML for your docs.",
      },
      {
        title: "Import CSV or JSON with column mapping",
        body: "The wizard infers types and shows a preview before the bulk load.",
      },
    ],
    figure: {
      mock: "schema",
      caption: "Two tables linked by a foreign key, as the ERD shows them.",
    },
    related: ["explorer", "notebooks"],
  },
  {
    slug: "plan-studio",
    group: "analyze",
    name: "Plan Studio",
    title: "From slow query to concrete *fix*",
    summary: "Read EXPLAIN ANALYZE as a tree and flame graph, compare runs, and get index suggestions.",
    lede: "Run EXPLAIN ANALYZE in a notebook cell to open an interactive plan tree, a flame graph, and a diff between runs. Index recommendations are based on your schema.",
    tier: "sponsor",
    tierLabel: "Pro, Sponsor",
    facts: ["Visual EXPLAIN", "Plan diff between runs", "Flame graph", "Index suggestions", "Charts and an Analyst tab on result sets"],
    steps: [
      {
        title: "Run EXPLAIN from a notebook cell",
        body: "The Explain Analyze CodeLens appends a plan cell. Read the text plan for a quick scan, or the Visual tab for structure.",
        snippet: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM orders\nWHERE created_at >= NOW() - INTERVAL '30 days';",
      },
      {
        title: "Open Plan Studio on the result",
        body: "The tree and flame graph highlight sequential scans and nested loops. Compare two runs side by side.",
      },
      {
        title: "Ask AI to optimize with schema context",
        body: "The Optimize CodeLens or the assistant suggests an index, with the expected impact.",
        snippet: "CREATE INDEX CONCURRENTLY idx_orders_created_at\n  ON orders (created_at DESC);",
      },
      {
        title: "Chart a result set",
        body: "Draw bar, line or pie charts from query output. The Analyst tab adds pivot and histogram, with an optional Send to Assistant.",
      },
    ],
    figure: {
      mock: "explain",
      caption: "A plan with a sequential scan, and the same query after adding an index.",
    },
    related: ["notebooks", "assistant", "dashboard"],
  },
  {
    slug: "dashboard",
    group: "analyze",
    name: "Live dashboard",
    title: "Ops metrics without leaving your *editor*",
    summary: "Connections, locks, cache hit ratio and top tables, read from pg_stat views.",
    lede: "Connections, active queries, locks, cache hit ratio and top tables, refreshed from the pg_stat views. An optional AI health chat answers from the live metrics.",
    tier: "sponsor",
    tierLabel: "Pro, Sponsor",
    facts: ["Connections and active queries", "Locks and wait events", "Top queries and tables", "AI health chat", "pg_dump and pg_restore backup workspace"],
    steps: [
      {
        title: "Open the dashboard from a connection or database",
        body: "Choose Show Database Dashboard in the tree, or press Ctrl+Alt+D from the palette.",
      },
      {
        title: "Watch throughput and contention",
        body: "Active sessions, wait events and the lock graph show blocking chains before they stall a deploy.",
      },
      {
        title: "Drill into slow queries",
        body: "Jump from a dashboard metric to a notebook with the investigation SQL filled in.",
      },
      {
        title: "Back up from the same connection",
        body: "The backup workspace runs pg_dump and pg_restore with version checks and filtered table dumps.",
      },
    ],
    figure: {
      mock: "dashboard",
      gif: {
        src: "/assets/05-dashboard.gif",
        alt: "The NexQL database dashboard showing health, connections and blocking locks in VS Code",
        width: 960,
        height: 540,
      },
      caption: "The database dashboard: health, load, locks and connections.",
    },
    related: ["plan-studio", "sentinel"],
  },
  {
    slug: "sync",
    group: "connect",
    name: "Cloud sync",
    title: "Shared context for *teams*",
    summary: "End-to-end encrypted sync of connections, saved queries and notebooks.",
    lede: "End-to-end encrypted sync of connections, saved queries and notebooks. Sponsor adds NexQL Cloud auto-sync. Singularity adds team workspaces and audit hooks.",
    tier: "singularity",
    tierLabel: "Pro, Singularity",
    facts: ["Encrypted sync", "Team sharing (Singularity)", "Audit log (Singularity)", "Use NexQL Cloud or your own Postgres"],
    steps: [
      {
        title: "Run the sync setup walkthrough",
        body: "Activate your license, choose NexQL Cloud or a self-hosted Postgres backend, then run Sync Now.",
      },
      {
        title: "Pick up your connections on another machine",
        body: "Secrets stay encrypted. The server stores ciphertext only.",
      },
      {
        title: "Share notebooks and saved queries",
        body: "On Singularity, invite your team and import the shared workspace. Notebooks stay plain files in git.",
      },
      {
        title: "Review the production audit log",
        body: "On Singularity, sensitive actions are recorded for compliance review.",
      },
    ],
    figure: {
      mock: "connect",
      caption: "Connections synced across environments.",
    },
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

/** Features in sidebar order: grouped by GROUPS, original order inside a group. */
export const FEATURES_ORDERED: FeatureStory[] = GROUPS.flatMap((g) => FEATURES.filter((f) => f.group === g.id));

export const featureHref = (slug: string) => `/features/${slug}/`;

/** Split "Know which *database* you're on" into [before, emphasised, after]. */
export function titleParts(title: string): [string, string, string] {
  const m = title.match(/^(.*?)\*(.+?)\*(.*)$/);
  return m ? [m[1], m[2], m[3]] : [title, "", ""];
}

/** Plain-text title for <title> and meta tags. */
export const plainTitle = (title: string) => title.replace(/\*/g, "");
