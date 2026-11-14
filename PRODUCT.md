# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Self-treat shoppers:** mostly young women in Sri Lanka who arrive from Instagram or TikTok on their phone, browse small beauty and accessory items, and buy for themselves.
- **Gift buyers:** people of any age looking for a present (birthday, anniversary, "just because"), often in a hurry, who want something that arrives ready to give.
- The two groups are roughly equal. Most visits are on a phone, often inside the Instagram or TikTok in-app browser.
- **Shop owner (admin):** checks orders, confirms bank-transfer receipts from WhatsApp, and marks orders paid or shipped from `/admin`.

## Product Purpose

An online gift and accessories shop for Sri Lanka. Customers pick items or ready-made gift sets, check out with their delivery details, get an Order ID, and send the order on WhatsApp, where they pay by bank transfer. Success means a visitor from a social post finds something they like, trusts the shop enough to transfer money, and completes the WhatsApp order.

## Positioning

- **Curated picks:** trendy, hand-picked items (K-beauty sheet masks, eye and lip masks, cute accessories) that are hard to find locally.
- **Ready gift boxes:** wrapped, ready-to-send gift sets with a personal gift note. No effort for the buyer.
- **Affordable:** small treats that fit a student budget; prices in Rs.
- **Personal service:** a real person on WhatsApp, custom requests, island-wide delivery.

## Operating Context

- Orders and payment happen on WhatsApp. The site never takes payment and never offers Cash on Delivery.
- Delivery is island-wide: Rs. 500 up to 1 kg (the rule above 1 kg is undecided).
- Stock is small and changes often; some items sell out.

## Capabilities and Constraints

- Next.js 16 (App Router, Cache Components), Tailwind CSS v4, Supabase (Postgres, Storage, Auth), hosted on Vercel.
- Catalogue: skincare (sheet, eye, lip, sleeping and foot masks, facial razors), accessories (necklaces, earrings, hair clips, everyday essentials) and curated gift sets.
- Cart → checkout → Order ID → prefilled WhatsApp message → bank transfer → receipt on WhatsApp.
- "Build Your Own Box" is planned and not built yet.
- Has a light and a dark theme with a toggle.

## Brand Commitments

- **Name: GIFMIRA** (pronounced Gif-MEE-ra), coined from Gift + Admire (a creative story, not dictionary etymology). Tagline **Little Gifts, Big Smiles.** Short line: Beauty · Accessories · Gifts.
- **Positioning:** a friendly premium-but-accessible boutique. Voice: warm, friendly, thoughtful, delightful, never snobbish.
- **Pinned palette:** Burgundy #7A1F3D (wordmark, primary buttons), Rose #E55E80 (bow/heart, accents), Blush #F7B6C8 (wraps, backgrounds), Cream #FFF6EF (main background), Champagne #D4AF7F (foil details, small separators), Dark Ink #3A1A27 (body text).
- **Pinned type:** Playfair Display for headings and wordmark; Poppins (regular/medium) for body and UI.
- **Logo:** ribbon bow with a heart and a champagne knot, plus sparkles (files in `GIFMIRA_Brand_Kit_Download/GIFMIRA_Brand_Kit/`). Avoid thin gold lettering on cream at small sizes; use burgundy for contrast.
- **Collections:** Glow (skincare and masks), Charms (jewellery and hair accessories), Moments (ready-to-gift sets), Minis (budget-friendly small treats).
- **Website menu:** Home | Skincare | Accessories | Gift Sets | Our Story | Order Help.
- Domain and trademark not verified (see the brand kit's SEO guide).

## Evidence on Hand

- No product photos yet: every product image is a placeholder until real photos are uploaded.
- No reviews, testimonials, sales numbers or press. Do not invent any.
- The WhatsApp number and bank details are placeholders.
- Brand kit assets: logos, favicon, social avatar, round sticker, thank-you card, gift tag and two AI-generated concept boards (reference only; their mock-up photos are not real product photos).
- No returns or exchange policy has been given. Do not invent one.

## Product Principles

1. **Trust before transfer.** The customer sends money to a bank account on faith: payment, delivery and contact details must be clear and honest everywhere.
2. **Phone first.** Design for a thumb on a phone screen inside a social app's browser before desktop.
3. **The gift is the moment.** Gift sets and gift notes are what make this shop special, not an add-on.
4. **Small and personal, not a marketplace.** It should feel like a real person's shop, not a big chain.

## Accessibility & Inclusion

- Customers read English. Sinhala and Tamil are not needed now.
- Text must stay readable outdoors on a phone in bright light: aim for strong contrast.
