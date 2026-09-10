"use client";

import { cloneElement, useEffect, useState, type ReactElement } from "react";
import type { Concert, ConcertInput } from "@/lib/supabase/types";

const GENRES = ["Techno", "House", "Electronic", "Downtempo", "Bass", "Indie", "Hip-Hop", "Other"];

const emptyForm: ConcertInput = {
  artist: "",
  venue: "",
  date: new Date().toISOString().slice(0, 10),
  genre: "Techno",
  score: 8,
  notes: "",
};

export default function ConcertFormModal({
  concert,
  onClose,
  onSave,
  onDelete,
}: {
  concert: Concert | null;
  onClose: () => void;
  onSave: (input: ConcertInput) => Promise<{ error?: string }>;
  onDelete?: (id: string) => Promise<{ error?: string }>;
}) {
  const [form, setForm] = useState<ConcertInput>(() =>
    concert
      ? { artist: concert.artist, venue: concert.venue, date: concert.date, genre: concert.genre, score: concert.score, notes: concert.notes }
      : emptyForm,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!form.artist.trim() || !form.venue.trim() || !form.date) {
      setError("Add an artist, venue, and date before saving.");
      return;
    }
    setBusy(true);
    const res = await onSave(form);
    setBusy(false);
    if (res.error) setError(res.error);
    else onClose();
  }

  async function handleDelete() {
    if (!concert || !onDelete) return;
    if (!confirm(`Delete "${concert.artist}" at ${concert.venue}? This can't be undone.`)) return;
    setBusy(true);
    const res = await onDelete(concert.id);
    setBusy(false);
    if (res.error) setError(res.error);
    else onClose();
  }

  const inputClass =
    "w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-150 focus:border-magenta focus:ring-2 focus:ring-magenta/25";

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-20 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="concert-modal-title"
        className="w-full max-w-[var(--shell-width)] bg-bg-elevated rounded-t-3xl px-5 pt-5 pb-6 max-h-[85vh] overflow-y-auto border-t border-border/70 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] animate-sheet-in"
      >
        <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />
        <h2 id="concert-modal-title" className="display text-xl mb-4">
          {concert ? "Edit Show" : "Log a Show"}
        </h2>

        {error && (
          <div role="alert" className="text-xs text-amber bg-amber/10 border border-amber rounded-lg px-3 py-2 mb-3">
            {error}
          </div>
        )}

        <Field id="f-artist" label="ARTIST">
          <input
            className={inputClass}
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            placeholder="e.g. Overmono"
            autoFocus
          />
        </Field>
        <div className="flex gap-2.5 mb-3.5">
          <Field id="f-venue" label="VENUE" className="flex-1">
            <input
              className={inputClass}
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="e.g. Brooklyn Steel"
            />
          </Field>
          <Field id="f-date" label="DATE" className="flex-1">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
        </div>
        <Field id="f-genre" label="GENRE">
          <select className={inputClass} value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
            {GENRES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </Field>
        <Field id="f-score" label="YOUR SCORE">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: parseInt(e.target.value, 10) })}
              className="flex-1 accent-magenta"
              aria-valuetext={`${form.score} out of 10`}
            />
            <div className="mono font-bold text-magenta w-8 text-center" aria-hidden="true">
              {form.score}
            </div>
          </div>
        </Field>
        <Field id="f-notes" label="NOTES (OPTIONAL)">
          <textarea
            className={`${inputClass} min-h-15 resize-y`}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="How was the sound, the crowd, the setlist..."
          />
        </Field>

        {concert && onDelete && (
          <button
            disabled={busy}
            onClick={handleDelete}
            className="w-full border border-magenta text-magenta rounded-lg py-3 text-sm font-semibold mb-2.5 disabled:opacity-50 transition-all duration-150 hover:bg-magenta/10 active:scale-[0.98]"
          >
            Delete this show
          </button>
        )}
        <div className="flex gap-2.5">
          <button
            disabled={busy}
            onClick={onClose}
            className="flex-1 bg-bg-surface border border-border text-text-muted rounded-lg py-3 text-sm font-semibold disabled:opacity-50 transition-all duration-150 hover:text-text-primary active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            onClick={handleSave}
            className="flex-1 bg-magenta text-white rounded-lg py-3 text-sm font-semibold disabled:opacity-50 transition-all duration-150 hover:bg-[#ff529a] hover:shadow-[0_4px_16px_rgba(255,46,122,0.35)] active:scale-[0.98]"
          >
            {concert ? "Save changes" : "Save show"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: ReactElement<{ id?: string }>;
  className?: string;
}) {
  return (
    <div className={`mb-3.5 ${className ?? ""}`}>
      <label htmlFor={id} className="mono block text-[11px] text-text-muted mb-1.5">
        {label}
      </label>
      {cloneElement(children, { id })}
    </div>
  );
}
