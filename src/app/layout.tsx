import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

// Using system font stack — avoids Google Fonts network calls
// (faster for Instagram/Facebook in-app browsers in Sri Lanka).

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} 🎁 | Sri Lanka`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['gift store', 'sri lanka gifts', 'skincare', 'accessories', 'online gifts', 'LKR'],
  openGraph: {
    title: `${SITE_NAME} 🎁 | Sri Lanka`,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_LK',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-neutral-950">
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
