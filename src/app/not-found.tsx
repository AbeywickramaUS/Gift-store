import Link from 'next/link';
import { BowMark } from '@/components/brand/Brand';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <BowMark className="mx-auto h-14 w-auto" sparkles />
      <h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,3.6rem)] leading-tight text-brand">
        This page has been <em className="text-rose-ink">unwrapped</em>
      </h1>
      <p className="mt-4 text-ink-2">It may have moved, the item may have sold out, or the link has a little typo.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand hover:bg-brand/90">
          Back to the shop
        </Link>
        <Link href="/packages" className="rounded-full border border-brand/40 px-6 py-3.5 text-sm font-medium text-brand hover:border-brand">
          See gift sets
        </Link>
      </div>
    </div>
  );
}
