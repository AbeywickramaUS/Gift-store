/**
 * Hand-authored product illustrations (no photos exist yet).
 * Flat sticker style: plum outline, flat fills, 120×120 grid.
 * Each known product slug gets its own drawing; anything new falls
 * back to its sub-category's drawing. Real photos replace these later.
 */

const INK = '#2a1b3d';
const O = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const LINE = { ...O, fill: 'none' };

function Sparkle({ x, y, s = 1, fill = '#ffffff' }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-9 2.3-2.3 9 0 2.3 2.3 0 9-2.3 2.3-9 0-2.3-2.3Z"
      fill={fill}
      {...O}
      strokeWidth={2.5 / s}
    />
  );
}

/* ---------- Skincare ---------- */

function SheetMask({ tint, ingredient }: { tint: string; ingredient: 'aloe' | 'honey' | 'tea' | 'none' }) {
  return (
    <>
      <path d="M60 10c26 0 40 20 40 46 0 30-17 52-40 52S20 86 20 56c0-26 14-46 40-46Z" fill={tint} {...O} />
      <ellipse cx="45" cy="50" rx="9" ry="5" fill="#fff" {...O} />
      <ellipse cx="75" cy="50" rx="9" ry="5" fill="#fff" {...O} />
      <path d="M60 56v12" {...LINE} />
      <path d="M50 82q10 7 20 0" {...LINE} />
      <circle cx="37" cy="68" r="5" fill="#ff9db4" opacity="0.75" />
      <circle cx="83" cy="68" r="5" fill="#ff9db4" opacity="0.75" />
      {ingredient !== 'none' && (
        <g>
          <circle cx="92" cy="92" r="21" fill="#fff" {...O} />
          {ingredient === 'aloe' && (
            <>
              <path d="M92 108c-5-11-5-22 0-32 5 10 5 21 0 32Z" fill="#4fbf86" {...O} strokeWidth={2.5} />
              <path d="M92 108c-9-6-14-13-15-22 8 4 13 12 15 22Z" fill="#7fd6a6" {...O} strokeWidth={2.5} />
              <path d="M92 108c9-6 14-13 15-22-8 4-13 12-15 22Z" fill="#7fd6a6" {...O} strokeWidth={2.5} />
            </>
          )}
          {ingredient === 'honey' && (
            <>
              <path d="M92 76c7 9 11 15 11 20a11 11 0 0 1-22 0c0-5 4-11 11-20Z" fill="#f5b72e" {...O} strokeWidth={2.5} />
              <path d="M88 96a4 4 0 0 0 4 4" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
            </>
          )}
          {ingredient === 'tea' && (
            <>
              <path d="M79 104c0-15 11-26 26-26 0 15-11 26-26 26Z" fill="#7cc06b" {...O} strokeWidth={2.5} />
              <path d="M82 101l19-19" fill="none" {...O} strokeWidth={2.5} />
            </>
          )}
        </g>
      )}
    </>
  );
}

function EyePatches() {
  return (
    <>
      <path d="M12 46c10 24 38 28 52 6-17 9-38 6-52-6Z" fill="#f5c451" {...O} transform="rotate(-10 38 56)" />
      <path d="M56 70c10 24 38 28 52 6-17 9-38 6-52-6Z" fill="#f5c451" {...O} transform="rotate(10 82 80)" />
      <path d="M26 54c8 6 18 8 28 6" fill="none" stroke="#fff3c4" strokeWidth={3} strokeLinecap="round" transform="rotate(-10 38 56)" />
      <Sparkle x={92} y={30} s={1.3} fill="#fff6cf" />
      <Sparkle x={24} y={94} s={1} fill="#fff6cf" />
      <Sparkle x={70} y={22} s={0.7} fill="#fff6cf" />
    </>
  );
}

function StrawberryJar() {
  return (
    <>
      <rect x="26" y="46" width="68" height="56" rx="16" fill="#ffc2d4" {...O} />
      <rect x="30" y="26" width="60" height="22" rx="9" fill="#ff6f91" {...O} />
      <path d="M36 34h48" fill="none" stroke="#ffb3c6" strokeWidth={3} strokeLinecap="round" />
      <path d="M60 60c11 0 16 7 14 15-2 9-8 15-14 17-6-2-12-8-14-17-2-8 3-15 14-15Z" fill="#ff4d6d" {...O} />
      <path d="M51 61l9-7 9 7-9 3Z" fill="#4fbf86" {...O} strokeWidth={2.5} />
      <circle cx="55" cy="71" r="1.8" fill="#ffe17a" />
      <circle cx="65" cy="71" r="1.8" fill="#ffe17a" />
      <circle cx="60" cy="80" r="1.8" fill="#ffe17a" />
      <Sparkle x={100} y={34} s={1} />
    </>
  );
}

