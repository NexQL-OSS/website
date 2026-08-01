/**
 * Interactive feature hub + step-through stories for /features/*.
 */
(function initFeatureStory() {
  const HUB_HINTS = {
    all: "Eight workflows in one editor.",
    connect: "Know which DB you're on.",
    explore: "One tree for the schema.",
    query: "Notebooks + schema-aware AI.",
    analyze: "Plans, metrics, fixes.",
  };

  const PREVIEW_VISUAL = {
    notebooks: "notebook",
    explorer: "tree",
    assistant: "ai",
    sentinel: "safety",
    "schema-tools": "schema",
    "plan-studio": "explain",
    dashboard: "dashboard",
    sync: "connect",
  };

  function wireStory(root) {
    const steps = [...root.querySelectorAll("[data-feature-step]")];
    const panelTitle = root.querySelector("[data-feature-panel-title]");
    const panelLede = root.querySelector("[data-feature-panel-lede]");
    const snippet = root.querySelector("[data-feature-snippet]");
    const visual = root.querySelector("[data-feature-visual]");
    const progress = root.querySelector("[data-feature-progress]");
    const indexEl = root.querySelector("[data-feature-step-index]");
    const prevBtn = root.querySelector("[data-feature-prev]");
    const nextBtn = root.querySelector("[data-feature-next]");
    /** @type {ReturnType<typeof setInterval> | null} */
    let typeTimer = null;
    let active = 0;

    if (!steps.length) return;

    function syncMock(kind) {
      if (!visual) return;
      visual.querySelectorAll("[data-fv]").forEach((el) => {
        el.hidden = el.getAttribute("data-fv") !== kind;
      });
      const sqlLive = visual.querySelector("[data-fv-sql-live]");
      if (sqlLive && kind === "sql" && !snippet?.textContent) {
        sqlLive.textContent = "SELECT … FROM orders\nGROUP BY day;";
      }
    }

    function typeSnippet(full) {
      if (!snippet) return;
      if (typeTimer) clearInterval(typeTimer);
      if (!full) {
        snippet.textContent = "";
        snippet.hidden = true;
        return;
      }
      snippet.hidden = false;
      const reduceMotion =
        typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        snippet.textContent = full;
        return;
      }
      let i = 0;
      snippet.textContent = "";
      const step = Math.max(1, Math.round(full.length / 80));
      typeTimer = setInterval(() => {
        i += step;
        if (i >= full.length) {
          if (typeTimer) clearInterval(typeTimer);
          typeTimer = null;
          snippet.textContent = full;
          return;
        }
        snippet.textContent = full.slice(0, i);
      }, 18);
    }

    function show(idx) {
      active = Math.max(0, Math.min(steps.length - 1, idx));
      const step = steps[active];
      steps.forEach((s, i) => {
        s.setAttribute("aria-current", i === active ? "step" : "false");
        s.tabIndex = i === active ? 0 : -1;
      });
      if (panelTitle) panelTitle.textContent = step.dataset.stepTitle || "";
      if (panelLede) panelLede.textContent = step.dataset.stepBody || "";

      const sn = step.dataset.stepSnippet || "";
      const kind = step.dataset.stepVisual || "notebook";
      if (visual) {
        visual.setAttribute("data-visual", kind);
        visual.hidden = !!sn;
        syncMock(kind);
      }
      typeSnippet(sn);

      if (progress) {
        progress.style.width = `${((active + 1) / steps.length) * 100}%`;
      }
      if (indexEl) indexEl.textContent = String(active + 1);
      if (prevBtn) prevBtn.disabled = active === 0;
      if (nextBtn) nextBtn.disabled = active === steps.length - 1;
    }

    steps.forEach((step, i) => {
      step.addEventListener("click", () => show(i));
      step.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          show(active + 1);
          steps[Math.min(active, steps.length - 1)]?.focus();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          show(active - 1);
          steps[Math.max(active, 0)]?.focus();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show(i);
        }
      });
    });

    prevBtn?.addEventListener("click", () => show(active - 1));
    nextBtn?.addEventListener("click", () => show(active + 1));

    show(0);
  }

  function wireHub() {
    const hub = document.querySelector("[data-feature-hub]");
    if (!hub) return;

    const filters = hub.querySelectorAll("[data-hub-filter]");
    const cards = [...hub.querySelectorAll("[data-hub-card]")];
    const hint = hub.querySelector("[data-hub-hint]");
    const preview = hub.querySelector("[data-hub-preview]");
    let beat = "all";

    function fillPreview(card) {
      if (!preview || !card) return;
      const path = card.getAttribute("data-path") || "";
      const mark = card.getAttribute("data-mark") || "";
      const ink = card.getAttribute("data-ink") || "";
      const tint = card.getAttribute("data-tint") || "";
      const title = card.getAttribute("data-title") || "";
      const lede = card.getAttribute("data-lede") || "";
      const kicker = card.getAttribute("data-kicker") || "";
      const caps = (card.getAttribute("data-caps") || "").split("·").filter(Boolean);
      const slug = card.getAttribute("data-slug") || "";
      const visual = PREVIEW_VISUAL[slug] || "notebook";

      const set = (sel, text) => {
        const el = preview.querySelector(sel);
        if (el) el.textContent = text;
      };
      set("[data-preview-path]", path);
      set("[data-preview-title]", title);
      set("[data-preview-lede]", lede);
      set("[data-preview-kicker]", kicker);

      const markEl = preview.querySelector("[data-preview-mark]");
      if (markEl) {
        markEl.textContent = mark;
        markEl.style.background = tint;
        markEl.style.color = ink;
      }

      const capsEl = preview.querySelector("[data-preview-caps]");
      if (capsEl) {
        capsEl.innerHTML = caps.map((c) => `<span>${c}</span>`).join("");
      }

      const mock = preview.querySelector("[data-preview-mock]");
      if (mock) mock.setAttribute("data-visual", visual);

      const cta = preview.querySelector("[data-preview-cta]");
      if (cta) cta.setAttribute("href", `/features/${slug}/`);

      preview.style.setProperty("--hub-ink", ink);
      preview.style.setProperty("--hub-tint", tint);
    }

    function applyFilter(next) {
      beat = next;
      filters.forEach((btn) => {
        const on = btn.getAttribute("data-hub-filter") === beat;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (hint) hint.textContent = HUB_HINTS[beat] || HUB_HINTS.all;

      let firstVisible = null;
      cards.forEach((card) => {
        const match = beat === "all" || card.getAttribute("data-beat") === beat;
        card.hidden = !match;
        card.classList.toggle("is-filtered-out", !match);
        if (match && !firstVisible) firstVisible = card;
      });

      const active = cards.find((c) => c.classList.contains("is-active") && !c.hidden) || firstVisible;
      cards.forEach((c) => c.classList.toggle("is-active", c === active));
      if (active) fillPreview(active);
    }

    const filterList = [...filters];
    filterList.forEach((btn, i) => {
      btn.addEventListener("click", () => applyFilter(btn.getAttribute("data-hub-filter") || "all"));
      btn.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const next = filterList[(i + delta + filterList.length) % filterList.length];
        next?.focus();
        applyFilter(next?.getAttribute("data-hub-filter") || "all");
      });
    });

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        if (card.hidden) return;
        cards.forEach((c) => c.classList.toggle("is-active", c === card));
        fillPreview(card);
      });
      card.addEventListener("focus", () => {
        if (card.hidden) return;
        cards.forEach((c) => c.classList.toggle("is-active", c === card));
        fillPreview(card);
      });
    });

    applyFilter("all");
  }

  function wireTryDemo() {
    document.querySelectorAll("[data-feature-try-demo]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const file = btn.getAttribute("data-demo-file") || "query";
        const panel = btn.getAttribute("data-demo-panel") || "nexql";
        const shell = document.querySelector(".shell");
        if (
          shell &&
          typeof openFile === "function" &&
          typeof setEditorMinimizedState === "function"
        ) {
          setEditorMinimizedState(false);
          openFile(file);
          if (typeof switchSidebarPanel === "function") switchSidebarPanel(panel);
          return;
        }
        const home = btn.getAttribute("data-demo-home") || "/";
        const url = `${home}?demo=1&file=${encodeURIComponent(file)}&panel=${encodeURIComponent(panel)}`;
        window.location.href = url;
      });
    });
  }

  function boot() {
    document.querySelectorAll("[data-feature-story]").forEach(wireStory);
    wireHub();
    wireTryDemo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
