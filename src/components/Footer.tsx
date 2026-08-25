import { Logo } from './Logo';
import { ShieldAlert } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950/60">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              A premium media conversion workspace. Paste, preview, and export audio from links you own the rights to.
            </p>
          </div>
          <div className="max-w-md">
            <div className="mb-2 flex items-center gap-2 text-amber-400/90">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs font-600 uppercase tracking-wider">Copyright notice</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              SongFetch is a demo interface and does not store, host, or distribute copyrighted media. Only convert
              content you own or have explicit permission to use. Downloading copyrighted material without permission
              may violate the rights of creators and applicable laws in your country. You are responsible for how you
              use this tool.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-slate-600">© {new Date().getFullYear()} SongFetch. Demo build.</p>
          <p className="font-mono text-[11px] text-slate-600">Built for creators · Respect copyright</p>
        </div>
      </div>
    </footer>
  );
}
