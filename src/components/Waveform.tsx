export function Waveform({ bars = 32, className = '', active = true, seed = 1 }: { bars?: number; className?: string; active?: boolean; seed?: number }) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const v = Math.abs(Math.sin(i * 1.7 + seed) * 0.6 + Math.cos(i * 0.9 + seed * 2) * 0.4);
    return Math.max(0.18, Math.min(1, v));
  });
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {heights.map((h, i) => (
        <span
          key={i}
          className="waveform-bar w-[2px] rounded-full bg-gradient-to-t from-violet-500/40 to-cyan-neon/80"
          style={{
            height: `${h * 100}%`,
            animation: active ? `bar-rise 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.02}s both` : undefined,
            opacity: active ? 0.9 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
