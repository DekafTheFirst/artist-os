"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, Play, Pause, SkipBack, SkipForward, Volume2,
  Sparkles, RefreshCw, Mic2, ListMusic,
  Loader2, CheckCircle,
  Copy,
} from "lucide-react";
import { FxToggle } from "@/components/ui/FxToggle";
import { fxControls, SAMPLE_RAW_LYRICS, FALLBACK_STRUCTURED, type LyricsSection } from "@/lib/data";
import { parseStructuredLyrics } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "transcribing" | "done";

interface FileMetadata {
  file: File;
  duration: number;
  size: number;
  name: string;
}

export function AIStudio() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [file, setFile] = useState<FileMetadata | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rawText, setRawText] = useState("");
  const [structured, setStructured] = useState<LyricsSection[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const extractAudioDuration = useCallback(async (audioFile: File): Promise<number> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(audioFile);
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      audio.src = url;
    });
  }, []);

  const structureLyrics = useCallback(async (raw: string) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "structure_lyrics",
          payload: { rawLyrics: raw },
        }),
      });
      const data = await res.json();
      const parsed = parseStructuredLyrics(data.text ?? "");
      setStructured(parsed.length ? parsed : FALLBACK_STRUCTURED);
    } catch {
      setStructured(FALLBACK_STRUCTURED);
    }
    setAiLoading(false);
  }, []);

  function simulateUpload(e: React.ChangeEvent<HTMLInputElement> | undefined = undefined) {
    const audioFile = e?.target?.files?.[0];

    audioFile && saveAudioFile(audioFile)
  }

  const saveAudioFile = async (audioFile: File) => {
    if (!audioFile) {
      console.log("No file selected");
      return;
    }

    setUploadState("uploading");

    try {
      // Extract duration first
      const duration = await extractAudioDuration(audioFile);

      // Set file metadata
      setFile({
        file: audioFile,
        duration,
        size: audioFile.size,
        name: audioFile.name,
      });

      // Start transcription
      setUploadState("transcribing");

      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("type", "transcribe_audio");

      const res = await fetch("/api/ai", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Transcription failed");
      }

      const data = await res.json();
      const transcribedText = data.transcription || SAMPLE_RAW_LYRICS;

      setRawText(transcribedText);
      await structureLyrics(transcribedText);
      setUploadState("done");

    } catch (error) {
      console.error("Upload/transcription error:", error);
      // Fallback to sample data
      setRawText(SAMPLE_RAW_LYRICS);
      await structureLyrics(SAMPLE_RAW_LYRICS);
      setUploadState("done");
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      saveAudioFile(e.dataTransfer.files[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const isChorus = (tag: string) => tag.toLowerCase().includes("chorus");

  return (
    <div className="p-4 md:p-8 overflow-y-auto h-full">

      {/* Breadcrumb */}
      <p className="text-xs text-white/25 mb-1 flex items-center gap-2">
        <span className="cursor-pointer hover:text-white/45 transition-colors">Projects</span>
        <span>/</span>
        <span className="text-white/40">New Session</span>
      </p>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">Vocal Studio</h1>
          <p className="text-white/40 text-xs md:text-sm mt-1 max-w-lg">
            Transform raw vocal takes into structured lyrical compositions using
            industry-leading neural processing.
          </p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button
            className="hidden sm:block px-4 py-2 rounded-lg border text-sm text-white/60 hover:text-white
                       hover:border-white/20 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            Save Draft
          </button>
          <button
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium
                       hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
          >
            <Upload size={13} /> <span className="hidden sm:inline">Export Project</span><span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => uploadState === "idle" && fileRef.current?.click()}
        className="rounded-2xl border-2 border-dashed mb-5 md:mb-6 flex flex-col items-center
                   justify-center py-10 md:py-16 transition-all"
        style={{
          borderColor: isDragging
            ? "#f97316"
            : uploadState === "done"
              ? "#10b981"
              : "rgba(255,255,255,0.1)",
          background: isDragging
            ? "rgba(249,115,22,0.05)"
            : uploadState === "done"
              ? "rgba(16,185,129,0.04)"
              : "rgba(255,255,255,0.015)",
          cursor: uploadState === "idle" ? "pointer" : "default",
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".wav,.mp3,.m4a"
          className="hidden"
          onChange={(e) => simulateUpload(e)}
        />

        {uploadState === "idle" && (
          <>
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
              style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
            >
              <Upload size={22} />
            </div>
            <p className="text-base md:text-lg font-semibold mb-1">Drop audio here</p>
            <p className="text-white/40 text-xs md:text-sm mb-4 md:mb-5">
              WAV, MP3, or M4A — Max 50MB
            </p>
            <button
              className="px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-sm transition-all border
                         hover:border-white/25 hover:text-white text-white/60"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              Browse Files
            </button>
          </>
        )}

        {uploadState === "uploading" && (
          <>
            <Loader2 size={36} className="animate-spin text-orange-400 mb-3" />
            <p className="text-white/50 text-sm">Uploading and processing audio…</p>
          </>
        )}

        {uploadState === "transcribing" && (
          <>
            <Loader2 size={36} className="animate-spin text-blue-400 mb-3" />
            <p className="text-white/50 text-sm">Transcribing lyrics with AI…</p>
          </>
        )}

        {uploadState === "done" && file && (
          <>
            <CheckCircle size={36} className="text-green-400 mb-3" />
            <p className="font-semibold text-sm md:text-base mb-1">{file.name}</p>
            <p className="text-white/40 text-xs md:text-sm">{Math.floor(file.duration / 60)}:{String(Math.floor(file.duration % 60)).padStart(2, '0')} · {(file.size / 1024 / 1024).toFixed(1)} MB · Processing complete</p>
            <button
              onClick={() => {
                setUploadState("idle");
                setFile(undefined);
                setRawText("");
                setStructured(null);
                fileRef.current?.click();
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-orange-400 border border-orange-400/30
                         hover:bg-orange-400/10 hover:border-orange-400/50 transition-all"
            >
              Upload Another Song
            </button>
          </>
        )}
      </div>

      {/* {uploadState === "idle" && (
        <div className="text-center -mt-2 mb-5 md:mb-6">
          <button
            onClick={() => simulateUpload()}
            className="text-sm text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors"
          >
            → Demo: Load sample vocal take
          </button>
        </div>
      )} */}

      {/* FX Controls */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6">
        {fxControls.map((fx) => (
          <FxToggle key={fx.name} name={fx.name} defaultOn={fx.defaultOn} />
        ))}
      </div> */}

      {/* Two-column lyrics view — stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">

        {/* Raw Transcription */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListMusic size={15} className="text-white/40" />
              Raw Transcription
            </div>
            <div className="flex gap-3 items-center">
              <span
                className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded"
                style={{ background: "rgba(249,115,22,0.18)", color: "#fb923c" }}
              >
                REAL-TIME
              </span>
              <div className="cursor-pointer hover:bg-gray-400/10 p-[7px] px-[9px] rounded">
                <Copy size={15} />
              </div>
            </div>
          </div>
          <div className="p-4 md:p-5 min-h-36 md:min-h-52">
            {rawText ? (
              <p className="text-xs md:text-sm text-white/60 leading-relaxed font-mono">{rawText}</p>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 md:h-44 text-white/20">
                <Mic2 size={26} className="mb-2 opacity-30" />
                <span className="text-xs">Upload audio to begin transcription</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Structured Lyrics */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles size={15} className="text-orange-400" />
              AI Structured Lyrics
            </div>
            <button
              onClick={() => rawText && structureLyrics(rawText)}
              className="text-[11px] text-orange-400 font-medium flex items-center gap-1
                         hover:text-orange-300 transition-colors"
            >
              {aiLoading
                ? <Loader2 size={11} className="animate-spin" />
                : <RefreshCw size={11} />
              }
              Regenerate
            </button>
          </div>
          <div className="p-4 md:p-5 min-h-36 md:min-h-52 space-y-3 md:space-y-4">
            {aiLoading && (
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <Loader2 size={14} className="animate-spin" />
                Processing with AI…
              </div>
            )}
            {structured && !aiLoading && structured.map((section, i) => (
              <div key={i}>
                <span
                  className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded mb-1.5 inline-block"
                  style={{
                    background: isChorus(section.tag)
                      ? "rgba(249,115,22,0.2)"
                      : "rgba(99,102,241,0.2)",
                    color: isChorus(section.tag) ? "#fb923c" : "#818cf8",
                  }}
                >
                  [{section.tag}]
                </span>
                {section.lines.map((line, j) => (
                  <p
                    key={j}
                    className="text-xs md:text-sm leading-relaxed"
                    style={{
                      fontStyle: isChorus(section.tag) ? "normal" : "italic",
                      fontWeight: isChorus(section.tag) ? 600 : 400,
                      color: isChorus(section.tag)
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
            {!structured && !aiLoading && (
              <div className="flex flex-col items-center justify-center h-32 md:h-44 text-white/20">
                <Sparkles size={26} className="mb-2 opacity-30" />
                <span className="text-xs">AI structured lyrics will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {uploadState === "done" && (
        <div
          className="rounded-2xl p-4 md:p-5 border"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          {/* Mobile layout: stacked */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                  <SkipBack size={17} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 rounded-full flex items-center justify-center
                             transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
                >
                  {isPlaying
                    ? <Pause size={18} />
                    : <Play size={18} className="ml-0.5" />
                  }
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                  <SkipForward size={17} />
                </button>
              </div>
              {/* Volume — shown on mobile next to controls */}
              <div className="flex items-center gap-2 text-white/30 sm:hidden">
                <Volume2 size={15} />
                <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                </div>
              </div>
            </div>

            <span className="hidden sm:block text-sm text-white/40 tabular-nums">01:12</span>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-white/40 tabular-nums sm:hidden">01:12</span>
              <div className="flex-1 h-1.5 rounded-full relative cursor-pointer"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="absolute inset-y-0 left-0 w-1/3 rounded-full"
                  style={{ background: "linear-gradient(to right,#f97316,#ef4444)" }}
                />
                <div
                  className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2
                             w-3 h-3 rounded-full bg-white shadow"
                />
              </div>
              <span className="text-xs text-white/40 tabular-nums sm:hidden">03:45</span>
            </div>

            <span className="hidden sm:block text-sm text-white/40 tabular-nums">03:45</span>

            <div className="hidden sm:flex items-center gap-2 text-white/30">
              <Volume2 size={16} />
              <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
