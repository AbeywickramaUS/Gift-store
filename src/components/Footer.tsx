import Link from 'next/link';
import { cacheLife } from 'next/cache';
import { SITE_NAME, TAGLINE, INSTAGRAM_URL, FACEBOOK_URL, whatsappLink } from '@/lib/constants';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './BrandIcons';
import { Logo, Sparkle } from './brand/Brand';

/** Cache Components forbids raw `new Date()` while prerendering; cache the year for a day. */
async function CopyrightYear() {
  'use cache';
  cacheLife('days');
  return <>{new Date().getFullYear()}</>;
}

const SHOP = [
  { label: 'Glow · Skincare', href: '/category/skincare' },
  { label: 'Charms · Accessories', href: '/category/accessories' },
  { label: 'Moments · Gift Sets', href: '/packages' },
  { label: 'Minis · Under Rs. 500', href: '/minis' },
];
const HELP = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'Order Help', href: '/order-help' },
  { label: 'Delivery & payment', href: '/order-help#delivery' },
  { label: 'Your bag', href: '/cart' },
];

export default function Footer() {
  const link = 'text-[#f6dfe5] underline-offset-4 hover:text-white hover:underline';
  return (
    <footer className="mt-24 bg-[#7a1f3d] text-[#fff6ef] dark:bg-[#4a1226]">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo reverse withLine size="lg" />
            <p className="mt-6 font-display text-2xl italic text-[#f7b6c8]">{TAGLINE}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#f6dfe5]">
              K-beauty treats, cute accessories and ready-to-gift sets, hand-picked and wrapped with love in Sri Lanka.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#fff6ef] px-5 py-3 text-sm font-medium text-[#7a1f3d] hover:bg-white"
            >
              <WhatsAppIcon className="size-4" /> Chat with us on WhatsApp
            </a>
          </div>

          <nav aria-label="Shop">
            <h2 className="font-display text-lg">Shop</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {SHOP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help">
            <h2 className="font-display text-lg">Help</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {HELP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-14 flex items-center gap-3 border-y border-[#d4af7f]/40 py-4 text-sm text-[#fff6ef]">
          <Sparkle className="size-3.5 shrink-0" />
          No Cash on Delivery. Every order is paid by bank transfer before we pack and dispatch it.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#f0cfd8]">
          <p>
            © <CopyrightYear /> {SITE_NAME} · Prices in Sri Lankan rupees ·{' '}
            <Link href="/dev-blog" className="underline-offset-4 hover:text-white hover:underline">How this site was built</Link>
          </p>
          <div className="flex gap-1">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="GIFMIRA on Instagram" className="flex size-9 items-center justify-center rounded-full hover:bg-white/10 hover:text-white">
              <InstagramIcon className="size-[1.15rem]" />
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="GIFMIRA on Facebook" className="flex size-9 items-center justify-center rounded-full hover:bg-white/10 hover:text-white">
              <FacebookIcon className="size-[1.15rem]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
