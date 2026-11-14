'use client';

/**
 * Shrinks a phone photo in the browser before upload: longest side
 * ≤ maxSide px, re-encoded as WebP (JPEG where WebP encoding isn't
 * supported). A 6 MB phone photo usually becomes ~150–400 KB, which
 * keeps the shop fast on mobile data and inside Supabase's free
 * bandwidth.
 */
export async function resizeImage(file: File, maxSide = 1600, quality = 0.85): Promise<{ blob: Blob; ext: 'webp' | 'jpg' }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process the image.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  const webp = await toBlob('image/webp');
  if (webp && webp.type === 'image/webp') return { blob: webp, ext: 'webp' };
  const jpg = await toBlob('image/jpeg');
  if (!jpg) throw new Error('Could not process the image.');
  return { blob: jpg, ext: 'jpg' };
}
