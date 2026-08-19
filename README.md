# ConcertList

A MyAnimeList-style tracker for concerts and raves — log the shows you've been to, rate them, see your top artists, and discover upcoming tour dates.

**Status: prototype.** This is currently a single-file, client-side app with in-memory sample data — nothing persists between page loads yet, and there's no backend or accounts. See [`docs/roadmap.md`](docs/roadmap.md) for the full plan to take this to a real, deployed product.

## Features (current prototype)

- **My Sets** — your concert history as ticket-stub cards, sortable by date, score, or artist
- **Rankings** — your artists ranked by average rating, computed live from your logged shows
- **Discover** — live upcoming-show search via the [Ticketmaster Discovery API](https://developer.ticketmaster.com/)
- **Log a Show** — search past concerts via the [setlist.fm API](https://api.setlist.fm/docs/1.0/index.html) to auto-fill artist/venue/date instead of typing everything by hand
- **Artist photos** — pulled automatically from the [iTunes Search API](https://performance-partners.apple.com/search-api) (no key required)
- **Compare** — see how many shows you've logged against a small set of sample community users

## Running it locally

Because this app calls external APIs, opening `index.html` directly (double-clicking it) will fail with CORS errors — browsers treat local files as an untrusted `null` origin. Serve it over a local web server instead:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser. Full details, including why this happens, are in [`docs/local-testing-setup.md`](docs/local-testing-setup.md).

## API keys

Two free API keys unlock live features. Both are entered directly in the app's UI and saved only to your own browser's `localStorage` — they are never written to this repo or sent anywhere but their respective API.

| Service | Used for | Get a key |
|---|---|---|
| Ticketmaster | Upcoming show search (Discover tab) | [developer.ticketmaster.com](https://developer.ticketmaster.com/) |
| setlist.fm | Past show search (Log a Show modal) | [api.setlist.fm/docs](https://api.setlist.fm/docs/1.0/index.html) |

No key is required for artist photos (iTunes Search API is public/unauthenticated).

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md) for the full path from this prototype to a real, deployed, multi-user product — backend, auth, hosting, beta testing, and launch. [`docs/beta-targets.md`](docs/beta-targets.md) has illustrative target benchmarks for that eventual beta (planning goals, not real results).

## License

MIT — see [`LICENSE`](LICENSE).
