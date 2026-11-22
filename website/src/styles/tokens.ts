// Lumi Lane design tokens: the single place brand colours and type families are defined.
export const colors = {
  shell: '#FAEDDD',
  olive: '#2C342A',
  ember: '#C45441',
  cocoa: '#1C1814',
  cream: '#DACDB5',
} as const;

export const fontFamily = {
  sans: ['Archivo', 'system-ui', 'sans-serif'],
  serif: ['"Playfair Display"', 'Georgia', 'serif'],
  script: ['"Pinyon Script"', 'cursive'],
};

/** Shared easing used by page, mega-menu and form transitions. */
export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
