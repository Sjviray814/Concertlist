"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/sets",
    label: "MY SETS",
    icon: (
      <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
    ),
  },
  {
    href: "/rankings",
    label: "RANKINGS",
    icon: (
      <path d="M8 20V10M14 20V4M20 20v-7M2 20h20" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/discover",
    label: "DISCOVER",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: "/compare",
    label: "COMPARE",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c0-3 3-5 7-5s7 2 7 5" strokeLinecap="round" />
        <circle cx="17" cy="8" r="2.5" />
        <path d="M16 15c2.5.3 4.5 1.8 5 4" strokeLinecap="round" />
      </>
    ),
  },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 flex bg-bg-surface/85 backdrop-blur-md border-t border-border/70 z-10">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 pb-3 text-[10px] transition-colors duration-200 ${
              active ? "text-magenta" : "text-text-faint hover:text-text-muted"
            }`}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-magenta shadow-[0_0_8px_rgba(255,46,122,0.7)]" />
            )}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              {tab.icon}
            </svg>
            <span className="mono tracking-wide">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
