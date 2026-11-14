import type { MediaItem } from '@/lib/types';
import { sachetFor } from '@/lib/sachet';

/** Hosts listed in next.config.ts remotePatterns can go through the image optimiser. */
export function isOptimisable(item: MediaItem): boolean {
  return item.source === 'supabase' || item.source === 'cloudinary' || item.source === 'youtube';
}

/** The image to show on a card: first image, else a video's thumbnail. */
export function coverImage(media: MediaItem[]): { url: string; alt?: string; item: MediaItem } | null {
  const image = media.find((m) => m.type === 'image');
  if (image) return { url: image.url, alt: image.alt, item: image };
  const video = media.find((m) => m.type === 'video' && m.thumbnail);
  if (video?.thumbnail) return { url: video.thumbnail, alt: video.alt, item: video };
  return null;
}

/** Plain packet-colour block shown when a product has no photo yet. */
export function MediaPlaceholder({ kind, name }: { kind: string; name: string; large?: boolean }) {
  return <div role="img" aria-label={`${name} (photo coming soon)`} className="h-full w-full" style={{ backgroundColor: sachetFor(kind).bg }} />;
}
