"use client";

import { useState } from "react";
import {
  Sparkles,
  Eye,
  ChevronDown,
  Users,
  TrendingUp,
  RefreshCw,
  Loader2,
  CheckCircle,
  Music2,
  X,
  AlertCircle,
} from "lucide-react";
import { playlists, type Playlist } from "@/lib/data";

interface PlaylistDetailsModalProps {
  playlist: Playlist;
  onClose: () => void;
}

function PlaylistDetailsModal({
  playlist,
  onClose,
}: PlaylistDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-md w-full border"
        style={{ borderColor: `${playlist.color}40` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={20} className="text-white/60" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${playlist.color}40, ${playlist.color}18)`,
              }}
            >
              {playlist.badge}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{playlist.name}</h2>
              <p className="text-sm text-white/60">By {playlist.curator}</p>
              <div
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{
                  background: `${playlist.color}40`,
                  color: playlist.color,
                }}
              >
                {playlist.match}% Match
              </div>
            </div>
          </div>

          <div
            className="space-y-3 mb-6 pb-6 border-b"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Followers</span>
              <span className="font-semibold">{playlist.followers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Engagement</span>
              <span className="font-semibold text-green-400">
                {playlist.engagement}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Last Updated</span>
              <span className="font-semibold">{playlist.updated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Playlist Type</span>
              <span className="font-semibold">{playlist.tag}</span>
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">
              About
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              {playlist.name} is curated by {playlist.curator} and features
              high-quality{" "}
              {playlist.name.toLowerCase().includes("neon")
                ? "electronic"
                : "atmospheric"}{" "}
              tracks with strong listener engagement.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border font-medium transition-all"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Close
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{
                background: `linear-gradient(135deg, ${playlist.color}, ${playlist.color}99)`,
              }}
            >
              View on Spotify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnalysisModalProps {
  isOpen: boolean;
  input: string;
  loading: boolean;
  results: {
    trackName: string;
    genre: string;
    mood: string;
    description: string;
  } | null;
  step: "input" | "results";
  onInputChange: (value: string) => void;
  onAnalyze: () => void;
  onClose: () => void;
  onApplyResults: () => void;
  onBack: () => void;
}

function AnalysisModal({
  isOpen,
  input,
  loading,
  results,
  step,
  onInputChange,
  onAnalyze,
  onClose,
  onApplyResults,
  onBack,
}: AnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-2xl w-full border"
        style={{ borderColor: "rgba(99,102,241,0.4)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={20} className="text-white/60" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">Analyze Your Sound</h2>
          <p className="text-white/60 text-sm mb-6">
            Paste a Spotify link or describe your track to find matching
            playlists
          </p>

          {step === "input" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                  Spotify Link or Description
                </label>
                <textarea
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Paste a Spotify link or describe your track (e.g., 'Electronic, chill ambient vibes, atmospheric synths')"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/20 resize-none"
                  rows={4}
                />
              </div>

              <button
                onClick={onAnalyze}
                disabled={!input.trim() || loading}
                className="w-full px-4 py-3 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? "rgba(99,102,241,0.3)"
                    : "linear-gradient(135deg,#6366f1,#a855f7)",
                  opacity: !input.trim() || loading ? 0.5 : 1,
                }}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Analyzing..." : "Analyze My Sound"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.3)",
                  }}
                >
                  <h3 className="font-semibold text-lg mb-4">
                    Analysis Results
                  </h3>

                  {results && (
                    <div className="space-y-3">
                      {results.trackName && (
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">
                            Track Name
                          </p>
                          <p className="text-white text-sm font-medium">
                            {results.trackName}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">
                            Detected Genre
                          </p>
                          <div
                            className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{
                              background: "rgba(99,102,241,0.3)",
                              borderLeft: "3px solid #6366f1",
                            }}
                          >
                            {results.genre === "all"
                              ? "Not specific"
                              : results.genre}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">
                            Detected Mood
                          </p>
                          <div
                            className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{
                              background: "rgba(168,85,247,0.3)",
                              borderLeft: "3px solid #a855f7",
                            }}
                          >
                            {results.mood === "all"
                              ? "Not specific"
                              : results.mood}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">
                          Your Description
                        </p>
                        <p className="text-white/70 text-sm italic">
                          {results.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="flex gap-2 p-3 rounded-lg"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.3)",
                  }}
                >
                  <CheckCircle
                    size={16}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-green-300">
                    Filters will automatically update when you apply these
                    results
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onBack}
                  className="flex-1 px-4 py-2.5 rounded-lg border font-medium transition-all"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={onApplyResults}
                  className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all"
                  style={{
                    background: "linear-gradient(135deg,#06b6d4,#6366f1)",
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mockSpotifyTracks = [
  {
    trackName: "Midnight Dreams",
    genre: "Electronic",
    mood: "Atmospheric",
    description: "Synth-driven ambient track with ethereal soundscapes",
  },
  {
    trackName: "Electric Heartbeat",
    genre: "Electronic",
    mood: "Energetic",
    description: "High-energy dance track with pulsing beats",
  },
  {
    trackName: "Velvet Nights",
    genre: "Indie",
    mood: "Chill",
    description: "Smooth indie track perfect for late-night listening",
  },
  {
    trackName: "Neon Shadows",
    genre: "Ambient",
    mood: "Dark",
    description: "Moody atmospheric piece with cinematic undertones",
  },
];

export function Playlisting() {
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [analyzeInput, setAnalyzeInput] = useState("");
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState<"input" | "results">("input");
  const [analysisResults, setAnalysisResults] = useState<{
    trackName: string;
    genre: string;
    mood: string;
    description: string;
  } | null>(null);
  const [pitchLoading, setPitchLoading] = useState<number | null>(null);
  const [pitches, setPitches] = useState<Record<number, string>>({});
  const [editingPitch, setEditingPitch] = useState<number | null>(null);
  const [firstPitchId, setFirstPitchId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedReach, setSelectedReach] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<
    "genre" | "mood" | "reach" | null
  >(null);

  const genres = ["all", "Electronic", "Indie", "Hip-Hop", "Ambient"];
  const moods = ["all", "Atmospheric", "Energetic", "Chill", "Dark"];
  const reaches = ["all", "50k+", "100k+", "250k+", "500k+"];

  const filteredPlaylists = playlists.filter((pl) => {
    const matchesSearch =
      pl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.curator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === "all" ||
      (selectedGenre === "Electronic" && pl.id <= 2) ||
      (selectedGenre === "Indie" && pl.id === 3) ||
      (selectedGenre === "Hip-Hop" && pl.id === 4) ||
      (selectedGenre === "Ambient" && pl.id === 1);

    const matchesMood =
      selectedMood === "all" ||
      (selectedMood === "Atmospheric" && pl.id === 1) ||
      (selectedMood === "Energetic" && pl.id === 2) ||
      (selectedMood === "Chill" && pl.id === 3) ||
      (selectedMood === "Dark" && pl.id === 4);

    const matchesReach =
      selectedReach === "all" ||
      (selectedReach === "50k+" && pl.id >= 1) ||
      (selectedReach === "100k+" && pl.id >= 2) ||
      (selectedReach === "250k+" && pl.id === 3) ||
      (selectedReach === "500k+" && pl.id === 3);

    return matchesSearch && matchesGenre && matchesMood && matchesReach;
  });

  function handleGeneratePitch(pl: Playlist) {
    setPitchLoading(pl.id);
    
    // Simple static pitch without AI
    const pitch = `"Neon Street" would be a great fit for ${pl.name}. The track's atmospheric production and strong melodic hooks align perfectly with the playlist's editorial standards.`;
    
    setPitches((prev) => ({ ...prev, [pl.id]: pitch }));
    setPitchLoading(null);

    if (firstPitchId === null) {
      setFirstPitchId(pl.id);
    }
  }

  function handleReusePitch(pl: Playlist) {
    if (firstPitchId && pitches[firstPitchId]) {
      setPitches((prev) => ({ ...prev, [pl.id]: pitches[firstPitchId] }));
    }
  }

  function handleSubmit(id: number) {
    setSubmitted((prev) => ({ ...prev, [id]: true }));
  }

  async function handleAnalyzeSound() {
    if (!analyzeInput.trim()) return;

    setAnalyzeLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "analyze_sound",
          payload: { input: analyzeInput },
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      const analysis = data.analysis || generateMockAnalysis(analyzeInput);
      setAnalysisResults(analysis);
      setAnalyzeStep("results");
    } catch {
      const mockAnalysis = generateMockAnalysis(analyzeInput);
      setAnalysisResults(mockAnalysis);
      setAnalyzeStep("results");
    }

    setAnalyzeLoading(false);
  }

  function isSpotifyLink(input: string): boolean {
    return input.includes("spotify.com") || input.includes("spotify:");
  }

  function generateMockAnalysis(input: string) {
    if (isSpotifyLink(input)) {
      const randomTrack =
        mockSpotifyTracks[Math.floor(Math.random() * mockSpotifyTracks.length)];

      return {
        trackName: randomTrack.trackName,
        genre: randomTrack.genre,
        mood: randomTrack.mood,
        description: randomTrack.description,
      };
    }

    const genreMap: Record<string, string> = {
      electronic: "Electronic",
      ambient: "Ambient",
      indie: "Indie",
      hip: "Hip-Hop",
      hiphop: "Hip-Hop",
      rap: "Hip-Hop",
    };

    const moodMap: Record<string, string> = {
      chill: "Chill",
      energetic: "Energetic",
      dark: "Dark",
      atmospheric: "Atmospheric",
      mellow: "Chill",
      upbeat: "Energetic",
      moody: "Dark",
    };

    const lowerInput = input.toLowerCase();
    let detectedGenre = "all";
    let detectedMood = "all";

    for (const [key, value] of Object.entries(genreMap)) {
      if (lowerInput.includes(key)) {
        detectedGenre = value;
        break;
      }
    }

    for (const [key, value] of Object.entries(moodMap)) {
      if (lowerInput.includes(key)) {
        detectedMood = value;
        break;
      }
    }

    return {
      trackName: "",
      genre: detectedGenre,
      mood: detectedMood,
      description: input,
    };
  }

  function handleAnalyzeApply() {
    if (analysisResults) {
      setSelectedGenre(
        analysisResults.genre === "all" ? "all" : analysisResults.genre
      );
      setSelectedMood(
        analysisResults.mood === "all" ? "all" : analysisResults.mood
      );
    }

    setAnalyzeModalOpen(false);
    setAnalyzeInput("");
    setAnalyzeStep("input");
    setAnalysisResults(null);
  }

  function handleAnalyzeBack() {
    setAnalyzeStep("input");
    setAnalysisResults(null);
  }

  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            AI Playlisting
          </h1>
          <p className="text-white/40 text-xs md:text-sm mt-1">
            Scan your track and match with 50,000+ verified curators.
          </p>
        </div>


      </div>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-5 md:mb-6">
        <div
          className="flex-1 flex items-center gap-3 px-4 rounded-xl border transition-all hover:border-white/20"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Music2 size={16} className="text-white/30 flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent py-3 md:py-3.5 text-sm outline-none text-white/80 placeholder-white/40"
            placeholder="Search playlists or curators..."
          />
        </div>

        <button
          onClick={() => {
            setAnalyzeModalOpen(true);
            setAnalysisResults(null);
            setAnalyzeInput("");
            setAnalyzeStep("input");
          }}
          disabled={analyzeLoading}
          className="px-5 md:px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all whitespace-nowrap disabled:opacity-50"
        >
          Analyze My Sound
        </button>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-6 items-center">
        <div className="relative">
          <button
            onMouseEnter={() => setOpenDropdown("genre")}
            onMouseLeave={() => setOpenDropdown(null)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm transition-all"
            style={{
              borderColor:
                selectedGenre !== "all"
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
              color:
                selectedGenre !== "all"
                  ? "rgba(99,102,241,1)"
                  : "rgba(255,255,255,0.6)",
            }}
          >
            Genre: {selectedGenre === "all" ? "All" : selectedGenre}{" "}
            <ChevronDown size={12} />
          </button>

          <div
            onMouseEnter={() => setOpenDropdown("genre")}
            onMouseLeave={() => setOpenDropdown(null)}
            className={`absolute left-0 pt-2 w-40 bg-slate-900 rounded-lg border border-white/10 z-20 py-1 transition-opacity ${openDropdown === "genre" ? "block" : "hidden"
              }`}
          >
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGenre(g);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-all ${selectedGenre === g
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
              >
                {g === "all" ? "All Genres" : g}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            onMouseEnter={() => setOpenDropdown("mood")}
            onMouseLeave={() => setOpenDropdown(null)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm transition-all"
            style={{
              borderColor:
                selectedMood !== "all"
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
              color:
                selectedMood !== "all"
                  ? "rgba(99,102,241,1)"
                  : "rgba(255,255,255,0.6)",
            }}
          >
            Mood: {selectedMood === "all" ? "All" : selectedMood}{" "}
            <ChevronDown size={12} />
          </button>

          <div
            onMouseEnter={() => setOpenDropdown("mood")}
            onMouseLeave={() => setOpenDropdown(null)}
            className={`absolute left-0 pt-2 w-40 bg-slate-900 rounded-lg border border-white/10 z-20 py-1 transition-opacity ${openDropdown === "mood" ? "block" : "hidden"
              }`}
          >
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMood(m);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-all ${selectedMood === m
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
              >
                {m === "all" ? "All Moods" : m}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            onMouseEnter={() => setOpenDropdown("reach")}
            onMouseLeave={() => setOpenDropdown(null)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm transition-all"
            style={{
              borderColor:
                selectedReach !== "all"
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
              color:
                selectedReach !== "all"
                  ? "rgba(99,102,241,1)"
                  : "rgba(255,255,255,0.6)",
            }}
          >
            Reach: {selectedReach === "all" ? "All" : selectedReach}{" "}
            <ChevronDown size={12} />
          </button>

          <div
            onMouseEnter={() => setOpenDropdown("reach")}
            onMouseLeave={() => setOpenDropdown(null)}
            className={`absolute left-0 pt-2 w-40 bg-slate-900 rounded-lg border border-white/10 z-20 py-1 transition-opacity ${openDropdown === "reach" ? "block" : "hidden"
              }`}
          >
            {reaches.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedReach(r);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-all ${selectedReach === r
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
              >
                {r === "all" ? "All Reaches" : r}
              </button>
            ))}
          </div>
        </div>

        {(selectedGenre !== "all" ||
          selectedMood !== "all" ||
          selectedReach !== "all") && (
            <button
              onClick={() => {
                setSelectedGenre("all");
                setSelectedMood("all");
                setSelectedReach("all");
              }}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border text-xs md:text-sm transition-all"
              style={{
                borderColor: "rgba(239,68,68,0.5)",
                color: "rgba(239,68,68,1)",
              }}
            >
              Clear Filters
            </button>
          )}

        <div className="hidden md:flex ml-auto text-xs text-white/30 items-center gap-1">
          <span className="opacity-50">↓</span> {filteredPlaylists.length}{" "}
          playlists
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 md:mb-4 font-semibold">
        {filteredPlaylists.length === 0
          ? "No matching playlists"
          : "Top AI Suggested Playlists"}
      </p>

      <div className="space-y-3 mb-6 md:mb-8">
        {filteredPlaylists.map((pl) => (
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
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold text-white"
                  style={{
                    background: pl.color,
                    boxShadow: `0 0 10px ${pl.color}80`,
                  }}
                >
                  {pl.match}
                </div>
              </div>

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
                    className="mt-2 md:mt-3 p-2.5 md:p-3 rounded-lg text-xs text-white/55 italic leading-relaxed cursor-pointer hover:bg-white/5 transition-all"
                    style={{
                      background: `${pl.color}0f`,
                      border: `1px solid ${pl.color}28`,
                    }}
                    onClick={() =>
                      editingPitch === pl.id
                        ? setEditingPitch(null)
                        : setEditingPitch(pl.id)
                    }
                  >
                    {editingPitch === pl.id ? (
                      <textarea
                        value={pitches[pl.id]}
                        onChange={(e) =>
                          setPitches((prev) => ({
                            ...prev,
                            [pl.id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => setEditingPitch(null)}
                        autoFocus
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white italic resize-none focus:outline-none focus:border-white/40"
                        rows={3}
                      />
                    ) : (
                      <>
                        <span
                          className="text-[9px] font-bold not-italic uppercase tracking-wider"
                          style={{ color: pl.color }}
                        >
                          ✦ AI Pitch ·{" "}
                        </span>
                        {pitches[pl.id]}
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-3 sm:hidden">
                  {!pitches[pl.id] ? (
                    <>
                      {firstPitchId &&
                        firstPitchId !== pl.id &&
                        pitches[firstPitchId] && (
                          <button
                            onClick={() => handleReusePitch(pl)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
                            style={{
                              background: "rgba(99,102,241,0.2)",
                              color: "rgba(99,102,241,1)",
                            }}
                          >
                            Reuse Pitch
                          </button>
                        )}

                      <button
                        onClick={() => handleGeneratePitch(pl)}
                        disabled={pitchLoading !== null}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                          background: "linear-gradient(135deg,#a855f7,#6366f1)",
                        }}
                      >

                        <Sparkles size={14} />

                        {pitchLoading === pl.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) :           <Sparkles size={14} />
}
                        Generate Pitch
                      </button>


                    </>
                  ) : (
                    <button
                      onClick={() => handleSubmit(pl.id)}
                      disabled={submitted[pl.id]}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 disabled:opacity-60"
                      style={{
                        background: submitted[pl.id]
                          ? `${pl.color}22`
                          : `linear-gradient(135deg, ${pl.color}, ${pl.color}99)`,
                        color: submitted[pl.id] ? pl.color : "white",
                      }}
                    >
                      {submitted[pl.id] ? (
                        <>
                          <CheckCircle size={12} /> Submitted!
                        </>
                      ) : (
                        "Submit Track"
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex gap-2 items-center flex-shrink-0">
                <button
                  onClick={() => setSelectedPlaylist(pl)}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center hover:border-white/20 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  title="View playlist details"
                >
                  <Eye size={15} className="text-cyan-400" />
                </button>

                {!pitches[pl.id] ? (
                  <button
                    onClick={() => handleGeneratePitch(pl)}
                    disabled={pitchLoading !== null}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg,#a855f7,#6366f1)",
                    }}
                  >
                    {pitchLoading === pl.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
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
                      <>
                        <CheckCircle size={14} /> Submitted!
                      </>
                    ) : (
                      "Submit Track"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPlaylists.length === 0 && (
          <div className="text-center py-12">
            <Music2 size={40} className="mx-auto mb-3 text-white/20" />
            <p className="text-white/40">No playlists match your filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("all");
                setSelectedMood("all");
                setSelectedReach("all");
              }}
              className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {selectedPlaylist && (
        <PlaylistDetailsModal
          playlist={selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
        />
      )}

      <AnalysisModal
        isOpen={analyzeModalOpen}
        input={analyzeInput}
        loading={analyzeLoading}
        results={analysisResults}
        step={analyzeStep}
        onInputChange={setAnalyzeInput}
        onAnalyze={handleAnalyzeSound}
        onClose={() => {
          setAnalyzeModalOpen(false);
          setAnalysisResults(null);
          setAnalyzeInput("");
          setAnalyzeStep("input");
        }}
        onApplyResults={handleAnalyzeApply}
        onBack={handleAnalyzeBack}
      />
    </div>
  );
}