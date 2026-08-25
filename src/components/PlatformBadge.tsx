import type { Platform } from '@/lib/types';
import { PLATFORM_META } from '@/lib/platform';

export function PlatformBadge({ platform, size = 'md' }: { platform: Platform; size?: 'sm' | 'md' }) {
  const meta = PLATFORM_META[platform];
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-500 uppercase tracking-wider ${pad}`}
      style={{ backgroundColor: `${meta.color}1a`, color: meta.color, boxShadow: `inset 0 0 0 1px ${meta.color}33` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />
      {meta.label}
    </span>
  );
}
