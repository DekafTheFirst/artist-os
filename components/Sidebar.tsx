"use client";

import Link from "next/link";
import {
  LayoutDashboard, BarChart2, Radio, Cpu, ListMusic,
  Settings, Zap, Music2, ArrowUpRight, X,
} from "lucide-react";
import type { NavItem } from "@/lib/data";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { id: "analytics",   label: "Analytics",    icon: BarChart2 },
  { id: "aistudio",    label: "AI Studio",    icon: Cpu },
  { id: "playlisting", label: "Playlisting",  icon: ListMusic },
  { id: "distro",      label: "Distribution", icon: Radio },
  { id: "settings",    label: "Settings",     icon: Settings },
];

interface SidebarProps {
  active: NavItem;
  onClose?: () => void;
  isPending?: boolean;
  startTransition?: (callback: () => void) => void;
}

export function Sidebar({ active, onClose, isPending, startTransition }: SidebarProps) {
  const isStudio = active === "aistudio";

  const handleNavClick = (id: NavItem) => {
    if (startTransition && onClose) {
      startTransition(() => {
        onClose();
      });
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r h-full transition-opacity"
      style={{
        background: "#0c0c0f",
        borderColor: "rgba(255,255,255,0.05)",
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {/* Logo */}
      <div
        className="p-5 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: isStudio
                ? "linear-gradient(135deg,#f97316,#ef4444)"
                : "linear-gradient(135deg,#a855f7,#6366f1)",
            }}
          >
            {isStudio ? <Music2 size={15} /> : <Zap size={15} />}
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight">Artist OS</p>
            <p className="text-[10px] text-white/40">Pro Dashboard</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-white/30
                       hover:text-white hover:bg-white/5 transition-all md:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/${id}`}
            onClick={() => handleNavClick(id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
              active === id
                ? "text-purple-300 font-medium"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            )}
            style={
              active === id
                ? { background: "rgba(168,85,247,0.15)" }
                : undefined
            }
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Teaser */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="rounded-xl p-3 mb-3"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(99,102,241,0.08))",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-1">
            AI Studio Teaser
          </p>
          <p className="text-[11px] text-white/55 mb-2">
            New: Neural vocal cloning is now live.
          </p>
          <Link
            href="/aistudio"
            onClick={() => onClose && onClose()}
            className="text-[11px] text-purple-400 font-medium flex items-center gap-1 hover:text-purple-300"
          >
            Vocal Studio <ArrowUpRight size={10} />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 px-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)" }}
          >
            J
          </div>
          <div>
            <p className="text-xs font-medium">Julian Vox</p>
            <p className="text-[10px] text-white/40">julian@artistos.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
