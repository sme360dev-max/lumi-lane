export interface NavItem {
  href: string;
  label: string;
}

/** Original destinations shared with the footer. */
export const PRIMARY_NAV: NavItem[] = [
  { href: '/about/', label: 'About' },
  { href: '/menu/', label: 'Menu' },
  { href: '/visit/', label: 'Visit Us' },
  { href: '/book/', label: 'Book a Table' },
];

/** The bottom pill adds Loyalty while keeping the original footer links. */
export const PILL_NAV: NavItem[] = [...PRIMARY_NAV, { href: '/loyalty/', label: 'Loyalty' }];

/** Mega menu columns: number, two-line title and the menu tab they open. */
export const MEGA_COLUMNS = [
  { n: '01', lines: ['Brunch', '& All Day'], tab: 'brunch' },
  { n: '02', lines: ['Açaí', 'Bowls'], tab: 'acai' },
  { n: '03', lines: ['Coffee', '& Drinks'], tab: 'coffee' },
  { n: '04', lines: ['Bar', '& Sweets'], tab: 'bar' },
] as const;
