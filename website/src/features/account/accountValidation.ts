export type AccountMode = 'login' | 'signup';
export type AccountField = 'name' | 'email' | 'password' | 'confirmation';
export type AccountValues = Record<AccountField, string>;
export type AccountErrors = Partial<Record<AccountField, string>>;

export const EMPTY_ACCOUNT: AccountValues = { name: '', email: '', password: '', confirmation: '' };

export function validateAccount(mode: AccountMode, values: AccountValues): AccountErrors {
  const errors: AccountErrors = {};

  if (mode === 'signup' && !values.name.trim()) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password.trim()) errors.password = 'Enter a password.';
  if (mode === 'signup') {
    if (!values.confirmation) errors.confirmation = 'Confirm your password.';
    else if (values.confirmation !== values.password) errors.confirmation = 'The passwords must match.';
  }

  return errors;
}
