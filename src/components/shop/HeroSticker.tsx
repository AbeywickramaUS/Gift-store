import type { MediaItem } from '@/lib/types';
import { Sparkle } from '@/components/brand/Brand';
import { Badge, PriceTag, ProductWindow } from './Boutique';

/** Product page visual: one tall arched window with its price tag. */
export default function HeroSticker({
  slug,
  kind,
  isPackage = false,
  media,
  name,
  price,
  soldOut,
  stock,
  featured,
}: {
  slug: string;
  kind: string;
  isPackage?: boolean;
  media: MediaItem[];
  name: string;
  price: number;
  soldOut: boolean;
  stock: number;
  featured?: boolean;
  tape?: string;
}) {
  return (
    <div className="group relative mx-auto w-full max-w-[17rem] sm:max-w-[22rem] md:max-w-[28rem]">
      <ProductWindow slug={slug} kind={kind} isPackage={isPackage} media={media} name={name} size="lg" soldOut={soldOut} priority className="aspect-[4/5]">
        <span className="absolute bottom-[6%] left-1/2 z-20 flex -translate-x-1/2 gap-1 whitespace-nowrap">
          {soldOut && <Badge tone="muted">Back soon</Badge>}
          {!soldOut && stock <= 5 && <Badge>Only {stock} left</Badge>}
          {!soldOut && stock > 5 && featured && <Badge>One of our favourites</Badge>}
        </span>
      </ProductWindow>
      <PriceTag price={price} muted={soldOut} size="lg" className="absolute -top-2 right-[10%] z-20" />
      <Sparkle className="absolute -left-3 top-[18%] size-6" />
      <Sparkle className="absolute -right-2 bottom-[22%] size-4" />
    </div>
  );
}
