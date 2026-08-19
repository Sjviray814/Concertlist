import { createClient } from "@/lib/supabase/server";
import ArtistAvatar from "@/components/ArtistAvatar";

export default async function RankingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: concerts } = await supabase.from("concerts").select("artist, score").eq("user_id", user!.id);

  const grouped = new Map<string, { count: number; total: number }>();
  (concerts ?? []).forEach((c) => {
    const entry = grouped.get(c.artist) ?? { count: 0, total: 0 };
    entry.count += 1;
    entry.total += c.score;
    grouped.set(c.artist, entry);
  });

  const ranked = [...grouped.entries()]
    .map(([artist, { count, total }]) => ({ artist, count, avg: total / count }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <section>
      <div className="mb-3.5">
        <h1 className="display text-2xl">Top Artists</h1>
        <p className="mono text-xs text-text-muted mt-1">RANKED BY YOUR AVERAGE SCORE</p>
      </div>

      {ranked.length === 0 ? (
        <div className="text-center py-12 px-5 text-text-muted">
          <div className="display text-xl text-text-faint mb-2">Nothing ranked yet</div>
          <p className="text-xs leading-relaxed">Log a few shows and your top artists will show up here.</p>
        </div>
      ) : (
        ranked.map((a, i) => (
          <div key={a.artist} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
            <div className="display text-xl text-text-faint w-7 flex-none">{String(i + 1).padStart(2, "0")}</div>
            <ArtistAvatar name={a.artist} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold">{a.artist}</div>
              <div className="mono text-[10.5px] text-text-muted">
                {a.count} SET{a.count > 1 ? "S" : ""} SEEN
              </div>
            </div>
            <div className="mono font-bold text-magenta text-[15px]">{a.avg.toFixed(1)}</div>
          </div>
        ))
      )}
    </section>
  );
}
