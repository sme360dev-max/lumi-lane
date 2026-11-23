export const STAMP_TARGET = 8;
export const STORAGE_KEY = 'lumi-lane-stamp-ritual-v1';

type Phase =
  | 'loading'
  | 'idle'
  | 'pressing'
  | 'settling'
  | 'earned'
  | 'complete'
  | 'unlocking'
  | 'unlocked'
  | 'preview'
  | 'redeemed';

export interface RitualState {
  stamps: number;
  phase: Phase;
  notice: string;
}

export type Action =
  | { type: 'restore'; stored: string | null }
  | {
      type:
        | 'purchase'
        | 'impact'
        | 'settle'
        | 'reveal'
        | 'unlock'
        | 'flip'
        | 'replay'
        | 'redeem'
        | 'undo'
        | 'reset'
        | 'example';
    };

const welcome = 'Simulate a coffee purchase to get your first demo stamp.';
export const initialRitual: RitualState = { stamps: 0, phase: 'loading', notice: welcome };

export const isPressing = (state: RitualState) => state.phase === 'pressing' || state.phase === 'settling';
export const canPurchase = (state: RitualState) =>
  state.phase === 'idle' || state.phase === 'earned' || state.phase === 'redeemed';
export const canCancel = (state: RitualState) => state.phase !== 'loading' && (state.stamps > 0 || isPressing(state));
export const canLoadExample = (state: RitualState) => canPurchase(state) && state.stamps < STAMP_TARGET;
export const rewardAvailable = (state: RitualState) => state.phase === 'unlocked' || state.phase === 'preview';

const remaining = (stamps: number) => {
  const count = STAMP_TARGET - stamps;
  return `${count} ${count === 1 ? 'stamp' : 'stamps'} to go.`;
};

export function ritualReducer(state: RitualState, action: Action): RitualState {
  switch (action.type) {
    case 'restore': {
      if (state.phase !== 'loading') return state;
      const stamps = action.stored && /^[0-8]$/.test(action.stored) ? Number(action.stored) : 0;
      return stamps === STAMP_TARGET
        ? {
            stamps,
            phase: 'unlocked',
            notice: 'Your completed demo card is ready. Flip the reward ticket to see the details.',
          }
        : { stamps, phase: 'idle', notice: stamps ? `Your demo card is saved. ${remaining(stamps)}` : welcome };
    }
    case 'purchase':
      return canPurchase(state) && state.stamps < STAMP_TARGET
        ? {
            ...state,
            phase: 'pressing',
            notice: 'Demo purchase recorded. Applying one stamp.',
          }
        : state;
    case 'impact': {
      if (state.phase !== 'pressing') return state;
      return { ...state, stamps: state.stamps + 1, phase: 'settling' };
    }
    case 'settle':
      return state.phase === 'settling'
        ? {
            ...state,
            phase: state.stamps === STAMP_TARGET ? 'complete' : 'earned',
            notice:
              state.stamps === STAMP_TARGET
                ? 'Final demo stamp added. Your card is complete.'
                : `Demo stamp added. ${remaining(state.stamps)}`,
          }
        : state;
    case 'reveal':
      return state.phase === 'complete' ? { ...state, phase: 'unlocking' } : state;
    case 'unlock':
      return state.phase === 'unlocking'
        ? { ...state, phase: 'unlocked', notice: 'Demo reward unlocked. Flip the reward ticket to see the details.' }
        : state;
    case 'flip':
      return rewardAvailable(state) ? { ...state, phase: state.phase === 'preview' ? 'unlocked' : 'preview' } : state;
    case 'replay':
      return rewardAvailable(state)
        ? { ...state, phase: 'unlocking', notice: 'Replaying the demo reward reveal.' }
        : state;
    case 'redeem':
      return state.phase === 'preview'
        ? { stamps: 0, phase: 'redeemed', notice: 'Demo reward redeemed. Your next demo stamp card is ready.' }
        : state;
    case 'undo': {
      if (!canCancel(state)) return state;
      if (state.phase === 'pressing') return { ...state, phase: 'idle', notice: 'Pending demo stamp cancelled.' };
      const stamps = state.stamps - 1;
      return { stamps, phase: 'idle', notice: `Last demo stamp removed. ${remaining(stamps)}` };
    }
    case 'reset':
      return canCancel(state)
        ? { stamps: 0, phase: 'idle', notice: 'Demo card reset. Start with a simulated coffee purchase.' }
        : state;
    case 'example':
      return canLoadExample(state)
        ? {
            stamps: STAMP_TARGET - 1,
            phase: 'idle',
            notice: 'Example loaded at 7 of 8 stamps. Simulate one more purchase to try the unlock.',
          }
        : state;
  }
}
