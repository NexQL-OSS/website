import { useState } from "preact/hooks";

interface CapNode {
  id: string;
  path: string;
  label: string;
  title: string;
  body: string;
  caps: string[];
}

const NODES: CapNode[] = [
  {
    id: "notebooks",
    path: "workspace / notebooks",
    label: "query.pgsql",
    title: "SQL notebooks in the editor",
    body: "Write cells, run one or all, see sortable results inline. Export CSV, JSON, or Excel — notebooks commit to git like source.",
    caps: ["Write & run", "Inline results", "Export", "Auto history"],
  },
  {
    id: "explorer",
    path: "workspace / explorer",
    label: "demo_db · public",
    title: "Database explorer",
    body: "Sixteen-plus object types — tables, views, functions, triggers, partitions, FDWs. Column insights and right-click SQL with real names.",
    caps: ["16+ objects", "Column insights", "Quick search", "Generated SQL"],
  },
  {
    id: "assistant",
    path: "workspace / sql assistant",
    label: "Ask with schema context",
    title: "Schema-aware AI",
    body: "NexQL Free AI works with zero config. Text → SQL, Explain, Optimize, Debug — using your real tables and columns.",
    caps: ["Free AI default", "BYO providers", "Parallel chats", "Optimize"],
  },
  {
    id: "sentinel",
    path: "workspace / sentinel",
    label: "DEV / STAGE / PROD",
    title: "Sentinel safety",
    body: "Environment labels stay visible before you run. Risk scoring flags DELETE without WHERE, TRUNCATE, and DROP.",
    caps: ["Env labels", "Risk scoring", "Ambient context", "Read-only mode"],
  },
  {
    id: "visual",
    path: "workspace / visual tools",
    label: "schema.diff · erd",
    title: "Visual schema tools",
    body: "Table designer with SQL preview, schema diff with migration scripts, auto ERD, and a guided import wizard.",
    caps: ["Table designer", "Schema diff", "ERD", "Import wizard"],
  },
  {
    id: "perf",
    path: "workspace / performance",
    label: "EXPLAIN · dashboard",
    title: "Performance & ops",
    body: "Live dashboard for connections and locks, EXPLAIN breakdowns with concrete guidance — still inside VS Code.",
    caps: ["Live dashboard", "EXPLAIN", "Profiling", "FDWs"],
  },
];

/** Interactive workspace map — replaces emoji capability tile grids. */
export default function WorkspaceMap() {
  const [sel, setSel] = useState(NODES[0].id);
  const active = NODES.find((n) => n.id === sel) ?? NODES[0];

  return (
    <div class="ws-map" role="group" aria-label="NexQL capability map">
      <div class="ws-map-tree" role="tablist" aria-orientation="vertical">
        <div class="ws-map-tree-hdr">NexQL</div>
        {NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            role="tab"
            class="ws-map-node"
            id={`ws-tab-${n.id}`}
            aria-selected={n.id === sel}
            aria-controls={`ws-panel-${n.id}`}
            onClick={() => setSel(n.id)}
            onMouseEnter={() => setSel(n.id)}
            onFocus={() => setSel(n.id)}
          >
            <span class="ws-map-node-path">{n.path}</span>
            {n.label}
          </button>
        ))}
      </div>
      <div
        class="ws-map-detail"
        role="tabpanel"
        id={`ws-panel-${active.id}`}
        aria-labelledby={`ws-tab-${active.id}`}
      >
        <h3>{active.title}</h3>
        <p>{active.body}</p>
        <div class="ws-map-caps">
          {active.caps.map((c) => (
            <span key={c} class="ws-map-cap">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
