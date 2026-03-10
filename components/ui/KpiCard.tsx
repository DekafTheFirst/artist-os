"use client";

import { Sparkline } from "./Sparkline";

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  sparkData: number[];
  color: string;
}

export function KpiCard({ label, value, change, sparkData, color }: KpiCardProps) {
  return (
    <div
      className="rounded-2xl p-5 border relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        borderColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 85% 15%, ${color}, transparent 60%)`,
        }}
      />

      <div className="flex justify-between items-start mb-3">
        <p className="text-sm text-white/50">{label}</p>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: "#10b981", background: "rgba(16,185,129,0.15)" }}
        >
          {change}
        </span>
      </div>

      <p className="text-3xl font-bold tracking-tight mb-4">{value}</p>

      <Sparkline data={sparkData} color={color} />
    </div>
  );
}
