export interface NavItem {
  href: string;
  label: string;
}

/** Bottom pill navigation, in the original order. Menu is rendered as the mega-menu trigger. */
export const PRIMARY_NAV: NavItem[] = [
  { href: '/about/', label: 'About' },
  { href: '/menu/', label: 'Menu' },
  { href: '/visit/', label: 'Visit Us' },
  { href: '/book/', label: 'Book a Table' },
];

/** Mega menu columns: number, two-line title and the menu tab they open. */
export const MEGA_COLUMNS = [
  { n: '01', lines: ['Brunch', '& All Day'], tab: 'brunch' },
  { n: '02', lines: ['Açaí', 'Bowls'], tab: 'acai' },
  { n: '03', lines: ['Coffee', '& Drinks'], tab: 'coffee' },
  { n: '04', lines: ['Bar', '& Sweets'], tab: 'bar' },
] as const;
