import type { HistoryItem } from './types';
import { detectPlatform } from './platform';

const KEY = 'songfetch:history';
const MAX = 12;

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp' | 'platform'> & { platform?: HistoryItem['platform'] }): HistoryItem[] {
  const existing = loadHistory();
  const next: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url: item.url,
    platform: item.platform ?? detectPlatform(item.url),
    title: item.title,
    songCount: item.songCount,
    timestamp: Date.now(),
  };
  const dedup = existing.filter((h) => h.url !== item.url);
  const updated = [next, ...dedup].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    /* ignore quota */
  }
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
