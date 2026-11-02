---
layout: ../../../layouts/GuideLayout.astro
title: Connect through an SSH tunnel or with SSL certificates
summary: Reach a database in a private network through a bastion host, or verify the server with a CA certificate and optional client certificate.
area: connections
order: 2
related:
  - explorer
---

Use an SSH tunnel when the database accepts connections only from inside a private network, such as an RDS instance in a VPC, and you can log in to a bastion host that can reach it. Use SSL certificate verification when you want more than encryption: confirming the server is the one you meant to reach, or presenting a client certificate.

You end up with a connection that opens the tunnel itself each time it connects, or one that verifies the server's certificate before sending credentials. The two combine.

## Before you start

- For a tunnel: a host you can SSH into, a user on it, and a private key file on your machine. The key must not need a passphrase and the SSH server must allow port forwarding. Check with `ssh user@host -p port` first.
- For certificates: the CA certificate as a file on disk, plus a client certificate and key if the server requires them.
- A connection you can edit. New connections are created in the **New Connection** form; saved ones open from **Manage Connections**.

## Connect through an SSH tunnel

1. Run [**Manage Connections**](/docs/reference/commands#postgres-explorer.manageConnections), then use the edit button on the connection's row. For a new one, run [**Add PostgreSQL Connection**](/docs/reference/commands#postgres-explorer.addConnection). Connections made with **Add Connection from Clipboard URL** or **Import Connection from DATABASE_URL (.env)** have no tunnel until you edit them.
2. Fill in **Host** and **Port** as the bastion sees the database, not as your laptop sees it. For an RDS instance that is the private endpoint, for example `mydb.xxx.region.rds.amazonaws.com` and `5432`.
3. Expand **SSH Tunnel** and tick **Enable SSH Tunnel**.
4. Fill in all four fields, which become required: **SSH Host** (such as `bastion.example.com`), **SSH Port** (22 by default), **SSH Username** and **Private Key Path**.
5. Enter the full path to the key, for example `/home/you/.ssh/id_rsa`. The field's placeholder shows `~/.ssh/id_rsa`, but NexQL reads the path exactly as typed and does not expand `~`, so use an absolute path.
6. Press **Test Connection**, then **Add Connection** (or **Save Changes** when editing).

NexQL authenticates to the bastion with the private key only. There is no field for a key passphrase, a password or an SSH agent. The database login (**Username**, **Password**) is separate and unchanged.

In the connections table, a tunnelled connection shows `(ssh)` after its host and port.

Two limits to know: the tunnel is opened per connection when NexQL connects, and connections that use an SSH tunnel are skipped by the MCP server that NexQL Bot uses, as the MCP page in NexQL Settings notes.

## Verify the server with SSL certificates

1. Open the connection form as above and expand **Advanced Options**.
2. Set **SSL Mode**. The modes, in order, are `disable`, `allow`, `prefer`, `require`, `verify-ca` and `verify-full`. Leaving it on **Default (prefer)** behaves as `prefer`.
3. Choose `verify-ca` or `verify-full`. Three fields appear: **CA Certificate Path**, **Client Certificate Path** and **Client Key Path**.
4. Enter the CA certificate path. Add the client certificate and key paths if the server asks for a client certificate.
5. Press **Test Connection**.

Only `verify-ca` and `verify-full` check the server's certificate. `require` encrypts the connection without validating the certificate, and `prefer` and `allow` retry without SSL if the server does not offer it. They never do that on a connection tagged Production.

Test Connection currently requires the client certificate and key paths for `verify-full`, not just the CA. If your server needs only a CA, such as a managed provider's root certificate, use `verify-ca`.

If you use NexQL Sync, passwords and SSH or SSL key paths stay on each device. Enter the paths again on a new machine.

## If something goes wrong

- **"Failed to read private key at ...".** The path is wrong or unreadable. Use an absolute path and check permissions (`chmod 600` on Linux and macOS).
- **"SSH Connection failed: ...".** The text after the colon comes from the SSH client. Check the host, port and username, that the key is accepted for that user, and that the server allows port forwarding. A passphrase-protected key will fail, as NexQL cannot supply the passphrase.
- **Tunnel connects but the database does not.** The database host is resolved from the bastion. A name or address that only your laptop knows will fail.
- **"CA certificate path is required for SSL mode "verify-ca"."** Fill in **CA Certificate Path**. The message names whichever of the CA, client certificate or client key is missing for your mode.
- **"CA certificate file does not exist: ...".** Fix the path. The same message exists for the client files.
- **SSL fails with a certificate error.** The CA does not match the server's chain. Use the provider's CA bundle.
- **"Cannot reach host:port."** With no tunnel, NexQL checks the TCP connection first. With a tunnel enabled that check is skipped, so failures show up as SSH errors instead.
