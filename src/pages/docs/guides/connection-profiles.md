---
layout: ../../../layouts/GuideLayout.astro
title: Use connection profiles
summary: Switch a notebook between safety presets such as read-only with a row limit, and share your profiles as a JSON file.
area: profiles
order: 4
---

A connection profile is a named preset of safety settings that you apply to one notebook at a time. Use one when the same connection serves two jobs, for example read-only analysis most days and occasional admin work, and you want a quick switch instead of editing the connection. You end up with a profile shown in the status bar of the notebook, with its limits applied on the next run.

A profile changes behaviour, not where you connect. Switching leaves the notebook's connection as it was.

## Before you start

- A `.pgsql` notebook that is open, focused and attached to a connection. Switching needs one.
- Nothing to create first. On first start NexQL adds four profiles: **Read-Only Analyst**, **DB Admin**, **Staging Dev** and **Production Read-Only**.

| Profile | Read-only | Row limit | Safety checks |
| --- | --- | --- | --- |
| Read-Only Analyst | yes | 1000 | on |
| DB Admin | no | none | on |
| Staging Dev | no | 500 | on |
| Production Read-Only | yes | 100 | on |

## Switch profile

1. Focus the notebook.
2. Run [**Switch Connection Profile**](/docs/reference/commands#postgres-explorer.switchConnectionProfile) from the Command Palette, or click the profile item in the status bar once one is active.
3. Pick a profile. A message confirms "Switched to profile" and lists the active settings: read-only (writes blocked), the auto-limit and whether safety checks are on.

The status bar then shows `Profile: <name>`, with `RO` and `Limit: N` when they apply. The choice is remembered per notebook.

What a profile does at run time:

- **Read-only** is added to the connection's own setting. A profile can make a notebook read-only, but cannot switch off read-only that the connection already has. Blocked writes fail with "Write operations are not allowed in read-only mode".
- **Row limit** is added to `SELECT` queries without a `LIMIT`. A limit of `0` means the profile sets none, and your settings apply (see below).
- **Safety checks** control the confirmation dialog for destructive statements; see [Set up production guardrails](/docs/guides/production-safety).

## Create a profile

1. Run [**Create Connection Profile**](/docs/reference/commands#postgres-explorer.createConnectionProfile).
2. Answer the prompts: a name, an optional description, a host (default `localhost`), a port (default `5432`), then **Force read-only mode for this profile?** with Yes or No.
3. NexQL shows "Profile created".

Yes gives you read-only, a 1000 row limit and safety checks. No gives you no read-only, no limit, and safety checks. The prompts have no row-limit step, and no command edits a profile afterwards. To change one, delete and recreate it, or edit its JSON using the export below.

The host and port are saved with the profile, but switching does not use them.

## Share profiles

Export with [**Export Connection Profiles…**](/docs/reference/commands#postgres-explorer.exportConnectionProfiles) and choose where to save `nexql-profiles-<date>.json`. Passwords are stripped. Import with [**Import Connection Profiles…**](/docs/reference/commands#postgres-explorer.importConnectionProfiles). A profile with an `id` already present is overwritten, and entries missing `id` or `profileName` are skipped. NexQL also registers its profile store with VS Code Settings Sync.

Remove one with [**Delete Connection Profile**](/docs/reference/commands#postgres-explorer.deleteConnectionProfile); you are asked `Delete profile "<name>"?`.

## Settings that apply with a profile

When a profile sets no limit, these decide the default limit:

```json
{
  "postgresExplorer.query.autoLimitEnabled": true,
  "postgresExplorer.performance.defaultLimit": 1000
}
```

The first turns automatic `LIMIT` on for queries without one (always on for read-only connections); the second sets the row count. See [`postgresExplorer.query.autoLimitEnabled`](/docs/reference/settings#postgresExplorer.query.autoLimitEnabled) and [`postgresExplorer.performance.defaultLimit`](/docs/reference/settings#postgresExplorer.performance.defaultLimit).

## If something goes wrong

- **"No active notebook. Open a .pgsql notebook first."** Focus a notebook before switching.
- **"Notebook has no connection configured."** Attach the notebook to a connection first.
- **"No connection profiles available. Create one first."** Every profile was deleted. Create one, or import a file.
- **"No profiles to export." / "No profiles to delete."** Nothing is stored.
- **"Invalid profile file — expected a JSON array."** The imported file must be a JSON array of profiles.
- **"Failed to import profiles: ..."** The file is not valid JSON.
- **The status bar item is missing.** It shows only on a notebook with an active profile; switch once.
- **Writes still prompt after switching to DB Admin.** The profile does not remove confirmation; safety checks stay on. Environment tags also still apply.
