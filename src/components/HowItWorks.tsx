import { ClipboardPaste, Settings2, Download } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardPaste,
    title: 'Paste your link',
    body: 'Drop a YouTube, Spotify, Apple Music, or SoundCloud URL. We detect the platform and fetch the track or full playlist instantly.',
  },
  {
    icon: Settings2,
    title: 'Pick format & quality',
    body: 'Choose MP3 or MP4, select up to 320kbps, and toggle metadata or volume normalization. Advanced options stay out of the way.',
  },
  {
    icon: Download,
    title: 'Export & save',
    body: 'Download individual tracks or export everything as a ZIP on desktop. On mobile, files save one at a time with progress.',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-violet-400">How it works</p>
        <h2 className="font-display text-2xl font-700 text-white sm:text-3xl">Three steps, zero friction</h2>
      </div>
      <div className="stagger grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="glass-subtle group relative p-5 transition hover:border-violet-500/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-neon/10 text-violet-400 transition group-hover:from-violet-500/30">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
            </div>
            <h3 className="mb-1.5 font-display text-base font-600 text-white">{s.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
