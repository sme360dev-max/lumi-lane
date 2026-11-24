export function CoffeeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <path
        d="M9 16h18v5a9 9 0 0 1-18 0v-5Zm18 2h3a3 3 0 0 1 0 6h-4M8 32h23M16 13c-3-3 3-4 0-7m6 7c-3-3 3-4 0-7"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Line icon of a stamp card (for the "Collect stamps" step). Deliberately not the ink stamp. */
export function StampCardMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <rect x="5.5" y="10" width="29" height="20" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="16.5" r="2.3" fill="currentColor" />
      <circle cx="18.7" cy="16.5" r="2.3" fill="currentColor" />
      <circle cx="25.4" cy="16.5" r="2.3" fill="currentColor" />
      <circle cx="12" cy="23.5" r="2.3" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="18.7" cy="23.5" r="2.3" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="25.4" cy="23.5" r="2.3" stroke="currentColor" strokeWidth="1.1" />
      <path d="M30.6 13.5v13" stroke="currentColor" strokeWidth="1.1" strokeDasharray="1.4 1.9" strokeLinecap="round" />
    </svg>
  );
}

export function RubberStamp({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-wood`} x1="15" y1="15" x2="75" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c6885c" />
          <stop offset=".52" stopColor="#a05b3e" />
          <stop offset="1" stopColor="#633427" />
        </linearGradient>
        <linearGradient id={`${id}-base`} x1="50" y1="73" x2="50" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#794435" />
          <stop offset="1" stopColor="#542b23" />
        </linearGradient>
      </defs>
      <path
        d="M22 27c0-13 13-22 28-22s28 9 28 22c0 9-8 15-14 20-4 4-6 9-5 18H41c1-9-1-14-5-18-6-5-14-11-14-20Z"
        fill={`url(#${id}-wood)`}
        stroke="#653729"
        strokeWidth="1.2"
      />
      <path
        d="M29 25c3-10 14-16 29-14M28 31c5 7 15 11 19 24m21-34c4 5 3 12-4 18M35 20c5-4 12-6 20-6"
        stroke="#f6bb87"
        strokeOpacity=".44"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path d="M39 63h22l4 10H35l4-10Z" fill="#38251e" />
      <path
        d="M16 78a6 6 0 0 1 6-6h56a6 6 0 0 1 6 6v10H16V78Z"
        fill={`url(#${id}-wood)`}
        stroke="#653729"
        strokeWidth="1.2"
      />
      <path d="M21 77h57" stroke="#edac7d" strokeOpacity=".7" strokeLinecap="round" />
      <path d="M14 87h72v6a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4v-6Z" fill={`url(#${id}-base)`} />
      <path d="M19 96h62" stroke="#a13e2e" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="50" cy="80.5" rx="9" ry="2.5" fill="#efb58d" fillOpacity=".36" />
    </svg>
  );
}
