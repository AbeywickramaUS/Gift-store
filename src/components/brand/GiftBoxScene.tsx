import ProductArt from '@/components/art/ProductArt';
import { Sparkle } from './Brand';

/**
 * Hero centrepiece: a GIFMIRA gift box (rose lid, blush card, satin
 * ribbon with falling tails, the brand bow) breaking out of a lit arched
 * window, with three little product windows tucked around it.
 * Decorative: the real products are listed below.
 */
export default function GiftBoxScene({ compact = false }: { compact?: boolean }) {
  // both sizes can be on the page at once (one hidden), so gradient ids must differ
  const p = compact ? 'gbc' : 'gb';
  return (
    <div aria-hidden className={`unwrap relative mx-auto w-full ${compact ? 'aspect-[1/0.86] max-w-[22rem]' : 'aspect-[1/1.02] max-w-[34rem]'}`}>
      {/* the big window */}
      <div className="arch absolute inset-x-[12%] bottom-[10%] top-0 bg-[#fbe7ec] ring-1 ring-[#ecd8d2] dark:bg-[#f6dde4]">
        <span className="arch absolute inset-[4%] border border-[#d4af7f]/60" />
      </div>

      {/* gift box, larger than the window so it breaks its bottom edge */}
      <svg viewBox="0 0 420 380" className="absolute bottom-0 left-1/2 w-[86%] -translate-x-1/2">
        <defs>
          <linearGradient id={`${p}-satinV`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#b8325a" />
            <stop offset="0.3" stopColor="#e2678a" />
            <stop offset="0.52" stopColor="#f9c2d1" />
            <stop offset="0.72" stopColor="#e2678a" />
            <stop offset="1" stopColor="#b8325a" />
          </linearGradient>
          <linearGradient id={`${p}-satinH`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#b8325a" />
            <stop offset="0.3" stopColor="#e2678a" />
            <stop offset="0.52" stopColor="#f9c2d1" />
            <stop offset="0.72" stopColor="#e2678a" />
            <stop offset="1" stopColor="#b8325a" />
          </linearGradient>
          <linearGradient id={`${p}-card`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fbd3dd" />
            <stop offset="1" stopColor="#f2a3b9" />
          </linearGradient>
          <linearGradient id={`${p}-lid`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#e9799a" />
            <stop offset="1" stopColor="#cf4f76" />
          </linearGradient>
          <radialGradient id={`${p}-contact`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#7a1f3d" stopOpacity="0.32" />
            <stop offset="1" stopColor="#7a1f3d" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* contact shadow */}
        <ellipse cx="210" cy="362" rx="190" ry="16" fill={`url(#${p}-contact)`} />
        {/* body */}
        <rect x="70" y="178" width="280" height="182" rx="10" fill={`url(#${p}-card)`} />
        <rect x="70" y="178" width="280" height="18" fill="#7a1f3d" opacity="0.1" />
        {/* ribbon around the body */}
        <rect x="70" y="250" width="280" height="36" fill={`url(#${p}-satinH)`} />
        <rect x="192" y="178" width="36" height="182" fill={`url(#${p}-satinV)`} />
        {/* lid */}
        <rect x="52" y="140" width="316" height="54" rx="10" fill={`url(#${p}-lid)`} />
        <rect x="52" y="186" width="316" height="8" fill="#7a1f3d" opacity="0.18" />
        <rect x="192" y="140" width="36" height="54" fill={`url(#${p}-satinV)`} />
        {/* foil wordmark */}
        <text x="98" y="335" fill="#7a1f3d" fontFamily="var(--font-playfair), Georgia, serif" fontSize="25" fontWeight="600" letterSpacing="1">
          GIFMIRA
        </text>
        <path d="M98 344h88" stroke="#d4af7f" strokeWidth="1.6" />
        {/* the GIFMIRA bow (brand kit vector), knot sitting on the lid */}
        <g transform="translate(96 4) scale(0.95)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M120 112 C98 65 52 49 47 82 C41 111 83 126 120 111 C157 126 199 111 193 82 C188 49 142 65 120 112" fill="none" stroke="#e55e80" strokeWidth="15" />
          <path d="M109 136 C78 101 34 99 21 122 C9 147 42 166 101 144 Z" fill="#e55e80" />
          <path d="M131 136 C162 101 206 99 219 122 C231 147 198 166 139 144 Z" fill="#e55e80" />
          {/* ribbon tails falling past the lid */}
          <path d="M104 150 C86 182 70 214 58 262 L88 248 L102 270 L117 155" fill="#c94570" />
          <path d="M136 150 C154 182 170 214 182 262 L152 248 L138 270 L123 155" fill="#c94570" />
          <rect x="107" y="129" width="26" height="29" rx="8" fill="#d4af7f" />
        </g>
      </svg>

      {/* gift tag hanging off the box */}
      <div className="absolute bottom-[34%] right-[2%] w-[21%] rotate-[8deg]">
        <span className="mx-auto block h-8 w-px bg-[#d4af7f]" />
        <div className="relative rounded-[8px] border border-[#d4af7f] bg-[#fff6ef] px-2.5 pb-3 pt-5 text-center shadow-[0_10px_18px_-12px_rgb(122_31_61/0.5)]">
          <span className="absolute left-1/2 top-1.5 size-2 -translate-x-1/2 rounded-full border border-[#d4af7f] bg-[#fbe7ec]" />
          <p className="font-display text-[0.62rem] italic leading-tight text-[#7a1f3d] sm:text-sm">For someone special</p>
        </div>
      </div>

      {/* three little product windows */}
      <div className="arch art-luxe absolute left-0 top-[34%] flex aspect-[4/5] w-[23%] items-center justify-center bg-[#fff6ef] p-[4%] shadow-[0_14px_26px_-18px_rgb(122_31_61/0.6)] ring-1 ring-[#ecd8d2]">
        <ProductArt slug="collagen-gold-eye-patches" kind="eye-masks" />
      </div>
      <div className="arch art-luxe absolute right-[1%] top-[6%] flex aspect-[4/5] w-[21%] items-center justify-center bg-[#fff6ef] p-[4%] shadow-[0_14px_26px_-18px_rgb(122_31_61/0.6)] ring-1 ring-[#ecd8d2]">
        <ProductArt slug="pearl-drop-necklace" kind="necklaces" />
      </div>
      <div className="arch art-luxe absolute left-[6%] top-[2%] flex aspect-[4/5] w-[17%] items-center justify-center bg-[#fff6ef] p-[4%] shadow-[0_14px_26px_-18px_rgb(122_31_61/0.6)] ring-1 ring-[#ecd8d2]">
        <ProductArt slug="strawberry-lip-mask" kind="lip-masks" />
      </div>

      <Sparkle className="absolute left-[30%] top-[6%] size-5" />
      <Sparkle className="absolute right-[28%] top-[1%] size-3.5" />
      <Sparkle className="absolute bottom-[18%] left-[4%] size-3" />
    </div>
  );
}
