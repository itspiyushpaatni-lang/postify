# Postify

A social media scheduler: connect your channels, compose once, publish everywhere,
plan a week of content with AI, and read per-platform analytics.

Postify is a rebranded, trimmed fork of [Postiz](https://github.com/gitroomhq/postiz-app)
(AGPL-3.0). See [NOTICE.md](NOTICE.md) for what changed and [Licence](#licence) for
what the licence asks of you when you charge for a hosted version.

## What is in the box

| Area | What you get |
| --- | --- |
| Channels | OAuth connections for X, LinkedIn (profile and page), Instagram, Facebook, Threads, TikTok, YouTube, Pinterest, Reddit, Bluesky, Mastodon, Telegram, Discord and more |
| Composer | One post for many channels, per-channel edits, per-platform preview, media library |
| Scheduling | Day / week / month calendar, list view, posting-slot queue, drafts, recurring posts |
| AI | **AI week**: a topic becomes 7 editable drafts on the calendar; **Variations**: 4 rewrites of any planned post; plus the upstream agent chat and image generation |
| Analytics | Reach and engagement per channel, pulled from each platform's API |
| Accounts | Email + password sign-up, password reset, teams |
| Billing | Stripe subscriptions (Standard and Pro, monthly or yearly, 7-day trial, customer portal) |
| Marketing | Public landing page at `/`, plus `/terms` and `/privacy` templates |

## Architecture

```
apps/frontend      Next.js UI (port 4200)
apps/backend       NestJS API (port 3000)
apps/orchestrator  NestJS worker that publishes posts on schedule (Temporal workflows)
libraries/         shared code: providers, Prisma schema, DTOs, React helpers
```

It needs PostgreSQL, Redis and a Temporal server. Temporal is what fires scheduled
posts; its single-binary dev server is enough for a small install.

## Run it locally

Requirements: Node 22, pnpm 10, PostgreSQL 16+, Redis 7+, the
[Temporal CLI](https://docs.temporal.io/cli#install).

```bash
# 1. Dependencies
pnpm install

# 2. Database and services
createuser -s app && createdb -O app app && psql -c "ALTER USER app PASSWORD 'app'"
redis-server --daemonize yes
temporal server start-dev --db-filename ./temporal.db &

# 3. Configuration
cp .env.example .env        # set JWT_SECRET and UPLOAD_DIRECTORY at minimum
pnpm run prisma-db-push     # creates the tables

# 4. Start
pnpm run dev                # frontend + backend + orchestrator in watch mode
```

Open http://localhost:4200 — the landing page — and create an account.

`pnpm run dev` runs three watchers and needs roughly 8 GB of free RAM. On a smaller
machine build the two servers once and only watch the frontend:

```bash
pnpm run build:backend && pnpm run build:orchestrator
pnpm run start:prod:backend &
pnpm run start:prod:orchestrator &
pnpm run dev:frontend
```

If the frontend reports "OS file watch limit reached" on Linux:
`sudo sysctl -w fs.inotify.max_user_watches=1048576`.

### First things to try

1. **Connect a channel.** "Add Channel" lists every network; one only works after you
   put that network's developer-app keys in `.env` (see below).
2. **AI week.** With `OPENAI_API_KEY` set and at least one channel connected, the
   pink button next to "Create Post" opens the planner.
3. **Billing.** Add Stripe test keys, restart, and new accounts are sent to the plan
   picker. Pay with card `4242 4242 4242 4242`.

## Environment variables

`.env.example` is the short list; `.env.full.example` is the upstream reference with
every option.

| Variable | Needed | Purpose |
| --- | --- | --- |
| `DATABASE_URL`, `REDIS_URL`, `TEMPORAL_ADDRESS` | yes | Postgres, Redis, Temporal |
| `JWT_SECRET` | yes | Signs sessions. Long random string |
| `FRONTEND_URL` | yes | Public URL of the UI, exactly as visited |
| `NEXT_PUBLIC_BACKEND_URL` | yes | Public URL of the API (`…/api` behind the bundled nginx) |
| `BACKEND_INTERNAL_URL` | yes | How the frontend server reaches the API (`http://localhost:3000`) |
| `STORAGE_PROVIDER`, `UPLOAD_DIRECTORY`, `NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY` | yes | `local` disk uploads, or Cloudflare R2 (see full example) |
| `IS_GENERAL` | yes | Keep `"true"` |
| `NOT_SECURED` | no | `true` only for plain-http hosts other than localhost |
| `OPENAI_API_KEY` | no | Empty = AI is off and hidden. Set it to enable AI week, variations, agent, images |
| `OPENAI_MODEL`, `OPENAI_BASE_URL` | no | Model / OpenAI-compatible endpoint for the planner |
| `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_SIGNING_KEY` | for billing | Turns billing on |
| `NEXT_PUBLIC_SELLABLE_TIERS` | no | Plans shown for sale, default `STANDARD,PRO` |
| `EMAIL_PROVIDER` + keys, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | recommended | Activation, password reset, invites |
| `X_API_KEY`, `LINKEDIN_CLIENT_ID`, `FACEBOOK_APP_ID`, … | per network | OAuth apps for each network |
| `NEXT_PUBLIC_GOOGLE_LOGIN` | no | `true` shows "Continue with Google" (uses `YOUTUBE_CLIENT_ID`) |
| `HIDDEN_PROVIDERS` | no | Comma-separated networks to hide from "Add Channel" |
| `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_SOURCE_URL`, `NEXT_PUBLIC_DOCS_URL` | recommended | Footer contact, source link, API docs link |

`NEXT_PUBLIC_*` values are compiled into the frontend: rebuild after changing them.

### Connecting social networks

Every network requires **your own developer app**; nothing is shared with upstream.
The redirect URL is always `{FRONTEND_URL}/integrations/social/<provider>`
(`x`, `linkedin`, `linkedin-page`, `facebook`, `instagram`, `threads`, `youtube`, `tiktok`, …).

Plan for this before launch: Meta (Facebook/Instagram/Threads), LinkedIn pages and
TikTok require app review before accounts other than your own can connect, most
require HTTPS redirect URLs and a public privacy policy, and X needs a paid API tier
for meaningful posting volume. Bluesky, Mastodon, Telegram and Discord are the quickest
to get working.

### Stripe (test mode)

1. Copy the test publishable and secret keys from the Stripe dashboard into `.env`.
2. Forward webhooks while developing:
   `stripe listen --forward-to localhost:3000/stripe` and put the printed `whsec_…`
   in `STRIPE_SIGNING_KEY`. In production add a webhook endpoint for
   `{NEXT_PUBLIC_BACKEND_URL}/stripe`.
3. Restart. Products and prices are created in Stripe automatically on first checkout
   from `libraries/nestjs-libraries/src/database/prisma/subscriptions/pricing.ts`.

Edit prices and limits in `pricing.ts`. With Stripe keys set there is no free plan:
accounts start a 7-day trial on a paid plan. Without keys, billing is off and every
account has every feature.

## Deploy

### One server with Docker Compose

Suits a 2 vCPU / 8 GB VPS. The image builds on the server; the build needs about
4 GB of free RAM, so stop other heavy containers while it runs (or build elsewhere
and push the image to a registry).

```bash
git clone <your repo> postify && cd postify
cp .env.example .env
#   FRONTEND_URL=https://app.example.com
#   NEXT_PUBLIC_BACKEND_URL=https://app.example.com/api
#   JWT_SECRET, POSTGRES_PASSWORD, plus the keys you use
docker compose -f docker-compose.lean.yaml up -d --build
```

The app listens on `127.0.0.1:5000`; the schema is applied on start. Put TLS in front,
for example with Caddy:

```
app.example.com {
    reverse_proxy 127.0.0.1:5000
}
```

Update with `git pull && docker compose -f docker-compose.lean.yaml up -d --build`.
Back up the `pgdata`, `uploads` and `temporaldata` volumes.

`docker-compose.lean.yaml` runs Temporal's development server on SQLite. That keeps
the stack small, but Temporal does not recommend it for production load. When you
have paying customers, switch to the full Temporal services in `docker-compose.yaml`
or to Temporal Cloud (`TEMPORAL_ADDRESS`, `TEMPORAL_NAMESPACE`, `TEMPORAL_API_KEY`).

### Managed database

Any Postgres works, including Supabase: set `DATABASE_URL` to the **session** (port
5432) connection string, remove the `postgres` service from the compose file, and run
`pnpm run prisma-db-push` once.

### Before taking payments

- Replace `/terms` and `/privacy` (templates in `apps/frontend/src/app/(marketing)`).
- Configure an email provider so password resets work.
- Set `NEXT_PUBLIC_SOURCE_URL` (see Licence).
- Switch Stripe to live keys and a live webhook endpoint.

## Renaming

`scripts/rebrand.sh "New Name"` renames the product in the UI, emails and all
translations. Swap the logo in `apps/frontend/src/components/new-layout/logo.tsx`,
`apps/frontend/src/components/ui/logo-text.component.tsx` and `apps/frontend/public/`.
Colours for the landing page are in `apps/frontend/src/app/(marketing)/welcome/page.tsx`.

Internal identifiers still carry upstream names (`@gitroom/*` import paths,
`POSTIZ_*` SSO variables, `x-postiz-*` API headers, the `postiz` npm CLI shown on the
Public API settings page). They are not shown on the main screens and renaming them
would break compatibility with upstream updates and API clients.

## Licence

AGPL-3.0, inherited from Postiz. You may run this commercially and charge for it.
In return, the people who use your hosted copy must be able to get the complete
source code of the version you run, including your modifications, under the same
licence, and the original copyright and licence notices must stay. Publish your fork
(a public Git repository is the simplest way) and point `NEXT_PUBLIC_SOURCE_URL` at it.
This is a summary, not legal advice.
