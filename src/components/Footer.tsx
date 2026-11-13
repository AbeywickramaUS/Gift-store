import Link from 'next/link';
import { SITE_NAME, NO_COD_NOTICE, INSTAGRAM_URL, FACEBOOK_MESSENGER_URL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* No-COD Banner */}
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          {NO_COD_NOTICE}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-pink-600 dark:text-pink-400">
              🎁 {SITE_NAME}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Your favourite online gift & accessories shop in Sri Lanka 🇱🇰
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/skincare" className="text-neutral-600 hover:text-pink-600 dark:text-neutral-400 dark:hover:text-pink-400">Skincare & Beauty</Link></li>
              <li><Link href="/category/accessories" className="text-neutral-600 hover:text-pink-600 dark:text-neutral-400 dark:hover:text-pink-400">Fashion & Accessories</Link></li>
              <li><Link href="/packages" className="text-neutral-600 hover:text-pink-600 dark:text-neutral-400 dark:hover:text-pink-400">Gift Sets</Link></li>
              <li><Link href="/custom-box" className="text-neutral-600 hover:text-pink-600 dark:text-neutral-400 dark:hover:text-pink-400">Build Your Box</Link></li>
            </ul>
          </div>

          {/* Order Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              How to Order
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>1. Pick your gifts or build a box</li>
              <li>2. Copy your order summary</li>
              <li>3. DM us on Instagram or Facebook</li>
              <li>4. Pay via bank transfer</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href={FACEBOOK_MESSENGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-transform hover:scale-110"
                aria-label="Facebook Messenger"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Made with 💖 in Sri Lanka.</p>
          <p className="mt-1">Prices in LKR (Rs.) | Pre-payment only — No COD</p>
        </div>
      </div>
    </footer>
  );
}
