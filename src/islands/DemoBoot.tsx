/**
 * Phase 2 boot island — wraps the existing imperative demo JS without
 * rewriting it. Loads scripts in the legacy order after hydrate, then
 * theme-loader (module) last-before-bootstrap so window.NexqlThemes.ready
 * exists when bootstrap awaits it.
 *
 * The demo DOM itself is SSR'd by DemoShell.astro (static HTML).
 */
import { useEffect, useRef } from "preact/hooks";

const CLASSIC_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js",
  "/js/core-state.js",
  "/js/workbench.js",
  "/js/assistant.js",
  "/js/tour.js",
  "/js/visuals.js",
  "/js/landing-capabilities.js",
  "https://checkout.razorpay.com/v1/checkout.js",
  "/js/pricing.js",
  "/js/checkout.js",
  "/js/story-enhance.js",
  "/js/feature-story.js",
  "/js/playground.js",
] as const;

const THEME_LOADER = "/js/theme-loader.mjs";
const BOOTSTRAP = "/js/bootstrap.js";

const BOOT_FLAG = "nexqlDemoBooted";

function loadClassicScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

function loadModuleScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[type="module"][src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.type = "module";
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

export default function DemoBoot() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if ((window as unknown as Record<string, boolean>)[BOOT_FLAG]) return;
    started.current = true;
    (window as unknown as Record<string, boolean>)[BOOT_FLAG] = true;

    let cancelled = false;

    (async () => {
      try {
        // Sequential classic scripts — order matches legacy index.html.
        // partials.js omitted: DemoShell inlines the three HTML partials.
        for (const src of CLASSIC_SCRIPTS) {
          if (cancelled) return;
          await loadClassicScript(src);
        }
        if (cancelled) return;
        await loadModuleScript(THEME_LOADER);
        if (cancelled) return;
        // bootstrap listens for DOMContentLoaded OR runs immediately when
        // document.readyState !== "loading" (patched in bootstrap.js).
        await loadClassicScript(BOOTSTRAP);
      } catch (err) {
        console.error("[DemoBoot] failed to load demo scripts", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Invisible mount — DOM shell is owned by Astro SSR (DemoShell).
  return <span aria-hidden="true" data-nexql-demo-boot style={{ display: "none" }} />;
}
