"use client";

import { useState } from "react";

interface FxToggleProps {
  name: string;
  defaultOn?: boolean;
}

export function FxToggle({ name, defaultOn = false }: FxToggleProps) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div
      className="rounded-xl p-4 border transition-all"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: on ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-widest text-white/50">
          {name}
        </span>
        <button
          onClick={() => setOn(!on)}
          className="relative w-10 h-5 rounded-full transition-all focus:outline-none"
          style={{ background: on ? "#f97316" : "rgba(255,255,255,0.1)" }}
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
            style={{ left: on ? "calc(100% - 18px)" : "2px" }}
          />
        </button>
      </div>
      <div
        className="h-1 rounded-full transition-all"
        style={{
          background: on
            ? "linear-gradient(to right, #f97316, rgba(249,115,22,0.3))"
            : "rgba(255,255,255,0.06)",
          width: on ? "70%" : "35%",
        }}
      />
    </div>
  );
}
