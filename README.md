# NeoAuth

A graphical authentication system based on cognimetrics, built on the principle of using arbitrary objects instead of text as the "pass-phrase". Instead of typing a password, users pick 4–8 objects (an apple, a rocket, …) and later authenticate by spotting their objects inside randomly composited challenge images.

## The Stack

1. **API** — FastAPI (Python 3.12), managed with [uv](https://docs.astral.sh/uv/)
2. **ORM** — SQLAlchemy 2
3. **Database** — MariaDB 11
4. **Frontend** — React 18 + TypeScript, served by nginx
5. **Ingress** — Cloudflare Tunnel (no open inbound ports)

Everything runs as containers via Docker Compose:

```
cloudflared ──> nginx (web) ──> static SPA
                     └── /api/ ──> FastAPI (api) ──> MariaDB (db)
```

## Quick start (local)

```sh
cp .env.example .env
# fill in MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD and JWT_SECRET_KEY
# (generate secrets with: openssl rand -hex 32)

docker compose up --build -d
```

Then open <http://localhost:8080>. The first challenge request generates the image sets, so the first login screen can take a few seconds.

## Public deployment (Oracle Cloud + Cloudflare Tunnel)

The stack is designed to run on any small VM (e.g. an OCI free-tier Ampere instance, arm64 works out of the box) with **no inbound ports open** — public traffic arrives through an outbound-only Cloudflare Tunnel.

1. Install Docker on the VM and clone this repository.
2. In the Cloudflare dashboard: **Zero Trust → Networks → Tunnels → Create a tunnel** (Cloudflared connector). Copy the tunnel token.
3. Add a **Public Hostname** to the tunnel: your subdomain (e.g. `neoauth.example.com`) → service `http://web:80`.
4. On the VM: `cp .env.example .env`, fill in the secrets, set `TUNNEL_TOKEN` and `CORS_ORIGINS=https://neoauth.example.com`.
5. Start everything:

   ```sh
   docker compose --profile tunnel up --build -d
   ```

Notes:
- Keep the VM's firewall / OCI security list closed except SSH — the tunnel needs nothing inbound.
- The `web` port is bound to `127.0.0.1` only, for debugging on the host.
- nginx rate-limits `/api/auth/` per client IP (using `CF-Connecting-IP`) as brute-force protection.

## Object assets

`api/objects/` holds the object icons (SVG). The bundled set is [Twemoji](https://github.com/jdecked/twemoji) (CC-BY 4.0) — see `api/objects/LICENSE.md`. To use your own set, drop in at least 32 distinct SVG files (the filename becomes the object name shown to users); they are uploaded to the DB automatically on API start-up.

## Development

API (requires a running MariaDB, e.g. `docker compose up db -d` plus the `MYSQL_*`/`JWT_SECRET_KEY` env vars):

```sh
cd api
uv sync
DEV_RELOAD=1 uv run python main.py
```

Frontend dev server on port 3000:

```sh
cd app
npm install
npm start
```

## The Concept

### NeoPass
Composed of 4–8 arbitrary objects of the user's choice.
### Objects
An object is the image of an arbitrary, recognisable singular entity — a car, an apple, etc.
### Image
An image is a collection of multiple objects randomly composited together.
### ImageSet
An image set is a collection of 16 images that represents a single challenge; together its images contain all objects exactly once.
### Challenge
A challenge is a sequence of 4 or more image sets, from which the user must pick the images containing their objects.
