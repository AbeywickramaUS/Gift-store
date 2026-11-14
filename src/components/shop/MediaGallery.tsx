'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';
import type { MediaItem } from '@/lib/types';
import { MediaPlaceholder, isOptimisable } from './ProductVisual';

/** youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID → embed URL */
function youTubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

function MainMedia({ item, name }: { item: MediaItem; name: string }) {
  if (item.type === 'image') {
    return (
      <Image
        src={item.url}
        alt={item.alt ?? name}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        unoptimized={!isOptimisable(item)}
        className="object-cover"
      />
    );
  }

  if (item.source === 'youtube') {
    const embed = youTubeEmbed(item.url);
    if (embed) {
      return (
        <iframe
          src={embed}
          title={item.alt ?? `${name} video`}
          className="h-full w-full"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      );
    }
  }

  if (item.source === 'instagram') {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-brand text-on-brand"
      >
        <Play className="size-12" fill="currentColor" aria-hidden />
        <span className="text-sm font-semibold">Watch on Instagram</span>
      </a>
    );
  }

  // Short clips hosted on Supabase / Cloudinary / elsewhere
  return (
    <video
      src={item.url}
      poster={item.thumbnail}
      controls
      playsInline
      preload="metadata"
      className="h-full w-full bg-black object-contain"
    >
      <track kind="captions" />
    </video>
  );
}

/** Main viewer + thumbnail strip for product images and short videos. */
export default function MediaGallery({ media, kind, name }: { media: MediaItem[]; kind: string; name: string }) {
  const [active, setActive] = useState(0);

  if (media.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-3xl">
        <MediaPlaceholder kind={kind} name={name} large />
        <p className="absolute inset-x-0 bottom-4 text-center text-xs font-medium text-ink-3">
          Photos coming soon
        </p>
      </div>
    );
  }

  const current = media[Math.min(active, media.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-line">
        <MainMedia key={current.url} item={current} name={name} />
      </div>
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product media">
          {media.map((m, i) => {
            const thumb = m.type === 'image' ? m.url : m.thumbnail;
            const optimisable = m.type === 'image' ? isOptimisable(m) : m.source === 'youtube' || m.source === 'supabase';
            return (
              <button
                key={m.url}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`${m.type === 'video' ? 'Video' : 'Image'} ${i + 1}`}
                onClick={() => setActive(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                  i === active ? 'border-accent' : 'border-transparent hover:border-ink '
                }`}
              >
                {thumb ? (
                  <Image src={thumb} alt="" fill sizes="64px" unoptimized={!optimisable} className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-line" />
                )}
                {m.type === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white"><Play className="size-5" fill="currentColor" aria-hidden /></span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
