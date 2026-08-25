import { CheckSquare, Square, ListMusic, X, Loader2 } from 'lucide-react';
import type { Song, DownloadJob } from '@/lib/types';
import { SongCard } from './SongCard';

interface Props {
  songs: Song[];
  isPlaylist: boolean;
  selectedIds: Set<string>;
  jobs: Record<string, DownloadJob>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownload: (id: string) => void;
  onReset: () => void;
  loading: boolean;
}

export function PlaylistWorkspace({
  songs,
  isPlaylist,
  selectedIds,
  jobs,
  onToggle,
  onSelectAll,
  onClearSelection,
  onDownload,
  onReset,
  loading,
}: Props) {
  const allSelected = songs.length > 0 && selectedIds.size === songs.length;

  return (
    <div className="glass relative overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/15 text-violet-400">
            <ListMusic className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-sm font-700 text-white">
              {isPlaylist ? 'Playlist' : 'Track'}
            </h2>
            <p className="font-mono text-[11px] text-slate-500">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'} · {selectedIds.size} selected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPlaylist && songs.length > 1 && (
            <button
              type="button"
              onClick={allSelected ? onClearSelection : onSelectAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-500 text-slate-300 transition hover:border-violet-500/40 hover:text-white"
            >
              {allSelected ? <CheckSquare className="h-3.5 w-3.5 text-violet-400" /> : <Square className="h-3.5 w-3.5" />}
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-rose-500/40 hover:text-rose-400"
            aria-label="Clear and start over"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-ink-850/40 p-2.5">
                <div className="skeleton h-5 w-5 rounded-md" />
                <div className="skeleton h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-2/3 rounded" />
                  <div className="skeleton h-2.5 w-1/3 rounded" />
                </div>
                <div className="skeleton h-9 w-9 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="stagger space-y-2">
            {songs.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                index={i}
                selected={selectedIds.has(song.id)}
                onToggle={() => onToggle(song.id)}
                job={jobs[song.id]}
                onDownload={() => onDownload(song.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
