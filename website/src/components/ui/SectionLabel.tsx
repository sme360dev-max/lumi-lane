import type { ReactNode } from 'react';

/** Small uppercase ember label ("Where We Are", "Opening Hours" …). */
export function SectionLabel({
  children,
  className = '',
  as: Tag = 'h2',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'p';
}) {
  return (
    <Tag className={`text-[11px] font-semibold uppercase tracking-[0.3em] text-ember ${className}`}>{children}</Tag>
  );
}
