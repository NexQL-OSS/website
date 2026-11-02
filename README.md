# NexQL Site

Marketing site for [NexQL](https://nexql.astrx.dev), the PostgreSQL extension for VS Code.

Astro, static output, no client framework. The look comes from the NexQL MCP site
(`src/styles/brand.css` is a vendored copy of `mcp/site/src/styles/theme.css`).

## Run locally

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
```

Pricing and checkout call `/api/*`, which only resolves on a deployed URL (see
below). Locally those requests 404 and the pricing section shows the defaults
baked into the page.

## Layout

| Path | What |
|---|---|
| `src/pages/index.astro` | Home: hero, story (Connect → Guard), playground, then MCP, platforms, compare, pricing, changelog, FAQ, install |
| `src/components/landing/` | Home page sections; `Story.astro` and `Sections.astro` list the ids other parts link to |
| `src/components/story/`, `src/components/sections/` | Pieces of the story and the lower sections |
| `src/components/ui/` | Shared primitives: `Code`, `StopHead`, `SectionHead`, `NextStop` |
| `src/pages/demo.astro` | The interactive workbench demo, embedded on the home page in an iframe so its legacy CSS and scripts stay isolated |
| `src/pages/features/` | Feature hub and one page per feature (`src/data/feature-stories.ts`) on `DocsLayout` |
| `src/pages/privacy.astro`, `terms.astro` | Legal pages |
| `src/data/site.ts` | Version, URLs and facts used across pages |
| `src/data/landing-content.ts`, `story.ts` | Home page copy and data |
| `public/js/` | Legacy scripts: the workbench demo, the scripted SQL playground, `pricing.js`, `checkout.js` |
| `public/styles/` | Legacy CSS used only by `/demo/` and `device-auth.html` |
| `public/device-auth.html` | Device authorization flow for the extension |
| `public/assets/` | Screenshots, demo GIFs and platform logos |

## Brand layer

Don't edit `src/styles/brand.css`. When the MCP site's theme changes, refresh it:

```bash
node scripts/sync-brand.mjs
```

Site-specific styles go in scoped `<style>` blocks. New sections use the brand
tokens and global classes (`.btn`, `.btn-primary`, `.pill`, `.mono-label`,
`.serif-em`, `.code`) and never the legacy CSS in `public/styles/`.

## Deployment

Deployed to Vercel on `nexql.astrx.dev`, connected to this repo. **Pushes to
`main` deploy automatically** and pull requests get preview URLs.

The backend lives in a separate private repo and is deployed as its own Vercel
project on `api.nexql.astrx.dev`. `vercel.json` rewrites `/api/:path*` there, so
browser requests stay same-origin and no CORS is involved. Frontend code always
calls relative `/api/...` paths; never hardcode the backend host.
