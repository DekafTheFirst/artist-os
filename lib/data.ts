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

export const SAMPLE_RAW_LYRICS = `I want to go to la ain't no rookie, I'm a veteran Bulletproof whips moving like the president I need another I don't do no drugs yet the money that's my medicine look what I'm swerving in Ryan in the ding but you niggas know I'm heaven sent I'm super fly to know it's me just when I'm stepping nice fuck up in this jet take a div I need no parachute Might link up with your bitch and send a text to bring a friend and you know we wrist when we pull up it's all kind of cools I ain't going for I roll with shooters and all kind of yeah I grew up in this it's hella scammers around my avenue better watch to take it all when we no residue hopped up on my live sending threats but y scary drop this I ain't reply I swear to God I ain't heard of you I ain't heard of you too busy stacking revenue then I put it on the chain you reach for it I'm going federal can't trip about no before this fame I had savage love them all but they say I'm a savage, I'm an animal they gonna cap the menace known for killing that's on the regular do me that that is gonna get paid some like Atlantis gonna get my lick back it's something I can't forget it's on my calendar and I'm bulletproof to wish move like the present rockin sound I'm right no fanny hell no it's a kelly on my top and bitch I'm gripping to the toe yo man bitch give me top of shit so grip she the goat first bitch so good now she over here really trying to tip me oh no must have got I'll put up in the Maybach worth 250 too tone in the garage it out while trying to feel like fit me too strong play with the gang and shot in the bat like Ricky where you going still walking around these chains on your ass risky yeah I'm known but play and I'm blowing ass fuck up finish I take a dive I need no parachute liquor with your or send a text to bring a friend or two don't be rich when we pull up it's all kind of cool I ain't going for I roll with shooters and all kind of true up in this hella scams around my avenue you better watch to take it all when we leave no residue Hopped up on my live sending threats But y ain't scared of y' all Swear to God, yo, I don't even like niggas like that Ain't no shit talking at my back I just kill how I deem fit all that energy on flack make no sense if I made no stacks I've been on ghost mode Trying to know where I'm at Ask your ho on my pole trying to go pro I'm so low little I ain't never had FOMO I see niggas eat dick for promo and you know I can't be no throw goat Just post it up for my bros MX Y' all was trapping on bro phones Going class and ducking the popo that pressure had me low cold My niggas ain't new to risk we just count it up all day Nah, nigga, don't ask me, I ain't got answers I ain't sway all that talking made me sick I ain't even got shit to say Fresh to death, oh my gay pull up and wreck your stage Nigga don't play with me I ain't going for none Come I done he died to spray with me I hate having them hoes over they might just try to stay with me can't cry, my cold shoulder hold damn it, I ain't no trick Real niggas so I make them sick this the life it ain't no flickering`;

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
