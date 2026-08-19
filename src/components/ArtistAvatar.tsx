"use client";

import { useEffect, useState } from "react";

const cache = new Map<string, string | null>();

async function getArtistImage(name: string): Promise<string | null> {
  const key = name.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
  try {
    const res = await fetch("https://itunes.apple.com/search?media=music&limit=5&term=" + encodeURIComponent(name));
    if (!res.ok) {
      cache.set(key, null);
      return null;
    }
    const data = await res.json();
    const results = data.results || [];
    const match = results.find((r: { artistName?: string }) => r.artistName?.trim().toLowerCase() === key) || results[0];
    let url: string | null = match?.artworkUrl100 ?? null;
    if (url) url = url.replace("100x100", "300x300");
    cache.set(key, url);
    return url;
  } catch {
    cache.set(key, null);
    return null;
  }
}

export default function ArtistAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getArtistImage(name).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  return (
    <div
      className="rounded-full flex-none overflow-hidden bg-bg-elevated-2 flex items-center justify-center display text-text-muted"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
