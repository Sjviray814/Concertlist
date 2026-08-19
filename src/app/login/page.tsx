import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const { error, notice, next } = await searchParams;

  return (
    <div className="w-full max-w-[var(--shell-width)] min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <div className="display text-3xl">
          Concert<span className="text-magenta">List</span>
        </div>
        <p className="mono text-xs text-text-faint mt-1 tracking-wide">EVERY SET, LOGGED &amp; SCORED</p>
      </div>

      <form action={login} className="bg-bg-elevated border border-border rounded-xl p-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={next || "/sets"} />

        {error && (
          <div className="text-xs text-amber bg-amber/10 border border-amber rounded-lg px-3 py-2">{error}</div>
        )}
        {notice && (
          <div className="text-xs text-cyan bg-cyan/10 border border-cyan rounded-lg px-3 py-2">{notice}</div>
        )}

        <div>
          <label className="mono block text-xs text-text-muted mb-1.5">EMAIL</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-magenta"
          />
        </div>
        <div>
          <label className="mono block text-xs text-text-muted mb-1.5">PASSWORD</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-magenta"
          />
        </div>

        <button type="submit" className="bg-magenta text-white rounded-lg py-3 text-sm font-semibold mt-2 hover:bg-[#ff529a]">
          Log in
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-6">
        New here?{" "}
        <Link href="/signup" className="text-cyan">
          Create an account
        </Link>
      </p>
    </div>
  );
}
