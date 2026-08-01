/**
 * Interactive SQL playground (design mock → live typewriter + table/chart tabs).
 * Data injected via #nx-playground-data JSON from LandingStory.astro.
 */
(function initNxPlayground() {
  const root = document.querySelector("[data-nx-playground]");
  const dataEl = document.getElementById("nx-playground-data");
  if (!root || !dataEl) return;

  /** @type {Array<{title:string,ask:string,reply:string,sql:string,meta:string,cols:string[],rows:string[][],bars:{l:string,v:string,h:string}[]}>} */
  let queries = [];
  try {
    queries = JSON.parse(dataEl.textContent || "[]");
  } catch (err) {
    console.error("[nx-playground] bad data", err);
    return;
  }
  if (!queries.length) return;

  let active = 0;
  let tab = "table";
  /** @type {ReturnType<typeof setInterval> | null} */
  let timer = null;

  const askEl = root.querySelector("[data-nx-ask]");
  const replyEl = root.querySelector("[data-nx-reply]");
  const sqlEl = root.querySelector("[data-nx-sql]");
  const runStateEl = root.querySelector("[data-nx-run-state]");
  const metaEl = root.querySelector("[data-nx-meta]");
  const colsEl = root.querySelector("[data-nx-cols]");
  const rowsEl = root.querySelector("[data-nx-rows]");
  const barsEl = root.querySelector("[data-nx-bars]");
  const tablePane = root.querySelector('[data-nx-result="table"]');
  const chartPane = root.querySelector('[data-nx-result="chart"]');

  function typeSql(full) {
    if (timer) clearInterval(timer);
    let i = 0;
    if (sqlEl) sqlEl.textContent = "";
    if (runStateEl) runStateEl.textContent = "writing…";
    const step = Math.max(1, Math.round(full.length / 110));
    timer = setInterval(() => {
      i += step;
      if (i >= full.length) {
        if (timer) clearInterval(timer);
        timer = null;
        if (sqlEl) sqlEl.textContent = full;
        if (runStateEl) runStateEl.textContent = "ready — press ▶ to run";
        return;
      }
      if (sqlEl) sqlEl.textContent = full.slice(0, i);
    }, 26);
  }

  function renderResults(q) {
    if (metaEl) metaEl.textContent = q.meta;
    if (colsEl) {
      colsEl.innerHTML = q.cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
    }
    if (rowsEl) {
      rowsEl.innerHTML = q.rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
        )
        .join("");
    }
    if (barsEl) {
      barsEl.innerHTML = q.bars
        .map(
          (b) => `<div class="nx-chart-col">
            <span class="nx-chart-v">${escapeHtml(b.v)}</span>
            <div class="nx-chart-bar" style="height:${escapeHtml(b.h)}"></div>
            <span class="nx-chart-l">${escapeHtml(b.l)}</span>
          </div>`,
        )
        .join("");
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function selectQuery(index) {
    active = index;
    const q = queries[active];
    root.querySelectorAll("[data-nx-prompt]").forEach((btn) => {
      const on = Number(btn.getAttribute("data-nx-prompt")) === active;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (askEl) askEl.textContent = q.ask;
    if (replyEl) replyEl.textContent = q.reply;
    renderResults(q);
    typeSql(q.sql);
  }

  function setTab(next) {
    tab = next;
    root.querySelectorAll("[data-nx-tab]").forEach((btn) => {
      const on = btn.getAttribute("data-nx-tab") === tab;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (tablePane) tablePane.hidden = tab !== "table";
    if (chartPane) chartPane.hidden = tab !== "chart";
  }

  root.addEventListener("click", (ev) => {
    const t = /** @type {HTMLElement} */ (ev.target);
    const prompt = t.closest("[data-nx-prompt]");
    if (prompt) {
      selectQuery(Number(prompt.getAttribute("data-nx-prompt")));
      return;
    }
    const tabBtn = t.closest("[data-nx-tab]");
    if (tabBtn) setTab(tabBtn.getAttribute("data-nx-tab") || "table");
  });

  selectQuery(0);
})();

(function initNxChrome() {
  document.addEventListener("click", (ev) => {
    const t = /** @type {HTMLElement} */ (ev.target);

    const copyBtn = t.closest("[data-nx-copy-cmd]");
    if (copyBtn) {
      const cmd = copyBtn.getAttribute("data-cmd") || "ext install ric-v.postgres-explorer";
      const label = copyBtn.querySelector("[data-nx-copy-label]");
      const done = () => {
        if (label) label.textContent = "copied";
        setTimeout(() => {
          if (label) label.textContent = "⧉";
        }, 1800);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(cmd).then(done).catch(done);
      } else {
        done();
      }
      return;
    }

    if (t.closest("#nx-open-demo-from-playground")) {
      const openBtn = document.getElementById("open-editor-shortcut");
      if (openBtn) openBtn.click();
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );
    document.querySelectorAll("[data-nx-reveal]").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll("[data-nx-reveal]").forEach((el) => el.classList.add("is-visible"));
  }

  // Light tilt / magnetic (respect reduced motion)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-nx-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (ev) => {
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5;
        const py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1100px) rotateY(${(px * 6).toFixed(2)}deg) rotateX(${(-py * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
    document.querySelectorAll("[data-nx-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (ev) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((ev.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px,${((ev.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }
})();
