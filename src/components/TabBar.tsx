"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/sets", label: "MY SETS" },
  { href: "/rankings", label: "RANKINGS" },
  { href: "/discover", label: "DISCOVER" },
  { href: "/compare", label: "COMPARE" },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 flex bg-bg-surface border-t border-border z-10">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 pb-3 text-[10px] ${
              active ? "text-magenta" : "text-text-faint"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
