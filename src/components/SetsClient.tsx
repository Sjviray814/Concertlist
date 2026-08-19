"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Concert, ConcertInput } from "@/lib/supabase/types";
import TicketStub from "./TicketStub";
import ConcertFormModal from "./ConcertFormModal";
import { createConcert, updateConcert, deleteConcert } from "@/app/(app)/sets/actions";

type Sort = "date" | "score" | "artist";

export default function SetsClient({ concerts }: { concerts: Concert[] }) {
  const router = useRouter();
  const [sort, setSort] = useState<Sort>("date");
  const [genre, setGenre] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Concert | null>(null);

  const genres = useMemo(() => ["All", ...new Set(concerts.map((c) => c.genre))], [concerts]);

  const visible = useMemo(() => {
    const list = genre === "All" ? [...concerts] : concerts.filter((c) => c.genre === genre);
    if (sort === "date") list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sort === "score") list.sort((a, b) => b.score - a.score);
    if (sort === "artist") list.sort((a, b) => a.artist.localeCompare(b.artist));
    return list;
  }, [concerts, genre, sort]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(c: Concert) {
    setEditing(c);
    setModalOpen(true);
  }

  async function handleSave(input: ConcertInput) {
    const res = editing ? await updateConcert(editing.id, input) : await createConcert(input);
    if (!res.error) router.refresh();
    return res;
  }

  async function handleDelete(id: string) {
    const res = await deleteConcert(id);
    if (!res.error) router.refresh();
    return res;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h1 className="display text-2xl">My Sets</h1>
          <p className="mono text-xs text-text-muted mt-1">
            {concerts.length} {concerts.length === 1 ? "show" : "shows"} logged
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-0.5">
        {(["date", "score", "artist"] as Sort[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`mono flex-none text-[11px] px-3 py-1.5 rounded-full border whitespace-nowrap ${
              sort === s ? "bg-magenta border-magenta text-white" : "bg-bg-elevated border-border text-text-muted"
            }`}
          >
            {s === "date" ? "LATEST FIRST" : s === "score" ? "TOP RATED" : "A–Z"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-0.5">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`mono flex-none text-[11px] px-3 py-1.5 rounded-full border whitespace-nowrap ${
              genre === g ? "bg-magenta border-magenta text-white" : "bg-bg-elevated border-border text-text-muted"
            }`}
          >
            {g.toUpperCase()}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-12 px-5 text-text-muted">
          <div className="display text-xl text-text-faint mb-2">No sets yet</div>
          <p className="text-xs leading-relaxed">
            Log your first show with the + button below.
            <br />
            Your list starts here.
          </p>
        </div>
      ) : (
        visible.map((c) => <TicketStub key={c.id} concert={c} onClick={() => openEdit(c)} />)
      )}

      <button
        onClick={openAdd}
        className="fixed w-13 h-13 rounded-full bg-magenta text-white text-2xl flex items-center justify-center shadow-lg z-10"
        style={{
          width: 52,
          height: 52,
          bottom: 86,
          right: "calc((100vw - min(100vw, var(--shell-width))) / 2 + 16px)",
        }}
        title="Log a show"
      >
        +
      </button>

      {modalOpen && (
        <ConcertFormModal
          key={editing?.id ?? "add"}
          concert={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}
