// ─── TYPES ────────────────────────────────────────────────────────────────────

export type NavItem = "dashboard" | "analytics" | "playlisting" | "aistudio" | "distro" | "settings";

export interface Playlist {
  id: number;
  name: string;
  curator: string;
  followers: string;
  match: number;
  engagement: string;
  updated: string;
  color: string;
  badge: string;
  tag: string;
}

export interface Track {
  title: string;
  plays: string;
  trend: string;
  mood: string;
}

export interface LyricsSection {
  tag: string;
  lines: string[];
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

export const streamingData = [
  { day: "Mon", streams: 3200, listeners: 1800 },
  { day: "Tue", streams: 2800, listeners: 2100 },
  { day: "Wed", streams: 4100, listeners: 2400 },
  { day: "Thu", streams: 6800, listeners: 3200 },
  { day: "Fri", streams: 5900, listeners: 3800 },
  { day: "Sat", streams: 7200, listeners: 4100 },
  { day: "Sun", streams: 8900, listeners: 4800 },
];

export const sparklineStreams  = [40, 45, 38, 52, 60, 55, 70, 65, 80, 75, 90, 85];
export const sparklineListeners = [30, 35, 32, 40, 45, 42, 55, 50, 60, 58, 65, 70];
export const sparklineRoyalties = [20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42, 50];

export const playlists: Playlist[] = [
  {
    id: 1, name: "Neon Nightscapes", curator: "Pulse Media",
    followers: "142k", match: 98, engagement: "High Engagement",
    updated: "Updated Daily", color: "#a855f7", badge: "🔮", tag: "Official Spotify",
  },
  {
    id: 2, name: "Deep Space Echoes", curator: "Cosmic Curations",
    followers: "85k", match: 94, engagement: "Consistent Growth",
    updated: "Updated Weekly", color: "#06b6d4", badge: "🌌", tag: "Targeted",
  },
  {
    id: 3, name: "Future Waves", curator: "Vibe Labs",
    followers: "210k", match: 89, engagement: "Top 1% Engagement",
    updated: "Updated 2d ago", color: "#10b981", badge: "🌊", tag: "Discovery Queue",
  },
  {
    id: 4, name: "Midnight Frequencies", curator: "NightOwl Audio",
    followers: "67k", match: 82, engagement: "Rising Fast",
    updated: "Updated 3d ago", color: "#f59e0b", badge: "🌙", tag: "Discovery Queue",
  },
];

export const topTracks: Track[] = [
  { title: "Neon Street",   plays: "324k", trend: "+12%", mood: "Atmospheric" },
  { title: "Coastal Drift", plays: "198k", trend: "+8%",  mood: "Chill" },
  { title: "Electric Haze", plays: "145k", trend: "+22%", mood: "Energetic" },
  { title: "Signal Lost",   plays: "89k",  trend: "-3%",  mood: "Dark" },
];

export const platformBreakdown = [
  { name: "Spotify",       pct: 68, color: "#1db954" },
  { name: "Apple Music",   pct: 18, color: "#fc3c44" },
  { name: "YouTube Music", pct: 9,  color: "#ff0000" },
  { name: "Other",         pct: 5,  color: "#a855f7" },
];

export const fxControls = [
  { name: "DE-ESSER",    defaultOn: true  },
  { name: "AUTO-TUNE",   defaultOn: false },
  { name: "COMPRESSION", defaultOn: true  },
  { name: "AI REVERB",   defaultOn: true  },
];

export const SAMPLE_RAW_LYRICS = `Yeah, I've been walking down this neon street tonight. Looking for a feeling that I used to know so bright. Static in the air and the waves are crashing slow. Where did all the frequencies and all the magic go?`;

export const FALLBACK_STRUCTURED: LyricsSection[] = [
  {
    tag: "VERSE 1",
    lines: [
      "Yeah, I've been walking down this neon street tonight",
      "Looking for a feeling that I used to know so bright",
    ],
  },
  {
    tag: "CHORUS",
    lines: [
      "Static in the air and the waves are crashing slow",
      "Where did all the frequencies and all the magic go?",
    ],
  },
];