function CherryLips() {
  return (
    <>
      <g transform="translate(0 12)">
        <path d="M12 60c12-18 29-24 48-12 19-12 36-6 48 12-12 22-29 32-48 32S24 82 12 60Z" fill="#ff5c8a" {...O} />
        <path d="M16 60c22 7 66 7 88 0" {...LINE} />
        <path d="M36 76c8 4 18 6 26 5" fill="none" stroke="#ffc2d4" strokeWidth={3} strokeLinecap="round" />
      </g>
      <path d="M86 14c-4 8-8 13-11 20M86 14c2 9 7 14 13 18" {...LINE} />
      <circle cx="74" cy="38" r="8" fill="#d7263d" {...O} />
      <circle cx="100" cy="36" r="8" fill="#d7263d" {...O} />
      <path d="M86 14c7-8 15-8 20-3-7 6-14 6-20 3Z" fill="#4fbf86" {...O} strokeWidth={2.5} />
    </>
  );
}

function SleepingTub() {
  return (
    <>
      <path d="M24 56h72l-6 40a10 10 0 0 1-10 9H40a10 10 0 0 1-10-9Z" fill="#3a3f8f" {...O} />
      <rect x="18" y="38" width="84" height="20" rx="9" fill="#6b70c9" {...O} />
      <path d="M68 66a13 13 0 1 0 0 24 11 11 0 1 1 0-24Z" fill="#ffe17a" {...O} strokeWidth={2.5} />
      <Sparkle x={46} y={74} s={0.8} fill="#ffe17a" />
      <Sparkle x={92} y={24} s={1.2} fill="#ffe17a" />
      <Sparkle x={24} y={22} s={0.8} fill="#ffe17a" />
    </>
  );
}

function FootSock() {
  return (
    <>
      <path d="M38 12h32v54c0 6 4 10 10 14l13 9c9 6 6 21-6 23-9 2-17 0-25-4L42 98c-8-4-12-12-12-20V20c0-4 4-8 8-8Z" fill="#a8e6cf" {...O} />
      <path d="M34 26h38" {...LINE} />
      <path d="M46 52c8 2 14 2 20 0M50 66c6 2 12 2 16 0" fill="none" stroke="#e6fff3" strokeWidth={3} strokeLinecap="round" />
      <path d="M86 30c0-11 8-17 19-17 0 11-8 17-19 17Z" fill="#4fbf86" {...O} />
      <path d="M88 28l13-11" {...LINE} strokeWidth={2.5} />
      <Sparkle x={98} y={58} s={0.8} />
    </>
  );
}

function Razors() {
  const colors = ['#ff9db4', '#c9b8ff', '#8ee3c8'];
  return (
    <>
      {colors.map((c, i) => {
        const x = 34 + i * 26;
        const rot = (i - 1) * 12;
        return (
          <g key={c} transform={`rotate(${rot} 60 80)`}>
            <rect x={x - 4} y="46" width="8" height="62" rx="4" fill={c} {...O} />
            <rect x={x - 13} y="18" width="26" height="28" rx="7" fill="#fff" {...O} />
            <path d={`M${x - 7} 30h14M${x - 7} 36h14`} {...LINE} strokeWidth={2.5} />
          </g>
        );
      })}
    </>
  );
}

/* ---------- Accessories ---------- */

function Chain({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#e9c35a" strokeWidth={3} strokeLinecap="round" strokeDasharray="3 4" />
    </>
  );
}

function PearlNecklace() {
  return (
    <>
      <Chain d="M16 16c4 42 24 64 44 64s40-22 44-64" />
      <path d="M60 80v8" {...LINE} />
      <circle cx="60" cy="100" r="13" fill="#fffaf3" {...O} />
      <circle cx="55" cy="95" r="3.5" fill="#efe6ff" />
      <Sparkle x={88} y={96} s={0.8} fill="#fff6cf" />
    </>
  );
}

function InitialNecklace() {
  return (
    <>
      <Chain d="M16 16c4 40 24 60 44 60s40-20 44-60" />
      <path d="M60 76v6" {...LINE} />
      <circle cx="60" cy="98" r="17" fill="#f5c451" {...O} />
      <text x="60" y="105.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="21" fontWeight="700" fill={INK}>
        A
      </text>
      <Sparkle x={90} y={92} s={0.8} fill="#fff6cf" />
    </>
  );
}

