import { CheckCircle2 } from 'lucide-react';

export function SuccessToast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-full border border-cyan-neon/30 bg-ink-900/90 px-4 py-2.5 shadow-glow-cyan backdrop-blur-xl">
        <CheckCircle2 className="h-4 w-4 text-cyan-neon" />
        <span className="text-sm font-500 text-white">{message}</span>
      </div>
    </div>
  );
}
