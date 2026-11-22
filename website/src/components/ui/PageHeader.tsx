import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  /** Tailwind max-width for the headline, tuned per page as in the original. */
  titleWidth?: string;
  as?: 'h1' | 'h2';
  children?: ReactNode;
}

/** Script eyebrow + large serif headline used at the top of every inner page. */
export function PageHeader({ eyebrow, title, titleWidth = 'max-w-[17ch]', as: Tag = 'h1', children }: PageHeaderProps) {
  return (
    <header className="text-center">
      <p className="font-script text-3xl text-ember sm:text-4xl">{eyebrow}</p>
      <Tag
        className={`mx-auto mt-6 ${titleWidth} font-serif text-[clamp(2rem,5.2vw,4.2rem)] font-black leading-[1.02] tracking-tight text-cocoa`}
      >
        {title}
      </Tag>
      {children}
    </header>
  );
}
