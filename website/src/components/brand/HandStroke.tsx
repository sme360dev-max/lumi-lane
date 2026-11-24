/**
 * Hand-drawn terracotta stroke. Used in exactly two places: the Home index and the Loyalty steps.
 * The draw-on is a CSS stroke-dashoffset transition driven by `drawn` (see .hand-stroke in globals.css);
 * reduced motion shows the drawn state without the transition.
 */

const SHAPES = {
  underline: {
    viewBox: '0 0 400 24',
    d: 'M4 15c38-6 74-9 112-8 33 1 54 6 88 5 46-1 82-8 126-9 24 0 46 2 66 6',
  },
  connector: {
    viewBox: '0 0 1000 40',
    d: 'M6 24c90-14 170-16 250-8 62 6 104 14 170 10 90-6 140-20 230-18 92 2 160 14 248 6 30-3 60-8 90-12',
  },
} as const;

interface HandStrokeProps {
  drawn: boolean;
  variant?: keyof typeof SHAPES;
  /** Stroke width in CSS px (the stroke does not scale with the SVG). */
  width?: number;
  className?: string;
}

export function HandStroke({ drawn, variant = 'underline', width = 2.5, className = '' }: HandStrokeProps) {
  const shape = SHAPES[variant];
  return (
    <svg
      viewBox={shape.viewBox}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`hand-stroke ${className}`.trim()}
      data-drawn={drawn}
    >
      <path
        d={shape.d}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
