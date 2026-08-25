import type { Platform } from './types';

const PATTERNS: { platform: Platform; re: RegExp }[] = [
  { platform: 'youtube-music', re: /music\.youtube\.com/i },
  { platform: 'youtube', re: /youtube\.com|youtu\.be/i },
  { platform: 'spotify', re: /spotify\.com/i },
  { platform: 'apple-music', re: /music\.apple\.com/i },
  { platform: 'soundcloud', re: /soundcloud\.com/i },
];

export function detectPlatform(url: string): Platform {
  for (const { platform, re } of PATTERNS) {
    if (re.test(url)) return platform;
  }
  return 'unknown';
}

export const PLATFORM_META: Record<Platform, { label: string; color: string; glyph: string }> = {
  youtube: { label: 'YouTube', color: '#ff3b30', glyph: 'YT' },
  'youtube-music': { label: 'YouTube Music', color: '#ff3b30', glyph: 'YTM' },
  spotify: { label: 'Spotify', color: '#1db954', glyph: 'SP' },
  'apple-music': { label: 'Apple Music', color: '#fa57c1', glyph: 'AM' },
  soundcloud: { label: 'SoundCloud', color: '#ff7700', glyph: 'SC' },
  unknown: { label: 'Direct link', color: '#7c5cff', glyph: 'DL' },
};

export function isPlaylistUrl(url: string): boolean {
  return /[?&]list=|\/playlist\//i.test(url);
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
