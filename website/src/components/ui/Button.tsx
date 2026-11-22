import Link from 'next/link';
import type { ComponentProps } from 'react';

const base =
  'inline-block rounded-full font-semibold uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-shell';
const variants = {
  solid: 'bg-cocoa text-shell hover:bg-ember',
  outline: 'border border-cocoa/25 text-cocoa hover:border-cocoa hover:bg-cocoa hover:text-shell',
};
const sizes = {
  md: 'px-11 py-4 text-[11px] tracking-[0.28em]',
  sm: 'px-9 py-4 text-[10px] tracking-[0.28em]',
};

interface Style {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

export const buttonClass = ({ variant = 'solid', size = 'md', className = '' }: Style = {}) =>
  `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();

export function ButtonLink({ variant, size, className, ...props }: Style & ComponentProps<typeof Link>) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
