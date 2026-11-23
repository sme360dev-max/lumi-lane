'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { EMPTY_ACCOUNT, validateAccount } from './accountValidation';
import type { AccountErrors, AccountField, AccountMode } from './accountValidation';

const fieldLabels: Record<AccountField, string> = {
  name: 'Full name',
  email: 'Email',
  password: 'Password',
  confirmation: 'Confirm password',
};

const focus =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember';

export function AccountForm({ mode }: { mode: AccountMode }) {
  const signup = mode === 'signup';
  const [values, setValues] = useState(EMPTY_ACCOUNT);
  const [errors, setErrors] = useState<AccountErrors>({});
  const [visible, setVisible] = useState({ password: false, confirmation: false });
  const [unavailable, setUnavailable] = useState(false);
  const fields: AccountField[] = signup ? ['name', 'email', 'password', 'confirmation'] : ['email', 'password'];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateAccount(mode, values);
    setErrors(found);
    const first = fields.find((field) => found[field]);
    if (first) {
      document.getElementById(`${mode}-${first}`)?.focus();
      return;
    }
    setUnavailable(true);
    setValues((previous) => ({ ...previous, password: '', confirmation: '' }));
    setVisible({ password: false, confirmation: false });
  };

  return (
    <form
      className={`mx-auto max-w-md ${signup ? 'mt-9 space-y-4 sm:mt-10' : 'mt-12 space-y-6'}`}
      noValidate
      onSubmit={submit}
    >
      {fields.map((field) => {
        const id = `${mode}-${field}`;
        const error = errors[field];
        const password = field === 'password' || field === 'confirmation';
        const type = password ? (visible[field] ? 'text' : 'password') : field === 'email' ? 'email' : 'text';
        const autocomplete = password
          ? signup
            ? 'new-password'
            : 'current-password'
          : field === 'email'
            ? signup
              ? 'email'
              : 'username'
            : 'name';

        return (
          <div key={field}>
            <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cocoa/75">
              {fieldLabels[field]}
            </label>
            <div className="relative">
              <input
                id={id}
                type={type}
                autoComplete={autocomplete}
                autoCapitalize={field === 'name' ? 'words' : 'none'}
                spellCheck={false}
                required
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                value={values[field]}
                onChange={(event) => {
                  const value = event.target.value;
                  setValues((previous) => ({ ...previous, [field]: value }));
                  if (error) setErrors((previous) => ({ ...previous, [field]: undefined }));
                  if (unavailable) setUnavailable(false);
                }}
                className={`w-full appearance-none border-b bg-transparent pb-2.5 pt-3 text-[17px] text-cocoa transition-colors duration-200 focus:border-ember focus:outline-none focus-visible:ring-1 focus-visible:ring-ember ${error ? 'border-ember' : 'border-cocoa/30'} ${password ? 'pr-16' : ''}`}
              />
              {password && (
                <button
                  type="button"
                  aria-controls={id}
                  aria-label={`${visible[field] ? 'Hide' : 'Show'} ${field === 'confirmation' ? 'password confirmation' : 'password'}`}
                  onClick={() => setVisible((previous) => ({ ...previous, [field]: !previous[field] }))}
                  className={`absolute right-0 top-0 min-h-11 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa/75 hover:text-cocoa ${focus}`}
                >
                  {visible[field] ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
            {error && (
              <p id={`${id}-error`} className="mt-2 text-sm text-cocoa">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="pt-3 text-center">
        <button className={buttonClass()} type="submit">
          {signup ? 'Create Account' : 'Login'}
        </button>
        <p role="status" className={unavailable ? 'mt-4 text-sm leading-relaxed text-cocoa' : 'sr-only'}>
          {unavailable && (signup ? 'Account creation is currently unavailable.' : 'Login is currently unavailable.')}
        </p>
        <p className="mt-5 text-sm text-cocoa/75">
          {signup ? 'Already a member?' : 'New to Lumi Lane?'}{' '}
          <Link
            href={signup ? '/login/' : '/signup/'}
            className={`font-semibold text-cocoa underline underline-offset-4 hover:text-ember ${focus}`}
          >
            {signup ? 'Login' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </form>
  );
}
