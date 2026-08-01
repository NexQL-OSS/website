// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Static marketing site. The backend lives in a separate Vercel project;
// vercel.json rewrites /api/* there, so no adapter/SSR is needed here.
// Interactive pieces ship as Preact islands (Phase 2+), not a full SPA.
export default defineConfig({
  site: "https://nexql.astrx.dev",
  integrations: [preact()],
  build: {
    // Emit predictable asset paths; keeps parity with the current /assets, /js layout.
    assets: "_astro",
  },
});
