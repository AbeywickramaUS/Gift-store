import Image from 'next/image';
import type { MediaItem } from '@/lib/types';
import { formatLKR } from '@/lib/constants';
import ProductArt from '@/components/art/ProductArt';
import { coverImage, isOptimisable } from './ProductVisual';

/** Whole-rupee price: "Rs. 1,450" */
export function shelfPrice(n: number) {
  return formatLKR(n).replace(/\.00$/, '');
}

/**
 * Arched boutique window holding the product: its photo when one
 * exists, otherwise its illustration re-toned to the brand palette.
 * The window stays lit (light) in dark mode, like a shop window at night.
 */
export function ProductWindow({
  slug,
  kind,
  isPackage = false,
  media = [],
  name,
  size = 'md',
  soldOut = false,
  priority,
  className = '',
  children,
}: {
  slug: string;
  kind: string;
  isPackage?: boolean;
  media?: MediaItem[];
  name: string;
  size?: 'sm' | 'md' | 'lg';
  soldOut?: boolean;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const cover = coverImage(media);
  const pad = size === 'lg' ? 'p-[16%]' : size === 'sm' ? 'p-[12%]' : 'p-[17%]';
  return (
    <div className={`arch relative overflow-hidden bg-[#fbe7ec] ring-1 ring-[#ecd8d2] ${className}`}>
      {/* inner champagne arch line, like a window frame */}
      <span aria-hidden className="arch pointer-events-none absolute inset-[5%] z-10 border border-[#d4af7f]/60" />
      {cover ? (
        <Image
          src={cover.url}
          alt={cover.alt ?? name}
          fill
          priority={priority}
          sizes={size === 'lg' ? '(min-width: 768px) 42vw, 90vw' : size === 'sm' ? '72px' : '(min-width: 1024px) 22vw, 45vw'}
          unoptimized={!isOptimisable(cover.item)}
          className={`object-cover ${soldOut ? 'opacity-60 grayscale-[0.6]' : ''}`}
        />
      ) : (
        <div className={`art-luxe absolute inset-0 flex items-center justify-center ${pad} ${soldOut ? 'opacity-55 grayscale-[0.5]' : ''}`}>
          <ProductArt slug={slug} kind={kind} isPackage={isPackage} className="size-full drop-shadow-[0_8px_10px_rgb(122_31_61/0.12)]" />
        </div>
      )}
      {children}
    </div>
  );
}

/** Little gift tag on a champagne string, carrying the price. */
export function PriceTag({ price, muted = false, size = 'md', className = '' }: { price: number; muted?: boolean; size?: 'md' | 'lg'; className?: string }) {
  const lg = size === 'lg';
  return (
    <span className={`tag-swing flex flex-col items-center ${className}`}>
      <span aria-hidden className={`w-px bg-champagne ${lg ? 'h-6' : 'h-4'}`} />
      <span
        className={`relative rounded-[6px] border border-champagne bg-[#fff6ef] text-center font-display font-semibold tabular-nums shadow-[0_6px_12px_-8px_rgb(122_31_61/0.5)] ${
          lg ? 'px-4 pb-2 pt-3.5 text-2xl' : 'px-2.5 pb-1 pt-2.5 text-[0.95rem]'
        } ${muted ? 'text-[#7e5868]' : 'text-[#7a1f3d]'}`}
      >
        <span aria-hidden className={`absolute left-1/2 top-1 -translate-x-1/2 rounded-full border border-champagne bg-[#fbe7ec] ${lg ? 'size-2' : 'size-1.5'}`} />
        {shelfPrice(price)}
      </span>
    </span>
  );
}

/** Small pill badge. Real data only ("Only 3 left", "Popular", "Back soon"). */
export function Badge({ children, tone = 'blush' }: { children: React.ReactNode; tone?: 'blush' | 'brand' | 'muted' }) {
  const styles = {
    blush: 'bg-[#fff6ef] text-[#7a1f3d] ring-1 ring-[#f7b6c8]',
    brand: 'bg-[#7a1f3d] text-[#fff6ef]',
    muted: 'bg-[#efe4e0] text-[#66404f]',
  };
  return <span className={`inline-block rounded-full px-2.5 py-1 text-[0.7rem] font-medium tracking-wide ${styles[tone]}`}>{children}</span>;
}
