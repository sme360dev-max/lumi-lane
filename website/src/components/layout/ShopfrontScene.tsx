import styles from './SiteFooter.module.css';

/*
 * Closing illustration: a calm, flat, painted-style view of the shopfront — a low building with a row of
 * warmly lit arched windows, an awning line, potted olive trees and the pavement. Static and decorative.
 * Colours are the V1 tokens and their tints only: shell #FAEDDD, cream #DACDB5, olive #2C342A,
 * ember #C45441 (window light, pots), cocoa #1C1814 at low opacity for depth.
 *
 * The drawing keeps its key shapes inside the centre of the 1440-wide viewBox and below y≈80, so the
 * "slice" crop (centred, anchored to the bottom) never cuts them at phone or very wide widths.
 */

const WALL = '#E6D6BF'; // between shell and cream
const ARCHES = [380, 480, 580, 680, 780, 880, 980]; // left x of each 70-wide arch; 680 is the door

function arch(x: number, top: number, width: number, bottom: number) {
  const r = width / 2;
  return `M${x} ${bottom}V${top + r}A${r} ${r} 0 0 1 ${x + width} ${top + r}V${bottom}Z`;
}

function OliveTree({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 254) scale(${scale}) translate(0 -254)`}>
      {/* canopy: a few soft overlapping leaves of silvery olive */}
      <ellipse cx="0" cy="168" rx="34" ry="26" fill="#2C342A" fillOpacity="0.42" />
      <ellipse cx="-20" cy="184" rx="24" ry="18" fill="#2C342A" fillOpacity="0.55" />
      <ellipse cx="22" cy="186" rx="22" ry="17" fill="#2C342A" fillOpacity="0.5" />
      <ellipse cx="4" cy="152" rx="20" ry="15" fill="#2C342A" fillOpacity="0.32" />
      {/* trunk */}
      <path d="M-2 250 C -3 230 2 214 -1 196 L 3 196 C 6 214 3 232 4 250 Z" fill="#2C342A" fillOpacity="0.7" />
      {/* terracotta pot */}
      <path d="M-20 228 H20 L15 254 H-15 Z" fill="#C45441" fillOpacity="0.72" />
      <rect x="-22" y="224" width="44" height="7" rx="2" fill="#C45441" fillOpacity="0.85" />
    </g>
  );
}

export function ShopfrontScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <svg viewBox="0 0 1440 280" preserveAspectRatio="xMidYMax slice" focusable="false" className={styles.sceneSvg}>
        {/* distant trees, very soft */}
        <g fill="#2C342A" fillOpacity="0.1">
          <ellipse cx="150" cy="200" rx="120" ry="70" />
          <ellipse cx="300" cy="190" rx="90" ry="62" />
          <ellipse cx="1180" cy="188" rx="96" ry="64" />
          <ellipse cx="1320" cy="202" rx="130" ry="72" />
        </g>
        <g fill="#DACDB5" fillOpacity="0.55">
          <ellipse cx="40" cy="236" rx="160" ry="44" />
          <ellipse cx="1420" cy="236" rx="170" ry="46" />
        </g>

        {/* building */}
        <rect x="320" y="104" width="800" height="18" rx="3" fill="#DACDB5" />
        <rect x="336" y="120" width="768" height="132" fill={WALL} />
        <rect x="336" y="120" width="768" height="6" fill="#1C1814" fillOpacity="0.05" />
        {/* awning line */}
        <rect x="350" y="134" width="740" height="5" rx="2.5" fill="#2C342A" fillOpacity="0.82" />

        {/* arched windows, warmly lit; the centre arch is the door */}
        {ARCHES.map((x) => {
          const door = x === 680;
          return (
            <g key={x}>
              <path d={arch(x, 150, 70, 250)} fill="#DACDB5" />
              <path d={arch(x + 6, 156, 58, 250)} fill={door ? '#2C342A' : '#FAEDDD'} fillOpacity={door ? 0.78 : 1} />
              {!door && (
                <>
                  <path d={arch(x + 6, 156, 58, 250)} fill="#C45441" fillOpacity="0.26" />
                  <rect x={x + 6} y="214" width="58" height="36" fill="#C45441" fillOpacity="0.12" />
                  <rect x={x + 34} y="160" width="2" height="90" fill="#1C1814" fillOpacity="0.12" />
                </>
              )}
              {door && <path d={arch(x + 14, 166, 42, 250)} fill="#C45441" fillOpacity="0.32" />}
            </g>
          );
        })}

        {/* potted olive trees */}
        <OliveTree x={300} />
        <OliveTree x={1140} />
        <OliveTree x={1235} scale={0.82} />

        {/* pavement */}
        <rect x="0" y="250" width="1440" height="30" fill="#DACDB5" />
        <rect x="0" y="250" width="1440" height="2" fill="#1C1814" fillOpacity="0.08" />
        <ellipse cx="720" cy="253" rx="420" ry="4" fill="#1C1814" fillOpacity="0.05" />
      </svg>
      <div className={styles.ground} />
    </div>
  );
}
