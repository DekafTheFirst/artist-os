import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    // Handle file upload for transcription
    const formData = await req.formData();
    const file = formData.get("audio") as File;
    const type = formData.get("type") as string;

    if (!file || type !== "transcribe_audio") {
      return NextResponse.json({ error: "Invalid file or type" }, { status: 400 });
    }

    // For now, return mock transcription - replace with actual transcription service
    const mockTranscription = `Yeah, I'm feeling good tonight
The lights are shining bright
Got my favorite song on repeat
Dancing like there's no defeat

This is the chorus, hear me loud
Singing to the crowd
Life is beautiful, no doubt
We're gonna figure it out

Verse two coming through
Got a message just for you
Keep your head up, stay true
Everything's gonna be brand new`;

    return NextResponse.json({ transcription: mockTranscription });
  }

  // Handle JSON requests for other operations
  const { type, payload } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  let prompt = "";

  if (type === "structure_lyrics") {
    prompt = `Take these raw vocal transcription lyrics and structure them into a professional song format with [VERSE 1], [CHORUS], [VERSE 2], [BRIDGE] tags as appropriate. Format each line cleanly on its own line. Return ONLY the structured lyrics with section tags in square brackets, no explanation or preamble:\n\n${payload.rawLyrics}`;
  } else if (type === "generate_pitch") {
    prompt = `Write a short, compelling playlist submission pitch (2-3 sentences max) for submitting the track "${payload.trackName}" to the "${payload.playlistName}" playlist curated by ${payload.curator}. The track is: ${payload.trackDescription}. Be specific, professional, and persuasive. Return only the pitch text with no preamble.`;
  } else {
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";
  return NextResponse.json({ text });
}
