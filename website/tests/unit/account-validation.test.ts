import assert from 'node:assert/strict';
import test from 'node:test';
import { EMPTY_ACCOUNT, validateAccount } from '../../src/features/account/accountValidation.ts';

test('login requires a valid email and a password', () => {
  assert.deepEqual(Object.keys(validateAccount('login', EMPTY_ACCOUNT)), ['email', 'password']);
  assert.deepEqual(
    validateAccount('login', { ...EMPTY_ACCOUNT, email: ' guest@example.com ', password: 'preview' }),
    {},
  );
});

test('sign up requires a name and matching passwords in addition to a valid email', () => {
  assert.deepEqual(Object.keys(validateAccount('signup', EMPTY_ACCOUNT)), [
    'name',
    'email',
    'password',
    'confirmation',
  ]);
  const values = { name: 'Sam Lee', email: 'sam@example.com', password: 'preview', confirmation: 'different' };
  assert.deepEqual(validateAccount('signup', values), { confirmation: 'The passwords must match.' });
  assert.deepEqual(validateAccount('signup', { ...values, confirmation: values.password }), {});
});
