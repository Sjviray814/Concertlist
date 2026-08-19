import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-[var(--shell-width)] min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <div className="display text-3xl">
          Concert<span className="text-magenta">List</span>
        </div>
        <p className="mono text-xs text-text-faint mt-1 tracking-wide">EVERY SET, LOGGED &amp; SCORED</p>
      </div>

      <form action={signup} className="bg-bg-elevated border border-border rounded-xl p-6 flex flex-col gap-4">
        {error && (
          <div className="text-xs text-amber bg-amber/10 border border-amber rounded-lg px-3 py-2">{error}</div>
        )}

        <div>
          <label className="mono block text-xs text-text-muted mb-1.5">USERNAME</label>
          <input
            type="text"
            name="username"
            required
            pattern="[a-zA-Z0-9_]{3,20}"
            title="3-20 characters: letters, numbers, underscore"
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-magenta"
          />
        </div>
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
          Create account
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan">
          Log in
        </Link>
      </p>
    </div>
  );
}
