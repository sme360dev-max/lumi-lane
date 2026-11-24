// Page copy carried over verbatim from the original prototype.

export const HERO = {
  eyebrow: 'Brewed & Baked Fresh Daily',
  /** Same order as the original markup = the cycle order. */
  dishes: [
    {
      image: 'coffee',
      alt: 'Latte with leaf art, seen from above',
      lines: ['Espresso. Milk.', 'Crema. Long\u00a0Blacks.'],
    },
    {
      image: 'choco',
      alt: 'Hot chocolate topped with marshmallows, seen from above',
      lines: ['Cocoa. Milk.', 'Marshmallow. Warmth.'],
    },
    {
      image: 'food',
      alt: 'Scrambled eggs on sourdough with roasted tomatoes, seen from above',
      lines: ['Eggs. Sourdough.', 'Tomato. Chilli Jam.'],
    },
    {
      image: 'mezze',
      alt: 'Mezze board with hummus, beetroot dip, olives and pita',
      lines: ['Hummus. Pita.', 'Olives. Beetroot.'],
    },
    {
      image: 'burger',
      alt: 'Loaded brioche burger with bacon, egg and cheese',
      lines: ['Bacon. Egg.', 'Cheese. Brioche.'],
    },
  ],
} as const;

export const MENU_PAGE = {
  eyebrow: 'Our Menu',
  title: 'Brunch, coffee & everything in between.',
  intro: 'All-day favourites, coffee, bowls and evening pours.',
  ctaTitle: 'Stay a little longer.',
  ctaText: 'Found something you like?',
  ctaLabel: 'Book a Table',
};

export const MEGA = {
  eyebrow: 'Our Menu',
  title: 'Four ways to spend the day.',
  hoursLine: 'Seven till four; eight on Sundays.',
  fullMenuLabel: 'See the full menu',
};

export const ABOUT = {
  eyebrow: 'Our Story',
  title: 'A coffee house with a long table.',
  columns: [
    [
      'Lumi Lane is a modern Australian coffee house and bar in Lightsview, built around long brunches, good coffee and the kind of table you don\u2019t rush to leave.',
      'The kitchen cooks Australian brunch with a Middle Eastern accent: labneh under poached eggs, za\u2019atar on smashed avocado, beetroot hummus beside falafel, pomegranate over crisp cauliflower. Familiar plates, seasoned the way we grew up eating.',
    ],
    [
      'Coffee is the constant. Espresso from open, long blacks through the morning, matcha and iced everything when Adelaide turns warm.',
      'By afternoon the room shifts. South Australian wine by the glass, a short cocktail list, and small plates that carry the day into evening.',
    ],
  ],
  quote: '\u201cModern Australian, seasoned Middle Eastern, open from seven.\u201d',
  facts: [
    { term: 'Since', title: 'Lightsview, SA', text: 'A neighbourhood room on Fosters Rd.' },
    { term: 'Kitchen', title: 'All-day brunch', text: 'Seven till four; eight on Sundays.' },
    { term: 'Bar', title: 'SA wine & cocktails', text: 'Adelaide Hills, Barossa, McLaren Vale.' },
  ],
  ctaLabel: 'See the menu',
};

export const VISIT = {
  eyebrow: 'Visit Us',
  title: 'Come for the coffee, stay for the vibe.',
  storefrontAlt: 'The Lumi Lane shopfront on Fosters Rd, sign above open glass frontage with tables inside',
  gettingHereTitle: 'Getting Here',
  gettingHere:
    'Street parking along Fosters Rd, with the Lightsview shopping precinct next door. Walk-ins welcome; larger groups are better booked ahead.',
};

export const BOOK = {
  eyebrow: 'Book a Table',
  title: 'Keep a seat for you.',
  intro: 'Join us in Lightsview for breakfast, brunch, lunch, coffee or a drink.',
  subIntro: 'Choose your preferred date and time and send us your reservation request.',
  submitLabel: 'Request a Table',
};

export const FOOTER = {
  tagline: ['Modern Australian', 'Coffee House & Bar'],
};
