---
name: GIFMIRA
description: Little Gifts, Big Smiles. A friendly premium gift boutique of cream paper, burgundy Playfair, blush satin ribbon and arched boutique windows.
colors:
  cream: "#FFF6EF"
  card-stock: "#FFFCF9"
  blush-wash: "#FBE7EC"
  burgundy: "#7A1F3D"
  rose: "#E55E80"
  rose-ink: "#B8325A"
  blush: "#F7B6C8"
  champagne: "#D4AF7F"
  dark-ink: "#3A1A27"
  ink-secondary: "#66404F"
  ink-tertiary: "#7E5868"
  hairline: "#ECD8D2"
  whatsapp-green: "#128C4A"
  danger: "#B4233C"
  night-ground: "#1F0F17"
  night-surface: "#2A1520"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.9rem, 6.6vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "2.6rem"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 500
rounded:
  arch: "999px 999px 18px 18px"
  field: "12px"
  card: "22px"
  panel: "28px"
  pill: "9999px"
spacing:
  section: "96px"
  gutter: "16px"
components:
  button-primary:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-outline:
    textColor: "{colors.burgundy}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-add:
    textColor: "{colors.burgundy}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 16px"
  button-whatsapp:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  product-window:
    backgroundColor: "{colors.blush-wash}"
    rounded: "{rounded.arch}"
  price-tag:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.burgundy}"
    rounded: "6px"
    padding: "10px 10px 4px"
  input-field:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
---

# Design System: GIFMIRA

## Overview

**Creative North Star: "The Gift Boutique"**

GIFMIRA is a small, thoughtful gift boutique, and every page is unwrapped like a present from it. The ground is cream paper. Headings are set in burgundy Playfair Display, with the emotional half of a phrase in italic rose ("Little Gifts, *Big Smiles.*"). Products sit in **arched boutique windows**: a blush wash with a fine champagne inner arch. Each one has a little cream **gift tag** hanging from a champagne string with its price. The brand's **bow-with-heart** mark recurs as a quiet signature: in the logo, as the bullet in lists, in the middle of champagne hairline dividers, and on the thank-you card.

The palette, fonts, logo, collections and menu are pinned by the owner's brand kit (`GIFMIRA_Brand_Kit_Download/GIFMIRA_Brand_Kit`). The design's job is to express them at boutique quality: generous space, fine lines, few weights, warm copy, never snobbish.

**Key Characteristics:**
- Cream paper, burgundy Playfair, italic rose accents, Poppins for everything practical.
- Arched windows for products and collections; price on a hanging gift tag.
- Champagne used only as foil: hairlines, the knot, sparkles and tag strings.
- Product illustrations re-toned to the brand palette until real photos arrive.
- The satin ribbon runs through the site: the hero gift box, the edges of the collections band, a vertical ribbon on the gift-set band, the ribbon timeline in "How ordering works", and a wrapped band with a bow on the bag and checkout summaries.

## Colors

### Primary
- **Burgundy**: headings, the wordmark, primary buttons, the service line and the footer.

