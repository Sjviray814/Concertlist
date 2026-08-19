import type { Concert } from "@/lib/supabase/types";
import ArtistAvatar from "./ArtistAvatar";
import ScoreStamp from "./ScoreStamp";

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TicketStub({ concert, onClick }: { concert: Concert; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex bg-bg-elevated rounded-[10px] mb-3.5 overflow-hidden relative border border-border cursor-pointer hover:border-text-faint transition-colors"
    >
      <div className="flex-1 py-3.5 px-4 min-w-0">
        <div className="flex items-center gap-2.5 mb-2">
          <ArtistAvatar name={concert.artist} />
          <p className="text-base font-bold m-0 leading-tight">{concert.artist}</p>
        </div>
        <p className="text-xs text-text-muted mb-2">{concert.venue}</p>
        <div className="mono text-[10.5px] text-text-faint">{fmtDate(concert.date)}</div>
        <span className="mono inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-bg-elevated-2 text-cyan">
          {concert.genre.toUpperCase()}
        </span>
      </div>
      <div className="w-0 relative flex-none border-l-2 border-dashed border-border">
        <div className="absolute w-3.5 h-3.5 bg-bg-surface rounded-full -left-2 -top-1.5" />
        <div className="absolute w-3.5 h-3.5 bg-bg-surface rounded-full -left-2 -bottom-1.5" />
      </div>
      <div className="flex-none w-19 flex items-center justify-center p-2.5" style={{ width: 76 }}>
        <ScoreStamp score={concert.score} />
      </div>
    </div>
  );
}
