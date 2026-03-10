"use client";

import { useState } from "react";
import {
  Sparkles, Eye, ChevronDown, Users, TrendingUp,
  RefreshCw, Loader2, CheckCircle, Music2,
} from "lucide-react";
import { MatchBadge } from "@/components/ui/MatchBadge";
import { playlists, type Playlist } from "@/lib/data";

export function Playlisting() {
  const [pitchLoading, setPitchLoading] = useState<number | null>(null);
  const [pitches, setPitches] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  async function handleGeneratePitch(pl: Playlist) {
    setPitchLoading(pl.id);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generate_pitch",
          payload: {
            trackName: "Neon Street",
            playlistName: pl.name,
            curator: pl.curator,
            trackDescription:
              "a late-night atmospheric electronic piece with dreamy synths, slow beats, and a melancholic neon-lit city vibe",
          },
        }),
      });
      const data = await res.json();
      setPitches((prev) => ({ ...prev, [pl.id]: data.text }));
    } catch {
      setPitches((prev) => ({
        ...prev,
        [pl.id]: `"Neon Street" is an atmospheric late-night electronic journey that would complement ${pl.name}'s signature sound perfectly.`,
      }));
    }
    setPitchLoading(null);
  }

  function handleSubmit(id: number) {
    setSubmitted((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">AI Playlisting</h1>
          <p className="text-white/40 text-xs md:text-sm mt-1">
            Scan your track and match with 50,000+ verified curators.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:opacity-90 transition-all flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}
        >
          <Sparkles size={14} /> <span className="hidden sm:inline">Generate AI Pitch</span><span className="sm:hidden">AI Pitch</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-5 md:mb-6">
        <div
          className="flex-1 flex items-center gap-3 px-4 rounded-xl border transition-all hover:border-white/20"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
        >
          <Music2 size={16} className="text-white/30 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent py-3 md:py-3.5 text-sm outline-none text-white/80"
            placeholder="Paste Spotify link or describe your sound..."
          />
        </div>
        <button className="px-5 md:px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all whitespace-nowrap">
          Analyze My Sound
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-6 items-center">
        {[
          { label: "Genre", value: "Electronic" },
          { label: "Mood",  value: "Atmospheric" },
          { label: "Reach", value: "50k+" },
        ].map((f) => (
          <button
            key={f.label}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm text-white/60
                       hover:border-white/20 hover:text-white transition-all"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {f.label}: {f.value} <ChevronDown size={12} />
          </button>
        ))}
        <div className="hidden md:flex ml-auto text-xs text-white/30 items-center gap-1">
          <span className="opacity-50">⊟</span> Sort by: Match Score
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 md:mb-4 font-semibold">
        Top AI Suggested Playlists
      </p>

      {/* Playlist rows */}
      <div className="space-y-3 mb-6 md:mb-8">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="rounded-2xl p-4 md:p-5 border transition-all"
            style={{
              background: pitches[pl.id]
                ? `linear-gradient(135deg, ${pl.color}06, rgba(255,255,255,0.015))`
                : "rgba(255,255,255,0.02)",
              borderColor: pitches[pl.id]
                ? `${pl.color}40`
                : "rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-start gap-3 md:gap-5">
              {/* Cover + badge */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl md:text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${pl.color}40, ${pl.color}18)`,
                  }}
                >
                  {pl.badge}
                </div>
                <div
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center
                             text-[9px] md:text-[10px] font-bold text-white"
                  style={{
                    background: pl.color,
                    boxShadow: `0 0 10px ${pl.color}80`,
                  }}
                >
                  {pl.match}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base">{pl.name}</p>
                <p className="text-xs md:text-sm text-white/40 mb-1.5 md:mb-2">
                  Curated by{" "}
                  <span className="text-white/60">{pl.curator}</span>
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-xs text-white/35">
                  <span className="flex items-center gap-1">
                    <Users size={10} /> {pl.followers}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <TrendingUp size={10} /> {pl.engagement}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw size={10} /> {pl.updated}
                  </span>
                </div>

                {pitches[pl.id] && (
                  <div
                    className="mt-2 md:mt-3 p-2.5 md:p-3 rounded-lg text-xs text-white/55 italic leading-relaxed"
                    style={{
                      background: `${pl.color}0f`,
                      border: `1px solid ${pl.color}28`,
                    }}
                  >
                    <span
                      className="text-[9px] font-bold not-italic uppercase tracking-wider"
                      style={{ color: pl.color }}
                    >
                      ✦ AI Pitch ·{" "}
                    </span>
                    {pitches[pl.id]}
                  </div>
                )}

                {/* Mobile action buttons (below info) */}
                <div className="flex gap-2 mt-3 sm:hidden">
                  {!pitches[pl.id] ? (
                    <button
                      onClick={() => handleGeneratePitch(pl)}
                      disabled={pitchLoading !== null}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium
                                 transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
                    >
                      {pitchLoading === pl.id && <Loader2 size={12} className="animate-spin" />}
                      Generate Pitch
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmit(pl.id)}
                      disabled={submitted[pl.id]}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 disabled:opacity-60"
                      style={{
                        background: submitted[pl.id] ? `${pl.color}22` : `linear-gradient(135deg, ${pl.color}, ${pl.color}99)`,
                        color: submitted[pl.id] ? pl.color : "white",
                      }}
                    >
                      {submitted[pl.id] ? <><CheckCircle size={12} /> Submitted!</> : "Submit Track"}
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop action buttons */}
              <div className="hidden sm:flex gap-2 items-center flex-shrink-0">
                <button
                  className="w-9 h-9 rounded-lg border flex items-center justify-center
                             hover:border-white/20 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <Eye size={15} className="text-cyan-400" />
                </button>

                {!pitches[pl.id] ? (
                  <button
                    onClick={() => handleGeneratePitch(pl)}
                    disabled={pitchLoading !== null}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                               transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
                  >
                    {pitchLoading === pl.id && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Generate Pitch
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit(pl.id)}
                    disabled={submitted[pl.id]}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
                    style={{
                      background: submitted[pl.id]
                        ? `${pl.color}22`
                        : `linear-gradient(135deg, ${pl.color}, ${pl.color}99)`,
                      color: submitted[pl.id] ? pl.color : "white",
                    }}
                  >
                    {submitted[pl.id] ? (
                      <><CheckCircle size={14} /> Submitted!</>
                    ) : (
                      "Submit Track"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div
        className="grid grid-cols-3 rounded-2xl overflow-hidden border"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {[
          { val: "12",   unit: "New Matches Today",   color: "#a855f7" },
          { val: "4.8k", unit: "Total Playlist Reach", color: "#06b6d4" },
          { val: "85%",  unit: "Avg Match Accuracy",   color: "white"   },
        ].map((s, i) => (
          <div
            key={s.unit}
            className="p-4 md:p-6 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
            }}
          >
            <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: s.color }}>
              {s.val}
            </p>
            <p className="text-[9px] md:text-[10px] text-white/30 tracking-widest font-semibold uppercase">
              {s.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
