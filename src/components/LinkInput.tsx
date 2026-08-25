import { useRef, useState, useCallback } from 'react';
import { Link2, ArrowRight, Clipboard, Loader2, AlertCircle } from 'lucide-react';
import type { Platform } from '@/lib/types';
import { detectPlatform, isValidUrl, PLATFORM_META } from '@/lib/platform';

interface Props {
  onFetch: (url: string) => void;
  loading: boolean;
}

export function LinkInput({ onFetch, loading }: Props) {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const platform: Platform = url.trim() ? detectPlatform(url) : 'unknown';
  const meta = PLATFORM_META[platform];
  const valid = url.trim().length > 0 && isValidUrl(url);

  const submit = useCallback(() => {
    if (loading) return;
    if (!url.trim()) {
      setError('Paste a link to get started.');
      return;
    }
    if (!isValidUrl(url)) {
      setError('That doesn’t look like a valid URL.');
      return;
    }
    setError(null);
    onFetch(url.trim());
  }, [url, loading, onFetch]);

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`luminous-border glass relative rounded-2xl p-2 transition-all duration-300 ${
          focused ? 'shadow-glow' : ''
        } ${dragOver ? 'shadow-glow-cyan' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const text = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
          if (text) {
            setUrl(text.trim());
            inputRef.current?.focus();
          }
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              ref={inputRef}
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Paste YouTube, YouTube Music, Spotify, Apple Music, or SoundCloud link here..."
              aria-label="Media link"
              className="w-full bg-transparent py-3.5 pl-11 pr-3 font-mono text-sm text-white placeholder:font-sans placeholder:text-slate-500 placeholder:text-[13px] focus:outline-none"
            />
            {url.trim() && platform !== 'unknown' && (
              <span
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-500 uppercase tracking-wider sm:inline-flex"
                style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />
                {meta.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={paste}
              className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-xs font-500 text-slate-300 transition hover:border-violet-500/40 hover:text-white sm:inline-flex"
            >
              <Clipboard className="h-4 w-4" /> Paste
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="btn-glow group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-neon px-5 py-3 text-sm font-600 text-white shadow-glow transition hover:shadow-[0_0_0_1px_rgba(124,92,255,0.6),0_12px_48px_-8px_rgba(124,92,255,0.7)] disabled:opacity-70 sm:flex-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Fetching…
                </>
              ) : (
                <>
                  Fetch Song <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {dragOver && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-ink-950/80 backdrop-blur-sm">
            <span className="font-display text-sm font-600 text-cyan-neon">Drop your link</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2.5 flex items-center gap-2 px-1 text-xs text-rose-400 animate-fade-in">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}

      <p className="mt-2.5 px-1 text-[11px] text-slate-500">
        Tip: drag and drop a link directly here, or paste with Ctrl/Cmd+V. Playlists are detected automatically.
      </p>
    </div>
  );
}
