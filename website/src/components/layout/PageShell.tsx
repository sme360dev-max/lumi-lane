import type { ReactNode } from 'react';

/** <main> wrapper for inner pages: spacing that clears the fixed header and bottom nav, plus the entry transition. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="view-enter px-6 pb-[max(11rem,var(--nav-clearance))] pt-32 sm:pt-36 lg:px-10">
      {children}
    </main>
  );
}
