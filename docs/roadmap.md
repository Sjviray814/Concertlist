# ConcertList — Roadmap to Production

**Where we are today:** a real Next.js + Supabase app (see repo root) with accounts, a Postgres database, row-level security, and server-proxied Ticketmaster search. The original single-file prototype is kept for reference at `legacy/prototype.html`. **You still need to create your own Supabase project and run `supabase/schema.sql` against it, then fill in `.env.local` — see the root [README](../README.md) — before this runs for real.**

This doc lays out everything between here and a real product with real users, in rough build order. Not every box needs to be checked before you launch — see the "MVP cutline" notes marking what's truly required for a v1 launch vs. what can wait.

---

## Phase 0 — Decisions to make before writing more code

- [ ] Pick a name/brand for real (ConcertList is a placeholder — check domain + social handle availability)
- [ ] Decide platform scope for v1: mobile-responsive website only, or website + native app later
- [ ] Decide monetization (or explicitly: none for now) — affects whether you need payments infra later
- [ ] Decide hosting budget (free-tier stack vs. paid from day one)
- [ ] Choose tech stack (recommended default below, swap if you have preferences):
  - Frontend: Next.js (React) or keep vanilla — Next.js gives you routing + API routes in one place
  - Backend/DB: Supabase or Firebase (fastest path — auth + Postgres/NoSQL + hosting-friendly) *or* a custom Node/Express + Postgres setup if you want more control
  - Hosting: Vercel (frontend) + Supabase (backend/db) is the fastest free-tier combo

---

## Phase 1 — Turn the prototype into a real codebase

**MVP cutline: all required.**

- [x] Set up a proper project repo (git + GitHub), not a single HTML file
- [x] Scaffold the chosen framework (e.g. `npx create-next-app`) — Next.js (App Router, TypeScript, Tailwind)
- [x] Port existing UI (My Sets, Rankings, Discover, Compare, ticket-stub card design, tab bar, modal) into components
- [x] Set up environment variables (`.env`) for secrets — Ticketmaster key, DB credentials, etc. (never commit these)
- [x] Set up local dev workflow (linting, a README for yourself) — ESLint via create-next-app; no Prettier config yet

---

## Phase 2 — Backend & data layer

**MVP cutline: all required — this is what makes it a "real app" instead of a demo.**

- [x] Design the database schema — see `supabase/schema.sql`:
  - `profiles` (id, username, display_name, avatar_url, created_at) — auto-created per user via a trigger on `auth.users`
  - `concerts` (id, user_id, artist, venue, date, genre, score, notes, created_at), with row-level security so users can only edit/delete their own
  - Optional later: `follows`/`friends`, `comments`, `likes`
