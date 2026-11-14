'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Play, Star, Trash2 } from 'lucide-react';
import type { MediaItem } from '@/lib/types';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { resizeImage } from '@/lib/image-resize';

export const MEDIA_BUCKET = 'product-media';
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

/** Storage path of a file we uploaded, from its public URL (null for outside links). */
export function storagePathOf(url: string): string | null {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

/**
 * Photos (and short videos) for a product or gift set.
 * Uploads happen straight away so you can see them; removing a photo
 * only takes effect when the product is saved (see onRemoveFile).
 */
export default function PhotoManager({
  media,
  onChange,
  folder,
  altText,
  onRemoveFile,
}: {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  /** e.g. "products/aloe-vera-sheet-mask" */
  folder: string;
  altText: string;
  /** Called with the storage path of a removed file, to delete after saving */
  onRemoveFile: (path: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList) {
    setError(null);
    const supabase = getBrowserSupabase();
    let next = [...media];
    const list = Array.from(files).slice(0, 10);
    for (const [i, file] of list.entries()) {
      setBusy(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const isVideo = file.type === 'video/mp4' || file.type === 'video/webm';
        let body: Blob = file;
        let ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        let contentType = file.type;
        if (isVideo) {
          if (file.size > MAX_VIDEO_BYTES) throw new Error(`"${file.name}" is over 20 MB. Put longer videos on YouTube and paste the link instead.`);
        } else if (file.type.startsWith('image/')) {
          const r = await resizeImage(file);
          body = r.blob;
          ext = r.ext;
          contentType = r.blob.type;
        } else {
          throw new Error(`"${file.name}" isn't a photo or MP4/WebM video.`);
        }
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from(MEDIA_BUCKET).upload(path, body, { contentType, cacheControl: '31536000', upsert: false });
        if (upErr) throw new Error(upErr.message);
        const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        next = [...next, { type: isVideo ? 'video' : 'image', url: data.publicUrl, source: 'supabase', alt: altText }];
        onChange(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed.');
      }
    }
    setBusy(null);
    if (input.current) input.current.value = '';
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= media.length) return;
    const next = [...media];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const remove = (i: number) => {
    const path = storagePathOf(media[i].url);
    if (path) onRemoveFile(path);
    onChange(media.filter((_, j) => j !== i));
  };

  const iconBtn = 'flex size-8 items-center justify-center rounded-full bg-surface/95 text-ink shadow hover:bg-surface disabled:opacity-30';

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((m, i) => (
          <figure key={m.url} className="relative overflow-hidden rounded-2xl border-2 border-line bg-ground">
            <div className="relative aspect-square">
              {m.type === 'image' ? (
                <Image src={m.url} alt={m.alt ?? altText} fill sizes="200px" className="object-cover" unoptimized={m.source !== 'supabase'} />
              ) : (
                <div className="flex size-full items-center justify-center bg-brand text-on-brand">
                  <Play className="size-10" fill="currentColor" aria-hidden />
                  <span className="sr-only">Video</span>
                </div>
              )}
            </div>
            {i === 0 && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-tint px-2 py-0.5 text-xs font-medium text-[#3a1a27]">
                <Star className="size-3" fill="currentColor" aria-hidden /> Cover
              </span>
            )}
            <figcaption className="flex items-center justify-between gap-1 p-2">
              <div className="flex gap-1">
                <button type="button" className={iconBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move earlier">
                  <ArrowLeft className="size-4" aria-hidden />
                </button>
                <button type="button" className={iconBtn} onClick={() => move(i, i + 1)} disabled={i === media.length - 1} aria-label="Move later">
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
              <div className="flex gap-1">
                {i !== 0 && (
                  <button type="button" className={iconBtn} onClick={() => move(i, 0)} aria-label="Make this the cover photo">
                    <Star className="size-4" aria-hidden />
                  </button>
                )}
                <button type="button" className={`${iconBtn} hover:text-danger`} onClick={() => remove(i)} aria-label="Remove photo">
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </figcaption>
          </figure>
        ))}

        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={!!busy}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/30 bg-surface p-3 text-center text-sm font-medium text-ink-2 hover:border-ink hover:text-ink disabled:cursor-wait"
        >
          {busy ? <Loader2 className="size-7 animate-spin" aria-hidden /> : <ImagePlus className="size-7" aria-hidden />}
          {busy ?? 'Add photos'}
          {!busy && <span className="text-xs font-medium text-ink-3">From your phone or computer</span>}
        </button>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*,video/mp4,video/webm"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => e.target.files && e.target.files.length > 0 && upload(e.target.files)}
      />
      <p className="mt-2 text-xs text-ink-3">
        The first photo is the cover shown on the shop. Square photos on a plain background look best. Photos are resized automatically.
      </p>
      {error && <p role="alert" className="mt-2 text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}
