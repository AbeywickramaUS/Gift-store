import Link from 'next/link';
import { BowMark } from './Brand';

/** Shared page opening: breadcrumb, Playfair title (+ italic rose line), intro. */
export default function PageHeader({
  crumbs,
  title,
  italic,
  intro,
  center = false,
  children,
}: {
  crumbs?: { label: string; href?: string }[];
  title: string;
  italic?: string;
  intro?: React.ReactNode;
  center?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header className={`mb-10 ${center ? 'text-center' : ''}`}>
      {crumbs && (
        <nav aria-label="Breadcrumb" className={`mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-3 ${center ? 'justify-center' : ''}`}>
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-champagne">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-brand">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink-2">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      {center && <BowMark className="mx-auto mb-4 h-8 w-auto" sparkles />}
      <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.04] tracking-[-0.01em] text-brand">
        {title}
        {italic && <em className="block text-[0.62em] text-rose-ink">{italic}</em>}
      </h1>
      {intro && <div className={`mt-4 max-w-2xl leading-7 text-ink-2 ${center ? 'mx-auto' : ''}`}>{intro}</div>}
      {children}
    </header>
  );
}
