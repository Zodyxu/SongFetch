import { Music } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-neon shadow-glow">
        <Music className="h-5 w-5 text-white" strokeWidth={2.5} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-neon shadow-[0_0_8px_2px_rgba(61,240,230,0.7)]" />
      </div>
      <div className="leading-none">
        <span className="font-display text-lg font-700 tracking-tight text-white">Song<span className="text-gradient-violet">Fetch</span></span>
      </div>
    </div>
  );
}
