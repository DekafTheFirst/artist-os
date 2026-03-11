"use client";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/20">
      <div className="text-6xl mb-4">
        {label === "distro" ? "📡" : "⚙️"}
      </div>
      <p className="text-lg font-medium capitalize">{label}</p>
      <p className="text-sm mt-1">Coming soon</p>
    </div>
  );
}

export default function DistroPage() {
  return <ComingSoon label="distro" />;
}
