import { FileAudio, FileVideo, Sliders, Tag, Volume2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ConvertSettings, Format, Quality, Song } from '@/lib/types';
import { estimateSize } from '@/lib/download';

interface Props {
  settings: ConvertSettings;
  onChange: (s: ConvertSettings) => void;
  selectedSongs: Song[];
}

const QUALITIES: { value: Quality; label: string; sub: string }[] = [
  { value: '128', label: 'Standard', sub: '128 kbps' },
  { value: '192', label: 'High', sub: '192 kbps' },
  { value: '320', label: 'Very High', sub: '320 kbps' },
];

export function ConvertPanel({ settings, onChange, selectedSongs }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const totalSec = selectedSongs.reduce((a, s) => a + s.durationSec, 0);
  const estSize = selectedSongs.length ? estimateSize(totalSec, settings.quality, settings.format) : 0;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-neon/15 text-indigo-neon">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display text-sm font-700 text-white">Conversion</h2>
          <p className="font-mono text-[11px] text-slate-500">Format & quality</p>
        </div>
      </div>

      {/* Format */}
      <div className="mb-4">
        <p className="mb-2 text-[11px] font-500 uppercase tracking-wider text-slate-500">Format</p>
        <div className="grid grid-cols-2 gap-2">
          {(['mp3', 'mp4'] as Format[]).map((f) => {
            const active = settings.format === f;
            const Icon = f === 'mp3' ? FileAudio : FileVideo;
            return (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ ...settings, format: f })}
                className={`relative flex items-center gap-2.5 rounded-xl border p-3 transition-all ${
                  active
                    ? 'border-violet-500/60 bg-violet-500/[0.1] shadow-glow'
                    : 'border-white/[0.06] bg-ink-850/40 hover:border-white/15'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-violet-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className={`text-sm font-600 ${active ? 'text-white' : 'text-slate-300'}`}>{f.toUpperCase()}</p>
                  <p className="text-[10px] text-slate-500">{f === 'mp3' ? 'Audio only' : 'Video + audio'}</p>
                </div>
                {active && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(124,92,255,0.8)]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality */}
      <div className="mb-4">
        <p className="mb-2 text-[11px] font-500 uppercase tracking-wider text-slate-500">Quality</p>
        <div className="space-y-1.5">
          {QUALITIES.map((q) => {
            const active = settings.quality === q.value;
            return (
              <button
                key={q.value}
                type="button"
                onClick={() => onChange({ ...settings, quality: q.value })}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 transition-all ${
                  active ? 'border-violet-500/50 bg-violet-500/[0.08]' : 'border-white/[0.05] bg-ink-850/30 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${active ? 'border-violet-500' : 'border-white/20'}`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-violet-400" />}
                  </span>
                  <span className={`text-sm font-500 ${active ? 'text-white' : 'text-slate-300'}`}>{q.label}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{q.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced */}
      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-xs font-500 text-slate-400 transition hover:text-white"
      >
        <span>Advanced options</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
      </button>
      {advancedOpen && (
        <div className="space-y-2 animate-fade-in">
          <ToggleRow
            icon={<Tag className="h-4 w-4" />}
            label="Embed metadata"
            sub="Title, artist, artwork"
            on={settings.includeMetadata}
            onToggle={() => onChange({ ...settings, includeMetadata: !settings.includeMetadata })}
          />
          <ToggleRow
            icon={<Volume2 className="h-4 w-4" />}
            label="Normalize volume"
            sub="Consistent loudness"
            on={settings.normalizeVolume}
            onToggle={() => onChange({ ...settings, normalizeVolume: !settings.normalizeVolume })}
          />
        </div>
      )}

      {/* Estimate */}
      {selectedSongs.length > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-ink-950/40 px-3 py-2.5">
          <span className="text-[11px] text-slate-500">
            Est. size · {selectedSongs.length} {selectedSongs.length === 1 ? 'file' : 'files'}
          </span>
          <span className="font-mono text-xs font-600 text-cyan-neon">
            ~{estSize > 1024 * 1024 ? `${(estSize / (1024 * 1024)).toFixed(1)} MB` : `${(estSize / 1024).toFixed(0)} KB`}
          </span>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  on,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-ink-850/30 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="text-slate-400">{icon}</span>
        <div>
          <p className="text-xs font-500 text-slate-200">{label}</p>
          <p className="text-[10px] text-slate-500">{sub}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={`relative h-5 w-9 rounded-full transition ${on ? 'bg-violet-500' : 'bg-ink-700'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}
