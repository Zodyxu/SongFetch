import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import type { ConvertSettings, DownloadJob, Song } from '@/lib/types';
import { fetchFromUrl, FetchError } from '@/lib/mockFetch';
import { detectPlatform } from '@/lib/platform';
import { loadHistory, saveHistoryItem, clearHistory } from '@/lib/history';
import { estimateSize, triggerDownload, downloadZip } from '@/lib/download';
import { Logo } from '@/components/Logo';
import { LinkInput } from '@/components/LinkInput';
import { PlaylistWorkspace } from '@/components/PlaylistWorkspace';
import { ConvertPanel } from '@/components/ConvertPanel';
import { ExportAllButton } from '@/components/ExportAllButton';
import { HowItWorks } from '@/components/HowItWorks';
import { HistoryStrip } from '@/components/HistoryStrip';
import { Footer } from '@/components/Footer';
import { MobileActionBar } from '@/components/MobileActionBar';
import { SuccessToast } from '@/components/SuccessToast';
import { ErrorState } from '@/components/ErrorState';

const DEFAULT_SETTINGS: ConvertSettings = {
  format: 'mp3',
  quality: '320',
  includeMetadata: true,
  normalizeVolume: false,
};

function App() {
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [jobs, setJobs] = useState<Record<string, DownloadJob>>({});
  const [settings, setSettings] = useState<ConvertSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState(loadHistory());
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false });
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastUrl, setLastUrl] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);
  const progressTimers = useRef<Record<string, number>>({});

  const isDesktop = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches, []);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2600);
  }, []);

  const handleFetch = useCallback((url: string) => {
    setLoading(true);
    setFetchError(null);
    setSongs([]);
    setJobs({});
    setExportProgress(0);
    setLastUrl(url);
    window.setTimeout(() => {
      try {
        const result = fetchFromUrl(url);
        setSongs(result.songs);
        setIsPlaylist(result.isPlaylist);
        setSelectedIds(new Set(result.songs.map((s) => s.id)));
        setLoading(false);
        const updated = saveHistoryItem({
          url,
          title: result.isPlaylist ? `${result.songs.length}-song playlist` : result.songs[0]?.title ?? 'Track',
          songCount: result.songs.length,
          platform: detectPlatform(url),
        });
        setHistory(updated);
      } catch (err) {
        setLoading(false);
        setFetchError(err instanceof FetchError ? err.message : 'We couldn’t fetch that link. Please try again.');
      }
    }, 900);
  }, []);

  const handleReset = useCallback(() => {
    setSongs([]);
    setSelectedIds(new Set());
    setJobs({});
    setExporting(false);
    setExportProgress(0);
    setFetchError(null);
    setLastUrl('');
    Object.values(progressTimers.current).forEach((id) => window.clearInterval(id));
    progressTimers.current = {};
  }, []);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelectedIds(new Set(songs.map((s) => s.id))), [songs]);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const runJob = useCallback(
    (song: Song, onComplete?: () => void) => {
      setJobs((prev) => ({ ...prev, [song.id]: { songId: song.id, status: 'converting', progress: 0 } }));
      let p = 0;
      const id = window.setInterval(() => {
        p += 8 + Math.random() * 14;
        if (p >= 100) {
          p = 100;
          window.clearInterval(id);
          delete progressTimers.current[song.id];
          setJobs((prev) => ({ ...prev, [song.id]: { songId: song.id, status: 'downloading', progress: 100 } }));
          window.setTimeout(() => {
            const size = estimateSize(song.durationSec, settings.quality, settings.format);
            const content = `SongFetch demo file\n\nTitle: ${song.title}\nArtist: ${song.artist}\nFormat: ${settings.format.toUpperCase()}\nQuality: ${settings.quality}kbps\nSize: ~${(size / 1024).toFixed(0)} KB\nSource: ${song.sourceUrl}\n\n(This is a demo placeholder — no real media is downloaded.)`;
            triggerDownload(`${song.artist} - ${song.title}.${settings.format}`, content);
            setJobs((prev) => ({ ...prev, [song.id]: { songId: song.id, status: 'done', progress: 100 } }));
            onComplete?.();
          }, 400);
        } else {
          setJobs((prev) => ({ ...prev, [song.id]: { songId: song.id, status: 'converting', progress: Math.round(p) } }));
        }
      }, 180);
      progressTimers.current[song.id] = id;
    },
    [settings]
  );

  const handleDownload = useCallback(
    (id: string) => {
      const song = songs.find((s) => s.id === id);
      if (!song) return;
      runJob(song, () => showToast(`Saved “${song.title}”`));
    },
    [songs, runJob, showToast]
  );

  const handleExportAll = useCallback(() => {
    const selected = songs.filter((s) => selectedIds.has(s.id));
    if (selected.length === 0 || exporting) return;

    setExporting(true);
    setExportProgress(0);

    let p = 0;
    const id = window.setInterval(() => {
      p += 5 + Math.random() * 9;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        setExportProgress(100);

        if (isDesktop && selected.length > 1) {
          const entries = selected.map((s) => ({
            filename: `${s.artist} - ${s.title}.${settings.format}`,
            content: `SongFetch demo file\n\nTitle: ${s.title}\nArtist: ${s.artist}\nFormat: ${settings.format.toUpperCase()}\nQuality: ${settings.quality}kbps\nSource: ${s.sourceUrl}\n\n(This is a demo placeholder — no real media is downloaded.)`,
          }));
          entries.push({
            filename: 'SongFetch-export.txt',
            content: `SongFetch ZIP archive (demo)\n\nContains ${selected.length} files:\n\n${selected.map((s, i) => `${i + 1}. ${s.artist} - ${s.title} (${settings.format.toUpperCase()} ${settings.quality}kbps)`).join('\n')}\n\n(This is a demo placeholder ZIP — no real media is bundled.)`,
          });
          downloadZip('SongFetch-export.zip', entries);
        } else {
          selected.forEach((s, i) => {
            window.setTimeout(() => runJob(s), i * 500);
          });
        }

        window.setTimeout(() => {
          setExporting(false);
          showToast(`Exported ${selected.length} ${selected.length === 1 ? 'song' : 'songs'}`);
        }, 600);
      } else {
        setExportProgress(Math.round(p));
      }
    }, 160);
  }, [songs, selectedIds, exporting, isDesktop, settings, runJob, showToast]);

  const handleReuse = useCallback(
    (url: string) => {
      handleFetch(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [handleFetch]
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(progressTimers.current).forEach((id) => window.clearInterval(id));
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const selectedSongs = songs.filter((s) => selectedIds.has(s.id));
  const showWorkspace = loading || songs.length > 0 || fetchError !== null;

  return (
    <div className="relative min-h-screen">
      {/* ambient grid */}
      <div className="pointer-events-none fixed inset-0 bg-grid-faint bg-grid opacity-30" />

      <div className="relative">
        {/* Header */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Logo />
          <div className="hidden items-center gap-5 sm:flex">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-cyan-neon" /> No sign-up
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Zap className="h-4 w-4 text-violet-400" /> Fast conversion
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 pt-10 pb-6 text-center sm:pt-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-[11px] font-500 text-slate-300">YouTube · Spotify · Apple Music · SoundCloud</span>
          </div>
          <h1 className="font-display text-4xl font-700 leading-[1.05] tracking-tight text-white sm:text-6xl">
            Convert any song link
            <br />
            <span className="text-gradient-violet">into a download.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Paste a URL from your favorite music platform. Preview the track or playlist, choose your format and
            quality, then export — single files or a full ZIP.
          </p>

          <div className="mx-auto mt-8 max-w-2xl text-left">
            <LinkInput onFetch={handleFetch} loading={loading} />
          </div>
        </section>

        {/* Workspace */}
        {showWorkspace ? (
          <section className="mx-auto max-w-6xl px-4 pb-16 lg:pb-20">
            {fetchError ? (
              <ErrorState message={fetchError} onRetry={handleReset} />
            ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <PlaylistWorkspace
                songs={songs}
                isPlaylist={isPlaylist}
                selectedIds={selectedIds}
                jobs={jobs}
                onToggle={toggle}
                onSelectAll={selectAll}
                onClearSelection={clearSelection}
                onDownload={handleDownload}
                onReset={handleReset}
                loading={loading}
              />
              <div className="space-y-4">
                <ConvertPanel settings={settings} onChange={setSettings} selectedSongs={selectedSongs} />
                <ExportAllButton
                  selectedCount={selectedIds.size}
                  exporting={exporting}
                  exportProgress={exportProgress}
                  onExportAll={handleExportAll}
                  disabled={loading || songs.length === 0}
                  isDesktop={isDesktop}
                />
              </div>
            </div>
            )}
          </section>
        ) : (
          <>
            <HistoryStrip items={history} onReuse={handleReuse} onClear={handleClearHistory} />
            <HowItWorks />
          </>
        )}

        <Footer />
      </div>

      <MobileActionBar
        selectedCount={selectedIds.size}
        exporting={exporting}
        exportProgress={exportProgress}
        onExportAll={handleExportAll}
        disabled={songs.length === 0}
      />
      <SuccessToast message={toast.msg} visible={toast.visible} />
    </div>
  );
}

export default App;