- [ ] Set up the database (Postgres via Supabase, or equivalent) — schema is written and ready in `supabase/schema.sql`, but **you still need to create the actual Supabase project and run it**
- [x] Build the API layer (REST or Supabase's auto-generated API) for:
  - [x] Create / read / update / delete a concert entry
  - [x] Fetch a user's full concert list (with sort/filter params)
  - [x] Compute artist rankings server-side (or client-side from fetched data)
  - [x] Fetch community/compare data (other users' stats) — via the `leaderboard` SQL view
- [x] Replace all mock JS arrays in the current prototype with real API calls

---

## Phase 3 — Authentication & accounts

**MVP cutline: required — Compare/social features are meaningless without real accounts.**

- [x] Add sign-up / log-in — email+password via Supabase Auth (no Google/Apple yet)
- [x] Add session handling (Supabase Auth / NextAuth / Firebase Auth all handle this for you)
- [ ] Build a basic profile screen (username, avatar, bio, join date) — only a read-only username shows in the header so far
- [x] Gate "My Sets" and "Compare" behind login; allow "Discover" to work logged-out
- [ ] Add password reset / email verification flow — Supabase's default email-confirmation-on-signup flow is wired up (`/auth/callback`); no "forgot password" page yet
- [ ] Write and link a Privacy Policy and Terms of Service (required once you store real user data — use a generator like Termly as a starting point, then review it yourself)

---

## Phase 4 — Real ticket data, done production-safely

**MVP cutline: functional version required; the backend-proxy hardening can follow shortly after.**

- [x] Move the Ticketmaster API call from client-side `fetch` to a server-side API route (`/api/discover`) so your API key isn't exposed in the browser
- [x] Add basic caching (e.g. cache popular searches for a few hours) to stay within Ticketmaster's rate limits (5,000 calls/day on the free tier) — in-memory, 3hr TTL; also added a per-IP rate limit since this route is public
- [x] Add graceful fallback UI for rate-limit/error states (already partially built — port it over)
- [ ] Consider a second data source (Bandsintown or Songkick APIs) to fill gaps Ticketmaster misses, especially smaller/underground shows relevant to the rave/electronic scene
- [ ] Add location-based search (use browser geolocation or let users set a home city)

---

## Phase 5 — Core feature completeness

**MVP cutline: first four required; rest can be v1.1+**

- [x] Edit and delete a logged concert (currently add-only)
- [x] Working genre filter on "My Sets" (UI exists, not yet functional)
- [x] Real, non-mock "Compare" — pull actual other users' public stats
- [ ] Basic search/discovery of other users (by username)
- [ ] Concert photo/ticket-stub image upload (nice signature feature given the ticket-stub design language)
- [ ] Comments or reactions on other users' logged shows
- [ ] "Follow" system so Compare/feed can be personalized instead of global
- [ ] Public shareable profile pages (e.g. `concertlist.app/@username`) — huge for organic growth, people share their "top shows of the year"

---

## Phase 6 — Polish, quality, trust

**MVP cutline: first three required before public launch.**

- [ ] Mobile responsiveness pass on real devices (not just resized browser)
- [ ] Accessibility pass (color contrast, screen reader labels, keyboard navigation)
- [ ] Error/loading states everywhere (empty states already exist — extend the pattern)
- [ ] Basic analytics (Plausible, PostHog, or GA) to see what people actually use
- [ ] Set up error monitoring (Sentry) so you find bugs before users report them
- [ ] Write a short "About" page — what the app is, who made it, why

---

## Phase 7 — Deployment & infrastructure

**MVP cutline: all required.**

- [ ] Buy a domain
- [ ] Deploy frontend (Vercel/Netlify — connect to GitHub for auto-deploy on push)
- [ ] Deploy/configure backend + database (Supabase project, or your own server)
- [ ] Set up staging vs. production environments so you're not testing on live user data
- [ ] Set up automated backups for the database
- [ ] Basic uptime monitoring (UptimeRobot or similar, free tier)

---

## Phase 8 — Pre-launch testing

**MVP cutline: all required — don't skip this.**

- [ ] Recruit 5–10 friends/target users (concertgoers, ravers) for a closed beta
- [ ] Watch someone use it without guiding them — note every point of confusion
- [ ] Fix the top friction points from beta feedback
- [ ] Load-test or at least sanity-check what happens with 50/100/500 concerts in one list
- [ ] Test on real iOS Safari and Android Chrome specifically (mobile browser quirks are common)

---

## Phase 9 — Launch & gaining first users

- [ ] Soft launch to your existing network (friends, festival group chats, local rave/EDM Discord or Facebook groups)
- [ ] Post in relevant communities where this audience already exists: r/aves, r/electronicmusic, r/edmproduction-adjacent subs, local rave Discords, Resident Advisor forums — genuinely participate, don't just drop a link
- [ ] Consider a simple "log your 2026 shows, get your Spotify-Wrapped-style year-end recap" hook — highly shareable, proven pattern (Letterboxd, Spotify Wrapped, Goodreads do this)
- [ ] Reach out to a few music/rave-scene microinfluencers or bloggers for early coverage
- [ ] Make it dead simple to invite friends (share a profile link, "see how your year compares")
- [ ] Set up a simple feedback channel (a Discord, or just your email) so early users can reach you directly

---

## Phase 10 — Post-launch: retention & growth loops

- [ ] Email/push notification when a followed artist announces a new tour date near the user (this is the app's strongest retention hook — ties Discover + My Sets together)
- [ ] Year-in-review recap feature (huge organic sharing driver, as above)
- [ ] Badges/achievements (e.g. "Festival Season" for 5+ shows in summer) — light gamification MyAnimeList-style apps lean on
- [ ] Iterate based on real usage data from Phase 6's analytics setup
- [ ] Revisit monetization if desired (premium stats, ad-free, artist promotion partnerships) — only once retention is proven

---

## Suggested order of operations (condensed)

1. Phase 1 (real codebase) → Phase 2 (backend/DB) → Phase 3 (auth) — get a real, persistent, multi-user app working, even ugly
2. Phase 4 (secure the ticket API) in parallel — quick and important before wider sharing
3. Phase 5 (core features) until it does what you actually envisioned
4. Phase 6 + 7 (polish + deploy) to get it live on a real domain
5. Phase 8 (beta test) before telling strangers about it
6. Phase 9 (launch) → Phase 10 (grow/retain)
