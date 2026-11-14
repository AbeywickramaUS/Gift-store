import { Banknote, MessageCircle, Truck } from 'lucide-react';
import { whatsappLink } from '@/lib/constants';
import { DELIVERY_BASE_FEE } from '@/lib/delivery';
import { WhatsAppIcon } from '@/components/BrandIcons';
import AddToCart from './AddToCart';
import { shelfPrice } from './Shelf';

interface Props {
  type: 'product' | 'package';
  id: string;
  slug: string;
  name: string;
  price: number;
  weightGrams: number;
  stock: number;
  kind: string;
}

/** Price, stock, add-to-bag and the honest delivery/payment facts. */
export default function OrderPanel({ type, id, slug, name, price, weightGrams, stock, kind }: Props) {
  const inStock = stock > 0;
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className={`font-display text-[2.4rem] tabular-nums ${inStock ? 'text-brand' : 'text-ink-3'}`}>{shelfPrice(price)}</p>
        <p className={`text-sm font-medium ${inStock ? (stock <= 5 ? 'text-rose-ink' : 'text-ink-2') : 'text-ink-3'}`}>
          {inStock ? (stock <= 5 ? `Only ${stock} left` : 'In stock') : 'Sold out'}
        </p>
      </div>

      <div className="mt-6">
        {inStock ? (
          <AddToCart type={type} id={id} slug={slug} name={name} price={price} weightGrams={weightGrams} maxQty={stock} kind={kind} />
        ) : (
          <a
            href={whatsappLink(`Hi! Please tell me when "${name}" is back in stock.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand hover:bg-brand/90"
          >
            <WhatsAppIcon /> Tell me when it&apos;s back
          </a>
        )}
      </div>

      <ul className="mt-8 divide-y divide-line border-y border-line text-sm">
        <li className="flex gap-3 py-3.5">
          <Truck className="mt-0.5 size-5 shrink-0 text-champagne" strokeWidth={1.5} aria-hidden />
          <span className="text-ink-2">
            <strong className="font-medium text-ink">Island-wide delivery {shelfPrice(DELIVERY_BASE_FEE)}</strong> for parcels up to 1 kg.
          </span>
        </li>
        <li className="flex gap-3 py-3.5">
          <MessageCircle className="mt-0.5 size-5 shrink-0 text-champagne" strokeWidth={1.5} aria-hidden />
          <span className="text-ink-2">
            <strong className="font-medium text-ink">Ordered on WhatsApp.</strong> Check out, then send your order to us in one tap.
          </span>
        </li>
        <li className="flex gap-3 py-3.5">
          <Banknote className="mt-0.5 size-5 shrink-0 text-champagne" strokeWidth={1.5} aria-hidden />
          <span className="text-ink-2">
            <strong className="font-medium text-ink">Bank transfer, no Cash on Delivery.</strong> We dispatch once your payment is in.
          </span>
        </li>
      </ul>
    </div>
  );
}
