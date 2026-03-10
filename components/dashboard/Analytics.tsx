"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { streamingData, topTracks, platformBreakdown } from "@/lib/data";

export function Analytics() {
  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full">
      <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Analytics</h1>
      <p className="text-white/40 text-xs md:text-sm mb-6 md:mb-8">Deep dive into your streaming performance</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Top Tracks */}
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm text-white/50 mb-5 uppercase tracking-widest font-semibold">
            Top Tracks
          </h3>
          <div className="space-y-4">
            {topTracks.map((t, i) => (
              <div key={t.title} className="flex items-center gap-3">
                <span className="text-white/20 text-sm w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-white/30">{t.mood}</p>
                </div>
                <span className="text-sm text-white/50">{t.plays}</span>
                <span
                  className="text-xs font-semibold w-12 text-right"
                  style={{ color: t.trend.startsWith("+") ? "#10b981" : "#ef4444" }}
                >
                  {t.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm text-white/50 mb-5 uppercase tracking-widest font-semibold">
            Platform Breakdown
          </h3>
          <div className="space-y-4">
            {platformBreakdown.map((p) => (
              <div key={p.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{p.name}</span>
                  <span className="text-white/40">{p.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.pct}%`, background: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Area Chart */}
      <div
        className="rounded-2xl p-6 border"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm text-white/50 mb-5 uppercase tracking-widest font-semibold">
          Weekly Overview
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={streamingData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone" dataKey="streams"
              stroke="#a855f7" strokeWidth={2.5}
              fill="url(#ag2)" dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
