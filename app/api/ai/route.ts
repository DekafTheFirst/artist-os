import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";
import { GoogleGenAI } from "@google/genai";
import { SAMPLE_RAW_LYRICS } from "@/lib/data";

const assembly = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  console.log("Received AI API request");

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("audio") as File | null;
      const type = formData.get("type") as string | null;
      const useMock = formData.get("mock") === "true";

      if (!file || type !== "transcribe_audio") {
        return NextResponse.json(
          { error: "Invalid file or type" },
          { status: 400 }
        );
      }

      if (!process.env.ASSEMBLYAI_API_KEY && !useMock) {
        return NextResponse.json(
          { error: "ASSEMBLYAI_API_KEY not set" },
          { status: 500 }
        );
      }

      try {
        let transcription: string;

        if (useMock) {
          // Mock transcription for testing
          transcription = SAMPLE_RAW_LYRICS;
          console.log("Using mock transcription:", transcription);
        } else {
          // AssemblyAI async transcription; SDK uploads local/file input for you.
          const transcript = await assembly.transcripts.transcribe({
            audio: file,
            speech_models: ["universal-2"],
            // Optional:
            // language_detection: true,
            // format_text: true,
            // punctuate: true,
          });

          if (!transcript.text?.trim()) {
            return NextResponse.json(
              { error: "Empty transcription returned" },
              { status: 502 }
            );
          }

          transcription = transcript.text.trim();
          console.log("Transcription successful:", transcription);
        }

        return NextResponse.json({
          transcription,
          provider: useMock ? "mock" : "assemblyai",
        });
      } catch (error: any) {
        console.error("AssemblyAI transcription error:", error);

        return NextResponse.json(
          {
            error: "Transcription failed",
            provider: "assemblyai",
            details:
              error?.response?.data?.error ||
              error?.message ||
              "Unknown AssemblyAI error",
          },
          { status: 502 }
        );
      }
    }

    const { type, payload } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not set" },
        { status: 500 }
      );
    }

    let prompt = "";

    if (type === "structure_lyrics") {
      prompt = `
Analyze these raw vocal transcription lyrics and structure them into a professional song format with proper sections.

Available section tags (use only these):
[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[POST-CHORUS]
[VERSE 2]
[BRIDGE]
[OUTRO]
[HOOK] (if applicable)

Guidelines:
- Return ONLY the structured lyrics with section tags
- No explanations or additional text
- Keep original wording as much as possible, but clean up obvious transcription errors
- Each lyric line on its own line
- Group similar repeating sections under the same tag (e.g., multiple CHORUS sections)
- Use line breaks between sections
- If lyrics are short, use fewer sections
- Capitalize the first letter of each line appropriately
- Infer the most logical song structure based on content and repetition

Raw lyrics:
${payload?.rawLyrics ?? ""}
      `.trim();
    } else if (type === "generate_pitch") {
      prompt = `
Write a short, compelling playlist submission pitch in 2-3 sentences max.

Track: ${payload?.trackName ?? ""}
Playlist: ${payload?.playlistName ?? ""}
Curator: ${payload?.curator ?? ""}
Description: ${payload?.trackDescription ?? ""}

Return only the pitch text.
      `.trim();
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;

    if (!text?.trim()) {
      return NextResponse.json(
        {
          error: "Gemini request failed",
          provider: "gemini",
          details: "No response from Gemini",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as any)?.message },
      { status: 500 }
    );
  }
}