/**
 * The Lumi Lane ink stamp: a round rubber-stamp impression with a broken, uneven edge.
 * Used in exactly three places: the Loyalty stamp card, the booking "Requested" slip and the footer.
 *
 * Ink variation is deterministic (seeded), so server and client render the same marks and
 * eight stamps on one card never look identical.
 */

interface InkStampProps {
  /** Unique id prefix for the SVG mask and text path (must be unique on the page). */
  id: string;
  /** Optional word printed in a solid band across the stamp, e.g. "Requested". */
  word?: string;
  /** Seed for the ink weight, rotation and speckle pattern. */
  seed?: number;
  className?: string;
}

const RING_TEXT = 'LUMI LANE · COFFEE HOUSE & BAR · LIGHTSVIEW SA · ';
const CUP =
  'M9 16h18v5a9 9 0 0 1-18 0v-5Zm18 2h3a3 3 0 0 1 0 6h-4M8 32h23M16 13c-3-3 3-4 0-7m6 7c-3-3 3-4 0-7';

/** Small deterministic PRNG (mulberry32). */
function random(seed: number) {
  let a = (seed * 2654435761) >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

export function InkStamp({ id, word, seed = 1, className }: InkStampProps) {
  const rand = random(seed + 7);
  const weight = 0.88 + rand() * 0.24; // ink load: thinner or heavier strokes
  const opacity = round(0.8 + rand() * 0.16);
  const tilt = round((rand() - 0.5) * 10);
  const gapStart = round(rand() * 300);

  // Speckles where the rubber did not take ink: concentrated on the rings, a few inside.
  const specks = Array.from({ length: 34 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const ring = i < 22 ? 49 + rand() * 8 : 18 + rand() * 30;
    return {
      cx: round(60 + Math.cos(angle) * ring),
      cy: round(60 + Math.sin(angle) * ring),
      r: round(0.35 + rand() * (i < 22 ? 1.25 : 0.7)),
    };
  });
  // One or two worn arcs on the outer ring.
  const wornArc = round(14 + rand() * 22);

  // Words longer than "Requested" are set tighter so they stay inside the band.
  const long = (word?.length ?? 0) > 9;
  const mask = `${id}-ink`;
  const ring = `${id}-ring`;
  const band = `${id}-band`;

  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      <defs>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#fff" />
          {specks.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#000" />
          ))}
        </mask>
        <path id={ring} d="M60 60m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
        {word && (
          <mask id={band} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
            <rect x="4" y="50" width="112" height="20" fill="#fff" />
            <text
              x="60"
              y="64.2"
              fill="#000"
              textAnchor="middle"
              fontFamily="Archivo, sans-serif"
              fontWeight="600"
              fontSize={long ? 9 : 10.5}
              letterSpacing={long ? 1.4 : 2.4}
              {...(long ? { textLength: 98, lengthAdjust: 'spacingAndGlyphs' } : {})}
            >
              {word.toUpperCase()}
            </text>
          </mask>
        )}
      </defs>
      <g
        mask={`url(#${mask})`}
        opacity={opacity}
        transform={`rotate(${tilt} 60 60)`}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="60"
          cy="60"
          r="55"
          strokeWidth={round(3.1 * weight)}
          strokeDasharray={`${round(345 - wornArc)} ${round(wornArc * 0.08)} ${wornArc} 0.6`}
          strokeDashoffset={gapStart}
        />
        <circle cx="60" cy="60" r="49.5" strokeWidth={round(0.95 * weight)} />
        <text
          fill="currentColor"
          stroke="none"
          fontFamily="Archivo, sans-serif"
          fontWeight="600"
          fontSize="8.4"
          textLength="246"
          lengthAdjust="spacing"
        >
          <textPath href={`#${ring}`}>{RING_TEXT}</textPath>
        </text>
        {word ? (
          <>
            <rect x="4" y="50" width="112" height="20" fill="currentColor" stroke="none" mask={`url(#${band})`} />
            <path
              d={CUP}
              transform="translate(60 37) scale(0.62) translate(-20.5 -19)"
              strokeWidth={round(2.6 * weight)}
            />
            <circle cx="60" cy="82" r="1.5" fill="currentColor" stroke="none" />
          </>
        ) : (
          <>
            <path d={CUP} transform="translate(60 61) scale(1.08) translate(-20.5 -19)" strokeWidth={round(2 * weight)} />
            <path d="m27 61 2-2 2 2-2 2-2-2Zm62 0 2-2 2 2-2 2-2-2Z" fill="currentColor" stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
}
