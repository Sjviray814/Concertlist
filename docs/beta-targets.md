# ConcertList — Beta & Launch Target Benchmarks

**Important framing:** nothing below is measured data — the app hasn't launched. These are *optimistic planning targets*: reasonable, achievable-if-things-go-well numbers to aim for and compare your actual results against, based on typical outcomes for small niche social/passion-project apps at each stage. Treat every number as a goalpost, not a promise.

---

## Phase 8 — Closed Beta (Week 1–2)

| Metric | Optimistic target | Why this is plausible |
|---|---|---|
| Beta testers recruited | 30–50 people | Friends, festival group chats, 1–2 Discord/Reddit posts — realistic reach for a first ask |
| Beta testers who actually log in | 70–80% (≈25–35 people) | Typical activation rate when you personally ask people to try something |
| Beta testers who log ≥1 concert | 50–60% of those who log in (≈15–20 people) | The "did they do the core action" bar — this is the number that matters most |
| Total concerts logged during beta | 150–300 | ~8–10 shows per active tester, since most concertgoers can recall a summer's worth of shows off the top of their head |
| Avg. session length | 3–5 minutes | Enough to log a few shows and poke around Rankings/Discover |
| Bugs/crashes reported | <5% of sessions hit an error | A clean beta at this scale is achievable if Phase 6 polish was done properly |
| Qualitative feedback score | 7.5–8.5 / 10 "would you use this again" | Passion-project apps in a niche audience tend to score well when the core idea resonates |

---

## Discover / Ticketmaster API usage (Phase 8 load check)

| Metric | Optimistic target | Notes |
|---|---|---|
| API calls served during beta | 300–600 total | Well under Ticketmaster's free-tier cap of 5,000/day even on a heavy testing day |
| Cache hit rate (once caching is added) | 40–60% | Popular searches (big-name artists, home city) repeat often |
| Search success rate (results returned) | 85%+ | Mainstream/festival-circuit artists are well covered by Ticketmaster; smaller underground acts will miss more often |
| API error rate | <2% of requests | After the backend-proxy move in Phase 4 |

---

## Load-test numbers (Phase 8 technical check)

| Metric | Optimistic target |
|---|---|
| Concurrent test users handled cleanly | 50–100 (small beta scale — this is a low bar deliberately, not a stress test) |
| Page load time (first load) | Under 2 seconds |
| "My Sets" list render time at 500 logged concerts | Under 500ms |
| Uptime during beta window | 99%+ (easy at this scale on Vercel/Supabase free tiers) |

---

## Phase 9 — Early Public Launch (First 4–6 weeks)

| Metric | Optimistic target | Why this is plausible |
|---|---|---|
| Total signups | 300–500 | Realistic for a soft launch into music/rave communities + word of mouth from beta testers |
| Signups who log ≥1 concert (activation rate) | 40–50% | Solid activation for a list-building app once someone bothers to sign up |
| Day-7 retention | 30–40% | Healthy early retention for a niche social app; Letterboxd-style apps often land here pre-network-effects |
| Day-30 retention | 15–25% | Expected drop-off is normal — the year-end recap feature (Phase 10) is designed to pull people back later, not week 4 |
| Avg. concerts logged per activated user | 10–15 | People tend to backfill their recent concert history in one sitting |
| Organic shares (profile links, recap posts) | 10–15% of active users share at least once | The single biggest growth lever if the shareable recap hits |

---

## How to use this doc

Run the actual beta, plug your real numbers into a copy of these tables, and see where you beat vs. missed the target. Missing a number isn't a failure signal on its own at this scale — it just tells you where to focus (e.g., low activation → onboarding friction; low Day-30 retention but strong Day-7 → you need a reason for people to come back, which is exactly what Phase 10's retention features are for).
