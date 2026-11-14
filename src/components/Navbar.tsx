'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';
import { Logo, Sparkle } from './brand/Brand';
import CartButton from './shop/CartButton';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const iconBtn = 'flex size-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand/8';

  return (
    <header className="sticky top-0 z-50">
      {/* Service line: the three facts every buyer needs before a bank transfer */}
      <p className="bg-[#7a1f3d] px-4 py-2 text-center text-[0.72rem] font-medium tracking-wide text-[#fff6ef] dark:bg-[#5c1730]">
        Island-wide delivery Rs. 500 <Sparkle className="mx-2 inline size-2.5 -translate-y-px" /> Order on WhatsApp{' '}
        <span className="hidden sm:inline"><Sparkle className="mx-2 inline size-2.5 -translate-y-px" /></span>
        <span className="hidden sm:inline">Bank transfer, no Cash on Delivery</span>
      </p>

      <div className="border-b border-line bg-ground">
        <nav className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8" aria-label="Main">
          <Link href="/" aria-label={`${SITE_NAME} home`} onClick={() => setOpen(false)} className="shrink-0">
            <Logo />
          </Link>

          <ul className="mx-auto hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`relative px-3 py-2 text-[0.88rem] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:bg-champagne after:transition-transform ${
                    isActive(item.href) ? 'text-brand after:scale-x-100' : 'text-ink-2 after:scale-x-0 hover:text-brand hover:after:scale-x-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button type="button" onClick={toggleTheme} className={iconBtn} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <Moon className="size-[1.15rem]" strokeWidth={1.6} aria-hidden /> : <Sun className="size-[1.15rem]" strokeWidth={1.6} aria-hidden />}
            </button>
            <CartButton />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`${iconBtn} lg:hidden`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="size-5" strokeWidth={1.6} aria-hidden /> : <Menu className="size-5" strokeWidth={1.6} aria-hidden />}
            </button>
          </div>
        </nav>

        {open && (
          <ul id="mobile-menu" className="border-t border-line px-4 pb-5 pt-2 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="flex items-center justify-between border-b border-line py-4 font-display text-2xl text-brand"
                >
                  {item.label}
                  <ArrowRight className="size-5 text-champagne" strokeWidth={1.5} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
