import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TabBar from "@/components/TabBar";
import { logout } from "./actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
    username = profile?.username ?? null;
  }

  return (
    <div className="w-full max-w-[var(--shell-width)] min-h-screen bg-bg-surface flex flex-col border-x border-border/70 shadow-[0_0_120px_rgba(0,0,0,0.5)]">
      <header className="px-5 pt-5 pb-4 flex items-baseline justify-between border-b border-border/70 sticky top-0 bg-bg-surface/85 backdrop-blur-md z-10">
        <div>
          <div className="display text-xl flex items-baseline gap-0.5">
            Concert<span className="text-magenta">List</span>
          </div>
          <div className="mono text-[10px] text-text-faint tracking-wide mt-0.5">
            {username ? `@${username}` : "browsing as guest"}
          </div>
        </div>
        {user ? (
          <form action={logout}>
            <button
              className="mono text-[10px] text-text-faint hover:text-text-primary transition-colors duration-200 tracking-wide"
              type="submit"
            >
              LOG OUT
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="mono text-[10px] text-cyan hover:text-[#5fd6ec] transition-colors duration-200 tracking-wide"
          >
            LOG IN
          </Link>
        )}
      </header>

      <main className="flex-1 px-4 pt-4 pb-24 overflow-y-auto animate-screen-in">{children}</main>

      <TabBar />
    </div>
  );
}
