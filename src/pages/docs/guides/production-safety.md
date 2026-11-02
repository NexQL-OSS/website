---
layout: ../../../layouts/GuideLayout.astro
title: Set up production guardrails
summary: Tag production connections, turn on read-only mode, and get warnings and confirmation prompts before anything destructive runs.
area: connections
order: 3
related:
  - sentinel
---

Use this guide when a connection points at a database you can't afford to break. You end up with four layers: an environment tag that makes production visible everywhere in the editor, read-only mode that refuses writes, a confirmation dialog before risky statements, and a ban on silent SSL downgrades.

## Before you start

- A saved connection. Add one first with [**Add PostgreSQL Connection**](/docs/reference/commands#postgres-explorer.addConnection) if you haven't; see [Getting started](/docs/getting-started).
- A role on the server that has only the privileges you need. NexQL's checks are a second line of defence, not a replacement for database permissions.

## Tag the connection and turn on read-only

1. Run [**Manage Connections**](/docs/reference/commands#postgres-explorer.manageConnections).
2. In the table, change the **Environment** dropdown on the connection's row to **Production**. It saves immediately. To tag several at once, tick their checkboxes, pick an environment in the bar that appears and press **Tag selected**.
3. For more control, press the edit button on the row. The form's **Environment** field offers None, Development, Staging and Production.
4. Tick **Read-Only Mode** ("Force all transactions to be read-only").
5. If you pick Production without read-only, a banner reads **Production Database Connection** with an **Enable Read-Only Mode** link. Use it, or leave the box clear if this connection needs writes.
6. Press **Save Changes**.

Connections you imported from a `DATABASE_URL` are tagged Development until you change this.

## What read-only blocks

With **Read-Only Mode** on, a notebook cell only runs statements that start with `SELECT`, `WITH`, `EXPLAIN`, `SHOW` or `VALUES` and contain no `INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `ALTER`, `CREATE`, `GRANT` or `REVOKE`. Anything else stops with "Write operations are not allowed in read-only mode". Imports stop with "Import operations are not allowed in read-only mode". Automatic row limits are always on for read-only connections.

## What the Production tag adds

NexQL checks every cell before it runs. These always trigger a modal confirmation, on any connection: `DROP`, `TRUNCATE`, `DELETE`, `UPDATE` and `ALTER`. On a connection tagged Production, any statement that is not read-only also triggers it, as do `CREATE` and `GRANT` or `REVOKE`.

The dialog opens with "PRODUCTION DATABASE" on production connections, lists how many dangerous commands the cell contains, and offers two buttons. **Execute** runs the cell. **Execute in Transaction** opens a transaction first and adds a cell with transaction controls, so you can review the result and run `COMMIT` or `ROLLBACK`. Dismissing the dialog cancels the run with "Query execution cancelled by user".

Production connections also never fall back to an unencrypted connection when SSL fails. Staging and Development connections on `prefer` or `allow` do.

## Make production obvious

Sentinel colours the editor for tagged connections when a `.pgsql` notebook is focused: status bar, title and activity bars, `[P]`, `[S]` and `[D]` tab badges, a context strip in the notebook and an environment chip in NexQL Bot. Open [**Open Sentinel Settings**](/docs/reference/commands#postgres-explorer.sentinel.openSettings) to adjust it, or edit settings.json:

```json
{
  "postgresExplorer.sentinel.notifyOnTransition": true
}
```

This shows a notification when the focused notebook moves between environments, such as staging to production. The default is `false`. See [`postgresExplorer.sentinel.notifyOnTransition`](/docs/reference/settings#postgresExplorer.sentinel.notifyOnTransition) and the other `postgresExplorer.sentinel.*` settings, all `true` by default except the theme swap. [Sentinel](/docs/features/sentinel) has the full picture.

Cap runaway queries too:

```json
{
  "postgresExplorer.queryTimeout": 30000
}
```

This sets a global query timeout of 30 seconds; the default `0` means none. Setting **Statement Timeout** (milliseconds) under **Advanced Options** on a connection overrides it for that connection. See [`postgresExplorer.queryTimeout`](/docs/reference/settings#postgresExplorer.queryTimeout).

For per-notebook presets, see [Use connection profiles](/docs/guides/connection-profiles).

## If something goes wrong

- **"Production connection failed: ... NexQL blocked automatic SSL downgrade on a Production environment".** The server did not complete an SSL handshake. If it really has no SSL, or you connect through a trusted SSH tunnel, open the connection, expand **Advanced Options**, and set **SSL Mode** to "Disable — No SSL". From Test Connection the error has a **Set SSL Mode to Disable** button; retest before saving.
- **No colours or badges.** Sentinel only reacts to a focused `.pgsql` notebook on a connection that has an Environment, and only while [`postgresExplorer.sentinel.enabled`](/docs/reference/settings#postgresExplorer.sentinel.enabled) is `true`.
- **No confirmation on a `SELECT`.** Expected. Reads don't prompt, even on production.
- **A write ran without a prompt on a non-production connection.** `INSERT` alone doesn't prompt there. Tag the connection, or turn on read-only.
- **A read-only connection refuses a `SELECT` containing a write keyword.** The check also rejects statements that mention words like `INSERT` or `DELETE` in a CTE. Rewrite the query.
