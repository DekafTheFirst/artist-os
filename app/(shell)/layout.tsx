"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import type { NavItem } from "@/lib/data";

function getNavItemFromPath(pathname: string): NavItem {
  const segments = pathname.split("/").filter(Boolean);
  const page = segments[0] as NavItem;
  const validPages: NavItem[] = ["dashboard", "analytics", "playlisting", "aistudio", "distro", "settings"];
  return validPages.includes(page) ? page : "dashboard";
}

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = getNavItemFromPath(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#09090b" }}>
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar active={active} isPending={isPending} startTransition={startTransition} />
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
            <Sidebar 
              active={active} 
              onClose={() => setMobileMenuOpen(false)}
              isPending={isPending}
              startTransition={startTransition}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <MobileNav
          active={active}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page content with fade transition */}
        <main className="flex-1 overflow-hidden" style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 150ms ease-in-out" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
