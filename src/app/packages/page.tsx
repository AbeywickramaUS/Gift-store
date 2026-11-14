import type { Metadata } from 'next';
import { getPackages } from '@/lib/queries';
import { SITE_NAME, whatsappLink } from '@/lib/constants';
import Shelf from '@/components/shop/Shelf';
import PageHeader from '@/components/brand/PageHeader';
import { RibbonDivider } from '@/components/brand/Brand';
import { WhatsAppIcon } from '@/components/BrandIcons';

export const metadata: Metadata = {
  title: 'Ready-to-Gift Boxes Sri Lanka',
  description: `Birthday, anniversary, skincare and everyday gift sets from ${SITE_NAME}, gift-wrapped with a handwritten note and delivered islandwide.`,
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Gift Sets' }]}
        title="Gift Sets"
        italic="The Moments collection"
        intro="Picked, wrapped in blush paper and satin ribbon, and ready to send, with your message handwritten on the card. Every set shows exactly what you save."
      />

      {packages.length === 0 ? (
        <p className="text-ink-2">New gift sets are being wrapped. Check back soon.</p>
      ) : (
        <Shelf items={packages.map((item) => ({ kind: 'package' as const, item }))} label="Gift sets" />
      )}

      <RibbonDivider className="mt-20" />
      <section className="mx-auto mt-14 max-w-2xl text-center" aria-labelledby="custom-title">
        <h2 id="custom-title" className="font-display text-[2rem] text-brand">
          Need a <em className="text-rose-ink">different mix?</em>
        </h2>
        <p className="mt-3 text-ink-2">Tell us who it&apos;s for, the occasion and your budget. We&apos;ll put together a set made just for them.</p>
        <a
          href={whatsappLink(`Hi ${SITE_NAME}! Can you make a custom gift set for me?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand hover:bg-brand/90"
        >
          <WhatsAppIcon className="size-4" /> Ask for a custom set
        </a>
      </section>
    </div>
  );
}
