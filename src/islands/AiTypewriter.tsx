import { useEffect, useState } from "preact/hooks";

interface Prompt {
  id: string;
  plain: string;
  sqlHtml: string;
}

const PROMPTS: Prompt[] = [
  {
    id: "top",
    plain: "Top 10 customers by revenue last 30 days, exclude cancelled orders",
    sqlHtml: `<span class="sql-kw">SELECT</span> c.name, <span class="sql-fn">SUM</span>(o.amount) <span class="sql-kw">AS</span> revenue
<span class="sql-kw">FROM</span> customers c <span class="sql-kw">JOIN</span> orders o <span class="sql-kw">ON</span> c.id = o.customer_id
<span class="sql-kw">WHERE</span> o.created_at >= <span class="sql-fn">NOW</span>() - <span class="sql-kw">INTERVAL</span> <span class="sql-str">'30 days'</span>
  <span class="sql-kw">AND</span> o.status &lt;&gt; <span class="sql-str">'cancelled'</span>
<span class="sql-kw">GROUP BY</span> c.id, c.name <span class="sql-kw">ORDER BY</span> revenue <span class="sql-kw">DESC</span> <span class="sql-kw">LIMIT</span> <span class="sql-num">10</span>;`,
  },
  {
    id: "slow",
    plain: "Why is this daily revenue query slow?",
    sqlHtml: `<span class="sql-kw">CREATE INDEX CONCURRENTLY</span> idx_orders_created_at
  <span class="sql-kw">ON</span> orders (created_at <span class="sql-kw">DESC</span>);

<span class="sql-kw">--</span> Expected: ~3s sequential scan → under 100ms index scan`,
  },
  {
    id: "health",
    plain: "Orders by status for the last 24 hours",
    sqlHtml: `<span class="sql-kw">SELECT</span> status, <span class="sql-fn">COUNT</span>(*) <span class="sql-kw">AS</span> n
<span class="sql-kw">FROM</span> orders
<span class="sql-kw">WHERE</span> created_at >= <span class="sql-fn">NOW</span>() - <span class="sql-kw">INTERVAL</span> <span class="sql-str">'24 hours'</span>
<span class="sql-kw">GROUP BY</span> status <span class="sql-kw">ORDER BY</span> n <span class="sql-kw">DESC</span>;`,
  },
];

function useTypewriter(text: string, enabled: boolean) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!enabled) {
      setOut(text);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [text, enabled]);
  return out;
}

/** Live plain-English → SQL demo with optimize payoff. */
export default function AiTypewriter() {
  const [idx, setIdx] = useState(0);
  const [showSql, setShowSql] = useState(false);
  const prompt = PROMPTS[idx];
  const typed = useTypewriter(prompt.plain, true);

  useEffect(() => {
    setShowSql(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 80 : Math.min(900, 200 + prompt.plain.length * 18);
    const t = window.setTimeout(() => setShowSql(true), delay);
    return () => window.clearTimeout(t);
  }, [idx, prompt.plain.length]);

  return (
    <div>
      <div class="ai-chips" role="tablist" aria-label="Example prompts">
        {PROMPTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            class="ai-chip"
            role="tab"
            aria-pressed={i === idx}
            onClick={() => setIdx(i)}
          >
            {p.id === "top" ? "Revenue query" : p.id === "slow" ? "Optimize" : "Status rollup"}
          </button>
        ))}
      </div>

      <div class="ai-demo">
        <div class="ai-panel">
          <div class="ai-panel-label">Plain English</div>
          <div class="ai-prompt" aria-live="polite">
            &ldquo;{typed}
            {typed.length < prompt.plain.length ? <span class="ai-cursor" aria-hidden="true" /> : null}
            &rdquo;
          </div>
          <div class="ai-chips" style={{ marginTop: "0.85rem", marginBottom: 0 }}>
            <span class="ai-chip" style={{ cursor: "default" }}>
              schema: orders
            </span>
            <span class="ai-chip" style={{ cursor: "default" }}>
              schema: customers
            </span>
          </div>
        </div>
        <div class="ai-panel">
          <div class="ai-panel-label">Schema-aware SQL</div>
          {showSql ? (
            <pre class="ai-sql" dangerouslySetInnerHTML={{ __html: prompt.sqlHtml }} />
          ) : (
            <pre class="ai-sql" aria-busy="true">
              Generating…
            </pre>
          )}
          {prompt.id === "slow" && showSql ? (
            <div class="ai-payoff" aria-live="polite">
              <span class="ai-payoff-from">~3s</span>
              <span class="ai-payoff-to">
                → under <strong>100ms</strong>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
