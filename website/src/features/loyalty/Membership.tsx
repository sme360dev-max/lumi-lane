'use client';

import JsBarcode from 'jsbarcode';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import styles from './Loyalty.module.css';

type Member = { name: string; code: string };

const CARD_KEY = 'lumi-lane-coffee-club-card';
const ENROLLMENT_KEY = 'lumi-lane-coffee-club-enrollment';
const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const WALLET_URL = API ? API + '/api/loyalty/wallet/' : undefined;
const validCode = (value: unknown): value is string => typeof value === 'string' && /^89\d{10}$/.test(value);

export function Membership() {
  const [name, setName] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [walletAvailable, setWalletAvailable] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const busy = useRef(false);
  const barcode = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(CARD_KEY) ?? 'null');
        if (typeof saved?.name === 'string' && validCode(saved.code)) setMember(saved);
        setRegistrationId(localStorage.getItem(ENROLLMENT_KEY));
      } catch {
        // Storage may be blocked or contain an invalid card.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!member || !WALLET_URL) return;
    const request = new AbortController();
    fetch(WALLET_URL, { signal: request.signal })
      .then(async (response) => response.ok && (await response.json()).available === true)
      .then(setWalletAvailable)
      .catch(() => {});
    return () => request.abort();
  }, [member]);

  useEffect(() => {
    if (member && barcode.current) {
      JsBarcode(barcode.current, member.code, {
        format: 'CODE128',
        width: 2,
        height: 64,
        margin: 20,
        displayValue: false,
      });
    }
  }, [member]);

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const fullName = name.trim();
    if (!fullName) {
      setError('Please enter your name.');
      return;
    }
    if (!API) {
      setError('Registration is temporarily unavailable.');
      return;
    }

    busy.current = true;
    setPending(true);
    setError('');
    try {
      const registrationId = localStorage.getItem(ENROLLMENT_KEY) ?? crypto.randomUUID();
      localStorage.setItem(ENROLLMENT_KEY, registrationId);
      const response = await fetch(API + '/api/loyalty/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, registrationId }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await response.json();
      if (!response.ok || !validCode(data.code)) throw new Error('Registration failed');
      const card = { name: fullName, code: data.code };
      localStorage.setItem(CARD_KEY, JSON.stringify(card));
      setRegistrationId(registrationId);
      setMember(card);
    } catch {
      setError('We couldn’t save your card. Check your connection and allow browser storage, then try again.');
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <section id="join-club" tabIndex={-1} className={styles.membership} aria-labelledby="club-membership-title">
      <div>
        <h2 id="club-membership-title" className={styles.h2}>
          {member ? 'Your Coffee Club card' : 'Join the Coffee Club'}
        </h2>
        <p className={styles.lede}>
          {member
            ? 'Your member card is saved in this browser. Open this page on this device to show your barcode.'
            : 'Register to get your member barcode. Your card will be saved in this browser.'}
        </p>
        {!member && (
          <form className={styles.joinForm} onSubmit={register}>
            <label htmlFor="club-name">Full name</label>
            <input
              id="club-name"
              name="name"
              autoComplete="name"
              maxLength={100}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button className={styles.primary} type="submit" disabled={!ready || pending}>
              {pending ? 'Creating card…' : 'Create my card'}
            </button>
            {error && <p role="alert">{error}</p>}
          </form>
        )}
        {member && walletAvailable && registrationId && WALLET_URL && (
          <form action={WALLET_URL} method="post" className={styles.joinForm}>
            <input type="hidden" name="registrationId" value={registrationId} />
            <button className={styles.primary} type="submit">
              Add to Apple Wallet
            </button>
          </form>
        )}
        <p className={styles.memberNote}>
          Member barcodes identify your card. Stamp earning and rewards are currently available in the demo below.
        </p>
      </div>
      <div className={styles.realPhone}>
        <div className={styles.realScreen}>
          <div className={styles.island} aria-hidden="true" />
          <div className={styles.memberPass}>
            <p className={styles.passBrand}>Lumi Lane</p>
            <p className={styles.passTitle}>Coffee Club</p>
            <div className={styles.memberDetails} aria-live="polite">
              {member ? (
                <>
                  <p className={styles.memberName}>{member.name}</p>
                  <div className={styles.barcode}>
                    <svg ref={barcode} role="img" aria-label={'Member barcode ' + member.code} />
                    <span>{member.code}</span>
                  </div>
                </>
              ) : (
                <p className={styles.passPlaceholder}>Your barcode appears here after registration.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
