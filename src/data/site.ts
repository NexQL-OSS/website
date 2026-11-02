/**
 * Single source for site-wide constants. Import from here instead of
 * hard-coding URLs or the version in components.
 */
export const SITE_URL = "https://nexql.astrx.dev";
export const VERSION = "2.4.0";

export const MARKETPLACE_URL = "https://marketplace.visualstudio.com/items?itemName=ric-v.postgres-explorer";
export const OPENVSX_URL = "https://open-vsx.org/extension/ric-v/postgres-explorer";
export const REPO_URL = "https://github.com/dev-asterix/NexQL";
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
export const MCP_URL = "https://nexql-mcp.astrx.dev/";
export const THEMES_URL = "https://nexql-themes.astrx.dev/";

export const INSTALL_CMD = "ext install ric-v.postgres-explorer";

/** Facts repeated across sections. */
export const FACTS = {
  pgVersions: "12–17",
  license: "MIT core",
} as const;

/** The story stops, in order. Hero ticket, Story rail and StopHead numbers all read this. */
export const STOPS = [
  { id: "connect", label: "Connect", minutes: "1 min" },
  { id: "explore", label: "Explore", minutes: "1 min" },
  { id: "ask", label: "Ask", minutes: "2 min" },
  { id: "watch", label: "Watch", minutes: "1 min" },
  { id: "guard", label: "Guard", minutes: "1 min" },
] as const;