function Butterfly({ x, y, s, c }: { x: number; y: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-8" cy="-5" rx="9" ry="11" transform="rotate(-30 -8 -5)" fill={c} {...O} strokeWidth={2.5 / s} />
      <ellipse cx="8" cy="-5" rx="9" ry="11" transform="rotate(30 8 -5)" fill={c} {...O} strokeWidth={2.5 / s} />
      <ellipse cx="-6" cy="8" rx="5.5" ry="7" fill={c} {...O} strokeWidth={2.5 / s} />
      <ellipse cx="6" cy="8" rx="5.5" ry="7" fill={c} {...O} strokeWidth={2.5 / s} />
      <path d="M0-11v22" fill="none" stroke={INK} strokeWidth={3 / s} strokeLinecap="round" />
    </g>
  );
}

function ButterflyNecklace() {
  return (
    <>
      <Chain d="M18 12c4 30 22 46 42 46s38-16 42-46" />
      <Chain d="M12 18c4 46 26 72 48 72s44-26 48-72" />
      <Butterfly x={60} y={60} s={0.8} c="#c9b8ff" />
      <Butterfly x={60} y={96} s={1.15} c="#ff9db4" />
    </>
  );
}

function Hoops() {
  const hoops = [
    { cx: 32, cy: 58, r: 17, c: '#e9c35a' },
    { cx: 60, cy: 72, r: 22, c: '#cfd5e2' },
    { cx: 90, cy: 56, r: 17, c: '#f2a7a0' },
  ];
  return (
    <>
      {hoops.map((h) => (
        <g key={h.c}>
          <circle cx={h.cx} cy={h.cy} r={h.r} fill="none" stroke={INK} strokeWidth={11} />
          <circle cx={h.cx} cy={h.cy} r={h.r} fill="none" stroke={h.c} strokeWidth={5.5} />
        </g>
      ))}
      <Sparkle x={100} y={96} s={0.9} fill="#fff6cf" />
    </>
  );
}

const HEART = 'M60 96C32 78 22 60 34 48c8-8 19-5 26 6 7-11 18-14 26-6 12 12 2 30-26 48Z';

function HeartStuds() {
  return (
    <>
      <g transform="translate(-6 -10) scale(0.72)">
        <path d={HEART} fill="#ff7fae" {...O} strokeWidth={4.8} />
        <path d="M42 56c2-4 6-6 10-5" fill="none" stroke="#ffd3e4" strokeWidth={4} strokeLinecap="round" />
      </g>
      <g transform="translate(40 26) scale(0.72)">
        <path d={HEART} fill="#ff7fae" {...O} strokeWidth={4.8} />
        <path d="M42 56c2-4 6-6 10-5" fill="none" stroke="#ffd3e4" strokeWidth={4} strokeLinecap="round" />
      </g>
      <Sparkle x={96} y={24} s={1} fill="#fff6cf" />
    </>
  );
}

function ClawClip() {
  return (
    <>
      <path d="M18 56c10-24 74-24 84 0l-9 5c-11-14-55-14-66 0Z" fill="#c9b8ff" {...O} />
      <path d="M20 62h80l-7 32-8-19-8 24-9-24-8 24-9-24-8 24-8-24-8 19Z" fill="#8ee3c8" {...O} />
      <circle cx="60" cy="54" r="7" fill="#fff" {...O} />
      <Sparkle x={100} y={26} s={0.9} />
    </>
  );
}

function PearlPins() {
  return (
    <>
      {[0, 1, 2].map((i) => {
        const dx = i * 18;
        return (
          <g key={i}>
            <path d={`M${14 + dx} 104 L${72 + dx} 34`} {...LINE} strokeWidth={4} />
            <path d={`M${22 + dx} 106 L${78 + dx} 40`} {...LINE} strokeWidth={4} />
            <circle cx={75 + dx} cy={32} r="10" fill="#fffaf3" {...O} />
            <circle cx={72 + dx} cy={29} r="2.8" fill="#efe6ff" />
          </g>
        );
      })}
    </>
  );
}

