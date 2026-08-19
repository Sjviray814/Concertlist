# ConcertList

A MyAnimeList-style tracker for concerts and raves — log the shows you've been to, rate them, see your top artists, and discover upcoming tour dates.

**Status: real app, pre-launch.** This is a Next.js + Supabase app with real accounts, a Postgres database, and row-level security — no longer the single-file prototype. The original prototype is kept for reference at [`legacy/prototype.html`](legacy/prototype.html). See [`docs/roadmap.md`](docs/roadmap.md) for the full path to launch and what's still ahead.

## Features

- **Accounts** — email/password sign-up and login via Supabase Auth, with a profile row auto-created per user
- **My Sets** — your concert history as ticket-stub cards, sortable by date/score/artist and filterable by genre; add, edit, and delete shows
- **Rankings** — your artists ranked by average rating, computed from your logged shows
- **Discover** — live upcoming-show search via the [Ticketmaster Discovery API](https://developer.ticketmaster.com/), proxied through a server route so the API key never reaches the browser, with basic response caching
- **Compare** — a real (not mock) leaderboard of every user's logged-show count and average score
- **Artist photos** — pulled automatically from the [iTunes Search API](https://performance-partners.apple.com/search-api) (no key required)

## Stack

- **Frontend/backend:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Database/auth:** [Supabase](https://supabase.com/) (Postgres + Row Level Security + Auth)
- **Hosting (recommended):** Vercel (frontend) + Supabase (backend/db) — both have generous free tiers

## Setup

### 1. Create a Supabase project

Sign up at [supabase.com](https://supabase.com/) and create a new project (free tier is fine). Once it's ready:

1. Go to **Project Settings > API** and copy the **Project URL** and **anon public** key.
2. Go to the **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `profiles` and `concerts` tables, row-level security policies, and the `leaderboard` view used by Compare.

### 2. Get a Ticketmaster API key

Free at [developer.ticketmaster.com](https://developer.ticketmaster.com/) — needed for the Discover tab.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `TICKETMASTER_API_KEY` in `.env.local`. This file is gitignored — never commit it.

### 4. Run it

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Sign up for an account (Supabase sends a confirmation email by default — check your inbox, or disable email confirmation in **Authentication > Providers > Email** in the Supabase dashboard for faster local testing), then log in.

## Deploying

Push to GitHub and import the repo into [Vercel](https://vercel.com/). Add the same three environment variables from `.env.local` in the Vercel project settings, then deploy. Supabase needs no separate deploy step — it's already hosted.

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md) for the full path from here to a launched, multi-user product. [`docs/beta-targets.md`](docs/beta-targets.md) has illustrative target benchmarks for the eventual beta (planning goals, not real results).

## License

MIT — see [`LICENSE`](LICENSE).
