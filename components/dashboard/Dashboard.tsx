"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Calendar, ArrowUpRight } from "lucide-react";

import { KpiCard } from "@/components/ui/KpiCard";
import {
  streamingData, playlists,
  sparklineStreams, sparklineListeners, sparklineRoyalties,
} from "@/lib/data";

interface DashboardProps {
  onNavigate: (page: string) => void;
  // ...any other existing props
}


export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-white/40 text-xs md:text-sm mt-1">
            Real-time performance across all streaming platforms
          </p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button
            className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border text-sm text-white/60
                       hover:text-white hover:border-white/20 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <Calendar size={14} /> <span className="hidden md:inline">Last 30 Days</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium
                       hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
          >
            <Download size={14} /> <span className="hidden sm:inline">Export Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
        <KpiCard
          label="Total Streams" value="1,248,902" change="+12.5%"
          sparkData={sparklineStreams} color="#a855f7"
        />
        <KpiCard
          label="Monthly Listeners" value="84,512" change="+5.2%"
          sparkData={sparklineListeners} color="#06b6d4"
        />
        <KpiCard
          label="Royalty Balance" value="$12,450.00" change="+8.1%"
          sparkData={sparklineRoyalties} color="#10b981"
        />
      </div>

      {/* Streaming Trends Chart */}
      <div
        className="rounded-2xl p-4 md:p-6 border mb-5 md:mb-6"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 md:mb-6 gap-2">
          <div>
            <h2 className="text-base md:text-lg font-semibold">Streaming Trends</h2>
            <p className="text-white/40 text-xs md:text-sm">Spotify Performance over the last 30 days</p>
          </div>
          <div className="flex gap-4 md:gap-5 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              Daily Streams
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              Listeners
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={streamingData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="gradStreams" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradListeners" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false} tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />
            <Area
              type="monotone" dataKey="streams"
              stroke="#a855f7" strokeWidth={2.5}
              fill="url(#gradStreams)" dot={false}
            />
            <Area
              type="monotone" dataKey="listeners"
              stroke="#06b6d4" strokeWidth={2}
              strokeDasharray="6 3"
              fill="url(#gradListeners)" dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Target Playlists */}
      <div>
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-semibold">Target Playlists</h2>
          <button
            onClick={() => onNavigate("playlisting")}
            className="text-xs md:text-sm text-purple-400 flex items-center gap-1 hover:text-purple-300 transition-colors"
          >
            View All <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => onNavigate("playlisting")}
              className="rounded-xl p-3 border flex items-center gap-2 md:gap-3 hover:border-white/10 transition-all text-left"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-lg md:text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${pl.color}30, ${pl.color}10)`,
                  border: `1px solid ${pl.color}40`,
                }}
              >
                {pl.badge}
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">{pl.name}</p>
                <p className="text-[10px] md:text-xs text-white/40">{pl.tag}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