function Scrunchie() {
  const folds = Array.from({ length: 12 }, (_, k) => (k * Math.PI) / 6);
  return (
    <>
      <circle cx="84" cy="34" r="17" fill="none" stroke={INK} strokeWidth={17} />
      <circle cx="84" cy="34" r="17" fill="none" stroke="#c9b8ff" strokeWidth={10} />
      <circle cx="54" cy="68" r="30" fill="none" stroke={INK} strokeWidth={27} />
      <circle cx="54" cy="68" r="30" fill="none" stroke="#ff9db4" strokeWidth={20} />
      {folds.map((a) => (
        <path
          key={a}
          d={`M${54 + Math.cos(a) * 22} ${68 + Math.sin(a) * 22}L${54 + Math.cos(a + 0.18) * 38} ${68 + Math.sin(a + 0.18) * 38}`}
          stroke="#d9668c"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

function CompactMirror() {
  return (
    <>
      <rect x="53" y="14" width="14" height="10" rx="3" fill="#f5c451" {...O} />
      <circle cx="60" cy="64" r="42" fill="#f5c451" {...O} />
      <circle cx="60" cy="64" r="31" fill="#dff3ff" {...O} />
      <path d="M42 56l14-14M46 68l22-22" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      <Sparkle x={100} y={100} s={0.9} fill="#fff6cf" />
    </>
  );
}

/* ---------- Gift sets ---------- */

function GiftBox({ color }: { color: string }) {
  return (
    <>
      <rect x="22" y="58" width="76" height="50" rx="7" fill={color} {...O} />
      <rect x="22" y="58" width="76" height="50" rx="7" fill="#000" opacity="0.1" />
      <rect x="15" y="40" width="90" height="22" rx="7" fill={color} {...O} />
      <rect x="53" y="40" width="14" height="68" fill="#ffd84d" {...O} />
      <path d="M60 40c-9-17-33-21-31-6 2 8 18 9 31 6Z" fill="#ffd84d" {...O} />
      <path d="M60 40c9-17 33-21 31-6-2 8-18 9-31 6Z" fill="#ffd84d" {...O} />
      <circle cx="60" cy="40" r="6.5" fill="#ffd84d" {...O} />
      <Sparkle x={104} y={24} s={1} fill="#fff6cf" />
    </>
  );
}

/* ---------- Lookup ---------- */

type Art = () => React.ReactNode;

const BY_SLUG: Record<string, Art> = {
  'aloe-vera-sheet-mask': () => <SheetMask tint="#c4f1de" ingredient="aloe" />,
  'honey-rice-sheet-mask': () => <SheetMask tint="#ffe7a8" ingredient="honey" />,
  'green-tea-sheet-mask': () => <SheetMask tint="#d8edb4" ingredient="tea" />,
  'collagen-gold-eye-patches': EyePatches,
  'strawberry-lip-mask': StrawberryJar,
  'cherry-lip-patch': CherryLips,
  'overnight-sleeping-mask': SleepingTub,
  'peppermint-foot-mask': FootSock,
  'facial-razor-3-pack': Razors,
  'pearl-drop-necklace': PearlNecklace,
  'initial-letter-necklace': InitialNecklace,
  'butterfly-layered-necklace': ButterflyNecklace,
  'mini-hoop-earrings-set': Hoops,
  'heart-stud-earrings': HeartStuds,
  'pastel-claw-clips': ClawClip,
  'pearl-hair-pins': PearlPins,
  'satin-scrunchies': Scrunchie,
  'compact-pocket-mirror': CompactMirror,
};

const BY_KIND: Record<string, Art> = {
  'sheet-masks': () => <SheetMask tint="#e3dcff" ingredient="none" />,
  'eye-masks': EyePatches,
  'lip-masks': CherryLips,
  'sleeping-masks': SleepingTub,
  'foot-masks': FootSock,
  'facial-razors': Razors,
  necklaces: PearlNecklace,
  earrings: HeartStuds,
  'hair-clips': ClawClip,
  'everyday-essentials': CompactMirror,
};

const SET_COLOURS: Record<string, string> = {
  'skincare-sets': '#4fc2a8',
  'birthday-gifts': '#ff6fa5',
  'anniversary-gifts': '#d6456b',
  'everyday-essentials': '#9bcf5a',
};

export default function ProductArt({
  slug,
  kind,
  isPackage = false,
  label,
  className = 'size-full',
}: {
  slug: string;
  kind: string;
  isPackage?: boolean;
  /** Accessible name; omit when the product name is already next to the art */
  label?: string;
  className?: string;
}) {
  const art = isPackage ? () => <GiftBox color={SET_COLOURS[kind] ?? '#ff9db4'} /> : (BY_SLUG[slug] ?? BY_KIND[kind] ?? (() => <GiftBox color="#c9b8ff" />));
  return (
    <svg viewBox="0 0 120 120" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {art()}
    </svg>
  );
}
