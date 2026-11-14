import { SHORT_LINE, SITE_NAME } from '@/lib/constants';

/**
 * GIFMIRA bow-and-heart mark. Paths are the brand kit's own vector
 * (GIFMIRA_Brand_Kit/05_logo_icon.svg): a heart looping out of a folded
 * bow, with a champagne knot.
 */
export function BowMark({ className = 'h-10 w-auto', sparkles = false, tone = 'rose' }: { className?: string; sparkles?: boolean; tone?: 'rose' | 'cream' }) {
  const c = tone === 'cream' ? '#fff6ef' : '#e55e80';
  return (
    <svg viewBox={sparkles ? '10 40 232 182' : '15 50 210 172'} className={className} aria-hidden>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 112 C98 65 52 49 47 82 C41 111 83 126 120 111 C157 126 199 111 193 82 C188 49 142 65 120 112" fill="none" stroke={c} strokeWidth="15" />
        <path d="M109 136 C78 101 34 99 21 122 C9 147 42 166 101 144 Z" fill={c} />
        <path d="M131 136 C162 101 206 99 219 122 C231 147 198 166 139 144 Z" fill={c} />
        <path d="M104 150 C88 172 76 188 68 210 L94 202 L105 217 L117 155" fill={c} />
        <path d="M136 150 C152 172 164 188 172 210 L146 202 L135 217 L123 155" fill={c} />
        <rect x="107" y="129" width="26" height="29" rx="8" fill="#d4af7f" />
        {sparkles && (
          <>
            <path d="M221 69 L225 82 L237 86 L225 90 L221 103 L217 90 L205 86 L217 82 Z" fill="#d4af7f" />
            <circle cx="19" cy="84" r="4" fill="#d4af7f" />
          </>
        )}
      </g>
    </svg>
  );
}

/** Four-point champagne sparkle (foil detail). */
export function Sparkle({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 1.5 13.6 10.4 22.5 12 13.6 13.6 12 22.5 10.4 13.6 1.5 12 10.4 10.4Z" fill="#d4af7f" />
    </svg>
  );
}

/**
 * Horizontal GIFMIRA lockup: bow mark + Playfair wordmark (+ optional
 * "Beauty · Accessories · Gifts" line, which is part of the logo).
 */
export function Logo({ reverse = false, withLine = false, size = 'md' }: { reverse?: boolean; withLine?: boolean; size?: 'md' | 'lg' }) {
  const text = reverse ? 'text-[#fff6ef]' : 'text-brand';
  const big = size === 'lg';
  return (
    <span className="inline-flex items-center gap-2.5">
      <BowMark className={big ? 'h-12 w-auto' : 'h-8 w-auto sm:h-9'} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-[-0.005em] ${text} ${big ? 'text-4xl' : 'text-[1.6rem] sm:text-[1.8rem]'}`}>{SITE_NAME}</span>
        {withLine && (
          <span className={`mt-1 text-[0.58rem] font-medium uppercase tracking-[0.32em] ${reverse ? 'text-[#f7d6df]' : 'text-ink-2'}`}>
            {SHORT_LINE.replace(/·/g, '•')}
          </span>
        )}
      </span>
    </span>
  );
}

/** Champagne hairline with the bow in the middle (from the brand lockup). */
export function RibbonDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-champagne/70" />
      <BowMark className="h-5 w-auto" />
      <span className="h-px flex-1 bg-champagne/70" />
    </div>
  );
}

/** Satin ribbon band (blush with a soft sheen), used across hero and sections. */
export function SatinRibbon({ className = '', vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{
        background: vertical
          ? 'linear-gradient(90deg, #e9879f 0%, #f7b6c8 30%, #fbd3de 50%, #f7b6c8 70%, #e9879f 100%)'
          : 'linear-gradient(180deg, #e9879f 0%, #f7b6c8 30%, #fbd3de 50%, #f7b6c8 70%, #e9879f 100%)',
      }}
    />
  );
}
