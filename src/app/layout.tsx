import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

// GIFMIRA brand type: Playfair Display (headings, wordmark) + Poppins (body, UI).
// next/font downloads them at build time and serves them from this site.
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], display: 'swap', variable: '--font-playfair' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-poppins' });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Korean Skincare, Cute Accessories & Gift Sets in Sri Lanka`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['GIFMIRA', 'gift sets sri lanka', 'korean skincare sri lanka', 'sheet masks', 'k-beauty', 'cute accessories', 'gift box sri lanka'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')),
  openGraph: {
    title: `${SITE_NAME} | Little Gifts, Big Smiles.`,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_LK',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff6ef' },
    { media: '(prefers-color-scheme: dark)', color: '#1f0f17' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply saved / device theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-ground font-sans text-ink antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
