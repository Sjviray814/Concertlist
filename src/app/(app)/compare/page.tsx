import { createClient } from "@/lib/supabase/server";

const COLORS = ["#FF2E7A", "#FFB627", "#3EC6E0"];

export default async function ComparePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: leaderboard } = await supabase
    .from("leaderboard")
    .select("*")
    .order("show_count", { ascending: false })
    .limit(25);

  return (
    <section>
      <div className="mb-3.5">
        <h1 className="display text-2xl">Compare</h1>
        <p className="mono text-xs text-text-muted mt-1">MOST SETS LOGGED, ALL USERS</p>
      </div>

      {!leaderboard || leaderboard.length === 0 ? (
        <div className="text-center py-12 px-5 text-text-muted">
          <div className="display text-xl text-text-faint mb-2">No one yet</div>
          <p className="text-xs leading-relaxed">Be the first to log a show.</p>
        </div>
      ) : (
        leaderboard.map((row, i) => (
          <div key={row.user_id} className="flex items-center gap-3 px-3.5 py-3 bg-bg-elevated rounded-xl mb-2.5 border border-border">
            <div
              className="w-9 h-9 rounded-full flex-none flex items-center justify-center display text-sm text-bg-deep"
              style={{ background: COLORS[i % COLORS.length] }}
            >
              {(row.display_name || row.username).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold">
                {row.display_name || row.username}{" "}
                {row.user_id === user!.id && (
                  <span className="mono text-[9px] bg-magenta text-white px-1.5 py-0.5 rounded ml-1">YOU</span>
                )}
              </div>
              <div className="mono text-[10.5px] text-text-muted">
                {row.show_count} shows &middot; avg {Number(row.avg_score).toFixed(1)}
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
