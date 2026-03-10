# Artist OS – Pro Dashboard

A Next.js 14 music-tech dashboard with AI-powered features.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** – streaming trend charts
- **Lucide React** – icons
- **Anthropic Claude API** – AI lyrics structuring & playlist pitches

## Features
- 📊 **Dashboard** – KPI cards with sparklines, streaming area chart, playlist previews
- 🎵 **AI Studio** – Vocal drag-and-drop upload → raw transcription → AI-structured lyrics with [VERSE]/[CHORUS] tags
- 🎯 **Playlisting** – AI-generated curator pitches per playlist, match scores, submit flow
- 📈 **Analytics** – Top tracks, platform breakdown, weekly chart

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.local.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
artist-os/
├── app/
│   ├── api/ai/route.ts        ← Anthropic API proxy route
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ArtistOSShell.tsx      ← Root shell / router
│   ├── Sidebar.tsx
│   ├── ui/
│   │   ├── KpiCard.tsx
│   │   ├── Sparkline.tsx
│   │   ├── MatchBadge.tsx
│   │   └── FxToggle.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   └── Analytics.tsx
│   ├── playlisting/
│   │   └── Playlisting.tsx
│   └── aistudio/
│       └── AIStudio.tsx
└── lib/
    ├── data.ts                ← Mock data & types
    └── utils.ts               ← Helpers (cn, parseStructuredLyrics)
```

## AI Routes
All AI calls go through `/api/ai` (server-side) so your API key stays secret.

- `type: "structure_lyrics"` – formats raw transcription into verse/chorus sections
- `type: "generate_pitch"` – writes a tailored curator pitch for a playlist
