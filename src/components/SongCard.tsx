import { Download, Check, Loader2, Music2 } from 'lucide-react';
import type { Song, DownloadJob } from '@/lib/types';
import { formatDuration } from '@/lib/mockFetch';
import { PlatformBadge } from './PlatformBadge';
import { Waveform } from './Waveform';

interface Props {
  song: Song;
  index: number;
  selected: boolean;
  onToggle: () => void;
  job?: DownloadJob;
  onDownload: () => void;
}

export function SongCard({ song, index, selected, onToggle, job, onDownload }: Props) {
  const status = job?.status;
  const progress = job?.progress ?? 0;

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-300 ${
        selected
          ? 'border-violet-500/50 bg-violet-500/[0.07] shadow-glow'
          : 'border-white/[0.06] bg-ink-850/40 hover:border-white/15 hover:bg-ink-800/60'
      }`}
      style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${Math.min(index * 0.04, 0.4)}s both` }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={selected ? 'Deselect song' : 'Select song'}
        aria-pressed={selected}
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
          selected ? 'border-violet-500 bg-violet-500 text-white' : 'border-white/20 bg-transparent text-transparent hover:border-violet-500/60'
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </button>

      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-700">
        <img src={song.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
        <Music2 className="absolute inset-0 m-auto h-4 w-4 text-white/40" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-600 text-white">{song.title}</p>
          <PlatformBadge platform={song.platform} size="sm" />
        </div>
        <p className="truncate text-xs text-slate-400">{song.artist}</p>
        <div className="mt-1 flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-slate-500">{formatDuration(song.durationSec)}</span>
          <Waveform bars={18} className="h-3 flex-1 max-w-[140px]" active={status === 'converting'} seed={index + 1} />
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        {status === 'downloading' || status === 'converting' ? (
          <div className="flex items-center gap-2">
            <div className="hidden w-24 sm:block">
              <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-neon transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
          </div>
        ) : status === 'done' ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-neon/10 px-2.5 py-2 text-xs font-600 text-cyan-neon">
            <Check className="h-4 w-4" strokeWidth={3} /> Saved
          </span>
        ) : (
          <button
            type="button"
            onClick={onDownload}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white"
            aria-label={`Download ${song.title}`}
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>

      {status === 'downloading' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl bg-ink-700 sm:hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-neon" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
