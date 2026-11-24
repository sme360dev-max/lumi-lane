'use client';

import { useEffect, useRef } from 'react';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import styles from './SiteFooter.module.css';

const DISHES = ['coffee', 'burger', 'mezze', 'choco', 'food'] as const;

/** One run of the five cut-out dishes; rendered twice so the drift loops without a seam. */
function DishRun({ copy }: { copy?: boolean }) {
  return (
    <ul className={styles.run} data-copy={copy ? '' : undefined}>
      {DISHES.map((name) => (
        <li key={name} className={styles.dish}>
          <ResponsivePicture name={name} widths={[480]} sizes="140px" width={1254} height={1254} alt="" />
        </li>
      ))}
    </ul>
  );
}

/**
 * The closing illustration: a wooden table edge with the dishes resting along it, drifting very slowly
 * right to left. Purely decorative; it only moves while on screen and stands still under reduced motion.
 */
export function LongTableBand() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = ref.current;
    if (!band || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) band.setAttribute('data-running', '');
      else band.removeAttribute('data-running');
    });
    io.observe(band);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-long-table className={styles.band} aria-hidden="true">
      <div className={styles.track}>
        <DishRun />
        <DishRun copy />
      </div>
      <svg className={styles.table} viewBox="0 0 1440 64" preserveAspectRatio="none" focusable="false">
        {/* Table top, seen slightly from above. */}
        <rect x="0" y="0" width="1440" height="38" fill="#C89A6B" />
        {/* Grain: a few long, broken lines in a slightly deeper tone. */}
        <g fill="none" stroke="#B4855A" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke">
          <path
            d="M0 11 C 240 9 420 13 700 11 S 1180 8 1440 11"
            strokeDasharray="260 36 420 52 180 40 520 30"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 24 C 300 26 520 22 820 24 S 1240 27 1440 24"
            strokeDasharray="380 44 220 60 460 38"
            strokeDashoffset="140"
            vectorEffect="non-scaling-stroke"
          />
        </g>
        {/* The darker front edge, with a lighter hairline where it meets the top. */}
        <rect x="0" y="38" width="1440" height="26" fill="#8C5A37" />
        <path d="M0 39.5 H1440" stroke="#B4855A" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
