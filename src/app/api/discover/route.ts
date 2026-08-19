import { NextResponse, type NextRequest } from "next/server";

const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours - keeps repeat searches off Ticketmaster's rate limit
const cache = new Map<string, { expires: number; body: unknown }>();

// Discover works for logged-out visitors, so this proxy is public. A simple per-IP
// rate limit keeps a bot from burning through the shared Ticketmaster daily quota.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many searches — wait a few minutes and try again." }, { status: 429 });
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing TICKETMASTER_API_KEY." }, { status: 500 });
  }

  const keyword = request.nextUrl.searchParams.get("keyword")?.trim() ?? "";
  const city = request.nextUrl.searchParams.get("city")?.trim() ?? "";
  const cacheKey = `${keyword.toLowerCase()}|${city.toLowerCase()}`;

  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.body);
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    classificationName: "music",
    size: "20",
    sort: "date,asc",
  });
  if (keyword) params.set("keyword", keyword);
  if (city) params.set("city", city);

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      const message = data?.fault?.faultstring ?? `Ticketmaster request failed (HTTP ${res.status}).`;
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const events = data._embedded?.events ?? [];
    const body = { events };
    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, body });
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Network error reaching Ticketmaster." }, { status: 502 });
  }
}
