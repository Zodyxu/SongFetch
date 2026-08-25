export type Platform = 'youtube' | 'youtube-music' | 'spotify' | 'apple-music' | 'soundcloud' | 'unknown';

export type Format = 'mp3' | 'mp4';
export type Quality = '128' | '192' | '320';

export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  durationSec: number;
  sourceUrl: string;
  platform: Platform;
}

export interface Playlist {
  isPlaylist: boolean;
  songs: Song[];
}

export interface ConvertSettings {
  format: Format;
  quality: Quality;
  includeMetadata: boolean;
  normalizeVolume: boolean;
}

export interface HistoryItem {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  songCount: number;
  timestamp: number;
}

export interface DownloadJob {
  songId: string;
  status: 'queued' | 'converting' | 'ready' | 'downloading' | 'done' | 'error';
  progress: number;
}
