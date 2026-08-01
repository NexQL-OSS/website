/**
 * Step-through UI for /features/* pages and in-demo bridge panels.
 */
(function initFeatureStory() {
  function wireStory(root) {
    const steps = root.querySelectorAll("[data-feature-step]");
    const panelTitle = root.querySelector("[data-feature-panel-title]");
    const panelLede = root.querySelector("[data-feature-panel-lede]");
    const snippet = root.querySelector("[data-feature-snippet]");
    const visual = root.querySelector("[data-feature-visual]");

    if (!steps.length) return;

    const show = (idx) => {
      const step = steps[idx];
      if (!step) return;
      steps.forEach((s, i) => {
        s.setAttribute("aria-current", i === idx ? "step" : "false");
      });
      if (panelTitle) panelTitle.textContent = step.dataset.stepTitle || "";
      if (panelLede) panelLede.textContent = step.dataset.stepBody || "";
      if (snippet) {
        const sn = step.dataset.stepSnippet || "";
        snippet.textContent = sn;
        snippet.hidden = !sn;
      }
      if (visual) {
        visual.setAttribute("data-visual", step.dataset.stepVisual || "");
        visual.hidden = !!step.dataset.stepSnippet;
      }
    };

    steps.forEach((step, i) => {
      step.addEventListener("click", () => show(i));
      step.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show(i);
        }
      });
    });

    show(0);
  }

  function wireTryDemo() {
    document.querySelectorAll("[data-feature-try-demo]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const file = btn.getAttribute("data-demo-file") || "query";
        const panel = btn.getAttribute("data-demo-panel") || "nexql";
        const shell = document.querySelector(".shell");
        if (shell && typeof openFile === "function" && typeof setEditorMinimizedState === "function") {
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
    wireTryDemo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
