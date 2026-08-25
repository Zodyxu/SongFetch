import { Package, Check, Loader2 } from 'lucide-react';

interface Props {
  selectedCount: number;
  exporting: boolean;
  exportProgress: number;
  onExportAll: () => void;
  disabled: boolean;
}

export function MobileActionBar({ selectedCount, exporting, exportProgress, onExportAll, disabled }: Props) {
  if (disabled && !exporting) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink-900/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
      {exporting && (
        <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-ink-700">
          <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-neon transition-all duration-200" style={{ width: `${exportProgress}%` }} />
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1">
          <p className="font-display text-sm font-600 text-white">
            {exporting ? `Packaging… ${exportProgress}%` : `${selectedCount} selected`}
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            {exporting ? 'Preparing your files' : 'Tap export to download'}
          </p>
        </div>
        <button
          type="button"
          onClick={onExportAll}
          disabled={exporting || selectedCount === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-neon px-5 py-3 text-sm font-600 text-white shadow-glow disabled:opacity-50"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Exporting
            </>
          ) : exportProgress >= 100 ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} /> Done
            </>
          ) : (
            <>
              <Package className="h-4 w-4" /> Export
            </>
          )}
        </button>
      </div>
    </div>
  );
}
