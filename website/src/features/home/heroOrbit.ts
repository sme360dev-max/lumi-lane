// Geometry of the landing hero: dishes orbit an invisible ellipse (ported from the prototype).
// Pure functions only, so the maths can be unit-tested without a DOM.

type Knots = readonly (readonly [number, number])[];

export interface HeroLook {
  anchor: Record<'-1' | '0' | '1', readonly [number, number]>;
  scale: Knots;
}

/** Angle between neighbouring dishes (deg) and ellipse radii as fractions of the stage box. */
const STEP = 58;
const RX = 0.389;
const RY = 0.82;
const RAD = Math.PI / 180;

/** Approved resting coordinates from the signed-off hero design (wide screens). */
export const WIDE: HeroLook = {
  anchor: { '-1': [-0.355, 0.36], '0': [0, 0], '1': [0.345, 0.39] },
  scale: [
    [-2.5, 0.56],
    [-2, 0.62],
    [-1, 0.73],
    [0, 1.0],
    [1, 0.71],
    [2, 0.58],
    [2.5, 0.54],
  ],
};
/** Narrow screens: the focus dish spans the full width, so the wings sit wider and higher. */
export const NARROW: HeroLook = {
  anchor: { '-1': [-0.48, 0.02], '0': [0, 0], '1': [0.47, 0.04] },
  scale: [
    [-2.5, 0.42],
    [-2, 0.48],
    [-1, 0.54],
    [0, 1.0],
    [1, 0.52],
    [2, 0.44],
    [2.5, 0.46],
  ],
};
const TILT: Knots = [
  [-2.5, 32],
  [-2, 26],
  [-1, 11],
  [0, 0],
  [1, -16],
  [2, -34],
  [2.5, -40],
];
const ALPHA: Knots = [
  [-2, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [2, 0],
];

const baseX = (p: number) => RX * Math.sin(p * STEP * RAD);
const baseY = (p: number) => RY * (1 - Math.cos(p * STEP * RAD));

/** Linear interpolation over knots, clamped at both ends. */
export function track(knots: Knots, p: number): number {
  const first = knots[0]!;
  const last = knots[knots.length - 1]!;
  if (p <= first[0]) return first[1];
  if (p >= last[0]) return last[1];
  for (let i = 1; i < knots.length; i++) {
    const b = knots[i]!;
    if (p <= b[0]) {
      const a = knots[i - 1]!;
      return a[1] + ((b[1] - a[1]) * (p - a[0])) / (b[0] - a[0]);
    }
  }
  return last[1];
}

/** Signed ring position of dish k, in slot units, wrapped to [-n/2, n/2). */
export function ringPosition(k: number, pos: number, n: number): number {
  const half = n / 2;
  let d = (k - pos + half) % n;
  if (d < 0) d += n;
  return d - half;
}

export interface DishPose {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

/** Builds a pose function for the current look; corrections pin the ellipse to the design anchors. */
export function createPoser(look: HeroLook) {
  const corr = {} as Record<'-1' | '0' | '1', [number, number]>;
  (Object.keys(look.anchor) as ('-1' | '0' | '1')[]).forEach((key) => {
    const p = parseFloat(key);
    const a = look.anchor[key];
    corr[key] = [a[0] - baseX(p), a[1] - baseY(p)];
  });

  // Correction is only defined at the three visible anchors and fades to zero by |p| = 2.
  const corrAt = (p: number): [number, number] => {
    let lo: [number, number];
    let hi: [number, number];
    let t: number;
    if (p >= 1) [lo, hi, t] = [corr['1'], [0, 0], Math.min(1, p - 1)];
    else if (p >= 0) [lo, hi, t] = [corr['0'], corr['1'], p];
    else if (p >= -1) [lo, hi, t] = [corr['0'], corr['-1'], -p];
    else [lo, hi, t] = [corr['-1'], [0, 0], Math.min(1, -p - 1)];
    return [lo[0] + (hi[0] - lo[0]) * t, lo[1] + (hi[1] - lo[1]) * t];
  };

  return (p: number, width: number, height: number): DishPose => {
    const c = corrAt(p);
    return {
      x: (baseX(p) + c[0]) * width,
      y: (baseY(p) + c[1]) * height,
      rotate: track(TILT, p),
      scale: track(look.scale, p),
      opacity: track(ALPHA, p),
      // Hero on top, the approaching dish above the departing one; kept under the nav's z-50.
      zIndex: Math.round(34 - Math.abs(p) * 5 + p * 3),
    };
  };
}
