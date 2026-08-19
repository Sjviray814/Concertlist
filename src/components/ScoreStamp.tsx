function scoreColor(score: number) {
  if (score >= 8) return "var(--magenta)";
  if (score >= 6) return "var(--amber)";
  return "var(--cyan)";
}

export default function ScoreStamp({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div
      className="w-13 h-13 rounded-full flex items-center justify-center flex-col relative mono"
      style={{ width: 52, height: 52, border: `2px solid ${color}`, color, transform: "rotate(-9deg)" }}
    >
      <div className="absolute inset-1 border border-dashed rounded-full opacity-50" style={{ borderColor: color }} />
      <div className="text-base font-bold leading-none">{score.toFixed(1)}</div>
      <div className="text-[7px] opacity-70">/10</div>
    </div>
  );
}
