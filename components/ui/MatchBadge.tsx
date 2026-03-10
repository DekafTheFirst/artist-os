"use client";

interface MatchBadgeProps {
  score: number;
}

export function MatchBadge({ score }: MatchBadgeProps) {
  const color =
    score >= 95 ? "#a855f7"
    : score >= 90 ? "#06b6d4"
    : score >= 85 ? "#10b981"
    : "#f59e0b";

  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 36 36"
      >
        <circle
          cx="18" cy="18" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
        />
        <circle
          cx="18" cy="18" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <span className="text-[10px] font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}
