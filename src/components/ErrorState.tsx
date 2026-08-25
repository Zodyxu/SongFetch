import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="glass rounded-2xl p-8 text-center animate-fade-up">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-rose-500/15 text-rose-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mb-1.5 font-display text-base font-600 text-white">Something went wrong</h3>
      <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-slate-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-500 text-slate-200 transition hover:border-violet-500/40 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}