### Secondary
- **Rose / Rose Ink**: the italic half of headlines, the bow, and links on hover. Rose Ink (#B8325A) is the text-safe shade (≥4.5:1 on cream).
- **Blush**: product windows (as the blush wash), the satin ribbon and gift wraps.
- **Champagne**: foil only. Hairlines, arch frames, the knot, sparkles and tag strings. Never used for text on cream.

### Neutral
- **Cream** (page), **Card Stock** (panels, inputs), **Blush Wash** (windows, gift-set band tint), **Dark Ink** (body), **Ink Secondary / Tertiary** (supporting text), **Hairline** (borders).
- **Dark mode:** Night Ground and Night Surface. Burgundy buttons become blush with dark ink text. Product windows stay lit (blush wash) like shop windows at night.

### Named Rules
**The Foil Rule.** Champagne is decoration (lines, knots, sparkles), never body text, as the brand kit warns.

**The Honest Badge Rule.** Badges state only real data: "Only 3 left", "Our pick" (the owner's featured flag), "Back soon". No invented reviews, ratings or "loved by customers" claims.

**The Glyph-Marks-WhatsApp Rule.** Every control that opens WhatsApp carries the WhatsApp glyph, so it is never a surprise. On the storefront these are burgundy primary pills; WhatsApp Green is kept for the admin dashboard only.

## Typography

**Display Font:** Playfair Display (with Georgia)
**Body Font:** Poppins 400/500/600

**Character:** A high-contrast editorial serif with a soft italic for warmth, paired with a rounded geometric sans for clarity on small phone screens.

### Hierarchy
- **Display** (400, clamp 2.9–5.4rem, 1.02): the home H1 only. The second line is italic Rose Ink.
- **Headline** (400, ~2.1–2.9rem): section and page titles. The emotional word is italic rose ("Shop our *collections*").
- **Title** (400, 1–1.25rem): product names under windows, step titles, card titles.
- **Body** (400, 1–1.05rem, 1.75): copy, max ~65ch.
- **Label** (500, 0.72–0.88rem): buttons, nav, badges. The logo's "BEAUTY • ACCESSORIES • GIFTS" line is part of the lockup.

### Named Rules
**The One-Italic Rule.** Each heading italicises at most one phrase, in Rose Ink, for warmth.

**The No-Eyebrow Rule.** No small caps labels above headings. The italic line *below* a title carries the collection name ("Accessories / *The Charms collection*").

## Layout

- Container max 80rem, gutters 16 / 24 / 32px. Sections are 96px apart on the home page.
- Product grids: 2 / 3 / 4 columns (base / 640 / 1024), with 48px row gaps. Home rails scroll sideways on phones (62vw per item) and wrap from 640px.
- Hero: two columns from 768px (copy left, gift-box scene right). On phones a compact gift-box scene sits above the headline, so the first screen always shows the box.
- Product pages: the window on the left, details and the buy panel on the right, side by side from 768px.
- Each centred section opens with a champagne hairline divider with the bow in the middle.

## Elevation & Depth

Mostly flat paper. Depth is reserved for objects you could hold:
- **Hanging tag / card:** `0 6px 12px -8px rgb(122 31 61 / 0.5)` to `0 24px 40px -26px rgb(122 31 61 / 0.55)`.
- **Primary button glow:** `0 12px 24px -14px rgb(122 31 61 / 0.8)`.
- **Window lift (hover):** `translateY(-6px)` plus `0 22px 34px -22px rgb(122 31 61 / 0.45)`.

### Named Rules
**The Unwrap Rule.** Motion is soft and slow (420–900ms, ease-out). A window lifts and its price tag swings on hover, a little bow floats out of the bag when something is added, and the hero box rises into place. Content is always visible by default, and all of it is off under reduced motion.

## Shapes

- **Arch:** the signature silhouette for product, collection and mini thumbnails (`999px 999px 18px 18px`), with an inner champagne arch line at 5% inset.
- **Pills** for buttons, chips and badges. **22–28px** radius for cards and panels. Inputs are 12px with a 2px border.
- **Gift tag:** a small cream rectangle with a punched hole and a champagne string.

## Components

### Product window (signature)
A blush-wash arch with a champagne inner line. Inside is the photo (cover) or the re-toned illustration. A cream price tag hangs from the top-right, and at most one badge sits at the bottom centre. Below it: the name (Playfair), the category (small), and a "+ Add to bag" outline pill that fills burgundy on hover.

### Buttons
- **Primary:** a burgundy pill with cream text (blush with dark ink in dark mode).
- **Outline:** burgundy text on a 1px burgundy/40 border.
- **WhatsApp:** the primary burgundy pill with the WhatsApp glyph in front of the label.
- **Focus:** a 2px Rose Ink outline, offset 3px.

### Inputs
Card stock fill, 2px hairline border turning burgundy on focus, a visible label above, and errors in Danger with an icon.

### Navigation
- **Service line:** a burgundy strip (delivery · WhatsApp · no COD).
- **Header:** the cream bar has the GIFMIRA lockup (bow + Playfair wordmark), the brand menu with a champagne underline on the active and hover item, the theme toggle and the bag.
- **Phones:** a full-width menu in Playfair.

### Thank-you card & gift tag
They reproduce the brand kit's print pieces in HTML: on the home "Our story" teaser, as the checkout's live gift-note preview, on the order confirmation (with the Order ID), and on the gift-set page.

## Do's and Don'ts

### Do:
- **Do** use the brand kit's bow vector (`components/brand/Brand.tsx`) for the logo and the bow details; never redraw it.
- **Do** keep illustrations inside `.art-luxe` so they stay in the brand palette; real photos replace them automatically.
- **Do** keep delivery (Rs. 500 up to 1 kg), WhatsApp ordering and "no Cash on Delivery" visible near every buying decision.
- **Do** write like the brand: warm, friendly, thoughtful, never snobbish.

### Don't:
- **Don't** use thin champagne lettering on cream (per the brand kit); use burgundy.
- **Don't** invent social proof, return policies, delivery times or ingredient claims.
- **Don't** use emoji or text glyphs as icons; use lucide (1.5–1.6px strokes), the bow, the sparkle, or the authored brand marks.
- **Don't** put white text on rose (#E55E80) at small sizes; use Rose Ink or burgundy.
