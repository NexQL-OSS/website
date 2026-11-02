---
layout: ../../../layouts/GuideLayout.astro
title: Connect to Neon, Supabase, RDS and other managed Postgres
summary: Add a hosted PostgreSQL database with the right platform preset, SSL mode and endpoint, then check it with Test Connection.
area: connections
order: 1
related:
  - explorer
---

Hosted databases differ from a local Postgres in three ways that matter here: they need SSL, many of them sit behind a connection pooler, and none of them give you a superuser. NexQL has a platform preset for each common provider that fills in the port and SSL mode. You end up with a saved connection that passed **Test Connection**, shown in the Connections view with a platform badge once you connect.

This guide covers Neon, Supabase, AWS RDS and Aurora, Google Cloud SQL and AlloyDB, and Azure. For SSH bastions and client certificates, see [Connect through an SSH tunnel or with SSL certificates](/docs/guides/ssh-and-ssl).

## Before you start

- NexQL installed and a PostgreSQL 12 or newer server. Test Connection warns on older versions.
- The connection string or host details from your provider's dashboard, including the database user and password.
- A network path to the database. Hosted databases are often limited to an allow-list of IP addresses or a private VPC; that is set up at the provider, not in NexQL.

## Add the connection

1. Run **Add PostgreSQL Connection** from the Command Palette, or press `Ctrl+Alt+A` (`Cmd+Alt+A` on macOS). The [command](/docs/reference/commands#postgres-explorer.addConnection) opens the **New Connection** form.
2. Under **Database platform**, pick your provider: Neon, Supabase, TimescaleDB, AWS RDS PostgreSQL, AWS Aurora PostgreSQL, Google Cloud SQL, Google AlloyDB or Azure Database for PostgreSQL. The preset sets **Port** and **SSL Mode** and shows a hint for that provider.
3. Paste the provider's `postgresql://` URL into **Connection URL** and press **Apply URL**, or type **Host**, **Port**, **Database**, **Username** and **Password** yourself.
4. Open **Advanced Options** and check **Port** and **SSL Mode** against the section for your provider below. The platform preset fills these in, so check them after Apply URL too.
5. Give the connection a **Connection Name** and set **Environment** if it is production (see [Set up production guardrails](/docs/guides/production-safety)).
6. Press **Test Connection**. On success the form shows "Connected" with the PostgreSQL version, and **Add Connection** replaces the test button. Press it to save.

You can also paste a URL straight from the clipboard with [**Add Connection from Clipboard URL**](/docs/reference/commands#postgres-explorer.smartPasteConnection), or read one from a workspace `.env` file with [**Import Connection from DATABASE_URL (.env)**](/docs/reference/commands#postgres-explorer.importConnectionFromDatabaseUrl). Both save with a development environment tag and an auto-generated name, so open the connection in **Manage Connections** afterwards to rename it and set the environment.

## Neon

Neon's dashboard gives you a URL ending in `?sslmode=require`. Use the direct endpoint, the host without `-pooler`, on port `5432` with SSL Mode `require`. The pooled endpoint runs in transaction mode, which breaks transactions that span notebook cells, `SET`, LISTEN/NOTIFY and temporary tables.

Neon suspends idle computes. The first query after a long pause can take a few seconds or drop a stale connection; run it again.

## Supabase

Supabase offers three paths under Project Settings, then Database:

| Path | Port | Use it for NexQL |
| --- | --- | --- |
| Direct connection | 5432 | Yes. Can be IPv6-only on some plans. |
| Session pooler | 5432 | Yes. Works over IPv4. |
| Transaction pooler | 6543 | Avoid. |

Set SSL Mode to `require`. If you must use a pooler host, make sure **Port** is `5432` after you apply the URL.

## AWS RDS and Aurora

Use the instance endpoint from the RDS console (the cluster writer endpoint for Aurora) and SSL Mode `require`. If the instance is in a private VPC, go through a bastion with an [SSH tunnel](/docs/guides/ssh-and-ssl).

## Google Cloud SQL and AlloyDB

Use the Cloud SQL Auth Proxy, with the proxy's local address (often `127.0.0.1`) as **Host**, or SSL client certificates. Set SSL Mode to `require` when you connect over the network. For AlloyDB use the instance IP or the Auth Proxy.

## Azure Database for PostgreSQL

Use the Flexible Server host from the Azure portal (`myserver.postgres.database.azure.com`) and SSL Mode `require`.

## If something goes wrong

- **"Cannot reach host:port."** The TCP connection failed before login. Check the host, the port, and the provider's firewall or IP allow-list.
- **"Connection timeout after 17s reaching host:port."** Nothing answered. The number is your connection timeout plus two seconds; raise **Connection Timeout** in Advanced Options for a slow cold start.
- **A warning after "Connected":** "Transaction-mode pooler detected" means the host or port looks like a transaction pooler. Switch to the direct or session endpoint.
- **"Server reports PostgreSQL N. NexQL supports PostgreSQL 12 and newer."** The connection works, but expect missing features.
- **"No password found for this connection."** Enter a password in the form, or add a matching line to your `.pgpass` file; the message shows the path and format.
- **Production connection failed ... blocked automatic SSL downgrade.** See [Set up production guardrails](/docs/guides/production-safety).
- **Connected to the wrong database.** If the **Database** you typed doesn't exist, Test Connection retries against `postgres` and appends "(connected to postgres database)" to the version. Fix the name before saving.
- **Features fail with "permission denied".** Hosted platforms never grant superuser, so event triggers, some extension installs and tablespace changes fail on the server regardless of the client.
