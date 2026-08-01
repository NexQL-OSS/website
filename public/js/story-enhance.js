/**
 * Progressive enhancement for Direction C story sections.
 * Keeps interactions out of Preact islands so they don't fight the legacy
 * DemoBoot script chain (islands were truncating sibling SSR in the browser).
 */
(function initStoryEnhance() {
  const STEPS = ["connect", "explore", "query", "analyze"];

  function wireSpine() {
    const steps = document.querySelectorAll("[data-spine-id]");
    const beats = STEPS.map((id) => document.getElementById(`beat-${id}`)).filter(Boolean);
    if (!steps.length || !beats.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setActive = (id) => {
      document.body.dataset.storyBeat = id;
      steps.forEach((el) => {
        const on = el.getAttribute("data-spine-id") === id;
        el.dataset.active = on ? "true" : "false";
        if (on) el.setAttribute("aria-current", "step");
        else el.removeAttribute("aria-current");
      });
    };

    setActive("connect");
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        setActive(visible.target.id.replace(/^beat-/, ""));
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    beats.forEach((b) => io.observe(b));
  }

  function wireWorkspaceMap() {
    const root = document.querySelector("[data-ws-map]");
    if (!root) return;
    const tablist = root.querySelector('[role="tablist"]');
    const tabs = [...root.querySelectorAll("[data-ws-id]")];
    const panels = root.querySelectorAll("[data-ws-panel]");
    if (!tabs.length) return;

    const syncOrientation = () => {
      if (!tablist) return;
      tablist.setAttribute(
        "aria-orientation",
        window.matchMedia("(max-width: 900px)").matches ? "horizontal" : "vertical",
      );
    };
    syncOrientation();
    window.addEventListener("resize", syncOrientation, { passive: true });

    const show = (id, { focusTab = false } = {}) => {
      tabs.forEach((t) => {
        const on = t.getAttribute("data-ws-id") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focusTab) t.focus();
      });
      panels.forEach((p) => {
        p.hidden = p.getAttribute("data-ws-panel") !== id;
      });
    };

    // Initial roving tabindex
    show(tabs[0].getAttribute("data-ws-id") || "notebooks");

    tabs.forEach((t) => {
      const id = t.getAttribute("data-ws-id");
      t.addEventListener("click", () => show(id));
      // Hover only on fine pointers — touch shouldn't steal focus mid-scroll
      t.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") show(id);
      });
      t.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(t);
        let next = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        if (next < 0) return;
        e.preventDefault();
        show(tabs[next].getAttribute("data-ws-id"), { focusTab: true });
      });
    });
  }

  const AI_PROMPTS = [
    {
      plain: "Top 10 customers by revenue last 30 days, exclude cancelled orders",
      sql: `<span class="sql-kw">SELECT</span> c.name, <span class="sql-fn">SUM</span>(o.amount) <span class="sql-kw">AS</span> revenue
<span class="sql-kw">FROM</span> customers c <span class="sql-kw">JOIN</span> orders o <span class="sql-kw">ON</span> c.id = o.customer_id
<span class="sql-kw">WHERE</span> o.created_at >= <span class="sql-fn">NOW</span>() - <span class="sql-kw">INTERVAL</span> <span class="sql-str">'30 days'</span>
  <span class="sql-kw">AND</span> o.status &lt;&gt; <span class="sql-str">'cancelled'</span>
<span class="sql-kw">GROUP BY</span> c.id, c.name <span class="sql-kw">ORDER BY</span> revenue <span class="sql-kw">DESC</span> <span class="sql-kw">LIMIT</span> <span class="sql-num">10</span>;`,
      payoff: false,
    },
    {
      plain: "Why is this daily revenue query slow?",
      sql: `<span class="sql-kw">CREATE INDEX CONCURRENTLY</span> idx_orders_created_at
  <span class="sql-kw">ON</span> orders (created_at <span class="sql-kw">DESC</span>);

<span class="sql-kw">--</span> Expected: ~3s sequential scan → under 100ms index scan`,
      payoff: true,
    },
    {
      plain: "Orders by status for the last 24 hours",
      sql: `<span class="sql-kw">SELECT</span> status, <span class="sql-fn">COUNT</span>(*) <span class="sql-kw">AS</span> n
<span class="sql-kw">FROM</span> orders
<span class="sql-kw">WHERE</span> created_at >= <span class="sql-fn">NOW</span>() - <span class="sql-kw">INTERVAL</span> <span class="sql-str">'24 hours'</span>
<span class="sql-kw">GROUP BY</span> status <span class="sql-kw">ORDER BY</span> n <span class="sql-kw">DESC</span>;`,
      payoff: false,
    },
  ];

  function wireAiDemo() {
    const root = document.querySelector("[data-ai-demo]");
    if (!root) return;
    const plainEl = root.querySelector("[data-ai-plain]");
    const sqlEl = root.querySelector("[data-ai-sql]");
    const payoffEl = root.querySelector("[data-ai-payoff]");
    const chips = root.querySelectorAll("[data-ai-prompt]");
    let timer = null;
    let sqlTimer = null;

    const render = (idx) => {
      const p = AI_PROMPTS[idx];
      chips.forEach((c) =>
        c.setAttribute("aria-pressed", c.getAttribute("data-ai-prompt") === String(idx) ? "true" : "false"),
      );
      window.clearInterval(timer);
      window.clearTimeout(sqlTimer);
      payoffEl.hidden = true;
      sqlEl.textContent = "Generating…";

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        plainEl.textContent = `“${p.plain}”`;
        sqlEl.innerHTML = p.sql;
        payoffEl.hidden = !p.payoff;
        return;
      }

      let i = 0;
      plainEl.innerHTML = "“<span class=\"ai-cursor\" aria-hidden=\"true\"></span>”";
      const textNode = document.createTextNode("");
      plainEl.insertBefore(textNode, plainEl.querySelector(".ai-cursor"));
      timer = window.setInterval(() => {
        i += 1;
        textNode.textContent = p.plain.slice(0, i);
        if (i >= p.plain.length) {
          window.clearInterval(timer);
          plainEl.querySelector(".ai-cursor")?.remove();
        }
      }, 18);

      sqlTimer = window.setTimeout(
        () => {
          sqlEl.innerHTML = p.sql;
          payoffEl.hidden = !p.payoff;
        },
        Math.min(900, 200 + p.plain.length * 18),
      );
    };

    chips.forEach((c) =>
      c.addEventListener("click", () => render(Number(c.getAttribute("data-ai-prompt")))),
    );
    render(0);
  }

  function wireCompare() {
    const root = document.querySelector("[data-compare]");
    if (!root) return;
    const buttons = root.querySelectorAll("[data-compare-mode]");
    const stages = root.querySelectorAll("[data-compare-stage]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-compare-mode");
        buttons.forEach((b) =>
          b.setAttribute("aria-pressed", b === btn ? "true" : "false"),
        );
        stages.forEach((s) => {
          s.hidden = s.getAttribute("data-compare-stage") !== mode;
        });
      });
    });
  }

  function boot() {
    wireSpine();
    wireWorkspaceMap();
    wireAiDemo();
    wireCompare();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
