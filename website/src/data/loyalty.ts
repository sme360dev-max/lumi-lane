import { STAMP_TARGET } from '@/features/loyalty/ritualState';

/**
 * Copy for the proposed Lumi Lane Coffee Club page. The programme is not running yet: everything
 * here describes a proposal and a browser-only demo. Terms, rewards and redemption are unconfirmed.
 */
export const LOYALTY = {
  eyebrow: 'Coffee Club · Proposed',
  titleLines: ['Eight coffees.', "The next one's on us."],
  disclaimer: 'A proposed programme, shown as a demo. Collect eight stamps to unlock a sample coffee reward.',
  disclaimerLink: 'Try the demo',
  story: {
    title: 'How it would work',
    lines: ['Order a coffee.', 'Collect a stamp each time.', 'Your eighth unlocks a free coffee.'],
    illustration:
      'Illustration: a Coffee Club card collects eight stamps, one at a time, then a reward ticket tears off.',
  },
  demo: {
    title: 'Try it yourself',
    intro: `Each demo purchase adds one stamp. Fill all ${STAMP_TARGET} to see the reward ticket. Progress stays in this browser only.`,
    action: 'Try a demo purchase',
    empty: 'Your demo card is empty. Try a demo purchase to add a stamp.',
  },
  reward: {
    label: 'Demo reward',
    title: 'One standard coffee.',
    backTitle: 'The next coffee is the reward.',
    backCopy:
      'In the proposal, you would show this at the counter. In the demo, redeeming clears these eight stamps and starts a fresh card in this browser.',
    notice: 'Demo only — not valid for redemption',
  },
  faqTitle: 'Questions',
  faq: [
    {
      question: 'How do I earn stamps?',
      answer:
        'In the proposed programme, one eligible coffee would earn one stamp. Real stamps would need an approved way to confirm purchases, which is not set up yet. The demo simulates that purchase.',
    },
    {
      question: 'How many stamps do I need?',
      answer: `You need ${STAMP_TARGET} stamps to unlock the demo reward. “Load 7/8 example” lets you try the final stamp straight away.`,
    },
    {
      question: 'What would the reward be?',
      answer: 'The proposed reward is one standard coffee. Lumi Lane has not confirmed the final terms.',
    },
    {
      question: 'Do I need an account?',
      answer:
        'You can try the demo without an account. Demo progress stays in this browser and is separate from Login and Sign Up.',
    },
    {
      question: 'Can I redeem a reward now?',
      answer:
        'Not yet. The reward ticket is for demonstration only; “Redeem demo reward” just starts a fresh demo card in your browser.',
    },
  ],
  closing: 'A proposed programme. Terms to be confirmed with Lumi Lane.',
} as const;
