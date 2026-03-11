import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";
import { GoogleGenAI } from "@google/genai";
import { SAMPLE_RAW_LYRICS } from "@/lib/data";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const assembly = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

const ai = new GoogleGenAI({});
const client = new ElevenLabsClient();

// Timeout constants (in milliseconds)
const ASSEMBLYAI_TIMEOUT = 30000; // 30 seconds
const GEMINI_TIMEOUT = 30000; // 30 seconds

// Helper function to wrap a promise with a timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

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
          const transcript = await withTimeout(
            assembly.transcripts.transcribe({
              audio: file,
              speech_models: ["universal-2"],
              // Optional:
              // language_detection: true,
              // format_text: true,
              // punctuate: true,
            }),
            ASSEMBLYAI_TIMEOUT,
            "AssemblyAI transcription"
          );

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

    // Models to try in order (max 3 attempts)
    const models = [
      "gemini-3-flash-preview",
      "gemini-3.1-pro-preview",
      "gemini-3.1-flash-lite-preview",
    ];

    let lastError: any = null;
    let response = null;

    // Try each model up to 3 times
    for (const model of models) {
      try {
        console.log(`Attempting Gemini with model: ${model}`);
        response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: prompt,
          }),
          GEMINI_TIMEOUT,
          `Gemini request (${model})`
        );

        const text = response.text;

        if (text?.trim()) {
          console.log(`Success with model: ${model}`);
          return NextResponse.json({ text });
        } else {
          lastError = "No response from Gemini";
          console.warn(`Empty response from model ${model}, trying next...`);
        }
      } catch (error: any) {
        lastError = error;
        console.error(`Model ${model} failed:`, error?.message);
        // Continue to next model
      }
    }

    // All models failed
    return NextResponse.json(
      {
        error: "Gemini request failed after 3 attempts",
        provider: "gemini",
        details: lastError?.message || "All models failed",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as any)?.message },
      { status: 500 }
    );
  }
}