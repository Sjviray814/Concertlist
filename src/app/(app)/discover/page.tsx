"use client";

import { useState } from "react";
import ArtistAvatar from "@/components/ArtistAvatar";

type Event = {
  name: string;
  url: string;
  dates?: { start?: { localDate?: string } };
  priceRanges?: { min: number }[];
  _embedded?: {
    venues?: { name: string; city?: { name: string } }[];
    attractions?: { name: string }[];
  };
};

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DiscoverPage() {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ keyword, city });
      const res = await fetch(`/api/discover?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Search failed.");
        setEvents([]);
      } else {
        setEvents(data.events);
      }
    } catch {
      setError("Network error — check your connection and try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="mb-3.5">
        <h1 className="display text-2xl">Discover</h1>
        <p className="mono text-xs text-text-muted mt-1">LIVE SEARCH · TICKETMASTER</p>
      </div>

      <div className="flex gap-1.5 mb-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Artist, e.g. Bicep"
          className="flex-[1.3] min-w-0 bg-bg-elevated border border-border rounded-lg px-2.5 py-2.5 text-sm outline-none focus:border-magenta"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="City (optional)"
          className="flex-1 min-w-0 bg-bg-elevated border border-border rounded-lg px-2.5 py-2.5 text-sm outline-none focus:border-magenta"
        />
        <button onClick={search} className="flex-none bg-cyan text-bg-deep rounded-lg px-3.5 py-2 text-xs font-bold">
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center py-10 text-text-muted text-xs">Searching live listings…</div>
      )}

      {!loading && error && (
        <div className="text-center py-10 px-5 text-text-muted">
          <div className="display text-xl text-text-faint mb-2">Search failed</div>
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}

      {!loading && !error && events === null && (
        <div className="text-center py-10 px-5 text-text-muted">
          <div className="display text-xl text-text-faint mb-2">Search for a show</div>
          <p className="text-xs leading-relaxed">Search an artist or city to pull real, live listings from Ticketmaster.</p>
        </div>
      )}

      {!loading && !error && events?.length === 0 && (
        <div className="text-center py-10 px-5 text-text-muted">
          <div className="display text-xl text-text-faint mb-2">No shows found</div>
          <p className="text-xs leading-relaxed">Try a different artist or city.</p>
        </div>
      )}

      {!loading &&
        events?.map((ev, i) => {
          const venue = ev._embedded?.venues?.[0];
          const venueName = venue ? venue.name + (venue.city?.name ? ", " + venue.city.name : "") : "Venue TBA";
          const localDate = ev.dates?.start?.localDate;
          const dateStr = localDate ? fmtDate(localDate) : "Date TBA";
          const price = ev.priceRanges?.[0];
          const priceText = price ? `from $${Math.round(price.min)}` : "See pricing on site";
          const artistName = ev._embedded?.attractions?.[0]?.name ?? ev.name;

          return (
            <div key={i} className="flex items-center gap-3 bg-bg-elevated border border-border rounded-xl px-4 py-3.5 mb-3">
              <ArtistAvatar name={artistName} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold m-0 mb-0.5">{ev.name}</p>
                <div className="mono text-[11px] text-text-muted">
                  {venueName}
                  <br />
                  {dateStr}
                </div>
                <div className="mono text-[11px] text-amber mt-1.5">{priceText}</div>
              </div>
              <a
                href={ev.url}
                target="_blank"
                rel="noopener"
                className="flex-none bg-magenta text-white rounded-full px-4 py-2 text-[11px] font-semibold no-underline"
              >
                Get tickets
              </a>
            </div>
          );
        })}
    </section>
  );
}
