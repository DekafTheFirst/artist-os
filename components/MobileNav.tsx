"use client";

import Link from "next/link";
import { Menu, LayoutDashboard, BarChart2, ListMusic, Cpu, Zap } from "lucide-react";
import type { NavItem } from "@/lib/data";
import { cn } from "@/lib/utils";

const BOTTOM_TABS: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",   label: "Home",      icon: LayoutDashboard },
  { id: "analytics",   label: "Analytics", icon: BarChart2 },
  { id: "playlisting", label: "Playlist",  icon: ListMusic },
  { id: "aistudio",    label: "Lyric Transcriber",    icon: Cpu },
];

const PAGE_TITLES: Record<NavItem, string> = {
  dashboard:   "Analytics Overview",
  analytics:   "Analytics",
  playlisting: "AI Playlisting",
  aistudio:    "AI Lyric Transcriber",
  distro:      "Distribution",
  settings:    "Settings",
};

interface MobileNavProps {
  active: NavItem;
  onOpenMenu: () => void;
}

export function MobileNav({ active, onOpenMenu }: MobileNavProps) {
  return (
    <>
      {/* Top bar — mobile only */}
      <header
        className="flex md:hidden items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ background: "#0c0c0f", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={onOpenMenu}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50
                     hover:text-white hover:bg-white/5 transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
          >
            <Zap size={13} />
          </div>
          <span className="font-semibold text-sm">{PAGE_TITLES[active]}</span>
        </div>

        {/* Placeholder to center the title */}
        <div className="w-9" />
      </header>

      {/* Bottom tab bar — mobile only */}
      <nav
        className="flex md:hidden items-center justify-around border-t flex-shrink-0 safe-bottom"
        style={{
          background: "#0c0c0f",
          borderColor: "rgba(255,255,255,0.06)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {BOTTOM_TABS.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/${id}`}
            className={cn(
              "flex flex-col items-center gap-1 py-3 px-4 transition-all flex-1",
              active === id ? "text-purple-400" : "text-white/30"
            )}
          >
            <Icon size={20} strokeWidth={active === id ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
