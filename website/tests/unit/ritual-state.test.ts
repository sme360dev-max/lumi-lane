import assert from 'node:assert/strict';
import test from 'node:test';
import { initialRitual, ritualReducer, STAMP_TARGET, type Action } from '../../src/features/loyalty/ritualState.ts';

function run(stored: string | null, ...steps: Exclude<Action['type'], 'restore'>[]) {
  return steps.reduce(
    (state, type) => ritualReducer(state, { type }),
    ritualReducer(initialRitual, { type: 'restore', stored }),
  );
}

test('one purchase starts the press and only its first impact changes the count', () => {
  assert.equal(run(null, 'impact', 'undo').stamps, 0);
  assert.equal(run(null, 'purchase', 'purchase').phase, 'pressing');
  assert.equal(run(null, 'purchase', 'purchase').stamps, 0);
  const state = run(null, 'purchase', 'purchase', 'impact', 'impact', 'purchase', 'settle', 'settle');
  assert.equal(state.stamps, 1);
  assert.equal(state.phase, 'earned');
});

test('finished card unlocks once, replays without earning, and redeems only from the preview', () => {
  assert.equal(run('7', 'purchase', 'impact', 'settle', 'unlock').phase, 'complete');
  const full = run('7', 'purchase', 'impact', 'settle', 'reveal', 'unlock', 'unlock', 'purchase', 'impact', 'redeem');
  assert.equal(full.stamps, STAMP_TARGET);
  assert.equal(full.phase, 'unlocked');
  const replayed = ['flip', 'replay', 'unlock'].reduce(
    (state, type) => ritualReducer(state, { type: type as 'flip' | 'replay' | 'unlock' }),
    full,
  );
  assert.equal(replayed.stamps, STAMP_TARGET);
  assert.equal(replayed.phase, 'unlocked');
  const redeemed = ritualReducer(ritualReducer(replayed, { type: 'flip' }), { type: 'redeem' });
  assert.equal(redeemed.stamps, 0);
  assert.equal(redeemed.phase, 'redeemed');
});

test('restoration, undo, reset and example respect count and transition boundaries', () => {
  for (const invalid of ['9', '-1', 'NaN', '7.5', '{"count":8}']) assert.equal(run(invalid).stamps, 0);
  assert.equal(run('8').phase, 'unlocked');
  assert.equal(run('8', 'example').stamps, 8);
  assert.equal(run('8', 'undo').stamps, 7);
  assert.equal(run('7', 'purchase', 'example').phase, 'pressing');
  assert.equal(run('7', 'purchase', 'undo', 'impact', 'settle').stamps, 7);
  assert.equal(run('7', 'purchase', 'impact', 'undo', 'settle', 'reveal').stamps, 7);
  assert.equal(run('7', 'purchase', 'impact', 'reset', 'settle', 'reveal').stamps, 0);
  assert.equal(run('2', 'reset', 'example', 'undo').stamps, 6);
});
