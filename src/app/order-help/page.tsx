import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { SITE_NAME, whatsappLink } from '@/lib/constants';
import { DELIVERY_BASE_FEE } from '@/lib/delivery';
import PageHeader from '@/components/brand/PageHeader';
import { shelfPrice } from '@/components/shop/Boutique';
import { WhatsAppIcon } from '@/components/BrandIcons';

export const metadata: Metadata = {
  title: 'Delivery, Payment & Ordering',
  description: `How to order from ${SITE_NAME} Sri Lanka: build your bag online, send your order on WhatsApp and pay by bank transfer. Island-wide delivery, no Cash on Delivery.`,
};

const STEPS = [
  'Add treats or a gift set to your bag on this website.',
  'Check out with your name, mobile number and delivery address. You get an Order ID (like GIFT-1001) straight away.',
  'WhatsApp opens with your whole order already written. Press send so we receive it.',
  'Transfer the total to our bank account (the details are shown after checkout and in the message).',
  'Share a photo or screenshot of the transfer receipt in the same WhatsApp chat.',
  'We confirm your payment, wrap your order and send it on its way.',
];

const FAQ = [
  {
    q: 'Do I need an account?',
    a: 'No. There are no accounts or passwords. Your Order ID and your WhatsApp chat with us are all you need.',
  },
  {
    q: 'Can I pay by card or Cash on Delivery?',
    a: 'Not at the moment. Every order is paid by bank transfer before we dispatch it. We never ask for card details.',
  },
  {
    q: 'What if I don’t pay straight away?',
    a: 'We hold your order for 48 hours. Unpaid orders are cancelled after that, so please send the receipt when you can.',
  },
  {
    q: 'An item I want is sold out.',
    a: 'Tap “Tell me when it’s back” on the product page, or message us. We’ll let you know when it’s in stock again.',
  },
  {
    q: 'Can you make a custom gift set?',
    a: 'Yes! Tell us who it’s for, the occasion and your budget on WhatsApp and we’ll suggest a set.',
  },
  {
    q: 'I have a question about an order that has arrived.',
    a: 'Message us on WhatsApp with your Order ID and we’ll help.',
  },
];

function Block({ id, title, italic, children }: { id: string; title: string; italic?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 border-t border-line pt-10">
      <h2 id={`${id}-title`} className="font-display text-[1.9rem] text-brand">
        {title} {italic && <em className="text-rose-ink">{italic}</em>}
      </h2>
      <div className="mt-4 space-y-4 leading-7 text-ink-2">{children}</div>
    </section>
  );
}

export default function OrderHelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Order Help' }]}
        title="Order Help"
        italic="Delivery, payment & ordering"
        intro="Everything you need to know before you order. Still unsure? Message us. A real person replies."
      />

      <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-2 text-sm">
        {[
          ['#ordering', 'How to order'],
          ['#delivery', 'Delivery'],
          ['#payment', 'Payment'],
          ['#gifting', 'Gift wrapping & notes'],
          ['#faq', 'Questions'],
        ].map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border border-line bg-surface px-4 py-2 text-ink-2 hover:border-brand hover:text-brand">
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-14">
        <Block id="ordering" title="How to" italic="order">
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-champagne font-display italic text-brand">{i + 1}</span>
                <span className="pt-1">{s}</span>
              </li>
            ))}
          </ol>
        </Block>

        <Block id="delivery" title="Delivery" italic="island-wide">
          <p>
            We deliver anywhere in Sri Lanka. Delivery is <strong className="font-medium text-ink">{shelfPrice(DELIVERY_BASE_FEE)} for parcels up to 1 kg</strong>.
            Heavier parcels cost a little more; the exact fee is worked out from your bag&apos;s weight and shown before you confirm.
          </p>
          <p>We dispatch once your payment is confirmed, and we&apos;ll keep you updated in your WhatsApp chat.</p>
        </Block>

        <Block id="payment" title="Payment" italic="by bank transfer">
          <p>
            <strong className="font-medium text-ink">We don&apos;t offer Cash on Delivery.</strong> After checkout you&apos;ll see our bank details and your total. Please use
            your Order ID as the payment reference, then share the receipt in WhatsApp.
          </p>
          <p>We never ask for your card details or passwords.</p>
        </Block>

        <Block id="gifting" title="Gift wrapping" italic="& notes">
          <p>
            Gift sets arrive wrapped in blush paper and satin ribbon. Add a message in the gift note box at checkout (up to 300 characters) and we&apos;ll handwrite
            it on a {SITE_NAME} card.
          </p>
          <p>
            Sending it straight to someone? Just enter their address at checkout. Have a special request? <a href={whatsappLink(`Hi ${SITE_NAME}! I have a gift-wrapping request.`)} target="_blank" rel="noopener noreferrer" className="text-brand underline">Ask us on WhatsApp</a>.
          </p>
        </Block>

        <Block id="faq" title="Questions" italic="& answers">
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-ink marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <Plus className="size-4 shrink-0 text-champagne transition-transform group-open:rotate-45" strokeWidth={1.6} aria-hidden />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </Block>
      </div>

      <div className="mt-16 rounded-[24px] bg-tint p-8 text-center">
        <p className="font-display text-2xl text-brand">Still have a question?</p>
        <a
          href={whatsappLink(`Hi ${SITE_NAME}! I have a question about ordering.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand hover:bg-brand/90"
        >
          <WhatsAppIcon className="size-4" /> Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}
