import JSZip from 'jszip';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function estimateSize(durationSec: number, quality: string, format: string): number {
  const bitrate = format === 'mp4' ? Number(quality) * 4 : Number(quality);
  return Math.round((durationSec * bitrate * 1000) / 8);
}

export function triggerDownload(filename: string, content: BlobPart): void {
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ZipEntry {
  filename: string;
  content: string;
}

export async function buildZip(entries: ZipEntry[]): Promise<Blob> {
  const zip = new JSZip();
  entries.forEach((e) => zip.file(e.filename, e.content));
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export async function downloadZip(zipName: string, entries: ZipEntry[]): Promise<void> {
  const blob = await buildZip(entries);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
