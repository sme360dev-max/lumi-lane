export const navLinkClass = (active: boolean) =>
  [
    'inline-flex min-h-[28px] items-center whitespace-nowrap rounded-sm text-[10px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-75 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/80 sm:text-[11px] sm:tracking-[0.24em]',
    active ? 'underline decoration-white/80 decoration-1 underline-offset-[6px]' : '',
  ].join(' ');

/** True when `pathname` is the route `href` (trailing slash insensitive). */
export const isActive = (pathname: string, href: string) => {
  const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`);
  return norm(pathname) === norm(href);
};
