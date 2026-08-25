import { History, Trash2, ArrowUpRight } from 'lucide-react';
import type { HistoryItem } from '@/lib/types';
import { PLATFORM_META } from '@/lib/platform';
import { formatRelative } from '@/lib/history';

interface Props {
  items: HistoryItem[];
  onReuse: (url: string) => void;
  onClear: () => void;
}

export function HistoryStrip({ items, onReuse, onClear }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-12">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-500" />
          <h3 className="font-display text-sm font-600 text-slate-300">Recent</h3>
          <span className="font-mono text-[11px] text-slate-600">{items.length}</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-rose-400"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {items.map((item) => {
          const meta = PLATFORM_META[item.platform];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onReuse(item.url)}
              className="group flex min-w-[200px] shrink-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-850/40 p-3 text-left transition hover:border-violet-500/40 hover:bg-ink-800/60"
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-600"
                style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
              >
                {meta.glyph}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-600 text-slate-200">{item.title}</span>
                <span className="block font-mono text-[10px] text-slate-500">
                  {item.songCount} {item.songCount === 1 ? 'track' : 'tracks'} · {formatRelative(item.timestamp)}
                </span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-violet-400" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
