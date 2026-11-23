import { STAMP_TARGET } from '@/features/loyalty/ritualState';

export const LOYALTY = {
  tagline: 'Every coffee brings something good.',
  intro: `Collect ${STAMP_TARGET} stamps to unlock one standard coffee in our proposed loyalty program.`,
  notice: 'This is a demo only. The café is still considering the program and its redemption terms.',
  demoAction: 'Try a Demo Purchase',
  demoGuide: 'The demo simulates an eligible coffee purchase and adds one stamp automatically.',
  rewardNotice: 'Demo reward — not valid for redemption',
  steps: [
    { icon: 'coffee', title: 'Order coffee', description: 'Enjoy an eligible coffee at Lumi Lane.' },
    { icon: 'stamp', title: 'Collect stamps', description: 'Each eligible coffee earns one stamp.' },
    {
      icon: 'reward',
      title: 'Unlock a reward',
      description: 'Collect eight stamps to unlock a standard coffee reward.',
    },
  ],
  faq: [
    {
      question: 'How do I earn stamps?',
      answer:
        'In the proposed program, one eligible coffee would earn one stamp. Real stamps would require an approved way to confirm purchases. The demo simulates that purchase.',
    },
    {
      question: 'How many stamps do I need?',
      answer: `You need ${STAMP_TARGET} stamps to unlock the demo reward. “Load 7/8 example” lets you try the final stamp straight away.`,
    },
    {
      question: 'What reward can I unlock?',
      answer: 'The proposed reward is one standard coffee. The café is still considering the final terms.',
    },
    {
      question: 'Do I need an account?',
      answer:
        'You can try the demo without an account. Demo progress stays in this browser, separate from Login and Sign Up.',
    },
    {
      question: 'Can I redeem this reward now?',
      answer: 'The ticket is for demonstration only. “Redeem demo reward” starts a fresh demo card in your browser.',
    },
  ],
} as const;
