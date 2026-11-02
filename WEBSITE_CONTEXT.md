# Website Context

Last updated: 2026-11-02
Hosting: Vercel (`nexql.astrx.dev`); backend on `api.nexql.astrx.dev` via the `/api/*` rewrite
Design reference: the NexQL MCP site (`mcp/site`, nexql-mcp.astrx.dev). Sibling sites share its brand layer: nexql-themes.astrx.dev and this one.

## What this website is

The product site for NexQL: a guided story of the extension, an interactive workbench demo, and Razorpay checkout for the paid tiers.

- Show value by simulation and concrete facts, not brochure copy.
- Keep the install CTA one click away (header button, hero, final section).
- One fixed brand palette (Mute Dark / lilac light) with a System / Dark / Light switch, stored in `localStorage` key `nexql-theme` and applied before paint.
- Theme switching across the 39 NexQL themes happens **only inside the workbench demo**. The page links to nexql-themes.astrx.dev for the full gallery.

## Home page structure

Header nav: **Tour · Playground · Features · MCP · Pricing · Themes ↗ · GitHub · Install — free**

1. **Hero** (`landing/Hero.astro`): release pill → `#changelog`, headline, install command, and a "What you get" ticket listing the story stops.
2. **Story** (`landing/Story.astro`): sticky rail, five stops `#connect #explore #ask #watch #guard` driven by `STOPS` in `src/data/site.ts`. The Ask stop holds the scripted SQL playground (`#ask-demo`, wired by `public/js/playground.js`).
3. **Playground** (`landing/Playground.astro`, `#playground`): the workbench demo in an iframe pointing at `/demo/`. It loads on click, when scrolled near (skipped on Save-Data), or from a `?demo=1&file=&panel=` deep link. Any element with `data-landing-open-demo` opens it.
4. **Sections** (`landing/Sections.astro`): `#mcp` (links to the MCP site rather than listing tools), `#platforms`, `#compare` (table on wide screens, cards on phones), `#pricing`, `#changelog`, `#faq`, `#install`.
5. **Footer** (`SiteFooter.astro`): product, resources, community, plus cross-links to NexQL MCP and NexQL Themes.

Other pages: `/features` and `/features/<slug>` on `DocsLayout`, `/privacy` and `/terms` on `LegalLayout`, `/demo/` (noindex), `device-auth.html` (extension device authorization).

**Platform compatibility:** NexQL works with any PostgreSQL-wire database. The canonical matrix lives in `docs/COMPATIBILITY.md` in the extension repo (linked from the footer).

## The workbench demo (`/demo/`)

A separate page so its legacy CSS (`public/styles/demo.css` → base-theme, workbench-layout, content-panels, interactive) and scripts can't affect the site. Script order on that page: `core-state.js` → `workbench.js` → `demo-embed.js` → `assistant.js` → `tour.js` → `visuals.js` → `landing-capabilities.js` → `feature-story.js` → `theme-loader.mjs` (module) → `bootstrap.js`. `theme-loader.mjs` fetches theme JSON from `https://nexql-themes.astrx.dev/themes/` and repaints the iframe's `:root` only. `demo-embed.js` posts close events to the parent page.

## Pricing tiers

| Tier | Key | Audience | Payment |
|------|-----|----------|---------|
| Free | — | Everyone | $0, Marketplace |
| Sponsor | `sponsor` | Individual pro | Razorpay subscription |
| Singularity | `singularity` | Teams / org | Razorpay subscription, flat org license |

`landing/PageScripts.astro` loads `playground.js`, Razorpay, `pricing.js` and `checkout.js` after the page is idle. The pricing markup in `sections/Pricing.astro` must keep the hooks those scripts bind to (listed in the `Sections.astro` header comment). Full Razorpay setup: `RAZORPAY.md`.

## Maintenance rules

- Don't edit `src/styles/brand.css`; refresh it with `node scripts/sync-brand.mjs` from a checkout that has `../mcp`.
- New UI uses brand tokens and scoped styles, never `public/styles/*`.
- Version, URLs and facts live in `src/data/site.ts`. Update `VERSION` and the hero pill copy on each release.
- Don't commit theme JSON here; themes live in the vsc-themes repo.
- Test at 375px and desktop width, in dark and light.
