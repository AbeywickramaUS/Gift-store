import ProductArt from '@/components/art/ProductArt';

/** Tiny arched window for bag and order lists. */
export default function MiniPacket({
  slug = '',
  kind,
  isPackage = false,
  className = 'h-16 w-13',
}: {
  slug?: string;
  kind?: string;
  isPackage?: boolean;
  className?: string;
}) {
  return (
    <span className={`arch art-luxe relative block shrink-0 bg-[#fbe7ec] ring-1 ring-[#ecd8d2] ${className}`}>
      {/* inset is relative to this box (padding % would follow the parent's width) */}
      <span className="absolute inset-[14%]">
        <ProductArt slug={slug} kind={kind ?? ''} isPackage={isPackage} />
      </span>
    </span>
  );
}
