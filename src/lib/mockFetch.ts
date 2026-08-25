import type { Song, Platform } from './types';
import { detectPlatform, isPlaylistUrl } from './platform';

const ARTISTS = [
  'Nova Skyline', 'Aurora Veil', 'Kairo Voss', 'Lumen Drift', 'Sable Moon',
  'Echo Hartley', 'Vesper Lane', 'Cassian Wren', 'Iris Halo', 'Riven Cole',
  'Solen Ash', 'Mira Vex', 'Onyx Bloom', 'Thalia North', 'Caelum Rae',
];

const TITLE_A = ['Midnight', 'Neon', 'Velvet', 'Crystal', 'Paper', 'Liquid', 'Static', 'Golden', 'Hollow', 'Endless'];
const TITLE_B = ['Mirage', 'Tides', 'Pulse', 'Reverie', 'Cascade', 'Horizon', 'Bloom', 'Frequencies', 'Architecture', 'Afterglow'];

const THUMBS = [
  'https://images.pexels.com/photos/1370548/pexels-photo-1370548.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=400',
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function makeSong(url: string, platform: Platform, index: number): Song {
  const r = rng(hashString(url) + index * 97);
  const title = `${pick(TITLE_A, Math.floor(r() * TITLE_A.length))} ${pick(TITLE_B, Math.floor(r() * TITLE_B.length))}`;
  const artist = pick(ARTISTS, Math.floor(r() * ARTISTS.length));
  const durationSec = Math.floor(120 + r() * 300);
  const thumbnail = pick(THUMBS, Math.floor(r() * THUMBS.length));
  return {
    id: `${hashString(url)}-${index}`,
    title,
    artist,
    thumbnail,
    durationSec,
    sourceUrl: url,
    platform,
  };
}

export interface FetchResult {
  isPlaylist: boolean;
  songs: Song[];
}

export function fetchFromUrl(url: string): FetchResult {
  const platform = detectPlatform(url);
  if (platform === 'unknown') {
    throw new FetchError('We couldn’t recognize that link. Please paste a YouTube, Spotify, Apple Music, or SoundCloud URL.');
  }
  const playlist = isPlaylistUrl(url);
  const count = playlist ? 6 + (hashString(url) % 8) : 1;
  const songs = Array.from({ length: count }, (_, i) => makeSong(url, platform, i));
  return { isPlaylist: playlist, songs };
}

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
