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
      <div className="mb-8 text-center animate-screen-in">
        <div className="display text-3xl">
          Concert<span className="text-magenta">List</span>
        </div>
        <p className="mono text-xs text-text-faint mt-1 tracking-wide">EVERY SET, LOGGED &amp; SCORED</p>
      </div>

      <form
        action={login}
        className="bg-bg-elevated border border-border/80 rounded-xl p-6 flex flex-col gap-4 shadow-[0_16px_48px_rgba(0,0,0,0.35)] animate-screen-in"
      >
        <input type="hidden" name="next" value={next || "/sets"} />

        {error && (
          <div role="alert" className="text-xs text-amber bg-amber/10 border border-amber rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="text-xs text-cyan bg-cyan/10 border border-cyan rounded-lg px-3 py-2">
            {notice}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="mono block text-xs text-text-muted mb-1.5">
            EMAIL
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            autoFocus
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-150 focus:border-magenta focus:ring-2 focus:ring-magenta/25"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mono block text-xs text-text-muted mb-1.5">
            PASSWORD
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-150 focus:border-magenta focus:ring-2 focus:ring-magenta/25"
          />
        </div>

        <button
          type="submit"
          className="bg-magenta text-white rounded-lg py-3 text-sm font-semibold mt-2 transition-all duration-150 hover:bg-[#ff529a] hover:shadow-[0_4px_16px_rgba(255,46,122,0.35)] active:scale-[0.98]"
        >
          Log in
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-6">
        New here?{" "}
        <Link href="/signup" className="text-cyan hover:text-[#5fd6ec] transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}
