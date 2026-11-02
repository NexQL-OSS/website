// @ts-check
import { defineConfig } from "astro/config";

// Static marketing site. The backend lives in a separate Vercel project;
// vercel.json rewrites /api/* there, so no adapter/SSR is needed here.
// No client framework: small inline scripts, plus the legacy workbench demo on /demo/.
export default defineConfig({
  site: "https://nexql.astrx.dev",
  build: {
    // Emit predictable asset paths; keeps parity with the current /assets, /js layout.
    assets: "_astro",
  },
});
