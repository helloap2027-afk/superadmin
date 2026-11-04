# HELLO Platform — cPanel Phusion Passenger Deployment Architecture

This document specifies the production hosting configuration for **HELLO** on Ubuntu 24.04 VPS running cPanel / WHM, Apache with Phusion Passenger, NGINX reverse proxy, Node.js 22, and MariaDB.

---

## 1. Production Service Mappings

| Service | Intended Domain | Monorepo Application Root | Passenger Startup File | Port (if reverse-proxied) |
|---|---|---|---|:---:|
| **Public Website** | `https://hello-hi.in` | `/home/<user>/hello-platform/apps/website` | `app.js` | 3000 |
| **Super Admin Console** | `https://admin.hello-hi.in` | `/home/<user>/hello-platform/apps/admin` | `app.js` | 3001 |
| **Central REST API** | `https://api.hello-hi.in` | `/home/<user>/hello-platform/apps/api` | `app.js` | 4000 |

---

## 2. Phusion Passenger Compatibility Standards

1. **Startup Entrypoint**:
   * Every application root (`apps/website`, `apps/admin`, `apps/api`) provides an `app.js` entrypoint.
   * `app.js` checks for `typeof (PhusionPassenger) !== 'undefined'` and invokes the production compiled entry point (`.next/standalone/server.js` or `dist/main.js`).
2. **Environment Variables via Apache mod-env / cPanel Application Manager**:
   * Stored in `/home/<user>/hello-platform/.env.production` (strictly outside `public_html`).
   * Configured via cPanel Application Manager -> "Environment Variables" key-value table.
3. **No Secrets Inside `public_html`**:
   * The hosting webroot `/public_html` is kept strictly free from `.env`, database credentials, private documents, or backend TypeScript code.
   * Only static compiled assets or reverse proxy directives reside in public web locations.
4. **Application Restarts**:
   * Restarting an app without killing server connections is executed via:
     ```bash
     mkdir -p tmp && touch tmp/restart.txt
     # or using passenger CLI
     passenger-config restart-app /home/<user>/hello-platform/apps/<app-name>
     ```

---

## 3. MariaDB Configuration
* **Version**: MariaDB 10.11+ / 11.4 LTS
* **Database Name**: `hello_prod`
* **Collation**: `utf8mb4_unicode_ci`
* **Connection String Format**:
  ```
  DATABASE_URL="mysql://<user>:<password>@127.0.0.1:3306/hello_prod?sslmode=prefer"
  ```

