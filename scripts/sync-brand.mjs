// Re-copies the shared brand layer from the NexQL MCP site, when that repo is
// checked out next to this one. The vendored copy in src/styles/brand.css is
// committed, so a build never needs the sibling repo.
//
//   node scripts/sync-brand.mjs
import { copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../mcp/site/src/styles/theme.css");
const target = resolve(here, "../src/styles/brand.css");

if (!existsSync(source)) {
  console.log(`sync-brand: ${source} not found, keeping the vendored brand.css.`);
  process.exit(0);
}
copyFileSync(source, target);
console.log("sync-brand: copied mcp/site theme.css to src/styles/brand.css.");
