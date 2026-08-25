import { Package, Loader2, Check, Download } from 'lucide-react';
import type { Song } from '@/lib/types';

interface Props {
  selectedCount: number;
  exporting: boolean;
  exportProgress: number;
  onExportAll: () => void;
  disabled: boolean;
  isDesktop: boolean;
}

export function ExportAllButton({ selectedCount, exporting, exportProgress, onExportAll, disabled, isDesktop }: Props) {
  const label = selectedCount === 0
    ? 'Select songs to export'
    : selectedCount === 1
    ? 'Export 1 song'
    : `Export ${selectedCount} songs`;

  return (
    <button
      type="button"
      onClick={onExportAll}
      disabled={disabled || exporting || selectedCount === 0}
      className="btn-glow group relative w-full overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-neon px-5 py-4 text-left shadow-glow transition-all hover:shadow-[0_0_0_1px_rgba(124,92,255,0.7),0_16px_56px_-10px_rgba(124,92,255,0.8)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      {/* progress fill */}
      {exporting && (
        <span
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-neon/30 to-violet-500/30 transition-all duration-200"
          style={{ width: `${exportProgress}%` }}
        />
      )}
      <span className="relative flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
            {exporting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : exportProgress >= 100 ? (
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            ) : (
              <Package className="h-5 w-5 text-white" />
            )}
          </span>
          <span>
            <span className="block font-display text-base font-700 text-white">{exporting ? 'Packaging…' : exportProgress >= 100 ? 'Ready!' : label}</span>
            <span className="block text-[11px] font-400 text-white/70">
              {exporting
                ? `${exportProgress}% · preparing archive`
                : isDesktop && selectedCount > 1
                ? 'Downloads as a ZIP archive'
                : selectedCount > 1
                ? 'Each song downloads separately'
                : 'MP3 / MP4 file'}
            </span>
          </span>
        </span>
        {!exporting && exportProgress < 100 && (
          <Download className="h-5 w-5 text-white/80 transition-transform group-hover:translate-y-0.5" />
        )}
      </span>
    </button>
  );
}
