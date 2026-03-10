"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Dashboard } from "./dashboard/Dashboard";
import { Analytics } from "./dashboard/Analytics";
import { Playlisting } from "./playlisting/Playlisting";
import { AIStudio } from "./aistudio/AIStudio";
import type { NavItem } from "@/lib/data";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/20">
      <div className="text-6xl mb-4">
        {label === "distro" ? "📡" : "⚙️"}
      </div>
      <p className="text-lg font-medium capitalize">{label}</p>
      <p className="text-sm mt-1">Coming soon</p>
    </div>
  );
}

export function ArtistOSShell() {
  const [active, setActive] = useState<NavItem>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function navigate(id: NavItem) {
    setActive(id);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#09090b" }}>
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar active={active} onNavigate={navigate} />
      </div>

      {/* Mobile slide-in drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* drawer */}
          <div className="absolute left-0 top-0 h-full w-72 z-10">
            <Sidebar active={active} onNavigate={navigate} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <MobileNav
          active={active}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onNavigate={navigate}
        />

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {active === "dashboard"   && <Dashboard   onNavigate={navigate} />}
          {active === "analytics"   && <Analytics />}
          {active === "playlisting" && <Playlisting />}
          {active === "aistudio"    && <AIStudio />}
          {active === "distro"      && <ComingSoon label="distro" />}
          {active === "settings"    && <ComingSoon label="settings" />}
        </main>
      </div>
    </div>
  );
}
